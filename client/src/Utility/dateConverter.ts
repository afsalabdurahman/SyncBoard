export const deadlineCovert = (isoDate:string)=>{
const date = new Date(isoDate);
const day = String(date.getDate()).padStart(2, '0');         // "27"
const month = String(date.getMonth() + 1).padStart(2, '0');  // "07"
const year = date.getFullYear();         
const formattedDate = `${year}-${month}-${day}`;
return formattedDate
}