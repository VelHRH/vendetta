import ListElem from "@/components/Row/ListElem";
import SortButton from "@/components/SortButton";
import InfoLabel from "@/components/ui/InfoLabel";
import Label from "@/components/ui/Label";
import createClient from "@/lib/supabase-server";
import { avgShowByMatches, formatDateToDdMmYyyy } from "@/lib/utils";
import { Frown } from "lucide-react";
import { notFound } from "next/navigation";

const RatedShows = async ({
 params,
 searchParams,
}: {
 params: { slug: string };
 searchParams: { sort: string };
}) => {
 const supabase = createClient();

 const { data: shows } = await supabase.from("shows").select();

 const { data: profile } = await supabase
  .from("users")
  .select("*, comments_shows(*)")
  .eq("username", params.slug.replace(/%20/g, " "))
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
    Оцененные шоу:
   </Label>

   <InfoLabel>
    Колонка &quot;Среднее&quot; отвечает за средний рейтинг оцененных вами
    матчей на каждом шоу.
   </InfoLabel>
   {profile.comments_shows.length > 0 && (
    <div className="flex justify-between items-center py-2 mt-5 gap-3">
     <p className="text-center w-1/2">Шоу</p>
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
   {profile.comments_shows.length > 0 ? (
    profile.comments_shows
     .sort((a, b) =>
      searchParams.sort === "rating"
       ? b.rating - a.rating
       : searchParams.sort === "avg"
       ? avgShowByMatches(matches, b.item_id!, profile) -
         avgShowByMatches(matches, a.item_id!, profile)
       : new Date(b.created_at || new Date()).getTime() -
         new Date(a.created_at || new Date()).getTime()
     )
     .map((comment) => (
      <ListElem
       key={comment.id}
       main={shows?.find((w) => w.id === comment.item_id)!.name!}
       secondary={formatDateToDdMmYyyy(new Date(comment.created_at))}
       link={`/show/${shows?.find((w) => w.id === comment.item_id)!.id!}`}
       avgRating={comment.rating}
       yourRating={
        matches
         ? avgShowByMatches(matches, comment.item_id!, profile)
         : undefined
       }
      />
     ))
   ) : (
    <div className="text-2xl flex gap-3 justify-center items-center">
     <p>Пользователь еще не оценил ни одного шоу</p> <Frown size={40} />
    </div>
   )}
  </div>
 );
};

export default RatedShows;
