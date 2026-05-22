import { Request } from 'express';

export enum UserRole {
  Member = 'Member',
  Admin = 'Admin',
  SuperAdmin = 'SuperAdmin',
}

export interface CustomRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}
