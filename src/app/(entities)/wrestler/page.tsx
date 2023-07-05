import createClient from "@/lib/supabase-server";
import Label from "@/components/ui/Label";
import WrestlerElem from "@/components/Row/WrestlerElem";
import { normalizeRating } from "@/lib/utils";

const Wrestlers = async () => {
 const supabase = createClient();
 const { data: wrestlers } = await supabase
  .from("wrestlers")
  .select("*, comments_wrestlers(*)");
 return (
  <div className="w-full font-semibold">
   <Label className="font-bold mb-5 justify-center">All wrestlers</Label>
   <div className="flex justify-between items-center p-2">
    <p className="text-center w-1/2">Wrestler</p>
    <p className="text-center flex-1">Last show</p>
    <p className="text-center w-32">Rating</p>
   </div>
   {wrestlers!
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
