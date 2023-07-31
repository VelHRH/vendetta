import Link from "next/link";
import { FC } from "react";

interface ReignProps {
 main: string;
 link: string;
 matchesLink: string;
 start: string;
 end: string | null;
 index: number;
 withVacant?: string;
 isCrossed?: boolean;
}

const Reign: FC<ReignProps> = ({
 main,
 link,
 matchesLink,
 start,
 end,
 index,
 withVacant,
 isCrossed,
}) => {
 return (
  <>
   {index === 0 && (
    <div className="flex w-full px-4 py-2">
     <p className="w-1/5 px-3 text-center">Даты</p>
     <p className="flex-1 px-3"></p>
     <p className="w-32 px-3 text-center">Дни</p>
     <p className="w-32 px-3 text-center">Матчи</p>
    </div>
   )}
   {withVacant !== undefined && (
    <div
     key={index}
     className={`flex items-stretch bg-red-500/10 px-4 py-5 text-xl w-full rounded-md`}
    >
     <p className="w-1/5 text-center border-r-2 dark:border-slate-600 border-slate-400 px-3">
      {new Date(end!.toString()).toLocaleDateString()} -{" "}
      {withVacant === "сейчас"
       ? withVacant
       : new Date(withVacant).toLocaleDateString()}
     </p>
     <p className="flex-1 border-r-2 dark:border-slate-600 border-slate-400 px-3">
      VACANT
     </p>
     <p className="w-32 text-center border-r-2 dark:border-slate-600 border-slate-400 px-3">
      {getDaysDifference(
       end!,
       withVacant === "сейчас" ? new Date().toDateString() : withVacant
      )}
     </p>

     <p className="hover:underline underline-offset-4 font-semibold w-32 text-center px-3"></p>
    </div>
   )}
   <div
    key={index}
    className={`flex items-stretch ${
     index % 2 === 0 && "dark:bg-slate-800 bg-slate-200"
    } px-4 py-5 text-xl w-full rounded-md`}
   >
    <p className="w-1/5 text-center border-r-2 dark:border-slate-600 border-slate-400 px-3">
     {new Date(start.toString()).toLocaleDateString()} -{" "}
     {end ? new Date(end.toString()).toLocaleDateString() : "сейчас"}
    </p>
    <p className="flex-1 font-semibold border-r-2 dark:border-slate-600 border-slate-400 px-3">
     <Link
      href={link}
      className={`${
       isCrossed && "line-through"
      } hover:underline underline-offset-4`}
     >
      {main}
     </Link>
    </p>
    <p className="w-32 text-center border-r-2 dark:border-slate-600 border-slate-400 px-3">
     {end
      ? getDaysDifference(start, end)
      : getDaysDifference(start, new Date().toDateString())}
    </p>

    <Link
     href={matchesLink}
     className="hover:underline underline-offset-4 font-semibold w-32 text-center px-3"
    >
     Матчи
    </Link>
   </div>
  </>
 );
};

export default Reign;

function getDaysDifference(startDateStr: string, endDateStr: string) {
 const startDate = new Date(startDateStr);
 const endDate = new Date(endDateStr);
 const oneDayMilliseconds = 1000 * 60 * 60 * 24;
 const differenceMilliseconds = endDate.getTime() - startDate.getTime();
 const differenceDays = Math.floor(differenceMilliseconds / oneDayMilliseconds);

 return differenceDays;
}
