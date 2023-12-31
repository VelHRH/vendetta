import { parseSide } from "@/lib/utils";
import Link from "next/link";
import { FC } from "react";

interface MatchSideProps {
 wrestlers: Json[];
 noTeamName?: boolean;
}

const getIntermediate = (str: string, item: string, index: number) => {
 const nextItem = str.split(/[\(&\)]/)[index + 1]?.trim();
 return str.substring(
  str.indexOf(item.trim()) + item.trim().length,
  nextItem && str.indexOf(nextItem) !== -1 ? str.indexOf(nextItem) : str.length
 );
};

const MatchSide: FC<MatchSideProps> = ({ wrestlers, noTeamName }) => {
 return (
  <>
   {parseSide(wrestlers)
    .split(/[\(&\)]/)
    .map((item, index) =>
     wrestlers.find((o) => o.teamName === item.trim()) ? (
      noTeamName ? null : (
       <>
        <Link
         href={`/team/${
          wrestlers.find((o) => o.teamName === item.trim())?.teamId
         }`}
         className="font-semibold hover:underline underline-offset-4"
        >
         {item.trim()}
        </Link>
        {getIntermediate(parseSide(wrestlers), item, index).trim() === "&" ? (
         <p className="mx-2">
          {getIntermediate(parseSide(wrestlers), item, index)}
         </p>
        ) : getIntermediate(parseSide(wrestlers), item, index).trim() ===
          "(" ? (
         <p className="ml-2">
          {getIntermediate(parseSide(wrestlers), item, index)}
         </p>
        ) : getIntermediate(parseSide(wrestlers), item, index).trim() ===
          ")" ? (
         <p>{getIntermediate(parseSide(wrestlers), item, index)}</p>
        ) : null}
       </>
      )
     ) : wrestlers.find((o) => o.wrestlerCurName === item.trim()) ? (
      <>
       <Link
        href={`/wrestler/${
         wrestlers.find((o) => o.wrestlerCurName === item.trim())?.wrestlerId
        }`}
        className="font-semibold hover:underline underline-offset-4"
       >
        {item.trim()}
       </Link>
       {getIntermediate(parseSide(wrestlers), item, index).trim() === "&" ? (
        <p className="mx-2">
         {getIntermediate(parseSide(wrestlers), item, index)}
        </p>
       ) : getIntermediate(parseSide(wrestlers), item, index).trim() === "(" ? (
        !noTeamName && (
         <p className="ml-2">
          {getIntermediate(parseSide(wrestlers), item, index)}
         </p>
        )
       ) : getIntermediate(parseSide(wrestlers), item, index).trim() === ")" ? (
        !noTeamName && (
         <p>{getIntermediate(parseSide(wrestlers), item, index)}</p>
        )
       ) : null}
      </>
     ) : (
      <>
       {item === " " &&
        parseSide(wrestlers).split(/[\(&\)]/).length > index + 1 &&
        !noTeamName && <p className="mr-2">) &</p>}
      </>
     )
    )}
  </>
 );
};

export default MatchSide;
