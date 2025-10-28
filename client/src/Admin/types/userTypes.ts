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
  workspaces?: any[];
  isDelete?:boolean;
  isBlock?:boolean; 
}