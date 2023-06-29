import { ReactNode } from "react";

import Label from "@/components/ui/Label";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/Button";
import Link from "next/link";
import createClient from "@/lib/supabase-server";
import { cn } from "@/lib/utils";
import SectionButton from "@/components/SectionButton";

interface LayoutProps {
 children: ReactNode;
 params: { id: string };
}

const Layout = async ({ children, params }: LayoutProps) => {
 const supabase = createClient();
 const { data: profile } = await supabase
  .from("users")
  .select()
  .eq("username", params.id)
  .single();
 const {
  data: { user },
 } = await supabase.auth.getUser();
 if (!profile) {
  notFound();
 }
 return (
  <div className="flex gap-5 items-start">
   <div className="w-1/4 bg-slate-200 dark:bg-slate-800 rounded-md p-5 flex flex-col h-auto">
    <div className="flex flex-col gap-2 pb-5 mb-5 border-b-2 border-slate-500 items-start">
     <Label className="font-bold self-center mb-3">{profile?.username}</Label>
     <Label size="small">Full name: {profile?.full_name}</Label>
     <Label size="small">Role: {profile?.role}</Label>
     {user?.id === profile?.id && (
      <Label size="small">
       {profile?.email?.length! > 22
        ? `${profile?.email?.slice(0, 20)}...`
        : profile?.email}
      </Label>
     )}
    </div>
    <div className="flex flex-col gap-2 items-start">
     <Label size="small">Rated matches: 0</Label>
     <Label size="small">Rated wrestlers: 0</Label>
     <Label size="small">Rated shows: 0</Label>
    </div>
    {user?.id === profile?.id && (
     <Link href="#" className={cn(buttonVariants(), "w-full mt-10")}>
      Edit
     </Link>
    )}
   </div>
   <div className="flex-1 h-[1000px]">
    <div className="flex justify-center gap-2">
     <SectionButton link={`/user/${params.id}`} isMain>
      Matches
     </SectionButton>
     <SectionButton link={`/user/${params.id}/wrestlers`}>
      Wrestlers
     </SectionButton>
     <SectionButton link={`/user/${params.id}/shows`}>Shows</SectionButton>
     <SectionButton link={`/user/${params.id}/edit`}>Edit</SectionButton>
    </div>
    {children}
   </div>
  </div>
 );
};

export default Layout;
