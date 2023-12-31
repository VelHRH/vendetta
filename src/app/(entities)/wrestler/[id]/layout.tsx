import { ReactNode } from "react";

import Label from "@/components/ui/Label";
import { notFound } from "next/navigation";
import SectionButton from "@/components/SectionButton";
import { buttonVariants } from "@/components/ui/Button";
import { Pencil } from "lucide-react";
import Link from "next/link";
import createClient from "@/lib/supabase-server";

export async function generateMetadata({ params }: { params: { id: string } }) {
 const supabase = createClient();
 const { data: wrestler } = await supabase
  .from("wrestlers")
  .select("*")
  .eq("id", params.id)
  .single();

 if (!wrestler) {
  notFound();
 }
 return { title: wrestler.name };
}

interface LayoutProps {
 children: ReactNode;
 params: { id: string };
}

const Layout = async ({ children, params }: LayoutProps) => {
 const supabase = createClient();
 const { data: wrestler } = await supabase
  .from("wrestlers")
  .select(
   "*, reigns(*), teams_current_participants(*), teams_former_participants(*)"
  )
  .eq("id", params.id)
  .single();
 const {
  data: { user },
 } = await supabase.auth.getUser();
 if (!wrestler) {
  notFound();
 }
 return (
  <div className="flex flex-col gap-5 items-center">
   <div className="flex gap-2">
    <Label className="font-bold">{wrestler?.name!}</Label>
    {user &&
     (user.id === "41608919-15c0-4bbd-b91e-b3407a0c3520" ||
      user.id === "4caeee0b-5b66-4ba0-9fad-2c1ba9284238") && (
      <Link
       href={`/wrestler/edit?id=${wrestler.id}`}
       className={buttonVariants({ variant: "subtle" })}
      >
       <Pencil />
      </Link>
     )}
   </div>
   <div className="flex gap-2">
    <SectionButton link={`/wrestler/${params.id}`} isMain={2}>
     Обзор
    </SectionButton>
    <SectionButton link={`/wrestler/${params.id}/matches`}>Матчи</SectionButton>
    <SectionButton link={`/wrestler/${params.id}/matchguide`}>
     Матчгайд
    </SectionButton>
    {wrestler.reigns.length > 0 && (
     <SectionButton link={`/wrestler/${params.id}/titles`}>
      Титулы
     </SectionButton>
    )}
    {(wrestler.teams_current_participants.length > 0 ||
     wrestler.teams_former_participants.length > 0) && (
     <SectionButton link={`/wrestler/${params.id}/teams`}>
      Команды
     </SectionButton>
    )}
   </div>
   {children}
  </div>
 );
};

export default Layout;
