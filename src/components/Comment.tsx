import { FC } from "react";
import Label from "./ui/Label";

interface CommentProps {
 text: string;
 author: string;
 rating: number;
 date: string;
}

const Comment: FC<CommentProps> = ({ text, author, rating, date }) => {
 return (
  <div className="w-full p-7 bg-slate-200 dark:bg-slate-800 flex flex-col rounded-sm text-lg">
   <div className="flex justify-between items-center mb-5 pb-3 border-b-2 border-slate-500">
    <Label size="medium" className="font-bold">
     {author}
    </Label>
    <Label size="medium" className="font-bold text-green-700">
     {rating}
    </Label>
    <p className="font-bold text-xl text-slate-500">{date}</p>
   </div>
   {text}
  </div>
 );
};

export default Comment;
