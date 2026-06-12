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

    try {
      const decoded = await authService.verifyAccessToken(accessToken)
      if (!decoded.userId || !decoded.role) {
        throw new AuthenticationError('Invalid token payload');
      }

      let role: UserRole = decoded.role as UserRole;
      // if (!Object.values(UserRole).includes(role)) {
      //   throw new AuthenticationError('Invalid user role');
      // }
      const user: User | null = await getUserUseCase.execute(decoded.userId);
const status = user?.workspace?.some(
  (workspace) => workspace.permissions === "Admin"
);
if(status){
role = "Admin" as UserRole
}else if(decoded.role=="SuperAdmin"){
  req.user = { id: decoded.userId, role };
        return next()
}

      if (user?.role == "SuperAdmin") {
        req.user = { id: decoded.userId, role };
        return next()

      }
      if (!user) {
        throw new ForbiddenError('User not found');
      }
      if (!user.workspace || user.workspace.length === 0) {
        throw new ForbiddenError(ResponseMessages.NO_CONTENT);
      }
     const workspaceId =
  req.params.workspaceId ??
  req.params.workspaceid ??
  user.workspace?.[0]?.workspaceId.toString();


      if (!workspaceId) throw new NotFoundError(ResponseMessages.NO_CONTENT)
      const workspace = await workspaceUsecse.findWorkspace(stringToMongoObj(workspaceId));
      if (workspace?.status.toLowerCase() == "suspend") {
       throw new ForbiddenError('Workspace is Suspended')
      }

      if (user.isBlocked) {
        await userRepository.changeOnlineStatus(stringToMongoObj(user._id ?? ""))
        throw new ForbiddenError('User is blocked');
      }
      if (user.isDeleted) {
        await userRepository.changeOnlineStatus(stringToMongoObj(user._id ?? ""))
        throw new ForbiddenError('User is removed');

      }
      req.user = { id: decoded.userId, role };
      next();

    } catch (error) {

      next(error)
    }
  }

};
