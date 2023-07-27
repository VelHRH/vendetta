import { DEFAULT_IMAGE } from "@/config";
import { normalizeRating, ratingColor } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

import createClient from "@/lib/supabase-server";

interface WrestlerElemProps {
 wrestler: Database["public"]["Tables"]["wrestlers"]["Row"];
 comments: Database["public"]["Tables"]["comments_wrestlers"]["Row"][];
 place: number;
 yourComments?: number;
 reigns: Database["public"]["Tables"]["reigns"]["Row"][];
}

const WrestlerElem = async ({
 wrestler,
 place,
 comments,
 yourComments,
 reigns,
}: WrestlerElemProps) => {
 const supabase = createClient();

 const { data: shows } = await supabase
  .from("shows")
  .select("*, matches(*, match_sides(*))");
 return (
  <Link
   href={`/wrestler/${wrestler.id}`}
   className="w-full mb-4 flex justify-between items-center gap-3 text-xl h-20 group"
  >
   <div className="w-1/2 dark:bg-slate-800 bg-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 duration-300 rounded-md p-3 flex gap-4 font-bold items-center h-full flex-wrap">
    {place}.
    <div className="h-full aspect-square relative">
     <Image
      alt="Wrestler image"
      src={wrestler.wrestler_img || DEFAULT_IMAGE}
      fill
      className="object-cover rounded-md"
     />
    </div>
    {wrestler.name}
    {reigns.map(
     (reign) =>
      !reign.end && (
       <div
        key={reign.id}
        className={`p-1 font-semibold text-sm rounded-md bg-amber-400/70`}
       >
        Vendetta Champion
       </div>
      )
    )}
   </div>
   <div className="flex-1 flex items-center duration-300 dark:bg-slate-800 bg-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 rounded-md justify-center p-3 h-full text-center">
    {
     shows!
      .filter((show) =>
       show.matches.some((match) =>
        match.match_sides.some((side) =>
         side.wrestlers.some((w) => w.wrestlerId === wrestler.id.toString())
        )
       )
      )
      .sort(
       (a, b) =>
        new Date(b.upload_date || new Date()).getTime() -
        new Date(a.upload_date || new Date()).getTime()
      )[0].name
    }
   </div>

   {comments.length !== 0 ? (
    <div
     style={{
      color: ratingColor({
       rating: normalizeRating({
        ratings: comments.length,
        avgRating: wrestler.avgRating,
       }),
      }),
     }}
     className="dark:bg-slate-800 bg-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 duration-300 w-32 aspect-square rounded-md justify-center p-3 h-full flex items-center"
    >
     {normalizeRating({
      ratings: comments.length,
      avgRating: wrestler.avgRating,
     }).toFixed(2)}
    </div>
   ) : (
    <div className="dark:bg-slate-800 bg-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 duration-300 w-32 aspect-square rounded-md justify-center p-3 h-full flex items-center">
     --
    </div>
   )}
   {yourComments ? (
    yourComments !== -1 ? (
     <div
      style={{
       color: ratingColor({
        rating: yourComments,
       }),
      }}
      className="dark:bg-slate-800 bg-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 duration-300 w-32 rounded-md justify-center p-3 h-full flex items-center"
     >
      {yourComments}
     </div>
    ) : (
     <div className="dark:bg-slate-800 bg-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 duration-300 w-32 rounded-md justify-center p-3 h-full flex items-center">
      --
     </div>
    )
   ) : null}
   <div className="dark:bg-slate-800 bg-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 duration-300 w-32 rounded-md justify-center p-3 h-full flex items-center">
    {comments.length}
   </div>
  </Link>
 );
};

export default WrestlerElem;
