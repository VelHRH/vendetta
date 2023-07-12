import createClient from "@/lib/supabase-server";
import { normalizeRating, ratingColor } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";

interface MatchElemProps {
 matchId: number;
 isFull?: boolean;
 index: number;
}

const MatchElem = async ({ matchId, isFull, index }: MatchElemProps) => {
 const supabase = createClient();
 const { data: match, error } = await supabase
  .from("matches")
  .select("*, comments_matches(*), match_sides(*)")
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
    <div className="flex justify-between items-center py-2 gap-3 h-10">
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
    className="flex gap-3 w-full text-2xl items-center h-12 font-extralight"
    key={match.id}
   >
    <div className="flex-1 flex gap-3">
     {!isFull ? (
      match.match_sides.map((p, index) => (
       <div className="flex gap-3" key={p.name}>
        <Link
         href={`/wrestler/${p.wrestlers[0].wrestlerId}`}
         className={`hover:underline underline-offset-4 font-semibold`}
        >
         {p.name}
        </Link>
        {index !== match.match_sides.length - 1 && "vs. "}
       </div>
      ))
     ) : !match.winner[0].toLowerCase().includes("ничья") ? (
      <>
       {match.winner.map((w, index) => (
        <div key={index}>
         <Link
          href={`/wrestler/${
           match.match_sides.find((p) => p.name === w)?.wrestlers[0].wrestlerId
          }`}
          className={`hover:underline underline-offset-4 font-semibold`}
         >
          {w}
         </Link>
         {index !== match.winner.length - 1 && ","}
        </div>
       ))}
       поб.
       {match.match_sides
        .filter((p) => !match.winner.includes(p.name))
        .map((p, index) => (
         <div key={index}>
          <Link
           href={`/wrestler/${p.wrestlers![0].wrestlerId}`}
           className={`hover:underline underline-offset-4 font-semibold`}
          >
           {p.name}
          </Link>
          {index !==
           match.match_sides.filter((p) => !match.winner.includes(p.name))
            .length -
            1 && ","}
         </div>
        ))}
       <p>{match.ending}</p>
       <p>{`[${match.time}]`}</p>
      </>
     ) : (
      match.match_sides.map((p, index) => (
       <div className="flex gap-3" key={p.name}>
        <Link
         href={`/wrestler/${p.wrestlers[0].wrestlerId}`}
         className={`hover:underline underline-offset-4 font-semibold`}
        >
         {p.name}
        </Link>
        {index !== match.match_sides.length - 1
         ? "vs. "
         : `- ${match.winner[0]}`}
       </div>
      ))
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
        className="dark:bg-slate-800 bg-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 duration-300 w-32 rounded-md justify-center h-full flex items-center"
       >
        {normalizeRating({
         ratings: match.comments_matches.length,
         avgRating: match.avgRating,
        }).toFixed(2)}
       </Link>
      ) : (
       <Link
        href={`/match/${matchId}`}
        className="dark:bg-slate-800 bg-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 duration-300 w-32 rounded-md justify-center h-full flex items-center"
       >
        --
       </Link>
      )}
      {match.comments_matches.find((c) => c.author === user?.id) && (
       <Link
        href={`/match/${match.id}`}
        className="h-12 dark:bg-slate-800 bg-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 duration-300 w-32 rounded-md justify-center flex items-center"
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
