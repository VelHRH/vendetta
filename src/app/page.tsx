import SignOut from "@/components/Auth/SignOut";
import Image from "next/image";
import Link from "next/link";
import createClient from "../lib/supabase-server";

export default async function Home() {
 const supabase = createClient();

 const {
  data: { user },
 } = await supabase.auth.getUser();

 const { data, error, status } = await supabase
  .from("profiles")
  .select(`full_name, username, avatar_url`)
  .eq("id", user?.id)
  .single();

 return (
  <>
   {user ? (
    <div className="flex flex-col gap-3">
     <SignOut />
     <p>{data?.full_name}</p>
    </div>
   ) : (
    <div className="flex flex-col gap-3">
     <Link href="/user/sign-in" className="bg-pink-600 p-2">
      Sign In
     </Link>
     <p>Hi stranger</p>
    </div>
   )}
  </>
 );
}
