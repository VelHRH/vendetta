import { FC } from "react";
import MatchSide from "./Row/MatchSide";

interface TournamentBlockProps {
 wrestlers: Json[][];
 name: string;
 points?: number[];
}

const TournamentBlock: FC<TournamentBlockProps> = ({
 wrestlers,
 name,
 points,
}) => {
 return (
  <div className="w-1/3 flex flex-col gap-1">
   <p className="font-semibold text-2xl break-words dark:bg-slate-700 bg-slate-300 p-2 rounded-md">
    {name}
   </p>
   {wrestlers
    .map((w, i) => w.map((it) => ({ ...it, points: points ? points[i] : 0 })))
    .sort((a, b) => b[0].points - a[0].points)
    .map((wr, index) => (
     <div
      key={index}
      className="dark:bg-slate-700 bg-slate-300 p-2 flex justify-between gap-4 items-center"
     >
      <div className="flex">
       <p className="mr-2">{index + 1}.</p>
       <MatchSide wrestlers={wr} />
      </div>
      {wr[0].points} pts.
     </div>
    ))}
  </div>
 );
};

export default TournamentBlock;
