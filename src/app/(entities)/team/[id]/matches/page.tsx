import MatchNoResult from "@/components/Row/MatchNoResult";
import createClient from "@/lib/supabase-server";
import Link from "next/link";
import { notFound } from "next/navigation";

const TeamMatches = async ({ params }: { params: { id: string } }) => {
 const supabase = createClient();

 const { data: shows } = await supabase
  .from("shows")
  .select("*, matches(*, match_sides(*))");
 if (!shows) {
  notFound();
 }
 return (
  <div className="w-full">
   {shows
    .filter((show) =>
     show.matches.some((match) =>
      match.match_sides.some((side) =>
       side.wrestlers.some((wrestler) => wrestler.teamId === params.id)
      )
     )
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
        side.wrestlers.some((wrestler) => wrestler.teamId === params.id)
       )
      )
      .map((match) => (
       <div
        key={match.id}
        className={`flex ${
         index % 2 === 0 && "dark:bg-slate-800 bg-slate-300"
        } px-4 py-5 text-xl w-full rounded-md`}
       >
        <div className="flex w-[60%] border-r-2 dark:border-slate-700 border-slate-400 pr-3 items-center">
         <p className="mr-3">{index + 1}.</p>
         <MatchNoResult match_sides={match.match_sides} />
        </div>
        <Link
         href={`/show/${show.id}`}
         className="flex-1 text-center hover:underline underline-offset-4 font-semibold flex items-center justify-center"
        >
         {show.name}
        </Link>
        <div className="w-[10%] border-l-2 dark:border-slate-700 border-slate-400 flex items-center justify-center">
         {show.upload_date
          ? new Date(show.upload_date.toString() || "").toLocaleDateString()
          : ""}
        </div>
       </div>
      ))
    )}
  </div>
 );
};

export default TeamMatches;
