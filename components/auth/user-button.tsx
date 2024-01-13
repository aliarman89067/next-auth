import React from "react";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaUser } from "react-icons/fa";
import { ExitIcon } from "@radix-ui/react-icons";
import { useCurrentSession } from "@/utils/use-current-user";
import Image from "next/image";
import { LogoutButton } from "@/components/auth/logout-button";

export default function UserButton() {
  const user = useCurrentSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="p-2 rounded-full bg-sky-500 flex justify-center items-center cursor-pointer">
          {user?.image ? (
            <Image
              src={user.image || ""}
              width={30}
              height={30}
              alt="avatar"
              className="rounded-full"
            />
          ) : (
            <FaUser className="w-4 h-4 text-white" />
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <DropdownMenuItem>
          <LogoutButton>
            <ExitIcon className="h-4 w-4 mr-2" />
            Logout
          </LogoutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
