"use server";
import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_REDIRECT_PATH } from "@/routes";
import { AuthError } from "next-auth";
import {
  generateVerificationToken,
  generateConfirmationToken,
} from "@/lib/tokens";
import { findByEmail } from "@/data/user";
import { sendVerificationToken, sendTwoFactorToken } from "@/lib/resend";
import bcrypt from "bcryptjs";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";
import { getTwoFactorConfirmation } from "@/data/two-factor-confirmation";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validFields = LoginSchema.safeParse(values);
  if (!validFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, code } = validFields.data;

  const existingUser = await findByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email or Password is incorrect!" };
  }
  const passOk = await bcrypt.compare(password, existingUser.password);
  if (!passOk) return { error: "Invalid credentials" };
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );
    await sendVerificationToken(
      verificationToken.email,
      verificationToken.token
    );
    return { success: "Verification email sent!" };
  }
  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFactorToken) {
        return { error: "Token not found!" };
      }
      if (twoFactorToken.token !== code) {
        return { error: "Token not found!" };
      }
      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      if (hasExpired) {
        return { error: "Token expired!" };
      }
      await db.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });

      const existingConfirmation = await getTwoFactorConfirmation(
        existingUser.id
      );
      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id,
          },
        });
      }
      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactor = await generateConfirmationToken(existingUser.email);
      await sendTwoFactorToken(twoFactor.email, twoFactor.token);
      return { twoFactor: true };
    }
  }
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_REDIRECT_PATH,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
};
