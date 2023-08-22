import AllWrestlerMatches from "@/components/AllWrestlerMatches";
import createClient from "@/lib/supabase-server";

import { notFound } from "next/navigation";

const WrestlerMatches = async ({ params }: { params: { id: string } }) => {
 const supabase = createClient();

 const { data: shows } = await supabase
  .from("shows")
  .select("*, matches(*, match_sides(*), winners(*), challanges(*))");
 if (!shows) {
  notFound();
 }

 return (
  <AllWrestlerMatches
   shows={shows.map((show) =>
    show.id === 23 ? { ...show, upload_date: "2012-06-23" } : show
   )}
   id={params.id}
  />
 );
};

export default WrestlerMatches;
