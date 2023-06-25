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
   <div className="w-full flex gap-5">
    {children}
    <div className="flex-1 h-60 rounded-md dark:bg-slate-800 bg-slate-200 flex flex-col gap-5 items-center p-5">
     <Label size="medium" className="font-bold self-start">
      Rating:
     </Label>
     <p className="font-bold text-7xl">{wrestler.avgRating}</p>
    </div>
   </div>
  </div>
 );
};

export default Layout;
