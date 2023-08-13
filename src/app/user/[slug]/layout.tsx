import { ReactNode } from "react";
import Label from "@/components/ui/Label";
import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/Button";
import Link from "next/link";
import createClient from "@/lib/supabase-server";
import { cn } from "@/lib/utils";
import SectionButton from "@/components/SectionButton";
import InfoLabel from "@/components/ui/InfoLabel";

export async function generateMetadata({
 params,
}: {
 params: { slug: string };
}) {
 const supabase = createClient();
 const { data: profile } = await supabase
  .from("users")
  .select("*")
  .eq("username", params.slug.replace(/%20/g, " "))
  .single();

 if (!profile) {
  notFound();
 }
 return { title: profile.username };
}

interface LayoutProps {
 children: ReactNode;
 params: { slug: string };
}

const Layout = async ({ children, params }: LayoutProps) => {
 const supabase = createClient();

 const { data: profile } = await supabase
  .from("users")
  .select(
   "*, comments_shows(*), comments_wrestlers(*), comments_tournaments(*), comments_teams(*), comments_titles(*), comments_matches(*)"
  )
  .eq("username", params.slug.replace(/%20/g, " "))
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
     <Label className="font-bold self-center">{profile.username}</Label>
     {profile.username === profile.id && (
      <InfoLabel>
       Это имя пользователя было сгенерировано автоматически. Измените его в
       разделе «Редактировать».
      </InfoLabel>
     )}
     <Label size="small" className="mt-3">
      Полное имя: {profile.full_name}
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
      Оцененные матчи: {profile.comments_matches.length}
     </Label>
     <Label size="small">
      Оцененные рестлеры: {profile.comments_wrestlers.length}
     </Label>
     <Label size="small">Оцененные шоу: {profile.comments_shows.length}</Label>
     <Label size="small">
      Оцененные команды: {profile.comments_teams.length}
     </Label>
     <Label size="small">
      Оцененные турниры: {profile.comments_tournaments.length}
     </Label>
     <Label size="small">
      Оцененные титулы: {profile.comments_titles.length}
     </Label>
    </div>
    {user?.id === profile.id && (
     <Link
      href={`/user/${params.slug}/edit`}
      className={cn(buttonVariants(), "w-full mt-10")}
     >
      Редактировать
     </Link>
    )}
   </div>
   <div className="flex-1">
    <div className="flex justify-center gap-2 mb-5">
     <SectionButton link={`/user/${params.slug}`} isMain={2}>
      Матчи
     </SectionButton>
     <SectionButton link={`/user/${params.slug}/wrestlers`}>
      Рестлеры
     </SectionButton>
     <SectionButton link={`/user/${params.slug}/shows`}>Шоу</SectionButton>
     <SectionButton link={`/user/${params.slug}/teams`}>Команды</SectionButton>
     <SectionButton link={`/user/${params.slug}/tournaments`}>
      Турниры
     </SectionButton>
     <SectionButton link={`/user/${params.slug}/titles`}>Титулы</SectionButton>
     {user?.id === profile.id && (
      <SectionButton link={`/user/${params.slug}/edit`}>
       Редактировать
      </SectionButton>
     )}
    </div>
    <div className="flex flex-col gap-3">{children}</div>
   </div>
  </div>
 );
};

export default Layout;
