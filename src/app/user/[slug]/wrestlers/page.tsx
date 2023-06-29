import Label from "@/components/ui/Label";
import { COLORS } from "@/config";
import createClient from "@/lib/supabase-server";
import Link from "next/link";

const RatedWrestlers = async ({ params }: { params: { slug: string } }) => {
 const supabase = createClient();

 const { data: comments } = await supabase
  .from("comments")
  .select()
  .eq("type", "wrestler")
  .eq("author", params.slug);

 const { data: wrestlers } = await supabase.from("wrestlers").select();

 return (
  <div className="flex flex-col gap-3">
   <Label className="font-bold mb-2">Rated wrestlers:</Label>
   {comments?.map((comment) => (
    <Link
     href={`/wrestler/${comment.item_id}`}
     key={comment.id}
     className="flex gap-4 text-xl group h-10"
    >
     <div className="flex-1 duration-300 dark:bg-slate-800 bg-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 rounded-md p-3 flex items-center">
      {wrestlers?.filter((wrestler) => wrestler.id === comment.item_id)[0].name}
     </div>
     <div
      className={`dark:bg-slate-800 bg-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 duration-300 w-32 aspect-square rounded-md justify-center p-3 h-full flex items-center text-${
       COLORS[comment.rating]
      }`}
     >
      {comment.rating}
     </div>
    </Link>
   ))}
  </div>
 );
};

export default RatedWrestlers;
