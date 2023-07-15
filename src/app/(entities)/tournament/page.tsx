import FilterDropdown from "@/components/FilterDropdown";
import ListElem from "@/components/Row/ListElem";
import TournamentElem from "@/components/Row/TournamentElem";
import Label from "@/components/ui/Label";
import createClient from "@/lib/supabase-server";
import { normalizeRating } from "@/lib/utils";
import { notFound } from "next/navigation";

const AllTournaments = async ({
 searchParams,
}: {
 searchParams: { filter: string };
}) => {
 const supabase = createClient();
 const { data: tournaments } = await supabase
  .from("tournaments")
  .select("*, comments_tournaments(*)");
 if (!tournaments) {
  notFound();
 }

 const {
  data: { user },
 } = await supabase.auth.getUser();

 const { data: profile } = await supabase
  .from("users")
  .select("*, comments_tournaments(*)")
  .eq("id", user?.id)
  .single();
 return (
  <div className="w-full font-semibold">
   <Label className="font-bold mb-5 justify-center">Все турниры</Label>
   <FilterDropdown
    array={["Дате", "Рейтингу"]}
    path="/tournament"
    placeholder="Сортировать по..."
   />
   <div className="flex justify-between items-center py-2 mt-5 gap-3">
    <p className="text-center w-1/2">Турнир</p>
    <p className="text-center flex-1">Начало</p>
    <p className="text-center w-32">Рейтинг</p>
    <p className="text-center w-32">Ваш рейтинг</p>
    <p className="text-center w-32">Количество рейтингов</p>
   </div>
   {tournaments!
    .sort((a, b) =>
     searchParams.filter === "Рейтингу"
      ? normalizeRating({
         ratings: b.comments_tournaments.length,
         avgRating: b.avgRating,
        }) -
        normalizeRating({
         ratings: a.comments_tournaments.length,
         avgRating: a.avgRating,
        })
      : new Date(b.start || new Date()).getTime() -
        new Date(a.start || new Date()).getTime()
    )
    .map((tournament, index) => (
     <ListElem
      key={index}
      id={tournament.id}
      avgRating={tournament.avgRating}
      main={`${index + 1}. ${tournament.name}`}
      secondary={
       tournament.start
        ? new Date(tournament.start.toString() || "").toLocaleDateString()
        : "Еще не вышло"
      }
      comments={tournament.comments_tournaments}
      yourComments={
       !profile
        ? undefined
        : profile?.comments_tournaments.find((c) => c.item_id === tournament.id)
           ?.rating || -1
      }
     />
    ))}
  </div>
 );
};

export default AllTournaments;
