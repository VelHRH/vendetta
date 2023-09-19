import ListElem from "@/components/Row/ListElem";
import SortButton from "@/components/SortButton";
import Label from "@/components/ui/Label";
import createClient from "@/lib/supabase-server";
import { normalizeRating } from "@/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
 title: "Команды/Группировки",
 description: "Все Команды и группировки.",
};

const Teams = async ({ searchParams }: { searchParams: { sort: string } }) => {
 const supabase = createClient();
 const { data: teams } = await supabase
  .from("teams")
  .select("*, comments_teams(*), reigns(*)");

 if (!teams) {
  notFound();
 }

 const { data: shows } = await supabase
  .from("shows")
  .select("*, matches(*, match_sides(*))");

 const {
  data: { user },
 } = await supabase.auth.getUser();

 const { data: profile } = await supabase
  .from("users")
  .select("*, comments_teams(*)")
  .eq("id", user?.id)
  .single();
 return (
  <div className="w-full font-semibold">
   <Label className="font-bold mb-5 justify-center">Все команды</Label>

   <div className="flex justify-between items-center py-2 mt-5 gap-3">
    <p className="text-center w-1/2">Команда</p>
    <p className="text-center flex-1">Последнее шоу</p>
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
   {teams
    .sort((a, b) =>
     searchParams.sort === "your"
      ? (profile?.comments_teams.find((c) => c.item_id === b.id)?.rating === 0
         ? 0
         : profile!.comments_teams.find((c) => c.item_id === b.id)?.rating ||
           -1) -
        (profile?.comments_teams.find((c) => c.item_id === a.id)?.rating === 0
         ? 0
         : profile!.comments_teams.find((c) => c.item_id === a.id)?.rating ||
           -1)
      : searchParams.sort === "number"
      ? b.comments_teams.length - a.comments_teams.length
      : normalizeRating({
         ratings: b.comments_teams.length,
         avgRating: b.avgRating,
        }) -
        normalizeRating({
         ratings: a.comments_teams.length,
         avgRating: a.avgRating,
        })
    )
    .map((team, index) => (
     <ListElem
      key={index}
      link={`/team/${team.id}`}
      avgRating={team.avgRating}
      main={team.name}
      secondary={
       shows
        ?.sort(
         (a, b) =>
          new Date(b.upload_date || new Date()).getTime() -
          new Date(a.upload_date || new Date()).getTime()
        )
        .find((show) =>
         show.matches.some((match) =>
          match.match_sides.some((side) =>
           side.wrestlers.some(
            (wrestler) => wrestler.teamId === team.id.toString()
           )
          )
         )
        )?.name || "Нет матчей"
      }
      commentsN={team.comments_teams.length}
      yourRating={
       !profile
        ? undefined
        : profile?.comments_teams.find((c) => c.item_id === team.id)?.rating ===
          0
        ? 0
        : profile?.comments_teams.find((c) => c.item_id === team.id)?.rating ||
          -1
      }
      reigns={team.reigns}
     />
    ))}
  </div>
 );
};

export default Teams;
