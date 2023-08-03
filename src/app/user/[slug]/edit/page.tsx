import EditUserForm from "@/components/Add/EditUserForm";
import Label from "@/components/ui/Label";
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
 if (!user || params.slug.replace(/%20/g, " ") !== profile?.username) {
  notFound();
 }
 return (
  <>
   <Label className="font-bold mb-2 flex justify-center" size="medium">
    Редактировать профиль:
   </Label>
   <div className="flex flex-col gap-7 items-center">
    <EditUserForm
     username={profile.username}
     fullName={profile.full_name}
     id={profile.id}
    />
   </div>
  </>
 );
};

export default EditProfile;
