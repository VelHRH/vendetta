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
   className={`flex flex-col gap-1 font-extralight ${
    index % 2 === 0 && "dark:bg-slate-800 bg-slate-300"
   } px-4 py-5 text-xl w-full rounded-md`}
  >
   {match.challanges.length > 0 && (
    <div className="flex gap-2">
     {match.challanges.map((title: any) => (
      <Link
       key={title.id}
       href={`/title/${title.id}`}
       className="rounded-full py-1 px-2 text-sm font-semibold border-2 duration-200 border-amber-400/70 self-start cursor-pointer hover:bg-amber-400/70"
      >
       {title.title_name}
      </Link>
     ))}
    </div>
   )}
   <div className="flex gap-3 items-center">
    <div className="flex w-[60%] border-r-2 dark:border-slate-700 border-slate-400 pr-3 items-center">
     <p className="mr-3">{index + 1}.</p>
     <MatchResult match_sides={match.match_sides} winners={match.winners} />
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
  </div>
 );
};

export default Match;
