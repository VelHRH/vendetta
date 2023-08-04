"use client";

import { areArraysEqual, doubleArraysAreEqual } from "@/lib/utils";
import { FC } from "react";
import MatchSide from "./Row/MatchSide";

interface TournamentBlockProps {
 wrestlers: Json[][];
 name: string;
 allTournamentMatches?: {
  id: number;
  created_at: string | null;
  ending: string | null;
  match_sides: Database["public"]["Tables"]["match_sides"]["Row"][];
  winners: Database["public"]["Tables"]["winners"]["Row"][];
 }[];
}

const TournamentBlock: FC<TournamentBlockProps> = ({
 wrestlers,
 name,
 allTournamentMatches,
}) => {
 if (allTournamentMatches) {
  let passedBlockMatches: Json[][][] = [];
  wrestlers.map((w) => w.map((s) => (s.points = 0)));
  allTournamentMatches.sort(
   (a, b) =>
    new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime()
  );
  for (let match of allTournamentMatches) {
   let isContinue = true;
   for (let passedBlockMatch of passedBlockMatches) {
    // TODO: Improve double array method
    if (
     doubleArraysAreEqual(
      passedBlockMatch,
      match.match_sides.map((side) => side.wrestlers)
     )
    ) {
     isContinue = false;
     break;
    }
   }
   if (!isContinue) continue;
   let isMatchInBlock = true;
   for (let match_side of match.match_sides) {
    let isMatchParticipantInBlock = false;
    for (let wrestler of wrestlers) {
     if (areArraysEqual(wrestler, match_side.wrestlers)) {
      isMatchParticipantInBlock = true;
      break;
     }
    }
    if (!isMatchParticipantInBlock) {
     isMatchInBlock = false;
     break;
    }
   }
   if (isMatchInBlock && match.ending) {
    if (match.winners.length === 0) {
     for (let match_side of match.match_sides) {
      wrestlers
       .find((w) => areArraysEqual(w, match_side.wrestlers))
       ?.map((w) => (w.points! += 1));
     }
    } else {
     for (let match_side of match.match_sides) {
      let isMatchSideWinner = false;
      for (let winner of match.winners) {
       if (areArraysEqual(match_side.wrestlers, winner.winner)) {
        wrestlers
         .find((w) => areArraysEqual(w, match_side.wrestlers))
         ?.map((w) => (w.points! += 2));
        isMatchSideWinner = true;
        break;
       }
      }
      if (!isMatchSideWinner) {
       wrestlers
        .find((w) => areArraysEqual(w, match_side.wrestlers))
        ?.map((w) => (w.points! += 0));
      }
     }
    }
   }
  }
 }
 return (
  <div className="w-1/3 flex flex-col gap-1">
   <p className="font-semibold text-2xl break-words dark:bg-slate-700 bg-slate-300 p-2 rounded-md">
    {name}
   </p>
   {wrestlers
    .sort((a, b) => (b[0].points || 0) - (a[0].points || 0))
    .map((wr, index) => (
     <div
      key={index}
      className="dark:bg-slate-700 bg-slate-300 p-2 flex justify-between gap-4 items-center"
     >
      <div className="flex flex-wrap">
       <p className="mr-2">{index + 1}.</p>
       <MatchSide wrestlers={wr} />
      </div>
      {wr[0].points || 0} pts.
     </div>
    ))}
  </div>
 );
};

export default TournamentBlock;
