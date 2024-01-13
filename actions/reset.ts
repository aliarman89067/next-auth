"use server";
import * as z from "zod";
import { ResetSchema } from "@/schemas";
import { findByEmail } from "@/data/user";
import { generatePasswordResettToken } from "@/lib/tokens";
import { sendResetPasswordToken } from "@/lib/resend";

export async function Reset(values: z.infer<typeof ResetSchema>) {
  const validateField = ResetSchema.safeParse(values);
  if (!validateField.success) return { error: "Invalid email" };
  const { email } = validateField.data;
  const existingUser = await findByEmail(email);
  if (!existingUser) return { error: "User not found" };
  const passwordResetToken = await generatePasswordResettToken(email);
  await sendResetPasswordToken(
    passwordResetToken.email,
    passwordResetToken.token
  );
  return { success: "Reset email send" };
}
