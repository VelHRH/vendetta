import ListElem from "@/components/Row/ListElem";
import SortButton from "@/components/SortButton";
import InfoLabel from "@/components/ui/InfoLabel";
import Label from "@/components/ui/Label";
import createClient from "@/lib/supabase-server";
import { formatDateToDdMmYyyy } from "@/lib/utils";
import { Frown } from "lucide-react";
import { notFound } from "next/navigation";

const RatedTournaments = async ({
 params,
 searchParams,
}: {
 params: { slug: string };
 searchParams: { sort: string };
}) => {
 const supabase = createClient();

 const { data: tournaments } = await supabase.from("tournaments").select();

 const { data: profile } = await supabase
  .from("users")
  .select("*, comments_tournaments(*)")
  .eq("username", decodeURIComponent(params.slug))
  .single();

 if (!profile) {
  notFound();
 }

 const { data: matches } = await supabase
  .from("matches")
  .select("*, comments_matches(*)");

 return (
  <div className="w-full font-semibold">
   <Label className="font-bold mb-2 flex justify-center" size="medium">
    Оцененные турниры:
   </Label>
   <InfoLabel>
    Колонка &quot;Среднее&quot; отвечает за средний рейтинг оцененных вами
    матчей на каждом турнире.
   </InfoLabel>
   {profile.comments_tournaments.length > 0 && (
    <div className="flex justify-between items-center py-2 mt-5 gap-3">
     <p className="text-center w-1/2">Турнир</p>
     <p className="text-center flex-1">
      <SortButton
       value="date"
       className={`${
        searchParams.sort !== "rating" &&
        searchParams.sort !== "avg" &&
        "text-amber-500"
       }`}
      >
       Оценено
      </SortButton>
     </p>
     <p className="text-center w-32">
      <SortButton
       value="rating"
       className={`${searchParams.sort === "rating" && "text-amber-500"}`}
      >
       Оценка
      </SortButton>
     </p>

     <p className="text-center w-32">
      <SortButton
       value="avg"
       className={`${searchParams.sort === "avg" && "text-amber-500"}`}
      >
       Среднее
      </SortButton>
     </p>
    </div>
   )}
   {profile.comments_tournaments.length > 0 ? (
    profile.comments_tournaments
     .sort((a, b) =>
      searchParams.sort === "rating"
       ? b.rating - a.rating
       : searchParams.sort === "avg"
       ? avgByMatches(matches, b, profile) - avgByMatches(matches, a, profile)
       : new Date(b.created_at || new Date()).getTime() -
         new Date(a.created_at || new Date()).getTime()
     )
     .map((comment) => (
      <ListElem
       key={comment.id}
       main={tournaments?.find((t) => t.id === comment.item_id)!.name!}
       secondary={formatDateToDdMmYyyy(new Date(comment.created_at))}
       link={`/tournament/${tournaments?.find((t) => t.id === comment.item_id)!
        .id!}`}
       avgRating={comment.rating}
       yourRating={
        matches ? avgByMatches(matches, comment, profile) : undefined
       }
      />
     ))
   ) : (
    <div className="text-2xl flex gap-3 justify-center items-center">
     <p>Пользователь еще не оценил ни одного турнира</p> <Frown size={40} />
    </div>
   )}
  </div>
 );
};

export default RatedTournaments;

const avgByMatches = (
 matches: any,
 comment: Database["public"]["Tables"]["comments_matches"]["Row"],
 profile: Database["public"]["Tables"]["users"]["Row"]
) => {
 return parseFloat(
  (
   matches
    .filter((match: any) => match.tournament === comment.item_id)
    .flatMap((match: any) => match.comments_matches)
    .filter((comment: any) => comment.author === profile.id)
    .reduce((sum: number, comment: any) => sum + comment.rating, 0) /
    matches
     .filter((match: any) => match.tournament === comment.item_id)
     .flatMap((match: any) => match.comments_matches)
     .filter((comment: any) => comment.author === profile.id).length || -1
  ).toFixed(2)
 );
};
