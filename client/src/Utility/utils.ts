import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function splitWordsIntoRows(text:string, maxWordsPerRow = 10) {
  const words = text.trim().split(/\s+/);
  const rows = [];

  for (let i = 0; i < words.length; i += maxWordsPerRow) {
    rows.push(words.slice(i, i + maxWordsPerRow).join(" "));
  }

  return rows;
}

