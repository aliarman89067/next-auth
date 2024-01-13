"use server";
import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcrypt";
import { db } from "@/lib/db";
import { findByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationToken } from "@/lib/resend";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validFields = RegisterSchema.safeParse(values);
  if (!validFields.success) {
    return { error: "Invalid fields!" };
  }
  const { name, email, password } = validFields.data;
  const existingUser = await findByEmail(email);
  if (existingUser) {
    return { error: "This email already taken" };
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  const verificationToken = await generateVerificationToken(email);
  await sendVerificationToken(verificationToken.email, verificationToken.token);
  return { success: "Confirmation email send" };
};
