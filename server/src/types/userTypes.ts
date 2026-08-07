import { Request } from 'express';
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

    _id?: string;
  
    profileImage?: string;
    workspace?: WorkspaceMembership[];
    location?: string;
    imageUrl?: string;
    about?: string;
    phone?: string;
   
    isSuperAdmin?: boolean;
  
    createdAt?: Date;
    updatedAt?: Date;
}
