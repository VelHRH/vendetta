"use client";
import { cn } from "@/lib/utils";
import { ArrowUpWideNarrow } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { FC } from "react";
import { Button } from "./ui/Button";

interface SortButtonProps
 extends React.ButtonHTMLAttributes<HTMLButtonElement> {
 children: string;
 value: "rating" | "your" | "number" | "date" | "avg";
}

const SortButton: FC<SortButtonProps> = ({ children, value, className }) => {
 const router = useRouter();
 const pathname = usePathname();
 return (
  <Button
   variant={"subtle"}
   onClick={() =>
    router.push(`${pathname.slice(0, pathname.indexOf("?") + 1)}?sort=${value}`)
   }
  >
   <p className={cn("flex items-center gap-1", className)}>
    <ArrowUpWideNarrow />
    {children}
   </p>
  </Button>
 );
};

export default SortButton;
