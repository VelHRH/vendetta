import CommentForm from "@/components/Add/CommentForm";
import InfoElement from "@/components/InfoElement";
import Comment from "@/components/Comment";
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

 const {
  data: { user },
 } = await supabase.auth.getUser();

 const { data: profile } = await supabase
  .from("users")
  .select()
  .eq("id", user?.id)
  .single();

 const loggedUserComment = user
  ? show.comments_shows.find((com) => com.author!.id === user.id)
  : undefined;
 return (
  <>
   <div className="w-full flex gap-5">
    <div className="flex-1">
     <div className="w-full flex flex-col gap-5 border-b-2 border-slate-500 items-start p-3 pb-10 mb-10">
      <Label size="small">
       Дата загрузки: <InfoElement>{show.upload_date}</InfoElement>
      </Label>
      <Label size="small">
       Тип шоу: <InfoElement>{show.type}</InfoElement>
      </Label>
      <Label size="small">
       Промоушен(ы):{" "}
       {show.promotion!.map((p) => (
        <InfoElement key={p}>{p}</InfoElement>
       ))}
      </Label>
      <Label size="small">
       Город и страна проведения: <InfoElement>{show.location}</InfoElement>
      </Label>
      <Label size="small">
       Арена: <InfoElement>{show.arena}</InfoElement>
      </Label>
      <Label size="small">
       Посещаемость: <InfoElement>{show.attendance}</InfoElement>
      </Label>
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
   {user && (
    <>
     <Label className="font-bold self-start">Your comment:</Label>
     {!loggedUserComment ? (
      <CommentForm
       type="shows"
       itemId={parseFloat(params.id)}
       authorId={profile!.id}
       author={profile!.username || ""}
      />
     ) : (
      <Comment
       author={profile!.username || ""}
       authorId={profile!.id}
       rating={loggedUserComment.rating}
       date={loggedUserComment.created_at!.toString()}
       text={loggedUserComment.text}
       id={loggedUserComment.id}
       type="shows"
      />
     )}
    </>
   )}

   <Label className="font-bold self-start mt-10">Comments:</Label>
   <div className="flex flex-col gap-4 w-full mt-2 mb-5">
    {show.comments_shows.length !== 0
     ? show.comments_shows.map((comment) => (
        <Comment
         key={comment.id}
         author={comment.author!.username || ""}
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

export default ShowOverview;
