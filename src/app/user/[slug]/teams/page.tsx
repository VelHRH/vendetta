import ListElem from "@/components/Row/ListElem";
import SortButton from "@/components/SortButton";
import Label from "@/components/ui/Label";
import createClient from "@/lib/supabase-server";
import { formatDateToDdMmYyyy } from "@/lib/utils";
import { Frown } from "lucide-react";
import { notFound } from "next/navigation";

const RatedTeams = async ({
 params,
 searchParams,
}: {
 params: { slug: string };
 searchParams: { sort: string };
}) => {
 const supabase = createClient();

 const { data: teams } = await supabase.from("teams").select();

 const { data: profile } = await supabase
  .from("users")
  .select("*, comments_teams(*)")
  .eq("username", params.slug.replace(/%20/g, " "))
  .single();

 if (!profile) {
  notFound();
 }

 const { data: matches } = await supabase
  .from("matches")
  .select("*, comments_matches(*), match_sides(*)");

 return (
  <div className="w-full font-semibold">
   <Label className="font-bold mb-2 flex justify-center" size="medium">
    Оцененные команды:
   </Label>
   {profile.comments_teams.length > 0 && (
    <div className="flex justify-between items-center py-2 mt-5 gap-3">
     <p className="text-center w-1/2">Команда</p>
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
   {profile.comments_teams.length > 0 ? (
    profile.comments_teams
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
       main={teams?.find((w) => w.id === comment.item_id)!.name!}
       secondary={formatDateToDdMmYyyy(new Date(comment.created_at))}
       link={`/team/${teams?.find((t) => t.id === comment.item_id)!.id!}`}
       avgRating={comment.rating}
       yourRating={
        matches ? avgByMatches(matches, comment, profile) : undefined
       }
      />
     ))
   ) : (
    <div className="text-2xl flex gap-3 justify-center items-center">
     <p>Пользователь еще не оценил ни одной команды</p> <Frown size={40} />
    </div>
   )}
  </div>
 );
};

export default RatedTeams;

const avgByMatches = (
 matches: any,
 comment: Database["public"]["Tables"]["comments_matches"]["Row"],
 profile: Database["public"]["Tables"]["users"]["Row"]
) => {
 return parseFloat(
  (
   matches
    .filter((match: any) =>
     match.match_sides.some((side: any) =>
      side.wrestlers.some(
       (wrestler: any) => wrestler.teamId === comment.item_id?.toString()
      )
     )
    )
    .flatMap((match: any) => match.comments_matches)
    .filter((comment: any) => comment.author === profile.id)
    .reduce((sum: number, comment: any) => sum + comment.rating, 0) /
    matches
     .filter((match: any) =>
      match.match_sides.some((side: any) =>
       side.wrestlers.some(
        (wrestler: any) => wrestler.teamId === comment.item_id?.toString()
       )
      )
     )
     .flatMap((match: any) => match.comments_matches)
     .filter((comment: any) => comment.author === profile.id).length || -1
  ).toFixed(2)
 );
};
