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
  backgroundColors.push(`rgb(${red}, ${green}, 0)`);
 }

 return backgroundColors;
}
