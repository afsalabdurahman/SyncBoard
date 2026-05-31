import {  Response, NextFunction } from "express";
import { AuthenticationError, ForbiddenError, NotFoundError } from "../../utils/errors";

import { AuthService } from "../../infrastructure/services/AuthService"
import { container } from "tsyringe";
import { CustomRequest, UserRole } from "../types/CustomRequest"
import { GetUserUseCase } from "../../application/use-cases/user/GetUserUsecase";
import { User } from "../../domain/entities/User";
import { CreateWorkspaceUsecases } from "../../application/use-cases/workspace/CreateWorkspaceUsecase"
import { stringToMongoObj } from "../../utils/convertMongoObject";
import { ResponseMessages } from "../../common/erroResponse";
import { UserMongooseRepository } from "../../infrastructure/repositories/UserRepository";
import { decode } from "punycode";



export const authMiddelware = () => {

  return async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    const authService = container.resolve(AuthService)
    const getUserUseCase = container.resolve(GetUserUseCase)
    const workspaceUsecse = container.resolve(CreateWorkspaceUsecases)
    const userRepository = container.resolve(UserMongooseRepository)
    const accessToken = req.cookies.accessToken;
    console.log(accessToken,"TIPOOEKN")
    if (!accessToken) {
      throw new AuthenticationError('No token Provided')
      // throw next(new AuthenticationError('No token provided'));
    }

    try {
      const decoded = await authService.verifyAccessToken(accessToken)
      if (!decoded.userId || !decoded.role) {
        throw new AuthenticationError('Invalid token payload');
      }
     
const {userId,role}:{userId:string,role:UserRole}=decoded
      console.log(userId,role,"ROLE+++USERID")


const isValidRole = Object.values(UserRole).includes(role as UserRole);
      console.log(isValidRole,"vLaidROLE")
      if (!isValidRole) {
        throw new AuthenticationError('Invalid user role');
      }


console.log(req.params,"PARSAA")
const workspaceId =req.params.workspaceid
    req.user={role:decoded.role,userId:decoded.userId}
     console.log(workspaceId,"workspaceId")
   if (!workspaceId) throw new NotFoundError(ResponseMessages.NO_CONTENT)
      // const workspaceId = user.workspace[0].workspaceId;
const userStatus = await workspaceUsecse.workspaceUserStatus(stringToMongoObj(workspaceId),stringToMongoObj(userId))
    console.log(userStatus,"FFFFFFFFF")


      const workspace = await workspaceUsecse.findWorkspace(stringToMongoObj(workspaceId));
      if (workspace?.status.toLowerCase() == "suspend") {
       throw new ForbiddenError('Workspace is Suspended')
      }

    
    
     
      next();

    } catch (error) {

      next(error)
    }
  }

};
