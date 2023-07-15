import CommentForm from "@/components/Add/CommentForm";
import InfoElement from "@/components/InfoElement";
import Comment from "@/components/Comment";
import Label from "@/components/ui/Label";
import createClient from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import RatingBlock from "@/components/RatingBlock";
import Link from "next/link";
import TournamentBracket from "@/components/TournamentBracket";
import { findFirstDuplicate, sortSides } from "@/lib/utils";

const TournamentOverview = async ({ params }: { params: { id: string } }) => {
 const supabase = createClient();
 const { data: tournament } = await supabase
  .from("tournaments")
  .select(
   "*, comments_tournaments(*), matches(*, match_sides(*)), play_off_participants(*)"
  )
  .eq("id", params.id)
  .single();
 if (!tournament) {
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
  ? tournament.comments_tournaments.find((com) => com.author === user.id)
  : undefined;

 return (
  <>
   <div className="w-full flex gap-5 pb-10 mb-5 border-b-2 border-slate-500">
    <div className="flex-1 flex flex-col gap-5">
     <p>{tournament.description}</p>
     <Label size="small">
      Тип: <InfoElement>{tournament.type}</InfoElement>
     </Label>
     {tournament.start && (
      <Label size="small">
       Дата старта: <InfoElement>{tournament.start}</InfoElement>
      </Label>
     )}
     {tournament.end && (
      <Label size="small">
       Дата окончания: <InfoElement>{tournament.end}</InfoElement>
      </Label>
     )}
     {tournament.end && (
      <Label size="small">
       Победитель:{" "}
       <InfoElement>
        <Link
         href={`/wrestler/${tournament.play_off_participants.map((a) =>
          a.participant.map((p) =>
           p.wrestlerCurName === tournament.winner ? p.wrestlerId : null
          )
         )}`}
         className="hover:underline underline-offset-4"
        >
         {tournament.winner}
        </Link>
       </InfoElement>
      </Label>
     )}
    </div>
    <RatingBlock
     comments={tournament.comments_tournaments}
     avgRating={tournament.avgRating}
    />
   </div>
   <div>
    <Label className="font-bold mb-5">Подробности турнира:</Label>
    <TournamentBracket
     participants={8}
     items={tournament.play_off_participants.map((p) => p.participant)}
     allTournamentMatches={tournament.matches.map((m) =>
      sortSides(m.match_sides).map((m) => m.wrestlers)
     )}
    />
   </div>

   {user && (
    <>
     <Label className="font-bold self-start">Ваш комментарий:</Label>
     {!loggedUserComment ? (
      <CommentForm
       type="tournaments"
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
       type="tournaments"
      />
     )}
    </>
   )}

   <Label className="font-bold self-start mt-10">Комментарии:</Label>
   <div className="flex flex-col gap-4 w-full mt-2 mb-5">
    {tournament.comments_tournaments.length !== 0
     ? tournament.comments_tournaments
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

export default TournamentOverview;
