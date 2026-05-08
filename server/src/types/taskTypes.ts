import { Types } from "mongoose";

export type statusType = "To Do" | "In Progress" | "Completed";
export type priorityType = "Low" | "Medium" | "High";
export type approvalType= "Approved"|"Rejected"|"Waiting"
export interface commentType{
    name:string,
    text:string,
    urls:string[],
    timestamp?:Date
}
export interface taskType {
_id:string|Types.ObjectId,
name:string,
project:string,
assignedUser:string,
approvalStatus:string,
updatedAt:string,
rejectionMsg:string;
acceptanceCriteria:[{title:string,status:string}]
}