"use client";

import { toast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase-browser";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icons } from "../Icons";
import { Button, buttonVariants } from "../ui/Button";
import Input from "../ui/Input";

const SingIn = () => {
 const [email, setEmail] = useState<string>("");
 const [password, setPassword] = useState<string>("");
 const [loading, setLoading] = useState<boolean>(false);
 const [isError, setIsError] = useState<boolean>(false);

 const router = useRouter();
 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  setIsError(true);
  try {
   const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
   });
   if (error) throw error;
   router.push("/");
  } catch (err) {
   toast({
    title: "Error while signing in",
    description: "Wrong email or password",
    variant: "destructive",
   });
  } finally {
   setLoading(false);
  }
 };

 async function signInWithGoogle() {
  setLoading(true);
  try {
   const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
   });
   router.push("/");
  } catch {
   toast({
    title: "Error while signing in",
    description: "There was an error while logging with Google",
    variant: "destructive",
   });
  } finally {
   setLoading(false);
  }
 }

 return (
  <div className="flex flex-col gap-7 items-center w-full bg-slate-100 dark:bg-slate-900 p-10 rounded-md">
   <p className="text-4xl font-semibold">Welcome back</p>
   <form
    onSubmit={(e) => handleSubmit(e)}
    className="flex flex-col gap-4 w-full"
   >
    <Input
     value={email}
     setValue={setEmail}
     placeholder="Email"
     isError={isError && email.length === 0 ? true : false}
    />
    <Input
     value={password}
     setValue={setPassword}
     placeholder="Password"
     type="password"
     isError={isError && password.length === 0 ? true : false}
    />

    <Button className="w-full text-lg" size="lg" isLoading={loading}>
     Sign In
    </Button>
   </form>
   <p className="text-2xl font-semibold">or</p>
   <Button
    onClick={signInWithGoogle}
    className="w-full text-lg"
    size="lg"
    isLoading={loading}
    icon={<Icons.google className="aspect-square h-5" />}
   >
    Sign In With Google
   </Button>
   <p>
    Have no account yet?
    <Link
     href="/sign-up"
     className="hover:underline ml-2 font-semibold underline-offset-4"
    >
     Sign Up
    </Link>
   </p>
   <p>
    Forgot password?
    <Link
     href="/reset-password"
     className="hover:underline ml-2 font-semibold underline-offset-4"
    >
     Reset
    </Link>
   </p>
  </div>
 );
};

export default SingIn;
