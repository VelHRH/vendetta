"use client";

import { toast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase-browser";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/Button";
import Input from "../ui/Input";

const SendEmailToLogin = () => {
 const [email, setEmail] = useState<string>("");
 const [loading, setLoading] = useState<boolean>(false);
 const [isError, setIsError] = useState<boolean>(false);

 const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  setIsError(true);
  try {
   const { data: profile } = await supabase
    .from("users")
    .select()
    .eq("email", email)
    .single();
   const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_BASE_URL}/user/${profile?.username}/edit`,
   });

   if (error) {
    throw error.message;
   }
   toast({
    title: "Password reset link sent",
    description:
     "Check your email and follow instructions (it can take some time)",
    variant: "default",
   });
  } catch (err: string | any) {
   toast({
    title: "Error while sending reset link",
    description: err,
    variant: "destructive",
   });
  } finally {
   setLoading(false);
  }
 };

 return (
  <div className="flex flex-col gap-7 items-center w-full bg-slate-100 dark:bg-slate-900 p-10 rounded-md">
   <p className="text-4xl font-semibold">Send me email to login</p>
   <form onSubmit={(e) => handleSend(e)} className="flex flex-col gap-4 w-full">
    <Input
     value={email}
     setValue={setEmail}
     placeholder="Email"
     isError={isError && email.length === 0 ? true : false}
    />

    <Button className="w-full text-lg" size="lg" isLoading={loading}>
     Send me
    </Button>
   </form>
   <p>
    Remember password?
    <Link
     href="/sign-in"
     className="hover:underline ml-2 font-semibold underline-offset-4"
    >
     Sign In
    </Link>
   </p>
  </div>
 );
};

export default SendEmailToLogin;
