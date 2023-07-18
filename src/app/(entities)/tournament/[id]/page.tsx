import CommentForm from "@/components/Add/CommentForm";
import InfoElement from "@/components/InfoElement";
import Comment from "@/components/Comment";
import Label from "@/components/ui/Label";
import createClient from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import RatingBlock from "@/components/RatingBlock";
import TournamentBracket from "@/components/TournamentBracket";
import { sortSides } from "@/lib/utils";
import MatchSide from "@/components/Row/MatchSide";
import WrestlerLinkImage from "@/components/WrestlerLinkImage";
import TournamentBlock from "@/components/TournamentBlock";

const TournamentOverview = async ({ params }: { params: { id: string } }) => {
 const supabase = createClient();
 const { data: tournament } = await supabase
  .from("tournaments")
  .select("*, comments_tournaments(*), matches(*, match_sides(*), winners(*))")
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
     {tournament.winner && (
      <>
       <Label size="small">
        Победитель:{" "}
        <InfoElement>
         {sortSides(tournament.winner).map((w, i) => (
          <>
           <MatchSide key={i} wrestlers={w} />
           {i !== tournament.winner!.length - 1 && <p className="mr-3">,</p>}
          </>
         ))}
        </InfoElement>
       </Label>
       <div className="w-full grid grid-cols-8 gap-3 mt-5">
        {sortSides(tournament.winner)
         .map((side) => side.wrestlers.flat())
         .flat()
         .map((wrestler, index) => (
          <WrestlerLinkImage key={index} wrestler={wrestler} />
         ))}
       </div>
      </>
     )}
    </div>
    <RatingBlock
     comments={tournament.comments_tournaments}
     avgRating={tournament.avgRating}
    />
   </div>
   <div className="flex gap-5 flex-col items-center w-full">
    <Label className="font-bold mb-5">Подробности турнира:</Label>
    {tournament.type === "Обычный" ? (
     <TournamentBracket
      participants={tournament.play_off_participants.length}
      items={tournament.play_off_participants}
      allTournamentMatches={tournament.matches.map((m) =>
       sortSides(m.match_sides).map((m) => m.wrestlers)
      )}
     />
    ) : (
     <>
      <div className="flex flex-wrap justify-around gap-10 w-full mb-5">
       {Array.from({ length: tournament.blocks_number! }, (_, index) => (
        <TournamentBlock
         key={index}
         name={
          thisBlockParticipants(
           tournament.block_participants,
           tournament.blocks_number!,
           index
          )[0][0].block!
         }
         allTournamentMatches={tournament.matches.map((m) => ({
          id: m.id,
          created_at: m.created_at,
          match_sides: m.match_sides,
          winners: m.winners,
          ending: m.ending,
         }))}
         wrestlers={thisBlockParticipants(
          tournament.block_participants,
          tournament.blocks_number!,
          index
         )}
        />
       ))}
      </div>
      {tournament.play_off_participants.length > 0 && (
       <div className="flex flex-col gap-3 items-center">
        <Label className="font-bold" size="medium">
         Стадия плей-офф:
        </Label>
        <TournamentBracket
         participants={tournament.play_off_participants.length}
         items={tournament.play_off_participants}
         allTournamentMatches={tournament.matches.map((m) =>
          sortSides(m.match_sides).map((m) => m.wrestlers)
         )}
        />
       </div>
      )}
     </>
    )}
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

const thisBlockParticipants = (
 participants: any,
 number: number,
 index: number
) => {
 return participants.slice(
  (index * participants.length) / number,
  ((index + 1) * participants.length) / number
 );
};
