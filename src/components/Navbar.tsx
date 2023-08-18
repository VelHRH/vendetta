import { cn } from "@/lib/utils";
import Link from "next/link";
import createClient from "../lib/supabase-server";
import SignOut from "./Auth/SignOut";
import SwitchTheme from "./SwitchTheme";
import { Button, buttonVariants } from "./ui/Button";
import { ChevronDown, Plus, UserCircle2 } from "lucide-react";
import { Icons } from "./Icons";
import BackUpButton from "./BackUpButton";
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuItem,
 DropdownMenuLabel,
 DropdownMenuSeparator,
 DropdownMenuTrigger,
} from "./ui/dropdown-menu";

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
  <div className="fixed h-[80px] text-lg lg:text-xl z-50 bg-slate-100/95 dark:bg-slate-900/95 backdrop-blur-sm flex justify-between items-center top-0 left-[50%] translate-x-[-50%] px-10 w-full">
   <div className="flex gap-5 lg:gap-10 items-center">
    <Link href="/" className="flex gap-2 font-bold items-center">
     <Icons.logo className="h-[35px] w-[37px] text-slate-900 dark:text-slate-100" />
     <p>Vendetta</p>
    </Link>
    <div className="lg:hidden">
     <DropdownMenu>
      <DropdownMenuTrigger>
       <Button variant={"subtle"} className="flex items-center gap-1">
        <ChevronDown /> Меню
       </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
       {user && (
        <>
         <DropdownMenuLabel>
          <Link
           href={`/user/${profile?.username}`}
           className="flex items-center gap-1"
          >
           <UserCircle2 />
           {profile?.username}
          </Link>
         </DropdownMenuLabel>
         <DropdownMenuSeparator />
        </>
       )}
       <DropdownMenuItem>
        <Link href="/match">Матчгайд</Link>
       </DropdownMenuItem>
       <DropdownMenuItem>
        <Link href="/show">Шоу</Link>
       </DropdownMenuItem>
       <DropdownMenuItem>
        <Link href="/wrestler">Рестлеры</Link>
       </DropdownMenuItem>
       <DropdownMenuItem>
        <Link href="/team">Команды</Link>
       </DropdownMenuItem>
       <DropdownMenuItem>
        <Link href="/tournament">Турниры</Link>
       </DropdownMenuItem>
       <DropdownMenuItem>
        <Link href="/title">Титулы</Link>
       </DropdownMenuItem>
       {profile?.role === "admin" && (
        <DropdownMenuItem>
         <Link href="/add" className="flex items-center gap-1">
          <Plus />
          Добавить
         </Link>
        </DropdownMenuItem>
       )}
      </DropdownMenuContent>
     </DropdownMenu>
    </div>
    <div className="hidden lg:flex gap-5 items-center">
     <Link
      href="/match"
      className={cn(buttonVariants({ variant: "subtle" }), "p-2")}
     >
      Матчгайд
     </Link>
     <Link
      href="/show"
      className={cn(buttonVariants({ variant: "subtle" }), "p-2")}
     >
      Шоу
     </Link>
     <Link
      href="/wrestler"
      className={cn(buttonVariants({ variant: "subtle" }), "p-2")}
     >
      Рестлеры
     </Link>
     <Link
      href="/team"
      className={cn(buttonVariants({ variant: "subtle" }), "p-2")}
     >
      Команды
     </Link>
     <Link
      href="/tournament"
      className={cn(buttonVariants({ variant: "subtle" }), "p-2")}
     >
      Турниры
     </Link>
     <Link
      href="/title"
      className={cn(buttonVariants({ variant: "subtle" }), "p-2")}
     >
      Титулы
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
       Добавить
      </Link>
     )}
    </div>
   </div>
   <div className="gap-2 ml-2 flex">
    <SwitchTheme />

    {user ? (
     <>
      <Link
       href={`/user/${profile?.username}`}
       className={cn(buttonVariants({ variant: "subtle" }), "hidden lg:flex")}
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
    {process.env.NODE_ENV === "development" && <BackUpButton />}
   </div>
  </div>
 );
};

export default Navbar;
