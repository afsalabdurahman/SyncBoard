import {IAuthService} from "../../domain/interfaces/services/IAuthService"
import { injectable } from 'tsyringe';
import * as bcrypt from 'bcrypt';
import { envConfig } from "../config/env.config";
import * as jwt from 'jsonwebtoken';
@injectable()
export class AuthService implements IAuthService {
 private ACCESS_TOKEN_SECRET=envConfig.JWT_SECRET
 private REFRESH_TOKEN_SECRET=envConfig.JWT_SECRET

 async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
  async comparePassword (password: string, hashedPassword: string): Promise<boolean> {
    console.log(password,hashedPassword,"fromdalt OOO")
  return await bcrypt.compare(password,hashedPassword);
};

 generateToken(user: { id:string, email: string; role: string }): string {
  console.log(user,"user@from token")
    return jwt.sign(

      {userId:user.id, email: user.email, role: user.role },
       this.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
  }
  generateRefreshToken(user: { id: string; email: string; role: string; }): string {
    return jwt.sign(
      { userId:user.id,email: user.email, role: user.role },
      this.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
  }
  //hide
  verifyAccessToken(token: string): { userId: string; role: string; } {
     return jwt.verify(token, this.ACCESS_TOKEN_SECRET) as {
      userId: string;
      role: string;
    };
  }
    verifyRefreshToken(token: string): { userId: string; role: string } {
    return jwt.verify(token, this.REFRESH_TOKEN_SECRET) as {
      userId: string;
      role: string;
    };
  }
}