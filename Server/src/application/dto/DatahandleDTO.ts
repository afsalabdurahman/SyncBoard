import { ObjectId } from "mongoose";
import { workspaceStatus } from "../../types/workpaceTypes";

export interface IWorkspaceChanges{
  nameOfWorkspace:string,
  subscriptionPlan: string;
  amount: number;
  date: Date|any;

}
export interface CountResponseDTO {
  token: string;
  refreshToken: string;
  userCount:number;
  workspaceCount:number;
  subscriptionCount:number;
  subscriptionChanges:IWorkspaceChanges[]
}
interface WorkspaceDetails{
  _id:string |ObjectId; 
   name:string;
   slug:string;
ownerName:string;
plan:string;
status:string;

}

export interface CountWorkspaceReponseDTO{
id:string|ObjectId,
name:string,
owner:{
  name:string,
  email:string,
  avatar:string,
},
plan:string,
status:workspaceStatus,
members:number,
createdAt:string,
lastActivity:string,
monthlyRevenue:number,
storage:any,

}