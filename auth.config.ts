import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { LoginSchema } from "@/schemas";
import { findByEmail } from "@/data/user";
import bcrypt from "bcryptjs";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validFields = LoginSchema.safeParse(credentials);
        if (validFields.success) {
          const { email, password } = validFields.data;
          const user = await findByEmail(email);
          if (!user || !user.password) {
            return null;
          }
          const validPassword = await bcrypt.compare(password, user.password);
          if (validPassword) return user;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
