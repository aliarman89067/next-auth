"use client";

import { logout } from "@/actions/logout-action";

interface LogoutButtonProps {
  children: React.ReactNode;
}

export function LogoutButton({ children }: LogoutButtonProps) {
  const onClick = () => {
    logout();
  };
  return (
    <span onClick={onClick} className="cursor-pointer flex items-center">
      {children}
    </span>
  );
}
