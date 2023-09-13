import ListElem from "@/components/Row/ListElem";
import SortButton from "@/components/SortButton";
import InfoLabel from "@/components/ui/InfoLabel";
import Label from "@/components/ui/Label";
import createClient from "@/lib/supabase-server";
import { avgTeamByMatches, formatDateToDdMmYyyy } from "@/lib/utils";
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
  .eq("username", decodeURIComponent(params.slug))
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
   <InfoLabel>
    Колонка &quot;Среднее&quot; отвечает за средний рейтинг оцененных вами
    матчей для каждой команды.
   </InfoLabel>
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
       ? avgTeamByMatches(matches, b.item_id!.toString(), profile) -
         avgTeamByMatches(matches, a.item_id!.toString(), profile)
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
        matches
         ? avgTeamByMatches(matches, comment.item_id!.toString(), profile)
         : undefined
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
