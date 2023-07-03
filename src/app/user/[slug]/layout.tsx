import { ReactNode } from "react";

import Label from "@/components/ui/Label";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/Button";
import Link from "next/link";
import createClient from "@/lib/supabase-server";
import { cn } from "@/lib/utils";
import SectionButton from "@/components/SectionButton";
import { Info } from "lucide-react";
import { comment } from "postcss";

interface LayoutProps {
 children: ReactNode;
 params: { slug: string };
}

const Layout = async ({ children, params }: LayoutProps) => {
 const supabase = createClient();

 const { data: profile } = await supabase
  .from("users")
  .select()
  .eq("username", params.slug)
  .single();
 const {
  data: { user },
 } = await supabase.auth.getUser();
 if (!profile) {
  notFound();
 }
 const { data: comments } = await supabase.from("comments").select();
 return (
  <div className="flex gap-5 items-start">
   <div className="w-1/4 bg-slate-200 dark:bg-slate-800 rounded-md p-5 flex flex-col h-auto">
    <div className="flex flex-col gap-2 pb-5 mb-5 border-b-2 border-slate-500 items-start">
     <Label className="font-bold self-center">{profile.username}</Label>
     {profile.username === profile.id && (
      <p className="flex text-slate-500 items-center gap-2">
       <Info size={40} />{" "}
       <p>
        This username was generated automaticaly. Change it in Edit section.
       </p>
      </p>
     )}
     <Label size="small" className="mt-3">
      Full name: {profile.full_name}
     </Label>
     <Label size="small">Role: {profile.role}</Label>
     {user?.id === profile.id && (
      <Label size="small" className="text-start">
       Email: {profile.email}
      </Label>
     )}
    </div>
    <div className="flex flex-col gap-2 items-start">
     <Label size="small">
      Rated matches:{" "}
      {
       comments?.filter(
        (comment) =>
         comment.type === "matches" && comment.author?.username === params.slug
       ).length
      }
     </Label>
     <Label size="small">
      Rated wrestlers:{" "}
      {
       comments?.filter(
        (comment) =>
         comment.type === "wrestlers" &&
         comment.author?.username === params.slug
       ).length
      }
     </Label>
     <Label size="small">
      Rated shows:{" "}
      {
       comments?.filter(
        (comment) =>
         comment.type === "shows" && comment.author?.username === params.slug
       ).length
      }
     </Label>
    </div>
    {user?.id === profile.id && (
     <Link
      href={`/user/${params.slug}/edit`}
      className={cn(buttonVariants(), "w-full mt-10")}
     >
      Edit
     </Link>
    )}
   </div>
   <div className="flex-1 h-[1000px]">
    <div className="flex justify-center gap-2 mb-5">
     <SectionButton link={`/user/${params.slug}`} isMain>
      Matches
     </SectionButton>
     <SectionButton link={`/user/${params.slug}/wrestlers`}>
      Wrestlers
     </SectionButton>
     <SectionButton link={`/user/${params.slug}/shows`}>Shows</SectionButton>
     <SectionButton link={`/user/${params.slug}/edit`}>Edit</SectionButton>
    </div>
    {children}
   </div>
  </div>
 );
};

export default Layout;
