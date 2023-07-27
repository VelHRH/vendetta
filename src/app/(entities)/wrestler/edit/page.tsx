import WrestlerForm from "@/components/Add/WrestlerForm";
import createClient from "@/lib/supabase-server";
import { notFound } from "next/navigation";

const EditWrestler = async ({
 searchParams,
}: {
 searchParams: { id: string };
}) => {
 const supabase = createClient();
 const { data: wrestler } = await supabase
  .from("wrestlers")
  .select("*, reigns(*)")
  .eq("id", searchParams.id)
  .single();
 if (!wrestler) {
  notFound();
 }
 return <WrestlerForm wrestler={wrestler} fetchedReigns={wrestler.reigns} />;
};

export default EditWrestler;
