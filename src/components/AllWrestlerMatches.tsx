"use client";
import { FC, useState } from "react";
import Match from "./Row/Match";

interface AllWrestlerMatchesProps {
 shows: any;
 id: string;
 isTeam?: boolean;
}

const AllWrestlerMatches: FC<AllWrestlerMatchesProps> = ({
 shows,
 id,
 isTeam,
}) => {
 let indexIncrement = 0;
 return (
  <div className="w-full">
   {shows
    .filter(
     (show: any) =>
      show.matches.some((match: any) =>
       match.match_sides.some((side: any) =>
        side.wrestlers.some((wrestler: any) =>
         !isTeam ? wrestler.wrestlerId === id : wrestler.teamId === id
        )
       )
      ) && show.upload_date
    )
    .sort(
     (a: any, b: any) =>
      new Date(b.upload_date || new Date()).getTime() -
      new Date(a.upload_date || new Date()).getTime()
    )
    .map((show: any, index: number) =>
     show.matches
      .filter((match: any) =>
       match.match_sides.some((side: any) =>
        side.wrestlers.some((wrestler: any) =>
         !isTeam ? wrestler.wrestlerId === id : wrestler.teamId === id
        )
       )
      )
      .map((match: any, index2: number) => {
       if (index2 > 0) indexIncrement += 1;
       return (
        <Match
         key={match.id}
         index={index + indexIncrement}
         match={match}
         show={show}
        />
       );
      })
    )}
  </div>
 );
};

export default AllWrestlerMatches;
