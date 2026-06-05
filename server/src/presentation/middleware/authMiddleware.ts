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



export const authMiddelware = () => {

  return async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    const authService = container.resolve(AuthService)
    const getUserUseCase = container.resolve(GetUserUseCase)
    const workspaceUsecse = container.resolve(CreateWorkspaceUsecases)
    const userRepository = container.resolve(UserMongooseRepository)
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
      throw new AuthenticationError('No token Provided')
      // throw next(new AuthenticationError('No token provided'));
    }
const workspaceId= req.params.workspaceId as string

    try {
      const decoded = await authService.verifyAccessToken(accessToken)
      console.log(decoded,"DECOEDE")
      if (!decoded.userId || !decoded.role) {
        throw new AuthenticationError('Invalid token payload');
      }
      
      const role = decoded.role as UserRole;
      if (!Object.values(UserRole).includes(role)) {
        throw new AuthenticationError('Invalid user role');
      }
      const user: User | null = await getUserUseCase.execute(decoded.userId);
      console.log(user,"User IN middlew")
      if (user?.isSuperAdmin) {
        req.user = { id: decoded.userId, role };
        return next()
      }


      if (!user) {
        throw new ForbiddenError('User not found');
      }
      console.log(workspaceId,"WORKSPCEIDD")
const workspaceObjectId = stringToMongoObj(workspaceId);
      // const isWorkspaceMember = user.workspace?.some((membership) =>
       
      //   membership.workspaceId.toString() === workspaceObjectId.toString()
      // );
      console.log(workspaceObjectId,"MEMSBER >>>???")
      if (!workspaceObjectId) {
        throw new ForbiddenError(ResponseMessages.NO_CONTENT);
      }
    const workspaceData = await workspaceUsecse.findWorkspace(workspaceObjectId);
    console.log(workspaceData,"DATA")
   if(workspaceData?.status == "InActive"){
    throw  new ForbiddenError('Workspace is Suspended')
   }
  const memberStatus = workspaceData?.members.find(
  (member) => member.userId.toString() === user._id?.toString()
);
if(memberStatus?.isBlocked || memberStatus?.isBlocked){
 throw new ForbiddenError(ResponseMessages.NO_CONTENT);
}
   console.log(memberStatus,"999")
      // if (!user.workspace || user.workspace.length === 0) {
      //   throw new ForbiddenError(ResponseMessages.NO_CONTENT);
      // }
      // const workspaceId = user.workspace[0].workspaceId;

      // if (!workspaceId) throw new NotFoundError(ResponseMessages.NO_CONTENT)
      // const workspace = await workspaceUsecse.findWorkspace(workspaceId);
      // if (workspace?.status.toLowerCase() == "suspend") {
      //  throw new ForbiddenError('Workspace is Suspended')
      // }

      // if (user.isBlocked) {
      //   await userRepository.changeOnlineStatus(stringToMongoObj(user._id ?? ""))
      //   throw new ForbiddenError('User is blocked');
      // }
      // if (user.isDeleted) {
      //   await userRepository.changeOnlineStatus(stringToMongoObj(user._id ?? ""))
      //   throw new ForbiddenError('User is removed');

      // }
      req.user = { id: decoded.userId, role };
      next();

    } catch (error) {

      next(error)
    }
  }

};