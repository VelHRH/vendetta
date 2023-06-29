import { cn } from "@/lib/utils";
import Link from "next/link";
import createClient from "../lib/supabase-server";
import SignOut from "./Auth/SignOut";
import SwitchTheme from "./SwitchTheme";
import { buttonVariants } from "./ui/Button";
import { Plus, UserCircle2 } from "lucide-react";

const Navbar = async () => {
 const supabase = createClient();

 const {
  data: { user },
 } = await supabase.auth.getUser();
 const { data: profile } = await supabase
  .from("users")
  .select()
  .eq("id", user?.id)
  .single();
 return (
  <div className="fixed h-[80px] text-xl z-50 bg-slate-100/95 dark:bg-slate-900/95 backdrop-blur-sm flex justify-between items-center top-0 left-[50%] translate-x-[-50%] px-10 w-full">
   <div className="flex gap-14 items-center">
    <Link href="/" className="flex gap-2 font-bold items-center">
     <p>Logo</p>
     <p>Vendetta</p>
    </Link>
    <div className="flex gap-5 items-center">
     <Link
      href="/"
      className={cn(buttonVariants({ variant: "subtle" }), "p-2")}
     >
      Shows
     </Link>
     <Link
      href="/wrestler"
      className={cn(buttonVariants({ variant: "subtle" }), "p-2")}
     >
      Wrestlers
     </Link>
     {profile?.role === "admin" && (
      <Link
       href="/add"
       className={cn(
        buttonVariants({ variant: "subtle" }),
        "p-2 flex gap-1 items-center"
       )}
      >
       <Plus />
       Add
      </Link>
     )}
    </div>
   </div>
   <div className="gap-2 flex">
    <SwitchTheme />

    {user ? (
     <>
      <Link
       href={`/user/${profile?.username}`}
       className={buttonVariants({ variant: "subtle" })}
      >
       <UserCircle2 />
       {profile?.username}
      </Link>
      <SignOut />
     </>
    ) : (
     <Link href="/sign-in" className={buttonVariants()}>
      Sign In
     </Link>
    )}
   </div>
  </div>
 );
};

export default Navbar;
