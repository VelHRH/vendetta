"use client";
import { toast } from "@/hooks/use-toast";
import supabase from "@/lib/supabase-browser";
import { FC, useState } from "react";
import { Button } from "../ui/Button";
import Input from "../ui/Input";
import Label from "../ui/Label";

interface EditUserFormProps {
 id: string;
 username: string;
 fullName: string | null;
}

const EditUserForm: FC<EditUserFormProps> = ({ username, fullName, id }) => {
 const [newPassword, setNewPassword] = useState<string>("");
 const [newUsername, setNewUsername] = useState<string>(username);
 const [newFullName, setNewFullName] = useState<string | null>(fullName);
 const [isError, setIsError] = useState<boolean>(false);

 const updateUser = async () => {
  setIsError(true);
  if (newUsername.length < 1)
   return toast({
    title: "Unable to update",
    description: "Username too short",
    variant: "destructive",
   });
  const { error } = await supabase
   .from("users")
   .update({ full_name: newFullName, username: newUsername })
   .eq("id", id);
  if (error)
   return toast({
    title: "Unable to update",
    description: error.message,
    variant: "destructive",
   });
  setIsError(false);
  toast({
   title: "Success",
   description: "Your username/full name updated",
   variant: "default",
  });
 };

 const updatePassword = async () => {
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error)
   return toast({
    title: "Unable to update password",
    description: error.message,
    variant: "destructive",
   });
  toast({
   title: "Success",
   description: "Your password was updated",
   variant: "default",
  });
 };
 return (
  <div className="flex flex-col gap-3 w-1/2">
   <Label className="font-bold self-start" size="medium">
    General info:
   </Label>
   <Input
    placeholder="Username"
    value={newUsername}
    setValue={setNewUsername}
    isError={isError && newUsername.length === 0}
   />
   <Input
    placeholder="Full Name"
    value={newFullName || ""}
    setValue={setNewFullName}
   />
   <Button className="w-full" onClick={() => updateUser()}>
    Update profile
   </Button>
   <Label className="font-bold self-start mt-7" size="medium">
    Password update:
   </Label>
   <Input
    placeholder="New password"
    type="password"
    value={newPassword}
    setValue={setNewPassword}
   />
   <Button className="w-full" onClick={() => updatePassword()}>
    Update password
   </Button>
  </div>
 );
};

export default EditUserForm;
