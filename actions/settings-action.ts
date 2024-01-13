"use server";

import * as z from "zod";
import { settingsSchema } from "@/schemas";
import { db } from "@/lib/db";
import { findByEmail, findById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationToken } from "@/lib/resend";
import bcrypt from "bcryptjs";

export const settings = async (values: z.infer<typeof settingsSchema>) => {
  const user = await currentUser();
  if (!user) {
    return { error: "Unauthorized!" };
  }
  const dbUser = await findById(user.id);
  if (!dbUser) {
    return { error: "Unauthorized!" };
  }
  if (user.isOAuth) {
    values.email = undefined;
    values.password = undefined;
    values.newPassword = undefined;
    values.isTwoFactorEnabled = undefined;
  }
  if (values.email && values.email !== user.email) {
    const existingUser = await findByEmail(values.email);
    if (existingUser && existingUser.id !== user.id) {
      return { error: "Email already used!" };
    }
    const verificationToken = await generateVerificationToken(values.email);
    await sendVerificationToken(
      verificationToken.email,
      verificationToken.token
    );
    return { success: "Verification token send!" };
  }
  if (values.password && values.newPassword && dbUser.password) {
    const matchedPass = await bcrypt.compare(values.password, dbUser.password);
    if (!matchedPass) {
      return { error: "Invalid password!" };
    }
    const hashedPass = await bcrypt.hash(values.newPassword, 10);
    values.password = hashedPass;
    values.newPassword = undefined;
  }
  await db.user.update({
    where: {
      id: dbUser.id,
    },
    data: {
      ...values,
    },
  });
  return { success: "Settings updated!" };
};
