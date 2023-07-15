import { ReactNode } from "react";

import Label from "@/components/ui/Label";
import { notFound } from "next/navigation";
import SectionButton from "@/components/SectionButton";
import { buttonVariants } from "@/components/ui/Button";
import { Pencil } from "lucide-react";
import Link from "next/link";
import createClient from "@/lib/supabase-server";
import MatchSide from "@/components/Row/MatchSide";
import { sortSides } from "@/lib/utils";

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
    <Label className="font-bold">
     {sortSides(match.match_sides).map((p, index) => (
      <>
       <MatchSide key={p.id} wrestlers={p.wrestlers} />
       {index !== match.match_sides.length - 1 && <p className="mx-3">vs.</p>}
      </>
     ))}
    </Label>
    {user &&
     (user.id === "41608919-15c0-4bbd-b91e-b3407a0c3520" ||
      user.id === "4caeee0b-5b66-4ba0-9fad-2c1ba9284238") && (
      <Link
       href={`/show/edit?id=${match.id}`}
       className={buttonVariants({ variant: "subtle" })}
      >
       <Pencil />
      </Link>
     )}
   </div>
   <div className="flex gap-2">
    <SectionButton link={`/show/${params.id}`} isMain>
     Overview
    </SectionButton>
    <SectionButton link={`/show/${params.id}/other`}>Other</SectionButton>
   </div>
   {children}
  </div>
 );
};

export default Layout;
