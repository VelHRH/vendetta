import TeamForm from "@/components/Add/TeamForm";
import createClient from "@/lib/supabase-server";
import { Metadata } from "next";

export const metadata: Metadata = {
 title: "Исправление команды",
 description: "Исправление команды",
};

const EditShow = async ({ searchParams }: { searchParams: { id: string } }) => {
 const supabase = createClient();
 const { data: team } = await supabase
  .from("teams")
  .select(
   "*, teams_current_participants(*), teams_former_participants(*), reigns(*)"
  )
  .eq("id", searchParams.id)
  .single();
 return (
  <TeamForm
   team={team!}
   team_current_participants={team!.teams_current_participants}
   team_former_participants={team!.teams_former_participants}
   fetchedReigns={team!.reigns}
  />
 );
};

export default EditShow;
