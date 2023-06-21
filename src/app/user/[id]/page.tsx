import createClient from "@/lib/supabase-server";
import { FC } from "react";

const Profile = async ({ params }: { params: { id: string } }) => {
 const supabase = createClient();
 const { data: user } = await supabase
  .from("profiles")
  .select("*")
  .eq("id", params.id);

 return (
  <div className="flex w-full gap-3">
   <div className="w-1/3 bg-slate-200 dark:bg-slate-800 rounded-md p-5">
    {user![0].id}
   </div>
  </div>
 );
};

export default Profile;
