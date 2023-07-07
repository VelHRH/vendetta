"use client";
import { FC } from "react";
import { getBaseLog } from "@/lib/utils";

interface TournamentBracketProps {
 participants: number;
 items: {
  itemName: string;
  items: {
   wrestlerId: string;
   wrestlerName: string;
   wrestlerImage: string;
  }[];
 }[];
}

const TournamentBracket: FC<TournamentBracketProps> = ({
 participants,
 items,
}) => {
 console.log(items);
 const cols = getBaseLog(2, participants) * 2 - 1;
 return (
  <div className={`flex p-5 w-full justify-center`}>
   {Array.from({ length: cols }, (_, index) => (
    <div key={index} className={`flex flex-col justify-around gap-14`}>
     {index % 2 === 0
      ? Array.from(
         { length: participants / 2 ** Math.ceil((index + 1) / 2) },
         (_, index2) => (
          <div
           key={index2}
           className="h-[3.5rem] flex gap-1 flex-col min-w-[50px]"
          >
           <div className="w-full p-1 bg-slate-600  h-1/2 rounded-t-md text-slate-50">
            {items[2 * index2].items[0].wrestlerId !== "" &&
             index === 0 &&
             items[2 * index2].itemName}
           </div>
           <div
            key={index}
            className="w-full p-1 bg-slate-600  h-1/2 rounded-b-md text-slate-50"
           >
            {items[2 * index2 + 1].itemName}
           </div>
          </div>
         )
        )
      : Array.from(
         { length: participants / 2 ** Math.ceil((index + 2 + 1) / 2) },
         (_, index2) => (
          <div
           key={index2}
           style={{ height: `${3.5 * 2 ** Math.ceil(index / 2) + 0.25}rem` }}
           className={`w-10 p-1 border-b-4 border-t-4 border-r-4 rounded-r-md border-slate-600`}
          ></div>
         )
        )}
    </div>
   ))}
  </div>
 );
};

export default TournamentBracket;
