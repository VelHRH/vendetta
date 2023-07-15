import createClient from "@/lib/supabase-server";
import {
 normalizeRating,
 parseSide,
 ratingColor,
 sortSides,
} from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";
import MatchSide from "./MatchSide";

interface MatchElemProps {
 matchId: number;
 isFull?: boolean;
 index: number;
}

const MatchElem = async ({ matchId, isFull, index }: MatchElemProps) => {
 const supabase = createClient();
 const { data: match } = await supabase
  .from("matches")
  .select("*, comments_matches(*), match_sides(*), winners(*)")
  .eq("id", matchId)
  .single();
 if (!match) {
  notFound();
 }
 const {
  data: { user },
 } = await supabase.auth.getUser();
 return (
  <>
   {index === 0 && (
    <div className="flex justify-between items-center py-2 gap-3 h-10 p-4">
     <p className="text-center flex-1"></p>
     {isFull && (
      <>
       <p className="text-center w-32">Рейтинг</p>
       {match.comments_matches.find((c) => c.author === user?.id) && (
        <p className="text-center w-32">Ваш рейтинг</p>
       )}
      </>
     )}
    </div>
   )}
   <div
    className={`flex gap-3 w-full text-2xl items-center rounded-md font-extralight p-4 ${
     index % 2 === 0 && "dark:bg-slate-800 bg-slate-200"
    }`}
    key={match.id}
   >
    <div className="flex-1 flex flex-wrap">
     {!isFull ? (
      sortSides(match.match_sides).map((p, index) => (
       <>
        <MatchSide key={p.id} wrestlers={p.wrestlers} />
        {index !== match.match_sides.length - 1 && <p className="mx-3">vs.</p>}
       </>
      ))
     ) : match.winners.length === 0 ? (
      sortSides(match.match_sides).map((p, index) => (
       <>
        <MatchSide key={p.id} wrestlers={p.wrestlers} />
        {index !== match.match_sides.length - 1 && <p className="mx-3">vs.</p>}
       </>
      ))
     ) : (
      <>
       {match.winners.map((p, index) => (
        <>
         <MatchSide key={p.id} wrestlers={p.winner} />
         {index === match.winners.length - 1 && <p className="mx-3">поб.</p>}
        </>
       ))}
       {sortSides(match.match_sides).map(
        (p, index) =>
         !match.winners.some(
          (obj) => JSON.stringify(obj.winner) === JSON.stringify(p.wrestlers)
         ) && <MatchSide key={p.id} wrestlers={p.wrestlers} />
       )}
      </>
     )}
    </div>
    {isFull && (
     <>
      {match.comments_matches.length !== 0 ? (
       <Link
        href={`/match/${matchId}`}
        style={{
         color: ratingColor({
          rating: normalizeRating({
           ratings: match.comments_matches.length,
           avgRating: match.avgRating,
          }),
         }),
        }}
        className="dark:bg-slate-800 h-12 bg-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 duration-300 w-32 rounded-md justify-center flex items-center font-semibold"
       >
        {normalizeRating({
         ratings: match.comments_matches.length,
         avgRating: match.avgRating,
        }).toFixed(2)}
       </Link>
      ) : (
       <Link
        href={`/match/${matchId}`}
        className={`dark:bg-slate-800 bg-slate-200 h-12 hover:bg-slate-300 dark:hover:bg-slate-700 duration-300 w-32 rounded-md justify-center flex items-center font-semibold`}
       >
        --
       </Link>
      )}
      {match.comments_matches.find((c) => c.author === user?.id) && (
       <Link
        href={`/match/${match.id}`}
        className={`dark:bg-slate-800 bg-slate-200 h-12 hover:bg-slate-300 dark:hover:bg-slate-700 duration-300 w-32 rounded-md justify-center flex items-center font-semibold`}
       >
        {match.comments_matches.find((c) => c.author === user?.id)!.rating}
       </Link>
      )}
     </>
    )}
   </div>
  </>
 );
};

export default MatchElem;
