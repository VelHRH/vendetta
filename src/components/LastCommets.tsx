import createClient from "@/lib/supabase-server";
import Label from "./ui/Label";
import Comment from "@/components/Comment";
import Link from "next/link";

const LastCommets = async () => {
 const supabase = createClient();
 const { data: comments } = await supabase
  .from("comments_matches")
  .select()
  .order("created_at", { ascending: false })
  .limit(3);
 return (
  <div className="flex flex-col p-3 lg:p-7 border-[3px] border-slate-300 dark:border-slate-700 rounded-md">
   <Label className="mb-3 lg:mb-5 font-semibold">Последние оценки</Label>
   <div className="flex flex-col gap-3">
    {comments &&
     comments.map((comment) => (
      <Link
       key={comment.id}
       href={`/match/${comment.item_id}`}
       className="cursor-pointer"
      >
       <Comment
        authorId={comment.author || ""}
        rating={comment.rating}
        date={comment.created_at?.toString() || ""}
        text={comment.text}
       />
      </Link>
     ))}
   </div>
  </div>
 );
};

export default LastCommets;
