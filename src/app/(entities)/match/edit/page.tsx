import MatchForm from "@/components/Add/MatchesForm";
import createClient from "@/lib/supabase-server";

const EditMatch = async ({
 searchParams,
}: {
 searchParams: { id: string };
}) => {
 const supabase = createClient();
 const { data: match } = await supabase
  .from("matches")
  .select("*, match_sides(*), winners(*), challanges(*)")
  .eq("id", searchParams.id)
  .single();

 const { data: show } = await supabase
  .from("shows")
  .select()
  .eq("id", match?.show)
  .single();

 const { data: tournament } = await supabase
  .from("tournaments")
  .select()
  .eq("id", match?.tournament)
  .single();
 return (
  <MatchForm
   match={{ ...match, show: show?.name, tournament: tournament?.name }}
  />
 );
};

export default EditMatch;
