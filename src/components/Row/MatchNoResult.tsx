import { sortSides } from "@/lib/utils";
import { FC } from "react";
import MatchSide from "./MatchSide";

interface MatchNoResultProps {
 match_sides: Database["public"]["Tables"]["match_sides"]["Row"][];
}

const MatchNoResult: FC<MatchNoResultProps> = ({ match_sides }) => {
 return (
  <div className="items-center flex flex-wrap">
   {sortSides(match_sides).map((p, index) => (
    <>
     <MatchSide key={p.id} wrestlers={p.wrestlers} />
     {index !== match_sides.length - 1 && <p className="mx-3">vs.</p>}
    </>
   ))}
  </div>
 );
};

export default MatchNoResult;
