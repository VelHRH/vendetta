"use client";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import CommentForm from "./Add/CommentForm";
import { Button } from "./ui/Button";

interface DeleteItemButtonProps {
 id: number;
 type: string;
 author: string;
 authorId: string;
 rating: number;
 text: string;
}

const EditComment: FC<DeleteItemButtonProps> = ({
 id,
 type,
 author,
 authorId,
 rating,
 text,
}) => {
 const router = useRouter();
 const [isConfirmDelete, setIsConfirmDelete] = useState<boolean>(false);
 const [isConfirmEdit, setIsConfirmEdit] = useState<boolean>(false);

 const { mutate: deleteComment, isLoading } = useMutation({
  mutationFn: async () => {
   const { data } = await axios.patch("/api/comment", { id, type });
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
  <>
   {isConfirmDelete || isConfirmEdit ? (
    <div className="w-full h-full top-0 left-0 bg-black/60 fixed">
     {isConfirmDelete ? (
      <div className="absolute bg-red-500 w-1/2 rounded-md p-7 flex items-center flex-col gap-7 left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
       <p className="text-3xl text-slate-50">Confirm deleting?</p>
       <div className="flex gap-5">
        <Button
         onClick={() => setIsConfirmDelete(false)}
         size={"lg"}
         className="text-xl"
        >
         Cancel
        </Button>
        <Button
         onClick={() => deleteComment()}
         isLoading={isLoading}
         className="text-red-500 dark:text-red-500 text-xl"
         size={"lg"}
        >
         DELETE
        </Button>
       </div>
      </div>
     ) : (
      <CommentForm
       type={type}
       itemId={id}
       author={author}
       authorId={authorId}
       content={text}
       stars={rating}
       cancel={isConfirmEdit}
       setCancel={setIsConfirmEdit}
       commetId={id}
       className="w-1/2 absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"
      />
     )}
    </div>
   ) : (
    <div className="flex gap-2">
     <Button onClick={() => setIsConfirmEdit(true)}>
      <Pencil />
     </Button>
     <Button onClick={() => setIsConfirmDelete(true)}>
      <Trash2 className="dark:text-red-700 text-red-300" />
     </Button>
    </div>
   )}
  </>
 );
};

export default EditComment;
