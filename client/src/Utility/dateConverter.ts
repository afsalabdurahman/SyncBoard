export const deadlineCovert = (isoDate:string)=>{
const date = new Date(isoDate);
const day = String(date.getDate()).padStart(2, '0');         // "27"
const month = String(date.getMonth() + 1).padStart(2, '0');  // "07"
const year = date.getFullYear();         
const formattedDate = `${year}-${month}-${day}`;
return formattedDate
}
export const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };