"use client";

import { useAuth } from "./AuthProvider";

export default function SignOut() {
 const { signOut } = useAuth();

 async function handleSignOut() {
  const { error } = await signOut();

  if (error) {
   console.error("ERROR signing out:", error);
  }
 }

 return (
  <button className="w-full h-full" onClick={handleSignOut}>
   Sign Out
  </button>
 );
}
