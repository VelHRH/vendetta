"use client";

import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CreateCommentPayload } from "@/lib/validators/comment";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { Button } from "../ui/Button";
import Dropdown from "../ui/Dropdown";

interface CommentFormProps extends React.HTMLAttributes<HTMLDivElement> {
 type: string;
 itemId: number;
 author: string;
 authorId: string;
 content?: string;
 stars?: number;
 commetId?: number;
 cancel?: boolean;
 setCancel?: (value: boolean) => void;
}

const CommentForm: FC<CommentFormProps> = ({
 type,
 itemId,
 author,
 authorId,
 content,
 commetId,
 stars,
 cancel,
 setCancel,
 className,
 ...props
}) => {
 const [text, setText] = useState<string>(content || "");
 const [rating, setRating] = useState<string>(stars?.toString() || "");
 const router = useRouter();

 const { mutate: addComment, isLoading: isLoadingAdd } = useMutation({
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

 const { mutate: editComment, isLoading: isLoadingEdit } = useMutation({
  mutationFn: async () => {
   const payload = {
    text,
    type,
    rating: parseFloat(rating),
    id: commetId,
   };
   const { data } = await axios.put("/api/comment", payload);
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
    description: "Could not update the comment",
    variant: "destructive",
   });
  },
  onSuccess: (data) => {
   setCancel!(false);
   router.refresh();
  },
 });

 return (
  <div
   className={cn("flex flex-col gap-4 w-full items-start mb-3", className)}
   {...props}
  >
   <Dropdown
    array={["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
    value={rating}
    setValue={setRating}
    placeholder="Choose rating..."
   />
   <textarea
    placeholder="Justify your rating..."
    value={text}
    onChange={(e) => setText(e.target.value)}
    className="w-full border-2 border-slate-500 p-5 rounded-md bg-slate-100 dark:bg-slate-900 h-64"
   />
   <div className="self-end flex gap-5">
    {cancel && (
     <Button onClick={() => setCancel!(false)} size={"lg"} className="text-xl">
      Cancel
     </Button>
    )}
    <Button
     onClick={content ? () => editComment() : () => addComment()}
     isLoading={isLoadingEdit || isLoadingAdd}
     size={"lg"}
     className="text-xl"
    >
     Save
    </Button>
   </div>
  </div>
 );
};

export default CommentForm;
