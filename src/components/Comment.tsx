import { ratingColor } from "@/lib/utils";
import Link from "next/link";
import createClient from "@/lib/supabase-server";
import EditComment from "./EditComment";
import Label from "./ui/Label";

interface CommentProps {
 text: string;
 rating: number;
 date: string;
 id?: number;
 type?: string;
 authorId: string;
}

const Comment = async ({
 text,
 rating,
 date,
 id,
 type,
 authorId,
}: CommentProps) => {
 const supabase = createClient();
 const { data: user } = await supabase
  .from("users")
  .select()
  .eq("id", authorId)
  .single();
 const dateConvert = new Date(date);

 return (
  <div className="w-full p-7 bg-slate-200 dark:bg-slate-800 flex flex-col rounded-sm text-lg">
   <div className="flex mb-5 pb-3 border-b-2 border-slate-500">
    <Link
     href={`/user/${user?.username}`}
     className="hover:underline underline-offset-4 w-1/2"
    >
     <Label size="medium" className="font-bold text-start">
      {user?.username}
     </Label>
    </Link>
    <div className="flex justify-between items-center flex-1">
     <Label
      size="medium"
      style={{
       color: ratingColor({
        rating: rating,
       }),
      }}
      className="font-bold text-green-700"
     >
      {rating}
     </Label>
     <p className="font-bold text-xl text-slate-500">
      {dateConvert.toLocaleDateString()}
     </p>
     {id && (
      <div className="gsp-2 flex">
       <EditComment
        id={id}
        type={type!}
        author={user?.username || ""}
        authorId={authorId!}
        text={text}
        rating={rating}
       />
      </div>
     )}
    </div>
   </div>
   {text}
  </div>
 );
};

export default Comment;
