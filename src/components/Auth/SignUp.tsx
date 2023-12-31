"use client";

import { toast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase-browser";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icons } from "../Icons";
import { Button, buttonVariants } from "../ui/Button";
import Input from "../ui/Input";

const SingUp = () => {
 const [email, setEmail] = useState<string>("");
 const [password, setPassword] = useState<string>("");
 const [fullname, setFullname] = useState<string>("");
 const [username, setUsername] = useState<string>("");
 const [loading, setLoading] = useState<boolean>(false);
 const [isError, setIsError] = useState<boolean>(false);
 const router = useRouter();

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);
  setIsError(true);
  try {
   const { data: isExistEmail } = await supabase
    .from("users")
    .select()
    .eq("email", email)
    .single();
   if (isExistEmail) throw "The email is already registered";
   const { data: isExistUsername } = await supabase
    .from("users")
    .select()
    .eq("username", username)
    .single();
   if (isExistUsername) throw "The username is already in use";
   const { error, data } = await supabase.auth.signUp({
    email,
    password,
   });
   if (error) throw error.message;

   await supabase
    .from("users")
    .update({ username, full_name: fullname })
    .eq("id", data.user!.id);
   toast({
    title: "Confirmation ",
    description: "Check your email and confirm adress",
    variant: "default",
   });
  } catch (err: string | any) {
   setLoading(false);
   toast({
    title: "Error while signing up",
    description: err,
    variant: "destructive",
   });
  } finally {
   setLoading(false);
  }
 };

 async function signInWithGoogle() {
  setLoading(true);
  try {
   const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
   });
   if (error) throw error.message;
   router.push("/");
  } catch {
   toast({
    title: "Error while signing in",
    description: "There was an error while registering with Google",
    variant: "destructive",
   });
  } finally {
   setLoading(false);
  }
 }
 return (
  <div className="flex flex-col gap-7 items-center w-full bg-slate-100 dark:bg-slate-900 p-10 rounded-md">
   <p className="text-4xl font-semibold">Register in Vendetta</p>
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
    <Input
     value={username}
     setValue={setUsername}
     placeholder="Username"
     isError={isError && username.length === 0 ? true : false}
    />
    <Input
     value={fullname}
     setValue={setFullname}
     placeholder="Full name"
     isError={isError && fullname.length === 0 ? true : false}
    />

    <Button className="w-full text-lg" size="lg" isLoading={loading}>
     Sign Up
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
    Sign Up With Google
   </Button>
   <p>
    Already registered?
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

export default SingUp;
