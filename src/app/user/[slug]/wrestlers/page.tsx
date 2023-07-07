import Label from "@/components/ui/Label";
import createClient from "@/lib/supabase-server";
import { ratingColor } from "@/lib/utils";
import Link from "next/link";

const RatedWrestlers = async ({ params }: { params: { slug: string } }) => {
 const supabase = createClient();

 const { data: wrestlers } = await supabase
  .from("wrestlers")
  .select("*, comments_wrestlers(*)");

 return (
  <>
   <Label className="font-bold mb-2">Rated wrestlers:</Label>
   {wrestlers!
    .sort(
     (a, b) =>
      (b.comments_wrestlers.find((c) => c.author?.username === params.slug)
       ?.rating || 0) -
      (a.comments_wrestlers.find((c) => c.author?.username === params.slug)
       ?.rating || 0)
    )
    .map((wrestler) =>
     wrestler.comments_wrestlers
      .filter((comment) => comment.author?.username === params.slug)
      .map((c) => (
       <Link
        href={`/wrestler/${c.item_id}`}
        key={c.id}
        className="flex gap-4 text-xl group h-10"
       >
        <div className="flex-1 duration-300 dark:bg-slate-800 bg-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 rounded-md p-3 flex items-center">
         {wrestler.name}
        </div>
        <div
         style={{
          color: ratingColor({
           rating: c.rating,
          }),
         }}
         className={`dark:bg-slate-800 bg-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 duration-300 w-32 aspect-square rounded-md justify-center p-3 h-full flex items-center`}
        >
         {c.rating}
        </div>
       </Link>
      ))
    )}
  </>
 );
};

export default RatedWrestlers;
