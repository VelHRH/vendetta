"use client";

import { Button, buttonVariants } from "../ui/Button";
import { useAuth } from "./AuthProvider";

export default function SignOut() {
 const { signOut } = useAuth();

 async function handleSignOut() {
  const { error } = await signOut();

  if (error) {
   console.error("ERROR signing out:", error);
  }
 }

 return <Button onClick={handleSignOut}>Sign Out</Button>;
}
