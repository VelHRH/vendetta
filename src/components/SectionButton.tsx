"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";

interface SectionButtonProps {
 children: string;
 link: string;
 isMain?: number;
}

const SectionButton: FC<SectionButtonProps> = ({ children, link, isMain }) => {
 const pathname = usePathname();
 return (
  <Link
   href={link}
   className={`p-2 text-lg rounded-md ${
    pathname.slice(pathname.lastIndexOf("/") + 1) ===
     link.slice(link.lastIndexOf("/") + 1) ||
    (isMain && (pathname.match(new RegExp("/", "g")) || []).length === isMain)
     ? "bg-transparent"
     : "dark:bg-slate-800 bg-slate-200 hover:scale-105 duration-300"
   } `}
  >
   {children}
  </Link>
 );
};

export default SectionButton;
