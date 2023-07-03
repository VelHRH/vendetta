import createClient from "@/lib/supabase-server";
import { notFound } from "next/navigation";

const EditProfile = async ({ params }: { params: { slug: string } }) => {
 const supabase = createClient();
 const {
  data: { user },
 } = await supabase.auth.getUser();

 const { data: profile } = await supabase
  .from("users")
  .select()
  .eq("id", user?.id)
  .single();
 if (!user || params.slug !== profile?.username) {
  notFound();
 }
 return <div>page</div>;
};

export default EditProfile;
