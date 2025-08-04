import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(str: string) {
  const date = new Date(str);

  let hours = date.getHours();
  let amPm = date.getHours() >= 12 ? "PM" : "AM";

  if (amPm == "PM" && date.getHours() > 12) {
    hours = hours - 12;
  }

  if (hours == 0) {
    hours = 12;
  }

  return `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}, ${hours}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")} ${amPm}`;
}

export function decodeHtml(html:string) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

export function cleanSpaces(input: string): string {
  return input
    .replace(/[\s\u00A0]*[\u200B-\u200F\u202F\u205F\u3000\u180E\uFEFF]+$/g, '') // remove trailing garbage
    .replace(/[\u200B-\u200F\u202F\u205F\u3000\u180E\uFEFF]/g, '') // remove any inside if needed
    .trimEnd();
}

