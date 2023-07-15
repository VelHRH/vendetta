import FilterDropdown from "@/components/FilterDropdown";
import ListElem from "@/components/Row/ListElem";
import Label from "@/components/ui/Label";
import createClient from "@/lib/supabase-server";
import { normalizeRating } from "@/lib/utils";

const AllShows = async ({
 searchParams,
}: {
 searchParams: { filter: string };
}) => {
 const supabase = createClient();
 const { data: shows } = await supabase
  .from("shows")
  .select("*, comments_shows(*)");
 const {
  data: { user },
 } = await supabase.auth.getUser();

 const { data: profile } = await supabase
  .from("users")
  .select("*, comments_shows(*)")
  .eq("id", user?.id)
  .single();
 return (
  <div className="w-full font-semibold">
   <Label className="font-bold mb-5 justify-center">Все шоу</Label>
   <FilterDropdown
    array={["Дате", "Рейтингу"]}
    path="/show"
    placeholder="Сортировать по..."
   />
   <div className="flex justify-between items-center py-2 mt-5 gap-3">
    <p className="text-center w-1/2">Шоу</p>
    <p className="text-center flex-1">Загружено</p>
    <p className="text-center w-32">Рейтинг</p>
    <p className="text-center w-32">Ваш рейтинг</p>
    <p className="text-center w-32">Количество рейтингов</p>
   </div>
   {shows!
    .sort((a, b) =>
     searchParams.filter === "Рейтингу"
      ? normalizeRating({
         ratings: b.comments_shows.length,
         avgRating: b.avgRating,
        }) -
        normalizeRating({
         ratings: a.comments_shows.length,
         avgRating: a.avgRating,
        })
      : new Date(b.upload_date || new Date()).getTime() -
        new Date(a.upload_date || new Date()).getTime()
    )
    .map((show, index) => (
     <ListElem
      key={index}
      id={show.id}
      avgRating={show.avgRating}
      main={`${index + 1}. ${show.name}`}
      secondary={
       show.upload_date
        ? new Date(show.upload_date.toString() || "").toLocaleDateString()
        : "Еще не вышло"
      }
      comments={show.comments_shows}
      yourComments={
       !profile
        ? undefined
        : profile?.comments_shows.find((c) => c.item_id === show.id)?.rating ||
          -1
      }
     />
    ))}
  </div>
 );
};

export default AllShows;
