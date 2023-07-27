import Match from "@/components/Row/Match";
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
  <div className="w-full">
   {shows
    .filter(
     (show) =>
      show.matches.some((match) =>
       match.match_sides.some((side) =>
        side.wrestlers.some((wrestler) => wrestler.wrestlerId === params.id)
       )
      ) && show.upload_date
    )
    .sort(
     (a, b) =>
      new Date(b.upload_date || new Date()).getTime() -
      new Date(a.upload_date || new Date()).getTime()
    )
    .map((show, index) =>
     show.matches
      .filter((match) =>
       match.match_sides.some((side) =>
        side.wrestlers.some((wrestler) => wrestler.wrestlerId === params.id)
       )
      )
      .map((match) => (
       <Match key={match.id} index={index} match={match} show={show} />
      ))
    )}
  </div>
 );
};

export default WrestlerMatches;
