import Link from "next/link";
import { FC } from "react";
import DeleteItemButton from "./DeleteItemButton";
import Label from "./ui/Label";

interface CommentProps {
 text: string;
 author: string;
 rating: number;
 date: string;
 id?: number;
}

const Comment: FC<CommentProps> = ({ text, author, rating, date, id }) => {
 const dateConvert = new Date(date);
 return (
  <div className="w-full p-7 bg-slate-200 dark:bg-slate-800 flex flex-col rounded-sm text-lg">
   <div className="flex mb-5 pb-3 border-b-2 border-slate-500">
    <Link
     href={`/user/${author}`}
     className="hover:underline underline-offset-4 w-1/2"
    >
     <Label size="medium" className="font-bold text-start">
      {author}
     </Label>
    </Link>
    <div className="flex justify-between items-center flex-1">
     <Label size="medium" className="font-bold text-green-700">
      {rating}
     </Label>
     <p className="font-bold text-xl text-slate-500">
      {dateConvert.toLocaleDateString()}
     </p>
     {id && (
      <div className="gsp-2 flex">
       <DeleteItemButton id={id} />
      </div>
     )}
    </div>
   </div>
   {text}
  </div>
 );
};

export default Comment;
