import createClient from "@/lib/supabase-server";
import Label from "@/components/ui/Label";
import WrestlerElem from "@/components/Row/WrestlerElem";
import { normalizeRating } from "@/lib/utils";
import FilterDropdown from "@/components/FilterDropdown";

const Wrestlers = async ({
 searchParams,
}: {
 searchParams: { filter: string };
}) => {
 const supabase = createClient();
 const { data: wrestlers } = await supabase
  .from("wrestlers")
  .select("*, comments_wrestlers(*)");
 return (
  <div className="w-full font-semibold">
   <Label className="font-bold mb-5 justify-center">All wrestlers</Label>
   <FilterDropdown
    array={["Все", "Vendetta", "Остальные"]}
    path="/wrestler"
    placeholder="Фильтровать"
   />
   <div className="flex justify-between items-center p-2 mt-5">
    <p className="text-center w-1/2">Wrestler</p>
    <p className="text-center flex-1">Last show</p>
    <p className="text-center w-32">Rating</p>
   </div>
   {wrestlers!
    .filter((a) =>
     searchParams.filter === "Vendetta"
      ? a.isVendetta === true
      : searchParams.filter === "Остальные"
      ? a.isVendetta === false
      : a
    )
    .sort(
     (a, b) =>
      normalizeRating({
       ratings: b.comments_wrestlers.length,
       avgRating: b.avgRating,
      }) -
      normalizeRating({
       ratings: a.comments_wrestlers.length,
       avgRating: a.avgRating,
      })
    )
    .map((wrestler, index) => (
     <WrestlerElem
      key={index}
      place={index + 1}
      wrestler={wrestler}
      comments={wrestler.comments_wrestlers}
     />
    ))}
  </div>
 );
};

export default Wrestlers;
