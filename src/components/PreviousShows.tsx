"use client";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC, useState } from "react";
import Label from "./ui/Label";

interface PreviousShowsProps {
 shows: Database["public"]["Tables"]["shows"]["Row"][];
}

const PreviousShows: FC<PreviousShowsProps> = ({ shows }) => {
 const [isMore, setIsMore] = useState<boolean>(false);
 return (
  <div className="flex flex-col p-3 lg:p-7 border-[3px] border-slate-300 dark:border-slate-700 rounded-md">
   <Label className="mb-3 lg:mb-5 font-semibold">Previous shows</Label>
   <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
    {shows
     ?.filter((s) => s.upload_date !== null)
     .sort((a, b) => b.upload_date!.localeCompare(a.upload_date!))
     .slice(0, isMore ? shows.length : 3)
     .map((show) => (
      <Link
       href={`/show/${show.id}`}
       key={show.id}
       className={`rounded-md aspect-video cursor-pointer relative flex flex-col justify-center`}
      >
       <div className="text-center font-bold text-md lg:text-xl">
        {show.name}
       </div>
       <Image
        src={
         show.show_img
          ? show.show_img
          : "https://brytpkxacsmzbawwiqcr.supabase.co/storage/v1/object/public/wrestlers/posters/default.jpg"
        }
        alt={show.name}
        fill
        className="object-cover hover:opacity-0 duration-300"
       />
      </Link>
     ))}
   </div>
   <button
    onClick={() => setIsMore((prev) => !prev)}
    className="text-lg self-center hover:underline font-semibold underline-offset-4 mt-3"
   >
    <p className="flex gap-1 items-center">
     {isMore ? (
      <>
       Less <ChevronUp />
      </>
     ) : (
      <>
       More <ChevronDown />
      </>
     )}
    </p>
   </button>
  </div>
 );
};

export default PreviousShows;
