import Match from "@/components/Row/Match";
import createClient from "@/lib/supabase-server";

import { notFound } from "next/navigation";

const TitleMatches = async ({
 params,
 searchParams,
}: {
 params: { id: string };
 searchParams?: { start?: string; end?: string };
}) => {
 const supabase = createClient();

 const { data: shows } = await supabase
  .from("shows")
  .select("*, matches(*, match_sides(*), winners(*), challanges(*))");
 if (!shows) {
  notFound();
 }
 return (
  <div className="w-full">
   {searchParams?.start ? (
    <div className="mb-2 w-full text-center text-2xl font-semibold">
     {searchParams.end
      ? `${new Date(searchParams.start).toLocaleDateString()} - ${new Date(
         searchParams.end
        ).toLocaleDateString()}`
      : `${new Date(searchParams.start).toLocaleDateString()} - сейчас`}
    </div>
   ) : null}
   {shows
    .filter(
     (show) =>
      show.matches.some((match) =>
       match.challanges.some((chal) => chal.title_id === parseFloat(params.id))
      ) &&
      show.upload_date &&
      new Date(show.upload_date).getTime() >=
       new Date(searchParams?.start || "2000-01-01").getTime() &&
      new Date(show.upload_date).getTime() <=
       new Date(searchParams?.end || "3000-01-01").getTime()
    )
    .sort(
     (a, b) =>
      new Date(b.upload_date || new Date()).getTime() -
      new Date(a.upload_date || new Date()).getTime()
    )
    .map((show, index) =>
     show.matches
      .filter((match) =>
       match.challanges.some((chal) => chal.title_id === parseFloat(params.id))
      )
      .map((match) => (
       <Match key={match.id} index={index} match={match} show={show} />
      ))
    )}
  </div>
 );
};

export default TitleMatches;
