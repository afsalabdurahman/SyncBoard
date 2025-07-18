// import { Request, Response, NextFunction } from "express";
// import {AuthenticationError,ForbiddenError} from "../../utils/errors";
// import { ResponseMessages } from "../../common/erroResponse";
// import { HttpStatusCode } from "../../common/errorCodes";
// import {AuthService} from "../../infrastructure/services/AuthService"
// import {UserMongooseRepository} from "../../infrastructure/repositories/UserRepository"
// import { RegisterUseCase } from "../../application/use-cases/auth/admin/RegisterUsecase";
// import { container } from "tsyringe";
// import {IUserRepository} from "../../domain/interfaces/repositories/IUserRepository"
// import {CustomRequest,UserRole} from"../types/CustomRequest"
// import { GetUserUseCase } from "../../application/use-cases/user/GetUserUsecase";
// import { User } from "../../domain/entities/User";




// export const authMiddelware = () => {
// async return (req:CustomRequest,res:Response,next:NextFunction):Promise<void>=>{
//     let authService= container.resolve(AuthService) 
//     let getUserUseCase=container.resolve(GetUserUseCase)
//     const accessToken = req.cookies.accessToken;
// if (!accessToken) {
//       throw next(new AuthenticationError('No token provided'));
//     }

//     try {
//         let decoded=await authService.verifyAccessToken(accessToken)
//          if (!decoded.userId || !decoded.role) {
//         throw new AuthenticationError('Invalid token payload');
//       }
//       const role = decoded.role as UserRole;
//       if (!Object.values(UserRole).includes(role)) {
//         throw new AuthenticationError('Invalid user role');
//       }
//       const user:User|null = await getUserUseCase.execute(decoded.userId);
//         if (!user) {
//         throw new AuthenticationError('User not found');
//       }
//        if (user.isBlock) {
//         throw new ForbiddenError('User is blocked');
//       }
//             req.user = { id: decoded.userId, role };
//       next();
      
//     } catch (error) {
//         next(error)
//     }
// }

// };
