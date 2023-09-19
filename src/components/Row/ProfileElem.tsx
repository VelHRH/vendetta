import { formatDateToDdMmYyyy, ratingColor } from "@/lib/utils";
import Link from "next/link";
import { FC, ReactNode } from "react";

interface ProfileElemProps {
 main: ReactNode | string;
 rating: number;
 id: number;
 date: string;
 type: string;
}

const ProfileElem: FC<ProfileElemProps> = ({
 main,
 rating,
 id,
 date,
 type,
}) => {
 return (
  <Link
   href={`/${type}/${id}`}
   className="flex gap-3 text-xl group items-stretch"
  >
   <div className="flex-1 duration-300 dark:bg-slate-800 bg-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 rounded-md p-3 flex items-center">
    {main}
   </div>
   <div
    style={{
     color: ratingColor({
      rating: rating,
     }),
    }}
    className={`dark:bg-slate-800 bg-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 duration-300 w-32 rounded-md justify-center p-3 flex items-center`}
   >
    {rating}
   </div>
   <div
    className={`dark:bg-slate-800 bg-slate-200 group-hover:bg-slate-300 dark:group-hover:bg-slate-700 duration-300 w-1/5 rounded-md justify-center p-3 flex items-center`}
   >
    {formatDateToDdMmYyyy(new Date(date))}
   </div>
  </Link>
 );
};

export default ProfileElem;
