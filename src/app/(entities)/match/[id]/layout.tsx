import { ReactNode } from "react";

import Label from "@/components/ui/Label";
import { notFound } from "next/navigation";
import SectionButton from "@/components/SectionButton";
import { buttonVariants } from "@/components/ui/Button";
import { Pencil } from "lucide-react";
import Link from "next/link";
import createClient from "@/lib/supabase-server";
import MatchNoResult from "@/components/Row/MatchNoResult";
import { parseSide, sortSides } from "@/lib/utils";
import RatingBlock from "@/components/RatingBlock";

export async function generateMetadata({ params }: { params: { id: string } }) {
 const supabase = createClient();
 const { data: match } = await supabase
  .from("matches")
  .select("*, match_sides(*)")
  .eq("id", params.id)
  .single();
 if (!match) {
  notFound();
 }
 let matchTitle = "";

 for (let side of sortSides(match.match_sides)) {
  matchTitle += `${parseSide(side.wrestlers)}`;
  if (match.match_sides.indexOf(side) !== match.match_sides.length - 1) {
   matchTitle += " vs. ";
  }
 }
 return { title: matchTitle };
}

interface LayoutProps {
 children: ReactNode;
 params: { id: string };
}

const Layout = async ({ children, params }: LayoutProps) => {
 const supabase = createClient();
 const { data: match } = await supabase
  .from("matches")
  .select("*, match_sides(*)")
  .eq("id", params.id)
  .single();
 const {
  data: { user },
 } = await supabase.auth.getUser();
 if (!match) {
  notFound();
 }
 return (
  <div className="flex flex-col gap-5 items-center">
   <div className="flex gap-2">
    <Label size="medium" className="font-semibold lg:font-bold">
     <MatchNoResult match_sides={match.match_sides} />
    </Label>
    {user &&
     (user.id === "41608919-15c0-4bbd-b91e-b3407a0c3520" ||
      user.id === "4caeee0b-5b66-4ba0-9fad-2c1ba9284238") && (
      <Link
       href={`/match/edit?id=${match.id}`}
       className={buttonVariants({ variant: "subtle" })}
      >
       <Pencil />
      </Link>
     )}
   </div>
   <div className="flex gap-2">
    <SectionButton link={`/match/${params.id}`} isMain={2}>
     Обзор
    </SectionButton>
    <SectionButton link={`/match/${params.id}/other`}>
     Другие матчи
    </SectionButton>
   </div>
   {children}
  </div>
 );
};

export default Layout;
