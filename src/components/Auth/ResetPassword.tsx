"use client";

import { toast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase-browser";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/Button";
import Input from "../ui/Input";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const ResetPassword = () => {
 const [email, setEmail] = useState<string>("");
 const [password, setPassword] = useState<string>("");
 const [loading, setLoading] = useState<boolean>(false);
 const [isError, setIsError] = useState<boolean>(false);
 const searchParams = useSearchParams();
 const router = useRouter();

 const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  setIsError(true);
  try {
   const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_BASE_URL}/reset-password`,
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

 const handleChange = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  setIsError(true);
  try {
   const { error } = await supabase.auth.updateUser({ password });

   if (error) {
    throw error.message;
   }
   toast({
    title: "Password updated",
    description: "You can sign in with it now",
    variant: "default",
   });
   router.push("/");
  } catch (err: string | any) {
   toast({
    title: "Error changing passsword",
    description: err,
    variant: "destructive",
   });
  } finally {
   setLoading(false);
  }
 };

 return (
  <div className="flex flex-col gap-7 items-center w-full bg-slate-100 dark:bg-slate-900 p-10 rounded-md">
   {searchParams.get("code") ? (
    <>
     <p className="text-4xl font-semibold">New Password</p>
     <form
      onSubmit={(e) => handleChange(e)}
      className="flex flex-col gap-4 w-full"
     >
      <Input
       value={password}
       setValue={setPassword}
       placeholder="New password"
       type="password"
       isError={isError && password.length === 0 ? true : false}
      />

      <Button className="w-full text-lg" size="lg" isLoading={loading}>
       Reset Password
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
    </>
   ) : (
    <>
     <p className="text-4xl font-semibold">Reset Password</p>
     <form
      onSubmit={(e) => handleSend(e)}
      className="flex flex-col gap-4 w-full"
     >
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
    </>
   )}
  </div>
 );
};

export default ResetPassword;
