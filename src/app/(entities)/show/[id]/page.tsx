import RatingChart from "@/components/RatingChart";
import Label from "@/components/ui/Label";
import createClient from "@/lib/supabase-server";
import { normalizeRating, ratingColor, ratingDataGenerate } from "@/lib/utils";
import { notFound } from "next/navigation";

const ShowOverview = async ({ params }: { params: { id: string } }) => {
 const supabase = createClient();
 const { data: show } = await supabase
  .from("shows")
  .select("*, comments_shows(*)")
  .eq("id", params.id)
  .single();
 if (!show) {
  notFound();
 }
 return (
  <div className="w-full flex gap-5">
   <div className="flex-1">
    <div className="w-full flex flex-col gap-5 border-b-2 border-slate-500 items-start p-3 pb-10 mb-10">
     <Label size="small">Дата загрузки: {show.upload_date}</Label>
     <Label size="small">Тип шоу: {show.type}</Label>
     <Label size="small" className="flex gap-2 items-center">
      Промоушен(ы):{" "}
      {show.promotion!.map((p) => (
       <div
        className="p-1 text-base rounded-md bg-slate-200 dark:bg-slate-800"
        key={p}
       >
        {p}
       </div>
      ))}
     </Label>
     <Label size="small">Город и страна проведения: {show.location}</Label>
     <Label size="small">Арена: {show.arena}</Label>
     <Label size="small">Посещаемость: {show.attendance}</Label>
    </div>
    <div>
     <Label className="font-bold" size="medium">
      Результаты матчей:
     </Label>
    </div>
   </div>
   <div className="w-1/4 h-[600px] rounded-md dark:bg-slate-800 bg-slate-200 flex flex-col gap-5 items-center p-5">
    <Label size="medium" className="font-bold self-start">
     Rating:
    </Label>
    {show.comments_shows.length! !== 0 ? (
     <p
      style={{
       color: ratingColor({
        rating: normalizeRating({
         ratings: show.comments_shows.length,
         avgRating: show.avgRating,
        }),
       }),
      }}
      className={`font-bold text-7xl`}
     >
      {normalizeRating({
       ratings: show.comments_shows.length,
       avgRating: show.avgRating,
      }).toFixed(2)}
     </p>
    ) : (
     <p className={`font-bold text-7xl`}>--</p>
    )}
    <RatingChart data={ratingDataGenerate(show.comments_shows!)} />
   </div>
  </div>
 );
};

export default ShowOverview;
