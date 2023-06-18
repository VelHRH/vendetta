"use client";

import supabase from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icons } from "../Icons";
import Input from "../ui/Input";

const SingIn = () => {
 const [email, setEmail] = useState<string>("");
 const [password, setPassword] = useState<string>("");

 const router = useRouter();
 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const { error } = await supabase.auth.signInWithPassword({
   email,
   password,
  });

  if (!error) {
   router.push("/");
  }
 };

 async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
   provider: "google",
  });
  if (!error) {
   router.push("/");
  }
 }

 return (
  <div className="flex flex-col gap-7 items-center w-full bg-slate-100 dark:bg-slate-900 p-10 rounded-md">
   <p className="text-4xl font-semibold">Welcome back</p>
   <form
    onSubmit={(e) => handleSubmit(e)}
    className="flex flex-col gap-4 w-full"
   >
    <Input value={email} setValue={setEmail} placeholder="Email" />
    <Input value={password} setValue={setPassword} placeholder="Password" />

    <button className="w-full text-center p-2 rounded-md mt-1 dark:hover:bg-slate-300 dark:bg-slate-100 hover:bg-slate-950 bg-slate-800 duration-200 font-semibold text-xl dark:text-black text-white">
     Sign In
    </button>
   </form>
   <p className="text-2xl font-semibold">or</p>
   <button
    onClick={signInWithGoogle}
    className="w-full flex justify-center gap-3 items-center p-2 rounded-md dark:hover:bg-slate-300 dark:bg-slate-100 hover:bg-slate-950 bg-slate-800 duration-200 font-semibold text-xl dark:text-black text-white"
   >
    <Icons.google className="h-5 aspect-square" />
    Sign In With Google
   </button>
  </div>
 );
};

export default SingIn;
