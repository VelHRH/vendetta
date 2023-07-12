import Image from "next/image";
import createClient from "@/lib/supabase-server";
import Label from "@/components/ui/Label";
import { DEFAULT_IMAGE } from "@/config";
import { notFound } from "next/navigation";
import Comment from "@/components/Comment";
import CommentForm from "@/components/Add/CommentForm";
import InfoElement from "@/components/InfoElement";
import RatingBlock from "@/components/RatingBlock";

const WrestlerOverview = async ({ params }: { params: { id: string } }) => {
 const supabase = createClient();
 const { data: wrestler } = await supabase
  .from("wrestlers")
  .select("*, comments_wrestlers(*)")
  .eq("id", params.id)
  .single();
 if (!wrestler) {
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
  ? wrestler.comments_wrestlers.find((com) => com.author === user.id)
  : undefined;

 const now = new Date();
 if (wrestler.career_start) {
  const beginCareer = new Date(wrestler.career_start.toString());
  const experience = new Date(
   new Date(now.getFullYear() + 4, now.getMonth(), now.getDate()).getTime() -
    beginCareer.getTime()
  );
 }

 if (wrestler.born) {
  const birthday = new Date(wrestler.born.toString());

  const age = new Date(
   new Date(now.getFullYear() + 4, now.getMonth(), now.getDate()).getTime() -
    birthday.getTime()
  );
 }
 return (
  <>
   <div className="w-full flex gap-5">
    <div className="h-80 w-80 aspect-square relative">
     <Image
      alt="Wrestler image"
      src={wrestler.wrestler_img || DEFAULT_IMAGE}
      fill
      className="object-cover rounded-md"
     />
    </div>
    <div className="flex-1 p-3 flex flex-col gap-10">
     <div className="flex flex-col pb-10 gap-5 border-b-2 border-slate-500 w-full items-start">
      <Label size="medium" className="font-bold mb-3 pb-3">
       Character information:
      </Label>
      {wrestler.nickname && (
       <Label size="small">
        Also known as:{" "}
        {wrestler.nickname.map((t) => (
         <InfoElement key={t}>{t}</InfoElement>
        ))}
       </Label>
      )}
      <Label size="small">
       Total matches: <InfoElement>0</InfoElement>
      </Label>
      {wrestler.career_start && (
       <>
        <Label size="small">
         Start of in-ring career:{" "}
         <InfoElement>{beginCareer.toLocaleDateString()}</InfoElement>
        </Label>
        <Label size="small">
         Experience:{" "}
         <InfoElement>
          {Math.abs(experience.getUTCFullYear() - 1970)} years
         </InfoElement>
        </Label>
       </>
      )}
      <Label size="small">
       Статус:{" "}
       <InfoElement>
        {wrestler.isVendetta ? "подписан Vendetta" : "на правах фрилансера"}
       </InfoElement>
      </Label>
      <Label size="small" className="flex gap-2 items-center">
       Trainers:{" "}
       {wrestler.trainer?.map((t) => (
        <InfoElement key={t}>{t}</InfoElement>
       ))}
      </Label>
      <Label size="small" className="flex gap-2 items-center">
       Wrestling styles:{" "}
       {wrestler.style?.map((s) => (
        <InfoElement key={s}>{s}</InfoElement>
       ))}
      </Label>
     </div>
     <div className="flex flex-col pb-10 gap-5 items-start">
      <Label size="medium" className="font-bold mb-3 pb-3">
       Personal information:
      </Label>
      <Label size="small">
       Real name: <InfoElement>{wrestler.real_name}</InfoElement>
      </Label>
      <Label size="small">
       Sex: <InfoElement>{wrestler.sex}</InfoElement>
      </Label>
      {wrestler.born && (
       <>
        <Label size="small">
         Age:{" "}
         <InfoElement>
          {Math.abs(age.getUTCFullYear() - 1970)} years
         </InfoElement>
        </Label>
        <Label size="small">
         Birthday: <InfoElement>{wrestler.born}</InfoElement>
        </Label>
       </>
      )}
      <Label size="small">
       Birthplace:{" "}
       <InfoElement>
        {wrestler.city}, {wrestler.country}
       </InfoElement>
      </Label>
      <Label size="small">
       Height: <InfoElement>{wrestler.height} cm</InfoElement>
      </Label>
      <Label size="small">
       Weight: <InfoElement>{wrestler.weight} kg</InfoElement>
      </Label>
     </div>
    </div>
    <RatingBlock
     comments={wrestler.comments_wrestlers}
     avgRating={wrestler.avgRating}
    />
   </div>

   {user && (
    <>
     <Label className="font-bold self-start">Your comment:</Label>
     {!loggedUserComment ? (
      <CommentForm
       type="wrestlers"
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
       type="wrestlers"
      />
     )}
    </>
   )}

   <Label className="font-bold self-start mt-10">Comments:</Label>
   <div className="flex flex-col gap-4 w-full mt-2 mb-5">
    {wrestler.comments_wrestlers.length !== 0
     ? wrestler.comments_wrestlers
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

export default WrestlerOverview;
