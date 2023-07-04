import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
 return twMerge(clsx(inputs));
}

export function createColors() {
 let data = [];
 let backgroundColors = [];
 for (var i = 10; i >= 0; i--) {
  let green = Math.round((i / 10) * 255);
  let red = Math.round(((10 - i) / 10) * 255);

  data.push(i);
  backgroundColors.push(`rgb(${red}, ${green}, 50)`);
 }

 return backgroundColors;
}

export function ratingDataGenerate(
 comments: Database["public"]["Tables"]["comments"]["Row"][]
) {
 return Array.from({ length: 11 }, (_, index) =>
  comments!.reduce(
   (count, comment) => count + (comment.rating === 10 - index ? 1 : 0),
   0
  )
 );
}

export function ratingColor({ rating }: { rating: number }) {
 return createColors()[10 - Math.ceil(rating)];
}

export function normalizeRating({
 avgRating,
 ratings,
}: {
 avgRating: number;
 ratings: number;
}) {
 if (ratings === 0) return 0;
 return (avgRating * ratings + 6) / (ratings + 1);
}
