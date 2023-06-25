import WrestlerForm from "@/components/Add/WrestlerForm";
import createClient from "@/lib/supabase-server";

const EditWrestler = async ({
 searchParams,
}: {
 searchParams: { id: string };
}) => {
 const supabase = createClient();
 const { data: wrestler } = await supabase
  .from("wrestlers")
  .select("*")
  .eq("id", searchParams.id)
  .single();
 return <WrestlerForm wrestler={wrestler!} />;
};

export default EditWrestler;
