import Link from "next/link";
import createClient from "../lib/supabase-server";
import SignOut from "./Auth/SignOut";
import SwitchTheme from "./SwitchTheme";

const Navbar = async () => {
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
  <div className="fixed h-[80px] bg-slate-100/95 dark:bg-slate-900/95 shadow-xl shadow-slate-100/95 dark:shadow-slate-900/95 backdrop-blur-sm flex justify-between items-center top-0 left-[50%] translate-x-[-50%] px-10 w-full">
   <div className="flex gap-10 items-center">
    <Link href="/" className="flex gap-2 font-bold items-center">
     <p>Logo</p>
     <p>Vendetta</p>
    </Link>
    <div className="flex gap-2 items-center">
     <Link
      href="/"
      className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md"
     >
      Shows
     </Link>
     <Link
      href="/"
      className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md"
     >
      Shows
     </Link>
    </div>
   </div>
   <div className="gap-2 flex">
    <SwitchTheme />
    <div className="px-2 py-1 bg-black text-white rounded-md">
     {user ? <SignOut /> : <Link href="/sign-in">Sign In</Link>}
    </div>
   </div>
  </div>
 );
};

export default Navbar;
