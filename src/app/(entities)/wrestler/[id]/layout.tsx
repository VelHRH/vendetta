import { ReactNode } from "react";

import Label from "@/components/ui/Label";
import { notFound } from "next/navigation";
import SectionButton from "@/components/SectionButton";
import { buttonVariants } from "@/components/ui/Button";
import { Pencil } from "lucide-react";
import Link from "next/link";
import createClient from "@/lib/supabase-server";

interface LayoutProps {
 children: ReactNode;
 params: { id: string };
}

const Layout = async ({ children, params }: LayoutProps) => {
 const supabase = createClient();
 const { data: wrestler } = await supabase
  .from("wrestlers")
  .select("*")
  .eq("id", params.id)
  .single();
 if (!wrestler) {
  notFound();
 }
 return (
  <div className="flex flex-col gap-5 items-center">
   <div className="flex gap-2">
    <Label className="font-bold">{wrestler?.name!}</Label>
    <Link
     href={`/wrestler/edit?id=${wrestler.id}`}
     className={buttonVariants({ variant: "subtle" })}
    >
     <Pencil />
    </Link>
   </div>
   <div className="flex gap-2">
    <SectionButton link={`/wrestler/${params.id}`}>Overview</SectionButton>
    <SectionButton link={`/wrestler/${params.id}`}>Matches</SectionButton>
    <SectionButton link={`/wrestler/${params.id}`}>Titles</SectionButton>
   </div>
   {children}
  </div>
 );
};

export default Layout;
