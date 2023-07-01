"use client";

import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { Button, buttonVariants } from "../ui/Button";
import { useAuth } from "./AuthProvider";

export default function SignOut() {
 const { signOut } = useAuth();
 const [isLoading, setIsLoading] = useState<boolean>(false);

 async function handleSignOut() {
  try {
   setIsLoading(true);
   const { error } = await signOut();

   if (error) throw error;
  } catch (err) {
   toast({
    title: "Error signing out",
    description: "Failed to sign out",
    variant: "destructive",
   });
  } finally {
   setIsLoading(false);
  }
 }

 return (
  <Button onClick={handleSignOut} isLoading={isLoading}>
   Sign Out
  </Button>
 );
}
