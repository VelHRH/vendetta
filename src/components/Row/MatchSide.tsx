import { parseSide } from "@/lib/utils";
import Link from "next/link";
import { FC } from "react";

interface MatchSideProps {
 wrestlers: Json[];
}

const getIntermediate = (str: string, item: string, index: number) => {
 return str.substring(
  str.indexOf(item.trim()) + item.trim().length,
  str.indexOf(str.split(/[\(&\)]/)[index + 1]?.trim()) === -1
   ? str.length
   : str.indexOf(str.split(/[\(&\)]/)[index + 1]?.trim())
 );
};

const MatchSide: FC<MatchSideProps> = ({ wrestlers }) => {
 return (
  <>
   {parseSide(wrestlers)
    .split(/[\(&\)]/)
    .map((item, index) =>
     wrestlers.find((o) => o.teamName === item.trim()) ? (
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
       ) : getIntermediate(parseSide(wrestlers), item, index).trim() === "(" ? (
        <p className="ml-2">
         {getIntermediate(parseSide(wrestlers), item, index)}
        </p>
       ) : getIntermediate(parseSide(wrestlers), item, index).trim() === "," ||
         getIntermediate(parseSide(wrestlers), item, index).trim() === "," ? (
        <p className="mr-2">
         {getIntermediate(parseSide(wrestlers), item, index)}
        </p>
       ) : null}
      </>
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
        <p className="ml-2">
         {getIntermediate(parseSide(wrestlers), item, index)}
        </p>
       ) : getIntermediate(parseSide(wrestlers), item, index).trim() === "," ||
         getIntermediate(parseSide(wrestlers), item, index).trim() === "," ? (
        <p className="mr-2">
         {getIntermediate(parseSide(wrestlers), item, index)}
        </p>
       ) : null}
      </>
     ) : (
      <>
       {item.trim()}
       {getIntermediate(parseSide(wrestlers), item, index).trim() === "&" ? (
        <p className="mx-2">
         {getIntermediate(parseSide(wrestlers), item, index)}
        </p>
       ) : getIntermediate(parseSide(wrestlers), item, index).trim() === "(" ? (
        <p className="ml-2">
         {getIntermediate(parseSide(wrestlers), item, index)}
        </p>
       ) : getIntermediate(parseSide(wrestlers), item, index).trim() === "," ||
         getIntermediate(parseSide(wrestlers), item, index).trim() === "," ? (
        <p className="mr-2">
         {getIntermediate(parseSide(wrestlers), item, index)}
        </p>
       ) : null}
      </>
     )
    )}
  </>
 );
};

export default MatchSide;
