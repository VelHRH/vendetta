import PreviousShows from "@/components/PreviousShows";
import Label from "@/components/ui/Label";
import createClient from "@/lib/supabase-server";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
 const supabase = createClient();
 const { data: shows, error } = await supabase
  .from("shows")
  .select("*, comments_shows(*)");
 const nextShow = shows
  ?.filter((s) => s.upload_date === null)
  .sort((a, b) => a.created_at!.localeCompare(b.created_at!))[0];
 return (
  <div className="flex flex-col gap-7">
   {nextShow && (
    <div className="flex flex-col p-7 border-[3px] border-slate-300 dark:border-slate-700 rounded-md cursor-pointer duration-200 hover:bg-slate-200 dark:hover:bg-slate-800">
     <Label className="mb-5 font-semibold">Next show</Label>

     <div key={nextShow.id} className="flex gap-5">
      <div className="flex flex-col gap-5 w-2/5">
       <div className="w-full p-5 border-2 border-slate-300 dark:border-slate-700 rounded-md">
        <Label className="text-3xl font-bold">
         {nextShow.name.includes("[")
          ? nextShow.name.slice(
             nextShow.name.indexOf("[") + 1,
             nextShow.name.indexOf("]")
            )
          : nextShow.name}{" "}
        </Label>
        <Label size="small" className="font-medium mt-3">
         July 2023
        </Label>
       </div>
       <div className="w-full flex-1 p-5 border-2 border-slate-300 dark:border-slate-700 rounded-md">
        <Label className="font-semibold" size="medium">
         Matches to watch:
        </Label>
       </div>
      </div>
      <div className="rounded-md flex-1 aspect-video relative">
       <Image
        src={
         nextShow.show_img
          ? nextShow.show_img
          : "https://brytpkxacsmzbawwiqcr.supabase.co/storage/v1/object/public/wrestlers/posters/default.jpg"
        }
        alt={nextShow.name}
        fill
        className="object-cover"
       />
      </div>
     </div>
    </div>
   )}
   <PreviousShows shows={shows!} />
  </div>
 );
}
