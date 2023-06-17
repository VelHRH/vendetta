"use client";

import supabase from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
  <>
   <form
    onSubmit={(e) => handleSubmit(e)}
    className="w-1/3 container mx-auto flex flex-col fotn-semibold gap-4 bg-pink-300 p-5 rounded-lg"
   >
    <p className="text-3xl">Sing In</p>
    <input
     value={email}
     placeholder="Email"
     onChange={(e) => setEmail(e.target.value)}
     className={`p-2 w-full text-xl rounded-md`}
    />
    <input
     value={password}
     placeholder="Password"
     type="password"
     onChange={(e) => setPassword(e.target.value)}
     className={`p-2 w-full text-xl rounded-md`}
    />

    <button className="w-full text-center py-1 rounded-full hover:bg-pink-600 bg-pink-500">
     Sign In
    </button>
   </form>
   <button
    onClick={signInWithGoogle}
    className="w-full text-center py-1 rounded-full hover:bg-pink-600 bg-pink-500"
   >
    GOOGLE
   </button>
  </>
 );
};

export default SingIn;
