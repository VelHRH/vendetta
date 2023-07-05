import ShowForm from "@/components/Add/ShowForm";
import createClient from "@/lib/supabase-server";

const EditShow = async ({ searchParams }: { searchParams: { id: string } }) => {
 const supabase = createClient();
 const { data: show } = await supabase
  .from("shows")
  .select("*")
  .eq("id", searchParams.id)
  .single();
 return <ShowForm show={show!} />;
};

export default EditShow;
