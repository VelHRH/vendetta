import ListElem from "@/components/Row/ListElem";
import SortButton from "@/components/SortButton";
import Label from "@/components/ui/Label";
import createClient from "@/lib/supabase-server";
import { normalizeRating } from "@/lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
 title: "Титулы",
 description: "Все титулы Vendetta",
};

const Titles = async ({ searchParams }: { searchParams: { sort: string } }) => {
 const supabase = createClient();
 const { data: titles } = await supabase
  .from("titles")
  .select("*, comments_titles(*), reigns(*)");

 if (!titles) {
  notFound();
 }

 const {
  data: { user },
 } = await supabase.auth.getUser();

 const { data: profile } = await supabase
  .from("users")
  .select("*, comments_titles(*)")
  .eq("id", user?.id)
  .single();

 return (
  <div className="w-full font-semibold">
   <Label className="font-bold mb-5 justify-center">Все титулы</Label>

   <div className="flex justify-between items-center py-2 mt-5 gap-3">
    <p className="text-center w-1/2">Титул</p>
    <p className="text-center flex-1">Владелец</p>
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
   {titles
    .sort((a, b) =>
     searchParams.sort === "your"
      ? (profile?.comments_titles.find((c) => c.item_id === b.id)?.rating === 0
         ? 0
         : profile!.comments_titles.find((c) => c.item_id === b.id)?.rating ||
           -1) -
        (profile?.comments_titles.find((c) => c.item_id === a.id)?.rating === 0
         ? 0
         : profile!.comments_titles.find((c) => c.item_id === a.id)?.rating ||
           -1)
      : searchParams.sort === "number"
      ? b.comments_titles.length - a.comments_titles.length
      : normalizeRating({
         ratings: b.comments_titles.length,
         avgRating: b.avgRating,
        }) -
        normalizeRating({
         ratings: a.comments_titles.length,
         avgRating: a.avgRating,
        })
    )
    .map((title, index) => (
     <ListElem
      key={index}
      link={`/title/${title.id}`}
      avgRating={title.avgRating}
      main={title.name}
      secondary={
       title.reigns.sort(
        (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()
       )[0] &&
       !title.reigns.sort(
        (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()
       )[0].end
        ? title.reigns.sort(
           (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()
          )[0].team_name ||
          title.reigns.sort(
           (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()
          )[0].wrestler_name
        : "Вакантно"
      }
      commentsN={title.comments_titles.length}
      yourRating={
       !profile
        ? undefined
        : profile?.comments_titles.find((c) => c.item_id === title.id)
           ?.rating === 0
        ? 0
        : profile?.comments_titles.find((c) => c.item_id === title.id)
           ?.rating || -1
      }
     />
    ))}
  </div>
 );
};

export default Titles;
