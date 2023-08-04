"use client";
import { FC, useEffect, useState } from "react";
import { areArraysEqual, getBaseLog, removeDuplicateArrays } from "@/lib/utils";
import MatchSide from "./Row/MatchSide";

interface TournamentBracketProps {
 participants: number;
 items: Json[][];
 allTournamentMatches?: Json[][][];
}

const TournamentBracket: FC<TournamentBracketProps> = ({
 participants,
 items,
 allTournamentMatches,
}) => {
 const cols = getBaseLog(2, participants) * 2 - 1;
 const [orderedMatches, setOrderedMatches] = useState<Json[][][]>([]);
 useEffect(() => {
  let orderedArray = [...orderedMatches];
  if (orderedArray.length < participants / 2) {
   for (let i = 0; i < participants; i += 2) {
    orderedArray.push([[...items[i]], [...items[i + 1]]]);
   }
  } else if (!allTournamentMatches || allTournamentMatches.length === 0) {
   orderedArray = [];
   for (let i = 0; i < participants; i += 2) {
    orderedArray.push([[...items[i]], [...items[i + 1]]]);
   }
  }
  if (allTournamentMatches && allTournamentMatches.length !== 0) {
   const uniqueMatches = removeDuplicateArrays(
    orderedArray,
    allTournamentMatches
   );

   for (let i = 0; i < cols; i += 2) {
    const stage = orderedArray.slice(
     whichIndexes(participants, i)[0],
     whichIndexes(participants, i)[-1]
    );
    if (stage.length < 2) continue;
    for (let j = 0; j < stage.length; j += 2) {
     const pair = [...stage[j], ...stage[j + 1]];
     const foundArray = uniqueMatches.find((innerArray) =>
      innerArray.every((subArray) =>
       pair.some((pairInnerArray) => areArraysEqual(subArray, pairInnerArray))
      )
     );
     if (!foundArray) continue;
     const orderedFoundArray = [...foundArray].sort((a, b) => {
      const indexA = pair.findIndex((innerArray) =>
       areArraysEqual(innerArray, a)
      );
      const indexB = pair.findIndex((innerArray) =>
       areArraysEqual(innerArray, b)
      );
      return indexA - indexB;
     });
     orderedArray.push(orderedFoundArray);
     uniqueMatches.splice(uniqueMatches.indexOf(foundArray), 1);
    }
   }
  }
  setOrderedMatches(orderedArray);
 }, [items]);

 return (
  <div className={`flex p-5 justify-center w-auto`}>
   {Array.from({ length: cols }, (_, index) => (
    <div key={index} className={`flex flex-col justify-around gap-14`}>
     {index % 2 === 0
      ? whichIndexes(participants, index).map((ind) => (
         <div key={ind} className="h-[3.5rem] flex gap-1 flex-col min-w-[70px]">
          {orderedMatches[ind] ? (
           orderedMatches[ind].map((elem, i) => (
            <div
             key={i}
             className="p-1 dark:bg-slate-700 bg-slate-300 h-1/2 rounded-t-md flex"
            >
             <MatchSide wrestlers={orderedMatches[ind][i]} />
            </div>
           ))
          ) : (
           <>
            <div className="w-full p-1 dark:bg-slate-700 bg-slate-300 h-1/2 rounded-t-md"></div>
            <div className="w-full p-1 dark:bg-slate-700 bg-slate-300 h-1/2 rounded-t-md"></div>
           </>
          )}
         </div>
        ))
      : Array.from(
         { length: participants / 2 ** Math.ceil((index + 2 + 1) / 2) },
         (_, index2) => (
          <div
           key={index2}
           style={{ height: `${3.5 * 2 ** Math.ceil(index / 2) + 0.25}rem` }}
           className={`${
            participants < 32 ? "w-20" : "w-10"
           } p-1 border-b-4 border-t-4 border-r-4 rounded-r-md border-slate-600`}
          ></div>
         )
        )}
    </div>
   ))}
  </div>
 );
};

export default TournamentBracket;

const whichIndexes = (participants: number, col: number) => {
 let sum1 = 0;
 let sum2 = 0;

 for (let i = 0; i < col + 1; i += 2) {
  sum1 += participants / 2 ** Math.ceil((i + 1) / 2);
 }

 for (let i = 0; i < col; i += 2) {
  sum2 += participants / 2 ** Math.ceil((i + 1) / 2);
 }

 return Array.from({ length: sum1 - sum2 }, (_, index) => sum2 + index);
};
