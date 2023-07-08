import FilterDropdown from "@/components/FilterDropdown";
import TournamentElem from "@/components/Row/TournamentElem";
import Label from "@/components/ui/Label";
import createClient from "@/lib/supabase-server";
import { normalizeRating } from "@/lib/utils";

const AllTournaments = async ({
 searchParams,
}: {
 searchParams: { filter: string };
}) => {
 const supabase = createClient();
 const { data: tournaments } = await supabase
  .from("tournaments")
  .select("*, comments_tournaments(*)");

 return (
  <div className="w-full font-semibold">
   <Label className="font-bold mb-5 justify-center">Все турниры</Label>
   <FilterDropdown
    array={["Дате", "Рейтингу"]}
    path="/tournament"
    placeholder="Сортировать по..."
   />
   <div className="flex justify-between items-center p-2 mt-5">
    <p className="text-center w-1/2">Турнир</p>
    <p className="text-center flex-1">Начало</p>
    <p className="text-center w-32">Рейтинг</p>
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
     <TournamentElem
      key={index}
      place={index + 1}
      tournament={tournament}
      comments={tournament.comments_tournaments}
     />
    ))}
  </div>
 );
};

export default AllTournaments;
