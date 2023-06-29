import Image from "next/image";
import createClient from "@/lib/supabase-server";
import Label from "@/components/ui/Label";
import { DEFAULT_IMAGE } from "@/config";
import { notFound } from "next/navigation";
import Comment from "@/components/Comment";
import CommentForm from "@/components/Add/CommentForm";

const WrestlerOverview = async ({ params }: { params: { id: string } }) => {
 const supabase = createClient();
 const { data: wrestler } = await supabase
  .from("wrestlers")
  .select("*")
  .eq("id", params.id)
  .single();
 const { data: comments } = await supabase
  .from("comments")
  .select("*")
  .eq("item_id", params.id)
  .eq("type", "wrestler");
 if (!wrestler) {
  notFound();
 }
 const {
  data: { user },
 } = await supabase.auth.getUser();

 const beginCareer = new Date(wrestler.career_start!.toString());
 const birthday = new Date(wrestler.born!.toString());
 // @ts-ignore
 const experience = new Date(Date.now() - beginCareer);
 // @ts-ignore
 const age = new Date(Date.now() - birthday);
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
    <div className="w-1/2 p-3 flex flex-col gap-10">
     <div className="flex flex-col pb-10 gap-5 border-b-2 border-slate-500 w-full items-start">
      <Label size="medium" className="font-bold mb-3 pb-3">
       Character information:
      </Label>
      {wrestler.nickname && (
       <Label size="small">
        Also known as:{" "}
        {wrestler.nickname.map((t) => (
         <div
          className="p-1 text-base rounded-md bg-slate-200 dark:bg-slate-800"
          key={t}
         >
          {t}
         </div>
        ))}
       </Label>
      )}
      <Label size="small">Total matches: 0</Label>
      <Label size="small">
       Start of in-ring career: {beginCareer.toLocaleDateString()}
      </Label>
      <Label size="small">
       Experience: {Math.abs(experience.getUTCFullYear() - 1970) + 4} years
      </Label>
      <Label size="small" className="flex gap-2 items-center">
       Trainers:
       {wrestler.trainer?.map((t) => (
        <div
         className="p-1 text-base rounded-md bg-slate-200 dark:bg-slate-800"
         key={t}
        >
         {t}
        </div>
       ))}
      </Label>
      <Label size="small" className="flex gap-2 items-center">
       Wrestling styles:
       {wrestler.style?.map((s) => (
        <div
         className="p-1 text-base rounded-md bg-slate-200 dark:bg-slate-800"
         key={s}
        >
         {s}
        </div>
       ))}
      </Label>
     </div>
     <div className="flex flex-col pb-10 gap-5 items-start">
      <Label size="medium" className="font-bold mb-3 pb-3">
       Personal information:
      </Label>
      <Label size="small">Real name: {wrestler.real_name}</Label>
      <Label size="small">Sex: {wrestler.sex}</Label>
      <Label size="small">
       Age: {Math.abs(age.getUTCFullYear() - 1970) + 4} years
      </Label>
      <Label size="small">Birthday: {wrestler.born}</Label>
      <Label size="small">
       Birthplace: {wrestler.city}, {wrestler.country}
      </Label>
      <Label size="small">Height: {wrestler.height} cm</Label>
      <Label size="small">Weight: {wrestler.weight} kg</Label>
     </div>
    </div>
    <div className="flex-1 h-60 rounded-md dark:bg-slate-800 bg-slate-200 flex flex-col gap-5 items-center p-5">
     <Label size="medium" className="font-bold self-start">
      Rating:
     </Label>
     <p className="font-bold text-7xl">{wrestler.avgRating}</p>
    </div>
   </div>
   {user && (
    <>
     <Label className="font-bold self-start">Your rating:</Label>
     <CommentForm type="wrestler" itemId={parseFloat(params.id)} />
    </>
   )}

   <Label className="font-bold self-start">Comments:</Label>
   <div className="flex flex-col gap-4 w-full mt-2 mb-5">
    {comments?.map((comment) => (
     <Comment
      key={comment.id}
      author={comment.author}
      rating={comment.rating}
      date={comment.created_at?.toString() || ""}
      text={comment.text}
     />
    ))}
   </div>
  </>
 );
};

export default WrestlerOverview;
