import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";

interface HeaderProps {
  label: string;
}
const font = Poppins({
  subsets: ["latin"],
  weight: ["500"],
});
export function Header({ label }: HeaderProps) {
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <h1 className={cn("text-3xl font-semibold", font.className)}>Auth</h1>
      <p className="text-muted-foreground">{label}</p>
    </div>
  );
}
