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

export function removeDuplicateArrays(arr1: Json[][][], arr2: Json[][][]) {
 let uniqueArr2 = [];
 for (let i = 0; i < arr2.length; i++) {
  let ifUnique = true;
  for (let j = 0; j < arr1.length; j++) {
   if (areArraysEqual(arr1[j], arr2[i])) {
    ifUnique = false;
    break;
   }
  }
  ifUnique && uniqueArr2.push(arr2[i]);
 }
 return uniqueArr2;
}

function areArraysEqual(arr1: Json[][], arr2: Json[][]) {
 if (arr1.length !== arr2.length) {
  return false;
 }

 for (let i = 0; i < arr1.length; i++) {
  const obj1 = arr1[i];
  let found = false;

  for (let j = 0; j < arr2.length; j++) {
   const obj2 = arr2[j];

   if (obj1 === obj2) {
    found = true;
    break;
   }
  }

  if (!found) {
   return false;
  }
 }

 return true;
}

export function parseSide(side: Json[]): string {
 const teamNames: any[] = [];
 const individualNames: any[] = [];
 side
  .sort((a, b) => a.wrestlerCurName.localeCompare(b.wrestlerCurName))
  .forEach((participant) => {
   if (participant.teamName) {
    const teamIndex = teamNames.findIndex(
     (team) => team.name === participant.teamName
    );
    if (teamIndex === -1) {
     teamNames.push({
      name: participant.teamName,
      members: [participant.wrestlerCurName],
     });
    } else {
     teamNames[teamIndex].members.push(participant.wrestlerCurName);
    }
   } else {
    individualNames.push(participant.wrestlerCurName);
   }
  });

 let formattedString = "";

 teamNames.forEach((team, index) => {
  formattedString += `${team.name} (${team.members.join(" & ")})`;
  if (index !== teamNames.length - 1 || individualNames.length > 0) {
   formattedString += " & ";
  }
 });

 formattedString += individualNames.join(" & ");

 return formattedString;
}

export function sortSides(sides: any[]) {
 return sides.sort((a, b) => {
  const firstObjA = a.wrestlers[0].wrestlerCurName;
  const firstObjB = b.wrestlers[0].wrestlerCurName;
  return firstObjA.localeCompare(firstObjB);
 });
}
