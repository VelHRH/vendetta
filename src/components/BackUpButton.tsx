"use client";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { Button } from "./ui/Button";

interface BackUpButtonProps {}

const BackUpButton: FC<BackUpButtonProps> = ({}) => {
 const router = useRouter();
 const { mutate: handleBackUp, isLoading } = useMutation({
  mutationFn: async () => {
   const { data } = await axios.post("/api/save-data");
   return data as string;
  },
  onError: () => {
   toast({
    title: "There was an error",
    description: "Could not save data",
    variant: "destructive",
   });
  },
  onSuccess: () => {
   toast({
    title: "Back Up was successful",
    description: "Successfully saved all your db data",
    variant: "default",
   });
  },
 });
 return (
  <Button onClick={handleBackUp} isLoading={isLoading}>
   Back Up
  </Button>
 );
};

export default BackUpButton;
