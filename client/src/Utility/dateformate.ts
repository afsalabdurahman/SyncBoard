export let formatDate =(dateStr: string): string =>{
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}
export const DateInHours= (dateStr:string):string=>{
  
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime(); // difference in milliseconds

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return `${seconds} sec${seconds !== 1 ? "s" : ""} ago`;
  if (minutes < 60) return `${minutes} min${minutes !== 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hr${hours !== 1 ? "s" : ""} ago`;
  if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`;

  // For dates older than 30 days, show actual date
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;


}
// jan 10 12:30
export const formatTime = (input: Date | string): string => {
  let date: Date;
  
  if (typeof input === "string") {
    // Parse ISO string (handles Z correctly)
    date = new Date(input);
  } else {
    date = input;
  }

  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  // Today → only time
  if (messageDate.getTime() === today.getTime()) {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  // Yesterday
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (messageDate.getTime() === yesterday.getTime()) {
    return "Yesterday " + date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }

  // Older → day month time (e.g., "24 Dec 18:01")
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  }) + " " + date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};