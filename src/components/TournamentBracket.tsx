"use client";
import { FC, useEffect, useState } from "react";
import { getBaseLog } from "@/lib/utils";

interface TournamentBracketProps {
 participants: number;
 items: Json[];
 matches?: Database["public"]["Tables"]["matches"]["Row"][];
}

const TournamentBracket: FC<TournamentBracketProps> = ({
 participants,
 items,
 matches,
}) => {
 const [orderedMatches, setOrderedMatches] = useState<Json[][]>([]);
 useEffect(() => {
  if (orderedMatches.length < participants / 2) {
   for (let i = 0; i < participants; i += 2) {
    setOrderedMatches((prev) => [
     ...prev,
     [
      { itemName: items[i].itemName, items: items[i].items },
      { itemName: items[i + 1].itemName, items: items[i + 1].items },
     ],
    ]);
   }
  }
  if (orderedMatches.length === participants / 2 && !matches) {
   setOrderedMatches([]);
   for (let i = 0; i < participants; i += 2) {
    setOrderedMatches((prev) => [
     ...prev,
     [
      { itemName: items[i].itemName, items: items[i].items },
      { itemName: items[i + 1].itemName, items: items[i + 1].items },
     ],
    ]);
   }
  }
 }, [items]);
 const cols = getBaseLog(2, participants) * 2 - 1;
 console.log(orderedMatches);
 return (
  <div className={`flex p-5 w-full justify-center`}>
   {Array.from({ length: cols }, (_, index) => (
    <div key={index} className={`flex flex-col justify-around gap-14`}>
     {index % 2 === 0
      ? whichIndexes(participants, index).map((ind, index2) => (
         <div key={ind} className="h-[3.5rem] flex gap-1 flex-col min-w-[70px]">
          <div className="w-full p-1 bg-slate-600 h-1/2 rounded-t-md text-slate-50">
           {orderedMatches[ind] ? orderedMatches[ind][0].itemName : ""}
          </div>
          <div
           key={index}
           className="w-full p-1 bg-slate-600  h-1/2 rounded-b-md text-slate-50"
          >
           {orderedMatches[ind] ? orderedMatches[ind][1].itemName : ""}
          </div>
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
