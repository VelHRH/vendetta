"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";

interface SectionButtonProps {
 children: string;
 link: string;
}

const SectionButton: FC<SectionButtonProps> = ({ children, link }) => {
 const pathname = usePathname();
 return (
  <Link
   href={`${link}/${children !== "Overview" ? children.toLowerCase() : ""}`}
   className={`p-2 text-lg rounded-md ${
    pathname.slice(pathname.lastIndexOf("/") + 1) === children.toLowerCase() ||
    (!isNaN(parseFloat(pathname.slice(pathname.lastIndexOf("/") + 1))) &&
     children === "Overview")
     ? "bg-transparent"
     : "dark:bg-slate-800 bg-slate-200 hover:scale-105 duration-300"
   } `}
  >
   {children}
  </Link>
 );
};

export default SectionButton;
