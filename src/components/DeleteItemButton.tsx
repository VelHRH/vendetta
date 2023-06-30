"use client";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { Button } from "./ui/Button";

interface DeleteItemButtonProps {
 id: number;
}

const DeleteItemButton: FC<DeleteItemButtonProps> = ({ id }) => {
 const router = useRouter();
 const { mutate: deleteComment, isLoading } = useMutation({
  mutationFn: async () => {
   const { data } = await axios.patch("/api/comment", { id });
   return data as string;
  },
  onError: (err) => {
   toast({
    title: "There was an error",
    description: "Could not delete the comment",
    variant: "destructive",
   });
  },
  onSuccess: (data) => {
   router.refresh();
  },
 });
 return (
  <Button onClick={() => deleteComment()} isLoading={isLoading}>
   <Trash2 className="text-red-500" />
  </Button>
 );
};

export default DeleteItemButton;
