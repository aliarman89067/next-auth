"use server";
import * as z from "zod";
import { NewPasswordSchema } from "@/schemas";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export const NewPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token: string
) => {
  const validatedField = NewPasswordSchema.safeParse(values);
  if (!validatedField.success) return { error: "Invalid inputs!" };
  const { password } = validatedField.data;
  if (!token) return { error: "Token not found!" };
  const existingToken = await db.resetPasswordToken.findFirst({
    where: {
      token,
    },
  });
  if (!existingToken) return { error: "Token not exist!" };
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) return { error: "Token is expired!" };
  const existingUser = await db.user.findFirst({
    where: {
      email: existingToken.email,
    },
  });
  if (!existingUser) return { error: "User not found!" };
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashedPassword,
    },
  });
  await db.resetPasswordToken.delete({
    where: {
      id: existingToken.id,
    },
  });
  return { success: "Password updated" };
};
