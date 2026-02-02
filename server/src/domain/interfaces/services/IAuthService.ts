export interface IAuthService {
  hashPassword(password: string): Promise<string>;
  comparePassword(password:string,hashedPassword:string) :Promise<boolean>;
  generateToken(user: { id: string; email: string; role: string }): string;
  generateRefreshToken(user:{id:string;email:string;role:string;}):string;
    verifyAccessToken?(token: string): { userId: string; role: string };
  verifyRefreshToken?(token: string): { userId: string; role: string };
}