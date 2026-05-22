export const taskFilter = (filter:string)=>{
    if(filter=="all") return null;
    if(filter=="To Do") return "To Do";
    if(filter=="In Progress") return "In Progress";
    if (filter == "completed") return "Completed"
}