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
 comments:
  | Database["public"]["Tables"]["comments_wrestlers"]["Row"][]
  | Database["public"]["Tables"]["comments_shows"]["Row"][]
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

export function getBaseLog(x: number, y: number) {
 return Math.log(y) / Math.log(x);
}

export function findFirstDuplicate(arr: Json[]) {
 const seen = new Set();
 for (let i = 0; i < arr.length; i++) {
  const itemName = arr[i].itemName;
  if (seen.has(itemName)) {
   return { index: i, value: itemName };
  }
  seen.add(itemName);
 }
 return { index: -1, value: "" };
}

export function excludeDuplicates(arr1: Json[][], arr2: Json[][]) {
 const uniqueValues = new Set(arr1);
 for (let i = arr2.length - 1; i >= 0; i--) {
  if (uniqueValues.has(arr2[i])) {
   arr2.splice(i, 1);
  }
 }
}
