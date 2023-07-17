import TournamentForm from "@/components/Add/TournamentForm";
import createClient from "@/lib/supabase-server";

const EditTournament = async ({
 searchParams,
}: {
 searchParams: { id: string };
}) => {
 const supabase = createClient();
 const { data: tournament } = await supabase
  .from("tournaments")
  .select("*")
  .eq("id", searchParams.id)
  .single();

 return <TournamentForm tournament={tournament} />;
};

export default EditTournament;
