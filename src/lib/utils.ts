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

export function doubleArraysAreEqual(arr1: Json[][], arr2: Json[][]) {
 if (arr1.length !== arr2.length) return false;

 arr1 = arr1.map((subArray) =>
  [...subArray].sort((a: any, b: any) => a.wrestlerId - b.wrestlerId)
 );
 arr2 = arr2.map((subArray) =>
  [...subArray].sort((a: any, b: any) => a.wrestlerId - b.wrestlerId)
 );

 for (const item of arr1) {
  if (
   !arr2.some((subArray) => {
    const sortedSubArray = [...subArray].sort(
     (a: any, b: any) => a.wrestlerId - b.wrestlerId
    );
    return JSON.stringify(sortedSubArray) === JSON.stringify(item);
   })
  ) {
   return false;
  }
 }

 return true;
}

export function areArraysEqual(array1: Json[], array2: Json[]) {
 if (array1.length !== array2.length) {
  return false;
 }

 const ids1 = array1.map((item) => item.wrestlerId);
 const ids2 = array2.map((item) => item.wrestlerId);

 return ids1.sort().toString() === ids2.sort().toString();
}

export function removeDuplicateArrays(array1: Json[][][], array2: Json[][][]) {
 const result = [];

 for (const subArray2 of array2) {
  if (!array1.some((subArray1) => doubleArraysAreEqual(subArray1, subArray2))) {
   result.push(subArray2);
  }
 }

 return result;
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

export function calculateScores(
 participants: Database["public"]["Tables"]["tournaments"]["Row"]["block_participants"],
 match_sides: Database["public"]["Tables"]["match_sides"]["Row"][][],
 winners: Database["public"]["Tables"]["winners"]["Row"][][]
): number[] {
 const scores: number[] = Array(participants!.length).fill(0);
 let matchId: number;
 let allPassedMatches: number[] = [];

 for (let match of match_sides) {
  let isIn = true;
  if (
   allPassedMatches.some((id) =>
    match_sides.some(
     (ma) =>
      ma.filter((m) => m.match_id === id)!.map((m) => m.wrestlers) ===
      match.map((m) => m.wrestlers)
    )
   )
  ) {
   continue;
  }

  for (let side of match) {
   matchId = side.match_id;
   allPassedMatches.push(matchId);
   for (let unit of side.wrestlers) {
    if (
     !participants!.some((innerArray) =>
      innerArray.some((item) => item.wrestlerId === unit.wrestlerId)
     )
    ) {
     isIn = false;
     break;
    }
   }
   if (!isIn) break;
  }
  if (isIn) {
   let win: Json[] | undefined;

   for (let winner of winners) {
    win = winner.find((w) => w.match_id === matchId)?.winner;
   }

   let match = match_sides.find((m) => m[0].match_id === matchId)!;
   for (let side of match) {
    if (win === undefined) {
     let p = participants!.find((p) => areArraysEqual(p, side.wrestlers))!;
     scores[participants!.indexOf(p)] += 1;
    } else {
     let p = participants!.find((p) => areArraysEqual(p, side.wrestlers))!;
     areArraysEqual(p, win)
      ? (scores[participants!.indexOf(p)] += 2)
      : (scores[participants!.indexOf(p)] += 0);
    }
   }
  }
 }

 return scores;
}
