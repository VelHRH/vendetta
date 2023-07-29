import createClient from "@/lib/supabase-server";
import { normalizeRating, ratingColor } from "@/lib/utils";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonVariants } from "../ui/Button";
import MatchNoResult from "./MatchNoResult";
import MatchResult from "./MatchResult";

interface MatchElemProps {
 matchId: number;
 isFull?: boolean;
 index: number;
}

const MatchElem = async ({ matchId, isFull, index }: MatchElemProps) => {
 const supabase = createClient();
 const { data: match } = await supabase
  .from("matches")
  .select("*, comments_matches(*), match_sides(*), winners(*), challanges(*)")
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
    className={`flex flex-col w-full text-2xl rounded-md font-extralight p-4 ${
     index % 2 === 0 && "dark:bg-slate-800 bg-slate-200"
    }`}
   >
    {match.challanges.length > 0 && (
     <div className="flex gap-2">
      {match.challanges.map((title) => (
       <Link
        key={title.id}
        href={`/title/${title.id}`}
        className={`rounded-full py-1 px-2 text-sm font-semibold border-2 duration-200 ${
         title.title_name === "Чемпионство Vendetta"
          ? "border-amber-400/70 hover:bg-amber-400/70"
          : title.title_name === "Командное чемпионство Vendetta"
          ? "border-blue-400/70 hover:bg-blue-400/70"
          : "border-red-400/70 hover:bg-red-400/70"
        }`}
       >
        {title.title_name}
       </Link>
      ))}
     </div>
    )}
    <div className="flex gap-3 items-center">
     <div className="flex-1 flex flex-wrap">
      {!isFull ? (
       <MatchNoResult match_sides={match.match_sides} />
      ) : match.winners.length === 0 ? (
       <div className="flex items-center gap-2">
        <MatchNoResult match_sides={match.match_sides} />
        <p>- ничья {match.ending}</p>
       </div>
      ) : (
       <MatchResult winners={match.winners} match_sides={match.match_sides} />
      )}
     </div>

     {user &&
      !isFull &&
      (user.id === "41608919-15c0-4bbd-b91e-b3407a0c3520" ||
       user.id === "4caeee0b-5b66-4ba0-9fad-2c1ba9284238") && (
       <Link
        href={`/match/edit?id=${match.id}`}
        className={buttonVariants({ variant: "subtle" })}
       >
        <Pencil />
       </Link>
      )}
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
   </div>
  </>
 );
};

export default MatchElem;
