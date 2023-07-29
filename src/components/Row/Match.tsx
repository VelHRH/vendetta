import Link from "next/link";
import { FC } from "react";
import MatchResult from "./MatchResult";

interface MatchProps {
 index: number;
 match: any;
 show: any;
}

const Match: FC<MatchProps> = ({ index, match, show }) => {
 return (
  <div
   className={`flex ${
    index % 2 === 0 && "dark:bg-slate-800 bg-slate-200"
   } px-4 py-5 text-xl w-full rounded-md gap-3 items-stretch`}
  >
   <div className="flex w-[60%] border-r-2 dark:border-slate-600 border-slate-400 pr-3 items-center">
    <p className="mr-3">{index + 1}.</p>
    <div className="flex flex-col gap-1">
     {match.challanges.length > 0 && (
      <div className="flex gap-2">
       {match.challanges.map((title: any) => (
        <Link
         key={title.id}
         href={`/title/${title.title_id}`}
         className={`rounded-full py-1 px-2 text-sm font-semibold border-2 duration-200 ${
          title.title_name === "Чемпионство Vendetta"
           ? "border-amber-400/70 hover:bg-amber-400/70"
           : title.title_name === "Командное чемпионство Vendetta"
           ? "border-blue-400/70 hover:bg-blue-400/70"
           : "border-red-400/70 hover:bg-red-400/70"
         } self-start cursor-pointer`}
        >
         {title.title_name}
        </Link>
       ))}
      </div>
     )}
     <MatchResult match_sides={match.match_sides} winners={match.winners} />
    </div>
   </div>
   <Link
    href={`/show/${show.id}`}
    className="flex-1 text-center hover:underline underline-offset-4 font-semibold flex items-center justify-center"
   >
    {show.name}
   </Link>
   <div className="w-[10%] border-l-2 dark:border-slate-600 border-slate-400 flex items-center justify-center">
    {show.upload_date
     ? new Date(show.upload_date.toString() || "").toLocaleDateString()
     : ""}
   </div>
  </div>
 );
};

export default Match;
