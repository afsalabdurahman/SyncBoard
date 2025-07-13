export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  role?: 'Member' | 'Admin' | 'SuperAdmin';
}