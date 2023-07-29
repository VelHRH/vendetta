import { normalizeRating, ratingColor } from "@/lib/utils";
import Link from "next/link";
import { FC } from "react";

interface ListElemProps {
 comments: Database["public"]["Tables"]["comments_wrestlers"]["Row"][];
 yourComments?: number;
 main: string;
 secondary: string;
 link: string;
 avgRating: number;
 reigns?: Database["public"]["Tables"]["reigns"]["Row"][];
}

const ListElem: FC<ListElemProps> = ({
 main,
 secondary,
 avgRating,
 link,
 comments,
 yourComments,
 reigns,
}) => {
 return (
  <Link
   href={link}
   className="w-full mb-4 flex justify-between gap-3 text-xl items-stretch group"
  >
   <div className="w-1/2 dark:bg-slate-800 bg-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 duration-300 rounded-md p-3 flex gap-4 font-bold items-center">
    {main}
    {reigns
     ?.filter(
      (item, index, self) =>
       index === self.findIndex((t) => t.title_name === item.title_name)
     )
     .map(
      (reign) =>
       !reign.end && (
        <div
         key={reign.id}
         className={`p-1 font-semibold text-sm rounded-md bg-amber-400/70`}
        >
         {reign.title_name}
        </div>
       )
     )}
   </div>
   <div className="flex-1 duration-300 dark:bg-slate-800 bg-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 rounded-md justify-center p-3 flex items-center text-center">
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
     className="dark:bg-slate-800 bg-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 duration-300 w-32 rounded-md justify-center p-3 flex items-center"
    >
     {normalizeRating({
      ratings: comments.length,
      avgRating: avgRating,
     }).toFixed(2)}
    </div>
   ) : (
    <div className="dark:bg-slate-800 bg-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 duration-300 w-32 rounded-md justify-center p-3 flex items-center">
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
      className="dark:bg-slate-800 bg-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 duration-300 w-32 rounded-md justify-center p-3 flex items-center"
     >
      {yourComments}
     </div>
    ) : (
     <div className="dark:bg-slate-800 bg-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 duration-300 w-32 rounded-md justify-center p-3 flex items-center">
      --
     </div>
    )
   ) : null}
   <div className="dark:bg-slate-800 bg-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 duration-300 w-32 rounded-md justify-center p-3 flex items-center">
    {comments.length}
   </div>
  </Link>
 );
};

export default ListElem;
