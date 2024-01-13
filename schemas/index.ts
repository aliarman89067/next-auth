import { UserRole } from "@prisma/client";
import * as z from "zod";

export const settingsSchema = z
  .object({
    name: z.optional(z.string().min(1, { message: "Name Required!" })),
    isTwoFactorEnabled: z.optional(z.boolean()),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (!data.password && data.newPassword) {
        return false;
      }
      return true;
    },
    { message: "Password is required!", path: ["password"] }
  )
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }
      return true;
    },
    { message: "New password is required!", path: ["newPassword"] }
  );

export const LoginSchema = z.object({
  email: z.string().email({ message: "Email must required" }),
  password: z.string().min(1, { message: "password required" }),
  code: z.optional(z.string()),
});
export const RegisterSchema = z.object({
  email: z.string().email({ message: "Email must required" }),
  password: z.string().min(6, { message: "Mininum 6 characters required" }),
  name: z.string().min(1, { message: " Name is required" }),
});
export const ResetSchema = z.object({
  email: z.string().email({ message: "Email must required" }),
});
export const NewPasswordSchema = z.object({
  password: z.string().min(6, { message: "Minimun 6 character required" }),
});
