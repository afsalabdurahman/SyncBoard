import { Types } from "mongoose";
import { WorkspaceMembership } from "../../types/workpaceTypes";
import { Interface } from "readline";

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
export interface ProfileUpdateDTO {
  name: string;
  role?: string;
  title?: string;
  location?: string;
  status?: string;
  email?: string;
  joinDate?: string;
  address?: string | null;
  about?: string | null;
  phone?: string | null;
  imageUrl?: string | null;
  skills?: string[];
}
export interface UserInWorkspaceDTO{
title?:string;
permission?:string;
role?:string;
isBlocked?:boolean;
isDeleted?:boolean;
isOnline?:boolean;
}
