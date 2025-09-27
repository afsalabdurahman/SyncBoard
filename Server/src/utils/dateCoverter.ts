export const nextMonth = () => {
  let today = new Date();


  const monthNumber = today.getMonth() + 1;

 
  const nextMonthDate = new Date(today);
  nextMonthDate.setMonth(nextMonthDate.getMonth() + 1);

  return nextMonthDate
  
}
