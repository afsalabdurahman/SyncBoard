export const nextMonth = () => {
  let today = new Date();


  const monthNumber = today.getMonth() + 1;

 
  const nextMonthDate = new Date(today);
  nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);

  return nextMonthDate
  
}
export const formateData = (date:string)=>{
  let ISOdate = new Date(date);
   return ISOdate.toISOString().split("T")[0];
}
export const getNextMonthEnd=(dateString: string): string => {
  const date = new Date(dateString);
  const nextMonth = date.getMonth() + 1; // move to next month
  const year = date.getFullYear() + Math.floor(nextMonth / 12);
  const month = nextMonth % 12;

 
  const lastDay = new Date(year, month + 1, 0);
  lastDay.setHours(23, 59, 59, 0);

  return lastDay.toISOString();
}
export const LLmFormateDate=(dateInput?: string | null): string=>{

  if (!dateInput) return "No due date";

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "Invalid date";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  if (target.getTime() === today.getTime()) return "Today";
  if (target.getTime() === tomorrow.getTime()) return "Tomorrow";
  if (target.getTime() === yesterday.getTime()) return "Yesterday";

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };

  const thisYear = new Date().getFullYear();
  if (target.getFullYear() !== thisYear) options.year = "numeric";

  return target.toLocaleDateString("en-US", options);

}
export function timeAgo(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  return `${years} year${years > 1 ? "s" : ""} ago`;
}

//formatDate("2026-01-10T06:31:26.335+00:00");
// "2026-01-10"
export function formatDateToString(isoString:string) {
  const date = new Date(isoString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


