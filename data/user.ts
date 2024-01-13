import { db } from "@/lib/db";

export const findByEmail = async (email: string) => {
  return await db.user.findUnique({
    where: {
      email,
    },
  });
};
export const findById = async (id: string) => {
  return await db.user.findUnique({
    where: {
      id,
    },
  });
};
