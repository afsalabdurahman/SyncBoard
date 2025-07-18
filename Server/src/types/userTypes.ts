import { Request } from 'express';

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
