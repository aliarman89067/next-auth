import UserInfo from "@/components/UserInfo";
import { currentUser } from "@/lib/auth";

export default async function Page() {
  const user = await currentUser();
  return <UserInfo user={user} label="Server Component" />;
}
