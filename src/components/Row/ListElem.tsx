import { normalizeRating, ratingColor } from "@/lib/utils";
import Link from "next/link";
import { FC } from "react";

interface ListElemProps {
 comments: Database["public"]["Tables"]["comments_wrestlers"]["Row"][];
 yourComments?: number;
 main: string;
 secondary: string;
 id: number;
 avgRating: number;
}

const ListElem: FC<ListElemProps> = ({
 main,
 secondary,
 avgRating,
 id,
 comments,
 yourComments,
}) => {
 return (
  <Link
   href={`/show/${id}`}
   className="w-full mb-4 flex justify-between items-center gap-3 text-xl h-12 group"
  >
   <div className="w-1/2 dark:bg-slate-800 bg-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 duration-300 rounded-md p-3 flex gap-4 font-bold items-center h-full">
    {main}
   </div>
   <div className="flex-1 duration-300 dark:bg-slate-800 bg-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 rounded-md justify-center p-3 h-full flex items-center">
    {secondary}
   </div>

   {comments.length !== 0 ? (
    <div
     style={{
      color: ratingColor({
       rating: normalizeRating({
        ratings: comments.length,
        avgRating: avgRating,
       }),
      }),
     }}
     className="dark:bg-slate-800 bg-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 duration-300 w-32 rounded-md justify-center p-3 h-full flex items-center"
    >
     {normalizeRating({
      ratings: comments.length,
      avgRating: avgRating,
     }).toFixed(2)}
    </div>
   ) : (
    <div className="dark:bg-slate-800 bg-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 duration-300 w-32 rounded-md justify-center p-3 h-full flex items-center">
     --
    </div>
   )}
   {yourComments ? (
    yourComments !== -1 ? (
     <div
      style={{
       color: ratingColor({
        rating: yourComments,
       }),
      }}
      className="dark:bg-slate-800 bg-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 duration-300 w-32 rounded-md justify-center p-3 h-full flex items-center"
     >
      {yourComments}
     </div>
    ) : (
     <div className="dark:bg-slate-800 bg-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 duration-300 w-32 rounded-md justify-center p-3 h-full flex items-center">
      --
     </div>
    )
   ) : null}
   <div className="dark:bg-slate-800 bg-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 duration-300 w-32 rounded-md justify-center p-3 h-full flex items-center">
    {comments.length}
   </div>
  </Link>
 );
};

export default ListElem;
