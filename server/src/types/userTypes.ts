import { Request } from 'express';
import { Types } from 'mongoose';
import { WorkspaceMembership } from './workpaceTypes';

export enum UserRole {
  SuperAdmin = 'SuperAdmin',
  Member = 'Member',
  Admin = 'Admin',
}

export interface CustomRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}
export interface responseUser{
   email: string;
    name: string;
    role: "Member" | "Admin" | "SuperAdmin";
    stripeCustomerId?: string;
    currentSubscription?: Types.ObjectId;
    _id?: string;
    title?: string;
    profileImage?: string;
    workspace?: WorkspaceMembership[];
    location?: string;
    imageUrl?: string;
    about?: string;
    phone?: string;
    isAdmin?: boolean;
    isSuperAdmin?: boolean;
    isBlocked?: boolean;
    isDeleted?: boolean;
    isOnline?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
