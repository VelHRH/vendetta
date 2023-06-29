import createClient from "@/lib/supabase-server";

const Profile = async ({ params }: { params: { slug: string } }) => {
 const supabase = createClient();

 return <div>opfvpos</div>;
};

export default Profile;
