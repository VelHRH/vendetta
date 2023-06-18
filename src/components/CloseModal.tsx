"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { FC } from "react";
interface CloseModalProps {
 children: React.ReactNode;
}

const CloseModal: FC<CloseModalProps> = ({ children }) => {
 const router = useRouter();

 return (
  <>
   <button
    onClick={() => router.back()}
    className="fixed inset-0 bg-zinc-900/40 dark:bg-zinc-100/40"
   />
   <div className="absolute left-1/2 w-2/5 translate-x-[-50%]">{children}</div>
  </>
 );
};

export default CloseModal;
