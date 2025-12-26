export type statusType = "To Do" | "In Progress" | "Completed";
export type priorityType = "Low" | "Medium" | "High";
export type approvalType= "Approved"|"Rejected"|"Waiting"
export interface commentType{
    name:string,
    text:string,
    urls:string[],
    timestamp?:Date
}