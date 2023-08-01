import createClient from "@/lib/supabase-server";
import { notFound } from "next/navigation";

import { normalizeRating, parseSide, sortSides } from "@/lib/utils";

import SortButton from "@/components/SortButton";
import ListElem from "@/components/Row/ListElem";
import { any } from "zod";

const OtherMatches = async ({
 searchParams,
 params,
}: {
 searchParams: { sort: string };
 params: { id: string };
}) => {
 const supabase = createClient();
 const { data: curMatch } = await supabase
  .from("matches")
  .select("*, comments_matches(*), match_sides(*), winners(*)")
  .eq("id", params.id)
  .single();
 if (!curMatch) {
  notFound();
 }

 const { data: shows } = await supabase
  .from("shows")
  .select("*, matches(*, comments_matches(*), match_sides(*))");
 const matches = otherMatches({
  matches: shows?.flatMap((show) => show.matches),
  curMatch,
 });
 if (!matches) {
  notFound();
 }

 const {
  data: { user },
 } = await supabase.auth.getUser();

 const { data: profile } = await supabase
  .from("users")
  .select("*, comments_matches(*)")
  .eq("id", user?.id)
  .single();

 return (
  <div className="w-full">
   <div className="flex justify-between items-center py-2 mt-5 gap-3">
    <p className="text-center w-1/2">Матч</p>
    <p className="text-center flex-1">Шоу</p>
    <p className="text-center w-32">
     <SortButton
      value="rating"
      className={`${
       searchParams.sort !== "your" &&
       searchParams.sort !== "number" &&
       "text-amber-500"
      }`}
     >
      Рейтинг
     </SortButton>
    </p>
    {profile && (
     <p className="text-center w-32">
      <SortButton
       value="your"
       className={`${searchParams.sort === "your" && "text-amber-500"}`}
      >
       Ваш
      </SortButton>
     </p>
    )}
    <p className="text-center w-32">
     <SortButton
      value="number"
      className={`${searchParams.sort === "number" && "text-amber-500"}`}
     >
      Оценок
     </SortButton>
    </p>
   </div>
   {matches
    .filter((match) => match.comments_matches.length > 0)
    .sort((a, b) =>
     searchParams.sort === "your"
      ? (profile!.comments_matches.find((c) => c.item_id === b.id)?.rating ||
         -1) -
        (profile!.comments_matches.find((c) => c.item_id === a.id)?.rating ||
         -1)
      : searchParams.sort === "number"
      ? b.comments_matches.length - a.comments_matches.length
      : normalizeRating({
         ratings: b.comments_matches.length,
         avgRating: b.avgRating,
        }) -
        normalizeRating({
         ratings: a.comments_matches.length,
         avgRating: a.avgRating,
        })
    )
    .map((match, index) => (
     <ListElem
      key={index}
      link={`/match/${match.id}`}
      avgRating={match.avgRating}
      main={`${index + 1}. ${sortSides(match.match_sides)
       .map(
        (s, i) =>
         `${parseSide(s.wrestlers)} ${
          i !== match.match_sides.length - 1 ? " vs. " : ""
         }`
       )
       .join(" ")}`}
      secondary={
       shows?.find((sh) => sh.matches.some((m) => m.id === match.id))?.name ||
       "Error"
      }
      comments={match.comments_matches}
      yourComments={
       !profile
        ? undefined
        : profile?.comments_matches.find((c) => c.item_id === match.id)
           ?.rating || -1
      }
     />
    ))}
  </div>
 );
};

export default OtherMatches;

const otherMatches = ({
 curMatch,
 matches,
}: {
 curMatch: any;
 matches: any;
}) => {
 let resArray = [];
 for (let match of matches) {
  let isAllIn = true;
  for (let curSide of curMatch.match_sides) {
   for (let wrestler of curSide.wrestlers) {
    let isWrestlerIn = false;
    for (let side of match.match_sides) {
     for (let participant of side.wrestlers) {
      if (participant.wrestlerId === wrestler.wrestlerId) {
       isWrestlerIn = true;
       break;
      }
     }
     if (isWrestlerIn) {
      break;
     }
    }
    if (!isWrestlerIn) {
     isAllIn = false;
     break;
    }
   }
  }
  if (isAllIn) {
   resArray.push(match);
  }
 }
 return resArray;
};
