"use client";

import { useCurrentRole } from "@/utils/use-current-role";
import { UserRole } from "@prisma/client";
import { FormError } from "../formerror";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}
export const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
  const role = useCurrentRole();
  if (role !== allowedRole) {
    return <FormError message="You do not have permission to view" />;
  }
  return <>{children}</>;
};
