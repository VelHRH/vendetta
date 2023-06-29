import createClient from "@/lib/supabase-server";

const Profile = async ({ params }: { params: { id: string } }) => {
 const supabase = createClient();
 const { data: profile } = await supabase
  .from("users")
  .select()
  .eq("username", params.id)
  .single();
 const {
  data: { user },
 } = await supabase.auth.getUser();

 return <div>opfvpos</div>;
};

export default Profile;
