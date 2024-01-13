"use server";
import { db } from "@/lib/db";
import { getVerificationTokebByToken } from "@/data/verification-token";
import { findByEmail } from "@/data/user";

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokebByToken(token);
  if (!existingToken) {
    return { error: "Token not found!" };
  }
  const isExpired = new Date(existingToken?.expires) < new Date();
  if (isExpired) {
    return { error: "Token has expired!" };
  }
  const existingUser = await findByEmail(existingToken.email);
  if (!existingUser) {
    return { error: "User not found!" };
  }
  await db.user.update({
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
    where: {
      id: existingUser.id,
    },
  });
  await db.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  });
  return { success: "Account verified!" };
};
