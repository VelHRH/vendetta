import CommentForm from "@/components/Add/CommentForm";
import InfoElement from "@/components/InfoElement";
import Comment from "@/components/Comment";
import Label from "@/components/ui/Label";
import createClient from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import RatingBlock from "@/components/RatingBlock";
import Link from "next/link";
import { sortSides } from "@/lib/utils";
import WrestlerLinkImage from "@/components/WrestlerLinkImage";
import MatchResult from "@/components/Row/MatchResult";

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
      Шоу:{" "}
      <InfoElement>
       <Link
        href={`/show/${show?.id}`}
        className="hover:underline underline-offset-4"
       >
        {show?.name}
       </Link>
      </InfoElement>
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
      {match.winners.length === 0 ? (
       <InfoElement>ничья</InfoElement>
      ) : (
       <InfoElement>
        <MatchResult winners={match.winners} match_sides={match.match_sides} />
       </InfoElement>
      )}
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
       <WrestlerLinkImage key={index} wrestler={wrestler} />
      ))}
    </div>
   </div>

   {user && params.id !== "42" && totalSeconds >= 180 && (
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
