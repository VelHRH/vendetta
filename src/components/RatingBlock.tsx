import { normalizeRating, ratingColor, ratingDataGenerate } from "@/lib/utils";
import { FC } from "react";
import RatingChart from "./RatingChart";
import Label from "./ui/Label";

interface RatingBlockProps {
 avgRating: number;
 comments:
  | Database["public"]["Tables"]["comments_wrestlers"]["Row"][]
  | Database["public"]["Tables"]["comments_shows"]["Row"][];
}

const RatingBlock: FC<RatingBlockProps> = ({ avgRating, comments }) => {
 return (
  <>
   <div className="w-1/4 h-[600px] rounded-md dark:bg-slate-800 bg-slate-200 hidden lg:flex flex-col gap-5 items-center p-5">
    <Label size="medium" className="font-bold self-start">
     Рейтинг:
    </Label>
    {comments.length !== 0 ? (
     <p
      style={{
       color: ratingColor({
        rating: normalizeRating({
         ratings: comments.length,
         avgRating: avgRating,
        }),
       }),
      }}
      className={`font-bold text-7xl`}
     >
      {normalizeRating({
       ratings: comments.length,
       avgRating: avgRating,
      }).toFixed(2)}
     </p>
    ) : (
     <p className={`font-bold text-7xl`}>--</p>
    )}
    <RatingChart data={ratingDataGenerate(comments)} />
   </div>
   <div className="flex lg:hidden items-center p-3 justify-between rounded-md dark:bg-slate-800 bg-slate-200">
    <Label size="medium" className="font-bold self-start">
     Рейтинг:
    </Label>
    {comments.length !== 0 ? (
     <p
      style={{
       color: ratingColor({
        rating: normalizeRating({
         ratings: comments.length,
         avgRating: avgRating,
        }),
       }),
      }}
      className={`font-semibold text-5xl`}
     >
      {normalizeRating({
       ratings: comments.length,
       avgRating: avgRating,
      }).toFixed(2)}
     </p>
    ) : (
     <p className={`font-semibold text-5xl`}>--</p>
    )}
   </div>
  </>
 );
};

export default RatingBlock;
