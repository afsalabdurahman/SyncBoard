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

