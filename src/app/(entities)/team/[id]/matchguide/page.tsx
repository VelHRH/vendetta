import FilterDropdown from "@/components/FilterDropdown";
import ListElem from "@/components/Row/ListElem";
import SortButton from "@/components/SortButton";
import createClient from "@/lib/supabase-server";
import { normalizeRating, parseSide, sortSides } from "@/lib/utils";
import { notFound } from "next/navigation";

const TeamMatchguide = async ({
 searchParams,
 params,
}: {
 searchParams: { sort: string };
 params: { id: string };
}) => {
 const supabase = createClient();
 const { data: shows } = await supabase
  .from("shows")
  .select("*, matches(*, comments_matches(*), match_sides(*))");
 const matches = shows
  ?.flatMap((show) => show.matches)
  .filter((match) =>
   match.match_sides.some((side) =>
    side.wrestlers.some((wrestler) => wrestler.teamId === params.id)
   )
  );
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
    <p className="text-center flex-1">
     <SortButton
      value="date"
      className={`${
       searchParams.sort !== "your" &&
       searchParams.sort !== "number" &&
       searchParams.sort !== "rating" &&
       "text-amber-500"
      }`}
     >
      Шоу
     </SortButton>
    </p>
    <p className="text-center w-32">
     <SortButton
      value="rating"
      className={`${searchParams.sort === "rating" && "text-amber-500"}`}
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
      : searchParams.sort === "rating"
      ? normalizeRating({
         ratings: b.comments_matches.length,
         avgRating: b.avgRating,
        }) -
        normalizeRating({
         ratings: a.comments_matches.length,
         avgRating: a.avgRating,
        })
      : b.show - a.show
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
      commentsN={match.comments_matches.length}
      yourRating={
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

export default TeamMatchguide;
