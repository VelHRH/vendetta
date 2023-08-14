import CommentForm from "@/components/Add/CommentForm";
import InfoElement from "@/components/InfoElement";
import Comment from "@/components/Comment";
import Label from "@/components/ui/Label";
import createClient from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import RatingBlock from "@/components/RatingBlock";
import Link from "next/link";
import Image from "next/image";
import { formatDateToDdMmYyyy } from "@/lib/utils";

export async function generateMetadata({ params }: { params: { id: string } }) {
 const supabase = createClient();
 const { data: team } = await supabase
  .from("teams")
  .select("*")
  .eq("id", params.id)
  .single();
 if (!team) {
  notFound();
 }

 return { title: team.name };
}

const TeamOverview = async ({ params }: { params: { id: string } }) => {
 const supabase = createClient();
 const { data: team } = await supabase
  .from("teams")
  .select(
   "*, comments_teams(*), teams_current_participants(*), teams_former_participants(*)"
  )
  .eq("id", params.id)
  .single();
 if (!team) {
  notFound();
 }

 const { data: shows } = await supabase
  .from("shows")
  .select("*, matches(*, comments_matches(*), match_sides(*), winners(*))");
 const matches = [...shows!]
  .flatMap((show) => show.matches)
  .filter(
   (match) =>
    match.match_sides.some((side) =>
     side.wrestlers.some((wrestler) => wrestler.teamId === params.id)
    ) && match.time
  );
 const results = [...shows!]
  .flatMap((show) => show.matches)
  .filter((match) =>
   match.winners.some((winner) =>
    matches?.some((m) => m.id === winner.match_id)
   )
  );

 const wins = [...results!].filter((result) =>
  result.winners.some((winner) =>
   winner.winner.some((wrestler) => wrestler.teamId === params.id)
  )
 );

 const {
  data: { user },
 } = await supabase.auth.getUser();

 const { data: profile } = await supabase
  .from("users")
  .select()
  .eq("id", user?.id)
  .single();

 const loggedUserComment = user
  ? team.comments_teams.find((com) => com.author === user.id)
  : undefined;

 return (
  <>
   <div className="w-full flex gap-5 pb-10 mb-5 border-b-2 border-slate-500">
    <div className="flex-1 flex flex-col gap-5">
     {team.img_url && (
      <div className="w-2/3 container mx-auto relative aspect-video">
       <Image
        src={team.img_url}
        fill
        alt="Poster"
        className="object-cover rounded-md"
       />
      </div>
     )}
     <Label size="small">
      Всего матчей: <InfoElement>{matches?.length}</InfoElement>
     </Label>

     {wins.length > 0 && (
      <Label size="small">
       Победы:{" "}
       <InfoElement>
        {wins.length} ({((wins.length * 100) / matches.length).toFixed(2)} %)
       </InfoElement>
      </Label>
     )}
     {matches!.length - results!.length > 0 && (
      <Label size="small">
       Ничьи:{" "}
       <InfoElement>
        {matches!.length - results!.length} (
        {(((matches!.length - results!.length) * 100) / matches.length).toFixed(
         2
        )}{" "}
        %)
       </InfoElement>
      </Label>
     )}
     {results!.length - wins.length > 0 && (
      <Label size="small">
       Поражения:{" "}
       <InfoElement>
        {results!.length - wins.length} (
        {(((results!.length - wins.length) * 100) / matches.length).toFixed(2)}{" "}
        %)
       </InfoElement>
      </Label>
     )}
     <Label size="small">
      Дата создания:{" "}
      <InfoElement>
       {formatDateToDdMmYyyy(new Date(team.creation_date))}
      </InfoElement>
     </Label>
     {team.disband_date && (
      <Label size="small">
       Дата распада:{" "}
       <InfoElement>
        {formatDateToDdMmYyyy(new Date(team.disband_date))}
       </InfoElement>
      </Label>
     )}
     <Label size="small" className="flex items-center">
      Участники:{" "}
      <div className="flex gap-2">
       {team.teams_current_participants.map((p) => (
        <InfoElement key={p.id}>
         <Link
          href={`/wrestler/${p.wrestler_id}`}
          className="hover:underline underline-offset-4"
         >
          {p.wrestler_name}
         </Link>
         {p.isLeader && <p className="ml-1">(лидер)</p>}
        </InfoElement>
       ))}
      </div>
     </Label>
     {team.teams_former_participants.length > 0 && (
      <Label size="small" className="flex items-start">
       Бывшие участники:{" "}
       <div className="flex gap-2">
        {team.teams_former_participants.map((p) => (
         <InfoElement key={p.id}>
          <Link
           href={`/wrestler/${p.wrestler_id}`}
           className="hover:underline underline-offset-4"
          >
           {p.wrestler_name}
          </Link>
         </InfoElement>
        ))}
       </div>
      </Label>
     )}
     {team.history && (
      <div className="flex flex-col gap-2 mt-2">
       <Label size="small" className="flex items-start">
        История:
       </Label>
       {team.history.map((hist) => (
        <InfoElement key={hist}>• {hist}</InfoElement>
       ))}
      </div>
     )}
    </div>
    <RatingBlock comments={team.comments_teams} avgRating={team.avgRating} />
   </div>
   {user && (
    <>
     <Label className="font-bold self-start">Ваш комментарий:</Label>
     {!loggedUserComment ? (
      <CommentForm
       type="teams"
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
       type="teams"
      />
     )}
    </>
   )}

   <Label className="font-bold self-start mt-10">Комментарии:</Label>
   <div className="flex flex-col gap-4 w-full mt-2 mb-5">
    {team.comments_teams.length !== 0
     ? team.comments_teams
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

export default TeamOverview;
