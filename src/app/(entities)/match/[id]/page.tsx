import CommentForm from "@/components/Add/CommentForm";
import InfoElement from "@/components/InfoElement";
import Comment from "@/components/Comment";
import Label from "@/components/ui/Label";
import createClient from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import Image from "next/image";
import RatingBlock from "@/components/RatingBlock";
import MatchShowElem from "@/components/Row/MatchShowElem";
import Link from "next/link";
import MatchSide from "@/components/Row/MatchSide";
import { sortSides } from "@/lib/utils";

const MatchOverview = async ({ params }: { params: { id: string } }) => {
 const supabase = createClient();
 const { data: match } = await supabase
  .from("matches")
  .select("*, comments_matches(*), match_sides(*), winners(*)")
  .eq("id", params.id)
  .single();
 if (!match) {
  notFound();
 }

 const { data: show } = await supabase
  .from("shows")
  .select("*")
  .eq("id", match.show)
  .single();

 const {
  data: { user },
 } = await supabase.auth.getUser();

 const { data: profile } = await supabase
  .from("users")
  .select()
  .eq("id", user?.id)
  .single();

 const loggedUserComment = user
  ? match.comments_matches.find((com) => com.author === user.id)
  : undefined;

 const totalSeconds = match.time
  ? parseInt(match.time.split(":")[0]) * 60 + parseInt(match.time.split(":")[1])
  : -1;

 return (
  <>
   <div className="w-full flex gap-5 pb-10 border-b-2 border-slate-500">
    <div className="flex-1 flex flex-col gap-5">
     <Label size="small">
      Шоу: <InfoElement>{show?.name}</InfoElement>
     </Label>
     <Label size="small">
      Дата:{" "}
      <InfoElement>
       {show?.upload_date
        ? new Date(show.upload_date).toLocaleDateString()
        : "Еще не состоялся"}
      </InfoElement>
     </Label>
     <Label size="small">
      Результат:{" "}
      <InfoElement>
       {match.winners.map((p, index) => (
        <>
         <MatchSide key={p.id} wrestlers={p.winner} />
         {index === match.winners.length - 1 && <p className="mx-3">поб.</p>}
        </>
       ))}
       {sortSides(match.match_sides).map(
        (p, index) =>
         !match.winners.some(
          (obj) => JSON.stringify(obj.winner) === JSON.stringify(p.wrestlers)
         ) && <MatchSide key={p.id} wrestlers={p.wrestlers} />
       )}
      </InfoElement>
     </Label>
     <Label size="small">
      Время: <InfoElement>{match.time}</InfoElement>
     </Label>
     <Label size="small">
      Способ окончания: <InfoElement>{match.ending}</InfoElement>
     </Label>
    </div>
    <RatingBlock
     comments={match.comments_matches}
     avgRating={match.avgRating}
    />
   </div>

   <div className="w-full flex flex-col pb-10 mb-10 gap-2 border-b-2 border-slate-500">
    <Label className="font-bold">Галерея:</Label>
    <div className="w-full grid grid-cols-8 gap-3 mt-5">
     {sortSides(match.match_sides)
      .map((side) => side.wrestlers.flat())
      .flat()
      .map((wrestler, index) => (
       <Link
        href={`/wrestler/${wrestler.wrestlerId}`}
        key={wrestler.wrestlerId}
        className={`aspect-square cursor-pointer relative flex flex-col justify-center`}
       >
        <div className="text-center font-bold text-xl">
         {wrestler.wrestlerCurName}
        </div>
        <Image
         src={wrestler.wrestlerImage!}
         alt={wrestler.wrestlerCurName}
         fill
         className="object-cover hover:opacity-0 duration-300 rounded-md"
        />
       </Link>
      ))}
    </div>
   </div>

   {user && totalSeconds >= 180 && (
    <>
     <Label className="font-bold self-start">Ваш комментарий:</Label>
     {!loggedUserComment ? (
      <CommentForm
       type="matches"
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
       type="matches"
      />
     )}
    </>
   )}

   <Label className="font-bold self-start">Комментарии:</Label>
   <div className="flex flex-col gap-4 w-full mt-2 mb-5">
    {totalSeconds < 0 || totalSeconds >= 180
     ? match.comments_matches.length !== 0
       ? match.comments_matches
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
       : "Еще нет комментарие."
     : "Этот матч не может быть оценен."}
   </div>
  </>
 );
};

export default MatchOverview;
