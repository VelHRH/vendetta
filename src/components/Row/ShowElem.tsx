import { DEFAULT_IMAGE } from "@/config";
import { normalizeRating, ratingColor } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface WrestlerElemProps {
 show: Database["public"]["Tables"]["shows"]["Row"];
 comments?: Database["public"]["Tables"]["comments_wrestlers"]["Row"][];
 place: number;
}

const ShowElem: FC<WrestlerElemProps> = ({ show, place, comments = [] }) => {
 return (
  <Link
   href={`/show/${show.id}`}
   className="w-full mb-4 flex justify-between items-center gap-4 text-xl h-12 group"
  >
   <div className="w-1/2 dark:bg-slate-800 bg-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 duration-300 rounded-md p-3 flex gap-4 font-bold items-center h-full">
    {place}. {show.name}
   </div>
   <div className="flex-1 duration-300 dark:bg-slate-800 bg-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 rounded-md justify-center p-3 h-full flex items-center">
    {show.upload_date
     ? new Date(show.upload_date.toString() || "").toLocaleDateString()
     : "Еще не вышло"}
   </div>

   {comments.length !== 0 ? (
    <div
     style={{
      color: ratingColor({
       rating: normalizeRating({
        ratings: comments.length,
        avgRating: show.avgRating,
       }),
      }),
     }}
     className="dark:bg-slate-800 bg-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 duration-300 w-32 rounded-md justify-center p-3 h-full flex items-center"
    >
     {normalizeRating({
      ratings: comments.length,
      avgRating: show.avgRating,
     }).toFixed(2)}
    </div>
   ) : (
    <div className="dark:bg-slate-800 bg-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 duration-300 w-32 rounded-md justify-center p-3 h-full flex items-center">
     --
    </div>
   )}
  </Link>
 );
};

export default ShowElem;
