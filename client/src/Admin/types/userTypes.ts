export interface WorkspaceMembership {
  workspaceId: string
  role: "Member" | "Admin" | "SuperAdmin";
  joinedAt?: Date;
}

export interface User {
  id?: string;
  name: string;
  email: string;
  role: string;
  isAdmin: boolean;
  imageUrl?: string;
  phone?: string | null;
  location?: string | null;
  status?: string;
  about?: string | null;
  address?: string | null;
  departmant?: string | null;
  workspaces?: WorkspaceMembership[];
  isDelete?:boolean;
  isBlock?:boolean; 
}
export interface userPage {
  _id: string;
  name: string;
  email: string;
  role: string;
  title?: string;
  isBlocked: boolean;
  isDeleted: boolean;
  isAdmin?: boolean;
}
export interface DialogMessage {
  title: string | null;
  description: string | null;
}