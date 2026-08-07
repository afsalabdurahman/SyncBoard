import {  Response, NextFunction } from "express";
import { AuthenticationError, ForbiddenError } from "../../utils/errors";

import { AuthService } from "../../infrastructure/services/AuthService"
import { container } from "tsyringe";
import { CustomRequest, UserRole } from "../types/CustomRequest"
import { GetUserUseCase } from "../../application/use-cases/user/GetUserUsecase";
import { User } from "../../domain/entities/User";
import { CreateWorkspaceUsecases } from "../../application/use-cases/workspace/CreateWorkspaceUsecase"
import { stringToMongoObj } from "../../utils/convertMongoObject";
import { ResponseMessages } from "../../common/erroResponse";



export const authMiddelware = () => {

  return async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    const authService = container.resolve(AuthService)
    const getUserUseCase = container.resolve(GetUserUseCase)
    const workspaceUsecse = container.resolve(CreateWorkspaceUsecases)
    
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      throw new AuthenticationError('No token Provided')
      // throw next(new AuthenticationError('No token provided'));
    }
const workspaceId= req.params.workspaceId as string

    try {
      const decoded = await authService.verifyAccessToken(accessToken)
      
      if (!decoded.userId || !decoded.role) {
        throw new AuthenticationError('Invalid token payload');
      }
      
      const role = decoded.role as UserRole;
      if (!Object.values(UserRole).includes(role)) {
        throw new AuthenticationError('Invalid user role');
      }
      const user: User | null = await getUserUseCase.execute(decoded.userId);
      
      if (user?.isSuperAdmin) {
        req.user = { id: decoded.userId, role };
        return next()
      }


      if (!user||user.isSuspend) {
        throw new ForbiddenError('User not found');
      }
      
const workspaceObjectId = stringToMongoObj(workspaceId);
      // const isWorkspaceMember = user.workspace?.some((membership) =>
       
      //   membership.workspaceId.toString() === workspaceObjectId.toString()
      // );
      
      if (!workspaceObjectId) {
        throw new ForbiddenError(ResponseMessages.NO_CONTENT);
      }
    const workspaceData = await workspaceUsecse.findWorkspace(workspaceObjectId);
  
   if(workspaceData?.status == "Suspend"){
    throw  new ForbiddenError('Workspace is Suspend')
   }
  const memberStatus = workspaceData?.members.find(
  (member) => member.userId.toString() === user._id?.toString()
);
if(memberStatus?.isBlocked || memberStatus?.isBlocked){
 throw new ForbiddenError(ResponseMessages.USER_BLOCKED);
}
   
      req.user = { id: decoded.userId, role };
      next();

    } catch (error) {

      next(error)
    }
  }

};