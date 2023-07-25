import CommentForm from "@/components/Add/CommentForm";
import InfoElement from "@/components/InfoElement";
import Comment from "@/components/Comment";
import Label from "@/components/ui/Label";
import createClient from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import RatingBlock from "@/components/RatingBlock";
import Link from "next/link";

const TitleOverview = async ({ params }: { params: { id: string } }) => {
 const supabase = createClient();
 const { data: title } = await supabase
  .from("titles")
  .select("*, comments_titles(*), reigns(*)")
  .eq("id", params.id)
  .single();
 if (!title) {
  notFound();
 }

 const {
  data: { user },
 } = await supabase.auth.getUser();

 const { data: profile } = await supabase
  .from("users")
  .select()
  .eq("id", user?.id)
  .single();

 const loggedUserComment = user
  ? title.comments_titles.find((com) => com.author === user.id)
  : undefined;

 const holder = title.reigns.sort(
  (a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()
 )[0];

 return (
  <>
   <div className="w-full flex gap-5 pb-10 mb-5 border-b-2 border-slate-500">
    <div className="flex-1 flex flex-col gap-5">
     <Label size="small">
      Тип титула: <InfoElement>{title.type}</InfoElement>
     </Label>
     <Label size="small">
      Дата первого матча: <InfoElement>{title.start}</InfoElement>
     </Label>
     {title.end && (
      <Label size="small">
       Дата распада: <InfoElement>{title.end}</InfoElement>
      </Label>
     )}
     <Label size="small">
      Владелец:{" "}
      <InfoElement>
       {holder && !holder.end ? (
        <Link
         href={`/wrestler/${holder.wrestler_id}`}
         className="hover:underline underline-offset-4"
        >
         {holder.wrestler_name}
        </Link>
       ) : (
        "Вакантно"
       )}
      </InfoElement>
     </Label>
    </div>
    <RatingBlock comments={title.comments_titles} avgRating={title.avgRating} />
   </div>

   {user && (
    <>
     <Label className="font-bold self-start">Ваш комментарий:</Label>
     {!loggedUserComment ? (
      <CommentForm
       type="titles"
       itemId={parseFloat(params.id)}
       authorId={profile!.id}
       author={profile!.username || ""}
      />
     ) : (
      <Comment
       authorId={profile!.id}
       rating={loggedUserComment.rating}
       date={loggedUserComment.created_at!.toString()}
       text={loggedUserComment.text}
       id={loggedUserComment.id}
       type="titles"
      />
     )}
    </>
   )}

   <Label className="font-bold self-start mt-10">Комментарии:</Label>
   <div className="flex flex-col gap-4 w-full mt-2 mb-5">
    {title.comments_titles.length !== 0
     ? title.comments_titles
        .sort((a, b) => b.created_at.localeCompare(a.created_at))
        .map((comment) => (
         <Comment
          key={comment.id}
          authorId={comment.author || ""}
          rating={comment.rating}
          date={comment.created_at?.toString() || ""}
          text={comment.text}
         />
        ))
     : "No comments here yet."}
   </div>
  </>
 );
};

export default TitleOverview;
