import AllWrestlerMatches from "@/components/AllWrestlerMatches";
import createClient from "@/lib/supabase-server";

import { notFound } from "next/navigation";

const TournamentMatches = async ({ params }: { params: { id: string } }) => {
 const supabase = createClient();

 const { data: shows } = await supabase
  .from("shows")
  .select("*, matches(*, match_sides(*), winners(*), challanges(*))");
 if (!shows) {
  notFound();
 }

 return (
  <AllWrestlerMatches
   shows={shows}
   id={params.id}
   tournament={parseFloat(params.id)}
  />
 );
};

export default TournamentMatches;
