import ListElem from "@/components/Row/ListElem";
import SortButton from "@/components/SortButton";
import Label from "@/components/ui/Label";
import createClient from "@/lib/supabase-server";
import { formatDateToDdMmYyyy, normalizeRating } from "@/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
 title: "Шоу",
 description: "Все шоу Vendetta",
};

const AllShows = async ({
 searchParams,
}: {
 searchParams: { sort: string };
}) => {
 const supabase = createClient();
 const { data: shows } = await supabase
  .from("shows")
  .select("*, comments_shows(*)");

 if (!shows) {
  notFound();
 }

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

   <div className="flex justify-between items-center py-2 mt-5 gap-3">
    <p className="text-center w-1/2">Шоу</p>
    <p className="text-center flex-1">
     <SortButton
      value="date"
      className={`${
       searchParams.sort !== "rating" &&
       searchParams.sort !== "your" &&
       searchParams.sort !== "number" &&
       "text-amber-500"
      }`}
     >
      Загружено
     </SortButton>
    </p>
    <p className="text-center w-32">
     <SortButton
      value="rating"
      className={`${searchParams.sort === "rating" && "text-amber-500"}`}
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
   {shows
    .sort((a, b) =>
     searchParams.sort === "rating"
      ? normalizeRating({
         ratings: b.comments_shows.length,
         avgRating: b.avgRating,
        }) -
        normalizeRating({
         ratings: a.comments_shows.length,
         avgRating: a.avgRating,
        })
      : searchParams.sort === "your"
      ? (profile!.comments_shows.find((c) => c.item_id === b.id)?.rating ||
         -1) -
        (profile!.comments_shows.find((c) => c.item_id === a.id)?.rating || -1)
      : searchParams.sort === "number"
      ? b.comments_shows.length - a.comments_shows.length
      : new Date(b.upload_date || new Date()).getTime() -
        new Date(a.upload_date || new Date()).getTime()
    )
    .map((show, index) => (
     <ListElem
      key={index}
      link={`/show/${show.id}`}
      avgRating={show.avgRating}
      main={`${index + 1}. ${show.name}`}
      secondary={
       show.upload_date
        ? formatDateToDdMmYyyy(new Date(show.upload_date.toString() || ""))
        : "Еще не вышло"
      }
      commentsN={show.comments_shows.length}
      yourRating={
       !profile
        ? undefined
        : profile.comments_shows.find((c) => c.item_id === show.id)?.rating ||
          -1
      }
     />
    ))}
  </div>
 );
};

export default AllShows;
