"use client";

import { toast } from "@/hooks/use-toast";
import { CreateCommentPayload } from "@/lib/validators/comment";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { Button } from "../ui/Button";
import Dropdown from "../ui/Dropdown";

interface CommentFormProps {
 type: string;
 itemId: number;
 author: string;
 authorId: string;
}

const CommentForm: FC<CommentFormProps> = ({
 type,
 itemId,
 author,
 authorId,
}) => {
 const [text, setText] = useState<string>("");
 const [rating, setRating] = useState<string>("");
 const [isSelectRating, setIsSelectRating] = useState<boolean>(false);
 const router = useRouter();

 const { mutate: addComment, isLoading } = useMutation({
  mutationFn: async () => {
   const payload: CreateCommentPayload = {
    text,
    rating: parseFloat(rating),
    type,
    itemId,
    author,
    authorId,
   };
   const { data } = await axios.post("/api/comment", payload);
   return data as string;
  },
  onError: (err) => {
   if (err instanceof AxiosError) {
    if (err.response?.status === 422) {
     return toast({
      title: "Input error",
      description:
       "Rating should be set. Comment at least 100 characters long.",
      variant: "destructive",
     });
    }
   }
   toast({
    title: "There was an error",
    description: "Could not create the comment",
    variant: "destructive",
   });
  },
  onSuccess: (data) => {
   setText("");
   setRating("");
   router.refresh();
  },
 });

 return (
  <div className="flex flex-col gap-4 w-full items-start mb-3">
   <Dropdown
    array={["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
    value={rating}
    setValue={setRating}
    isSelect={isSelectRating}
    setIsSelect={setIsSelectRating}
    placeholder="Choose rating..."
   />
   <textarea
    placeholder="Justify your rating..."
    value={text}
    onChange={(e) => setText(e.target.value)}
    className="w-full border-2 border-slate-500 p-5 rounded-md bg-transparent h-64"
   />
   <Button
    onClick={() => addComment()}
    isLoading={isLoading}
    className="self-end text-xl"
    size={"lg"}
   >
    Save
   </Button>
  </div>
 );
};

export default CommentForm;
