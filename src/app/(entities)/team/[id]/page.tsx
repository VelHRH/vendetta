import CommentForm from "@/components/Add/CommentForm";
import InfoElement from "@/components/InfoElement";
import Comment from "@/components/Comment";
import Label from "@/components/ui/Label";
import createClient from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import RatingBlock from "@/components/RatingBlock";
import Link from "next/link";

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
     <Label size="small">
      Дата создания: <InfoElement>{team.creation_date}</InfoElement>
     </Label>
     {team.disband_date && (
      <Label size="small">
       Дата распада: <InfoElement>{team.disband_date}</InfoElement>
      </Label>
     )}
     <Label size="small" className="flex items-start">
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
    </div>
    <RatingBlock comments={team.comments_teams} avgRating={team.avgRating} />
   </div>

   <>
    <Label className="font-bold self-start">Ваш комментарий:</Label>
    {!loggedUserComment ? (
     <CommentForm
      type="shows"
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
      type="shows"
     />
    )}
   </>

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
