import React, { ReactNode } from "react";
import Navbar from "./_components/Navbar";
import { Toaster } from "sonner";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">
      <Toaster />
      <Navbar />
      {children}
    </div>
  );
}
