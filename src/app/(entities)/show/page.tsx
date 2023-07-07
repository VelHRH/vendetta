import FilterDropdown from "@/components/FilterDropdown";
import ShowElem from "@/components/Row/ShowElem";
import Label from "@/components/ui/Label";
import createClient from "@/lib/supabase-server";
import { normalizeRating } from "@/lib/utils";

const AllShows = async ({
 searchParams,
}: {
 searchParams: { filter: string };
}) => {
 const supabase = createClient();
 const { data: shows, error } = await supabase
  .from("shows")
  .select("*, comments_shows(*)");
 return (
  <div className="w-full font-semibold">
   <Label className="font-bold mb-5 justify-center">Все шоу</Label>
   <FilterDropdown
    array={["Дате", "Рейтингу"]}
    path="/show"
    placeholder="Сортировать по..."
   />
   <div className="flex justify-between items-center p-2 mt-5">
    <p className="text-center w-1/2">Show</p>
    <p className="text-center flex-1">Uploaded</p>
    <p className="text-center w-32">Rating</p>
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
      : b.upload_date!.localeCompare(a.upload_date!)
    )
    .map((show, index) => (
     <ShowElem
      key={index}
      place={index + 1}
      show={show}
      comments={show.comments_shows}
     />
    ))}
  </div>
 );
};

export default AllShows;
