import { DEFAULT_IMAGE } from "@/config";
import { ratingColor } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface WrestlerElemProps {
 wrestler: Database["public"]["Tables"]["wrestlers"]["Row"];
 place: number;
}

const WrestlerElem: FC<WrestlerElemProps> = ({ wrestler, place }) => {
 return (
  <Link
   href={`/wrestler/${wrestler.id}`}
   className="w-full mb-4 flex justify-between items-center gap-4 text-xl h-16 group"
  >
   <div className="w-1/2 dark:bg-slate-800 bg-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 duration-300 rounded-md p-3 flex gap-4 font-bold items-center h-full">
    {place}.
    <div className="h-full aspect-square relative">
     <Image
      alt="Wrestler image"
      src={wrestler.wrestler_img || DEFAULT_IMAGE}
      fill
      className="object-cover rounded-md"
     />
    </div>
    {wrestler.name}
    <div
     className={`p-1 font-semibold text-sm rounded-md bg-sky-600 text-white`}
    >
     Vendetta Champion
    </div>
   </div>
   <div className="flex-1 duration-300 dark:bg-slate-800 bg-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 rounded-md justify-center p-3 h-full flex items-center">
    Четоввмвмвмвмв ам
   </div>

   <div
    style={{
     color: ratingColor({
      rating:
       (wrestler.avgRating * wrestler.ratings?.length! + 6) /
       (wrestler.ratings?.length! + 1),
     }),
    }}
    className="dark:bg-slate-800 bg-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 duration-300 w-32 aspect-square rounded-md justify-center p-3 h-full flex items-center"
   >
    {(
     (wrestler.avgRating * wrestler.ratings?.length! + 6) /
     (wrestler.ratings?.length! + 1)
    ).toFixed(2)}
   </div>
  </Link>
 );
};

export default WrestlerElem;
