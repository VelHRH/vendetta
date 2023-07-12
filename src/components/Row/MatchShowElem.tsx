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
 const { data: match } = await supabase
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
      match.match_sides.map((p, index) => (
       <div className="flex" key={p.name}>
        {p.name.split(/&/).map((wrestler, index2) => (
         <div key={index2} className="flex">
          <Link
           href={`/wrestler/${p.wrestlers[index2].wrestlerId}`}
           className={`hover:underline underline-offset-4 font-semibold`}
          >
           {wrestler.trim()}
          </Link>
          {index2 !== p.name.split(/&/).length - 1 ? (
           index2 === p.name.split(/&/).length - 2 ? (
            <p className="mx-2">&</p>
           ) : (
            <p className="mr-2">,</p>
           )
          ) : null}
         </div>
        ))}
        {index !== match.match_sides.length - 1 && <p className="mx-4">vs.</p>}
       </div>
      ))
     ) : !match.winner![0].toLowerCase().includes("ничья") ? (
      <>
       {match.winner!.map((w, index) => (
        <div className="flex" key={index}>
         {w.split(/&/).map((wrestler, index2) => (
          <>
           <Link
            key={index2}
            href={`/wrestler/${
             match.match_sides.find((p) => p.name === w)?.wrestlers[index2]
              .wrestlerId
            }`}
            className={`hover:underline underline-offset-4 font-semibold`}
           >
            {wrestler.trim()}
           </Link>
           {index2 !== w.split(/&/).length - 1 ? (
            index2 === w.split(/&/).length - 2 ? (
             <p className="mx-2">&</p>
            ) : (
             <p className="mr-2">,</p>
            )
           ) : null}
          </>
         ))}
         {index !== match.winner!.length - 1 && " и "}
        </div>
       ))}
       <p className="mx-4">поб.</p>
       {match.match_sides
        .filter((p) => !match.winner!.includes(p.name))
        .map((p, index) => (
         <div key={index} className="flex">
          {p.name.split(/&/).map((wrestler, index2) => (
           <>
            <Link
             key={index2}
             href={`/wrestler/${p.wrestlers[index2].wrestlerId}`}
             className={`hover:underline underline-offset-4 font-semibold`}
            >
             {wrestler.trim()}
            </Link>
            {index2 !== p.name.split(/&/).length - 1 ? (
             index2 === p.name.split(/&/).length - 2 ? (
              <p className="mx-2">&</p>
             ) : (
              <p className="mr-2">,</p>
             )
            ) : null}
           </>
          ))}
          {index !==
           match.match_sides.filter((p) => !match.winner!.includes(p.name))
            .length -
            1 && " и "}
         </div>
        ))}
       <p className="mx-4">-</p>
       <p className="mr-4">{match.ending}</p>
       <p>{`[${match.time}]`}</p>
      </>
     ) : (
      match.match_sides.map((p, index) => (
       <>
        <div className="flex" key={p.name}>
         {p.name.split(/&/).map((wrestler, index2) => (
          <>
           <Link
            key={index2}
            href={`/wrestler/${p.wrestlers[index2].wrestlerId}`}
            className={`hover:underline underline-offset-4 font-semibold`}
           >
            {wrestler.trim()}
           </Link>
           {index2 !== p.name.split(/&/).length - 1 ? (
            index2 === p.name.split(/&/).length - 2 ? (
             <p className="mx-2">&</p>
            ) : (
             <p className="mr-2">,</p>
            )
           ) : null}
          </>
         ))}

         {index !== match.match_sides.length - 1 && <p className="mx-4">vs.</p>}
        </div>
        {match.match_sides.length - 1 === index && <p className="mx-4">-</p>}
        {match.match_sides.length - 1 === index && (
         <p className="mr-4">
          {match.winner![0].toLowerCase()} {match.ending}
         </p>
        )}
        {match.match_sides.length - 1 === index && <p>{`[${match.time}]`}</p>}
       </>
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
        className="dark:bg-slate-800 h-12 bg-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 duration-300 w-32 rounded-md justify-center flex items-center"
       >
        {normalizeRating({
         ratings: match.comments_matches.length,
         avgRating: match.avgRating,
        }).toFixed(2)}
       </Link>
      ) : (
       <Link
        href={`/match/${matchId}`}
        className={`dark:bg-slate-800 bg-slate-200 h-12 hover:bg-slate-300 dark:hover:bg-slate-700 duration-300 w-32 rounded-md justify-center flex items-center`}
       >
        --
       </Link>
      )}
      {match.comments_matches.find((c) => c.author === user?.id) && (
       <Link
        href={`/match/${match.id}`}
        className={`dark:bg-slate-800 bg-slate-200 h-12 hover:bg-slate-300 dark:hover:bg-slate-700 duration-300 w-32 rounded-md justify-center flex items-center`}
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
