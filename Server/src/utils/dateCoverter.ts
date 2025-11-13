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

