"use client";
import UserInfo from "@/components/UserInfo";
import { useCurrentSession } from "@/utils/use-current-user";

export default function Page() {
  const user = useCurrentSession();
  return <UserInfo user={user} label="Client Component" />;
}
