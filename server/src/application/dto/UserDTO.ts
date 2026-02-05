import { Types } from "mongoose";
import { WorkspaceMembership } from "../../types/workpaceTypes";

export interface UserResponseDTO{
id?:string;
name:string;
email:string;
address:string;
workspace:WorkspaceMembership[] ;
phone:string;
location:string;
 about:string;
  createdAt: Date;
  updatedAt: Date;
  title:string;
  imageUrl:string;
  isAdmin:boolean;
  isSuperAdmin:boolean;
  isBlocked:boolean;
  isDeleted:boolean;
  isOnline:boolean;
  stripeCustomerId?: string;
  currentSubscription?: Types.ObjectId;
}