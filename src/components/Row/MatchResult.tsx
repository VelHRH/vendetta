import { areArraysEqual, sortSides } from "@/lib/utils";
import { FC } from "react";
import MatchSide from "./MatchSide";

interface MatchResultProps {
 winners: Database["public"]["Tables"]["winners"]["Row"][];
 match_sides: Database["public"]["Tables"]["match_sides"]["Row"][];
}

const MatchResult: FC<MatchResultProps> = ({ winners, match_sides }) => {
 return (
  <div className="w-full items-center flex flex-wrap">
   {winners.map((p, index) => (
    <>
     <MatchSide key={p.id} wrestlers={p.winner} />
     {index === winners.length - 1 && <p className="mx-3">поб.</p>}
    </>
   ))}
   {sortSides(
    match_sides.filter((matchItem) => {
     return !winners.some((winnerItem) =>
      areArraysEqual(matchItem.wrestlers, winnerItem.winner)
     );
    })
   ).map((p, index) => (
    <>
     <MatchSide key={p.id} wrestlers={p.wrestlers} />
     {index ===
      match_sides.filter((matchItem) => {
       return !winners.some((winnerItem) =>
        areArraysEqual(matchItem.wrestlers, winnerItem.winner)
       );
      }).length -
       2 && <p className="mx-2">&</p>}
     {index <
      match_sides.filter((matchItem) => {
       return !winners.some((winnerItem) =>
        areArraysEqual(matchItem.wrestlers, winnerItem.winner)
       );
      }).length -
       2 && <p className="mr-2">,</p>}
    </>
   ))}
  </div>
 );
};

export default MatchResult;
