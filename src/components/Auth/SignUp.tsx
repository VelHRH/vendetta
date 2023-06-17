"use client";

import supabase from "@/lib/supabase-browser";
import { useState } from "react";

const SingUp = () => {
 const [email, setEmail] = useState<string>("");
 const [password, setPassword] = useState<string>("");
 const [errorMsg, setErrorMsg] = useState<string>("");
 const [successMsg, setSuccessMsg] = useState<string>("");
 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const { error } = await supabase.auth.signUp({
   email,
   password,
  });

  if (error) {
   setErrorMsg(error.message);
  } else {
   setSuccessMsg("Go confirm your password");
  }
 };
 return (
  <form
   onSubmit={(e) => handleSubmit(e)}
   className="w-1/3 container mx-auto flex flex-col fotn-semibold gap-4 bg-pink-300 p-5 rounded-lg"
  >
   <p className="text-3xl">SingUp</p>
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
    Sign Up
   </button>
   {errorMsg !== "" && <p className="text-red-500">{errorMsg}</p>}
   {successMsg !== "" && <p className="text-green-500">{successMsg}</p>}
  </form>
 );
};

export default SingUp;
