import { HttpStatusCode } from "../../../common/errorCodes";
import { ResponseMessages } from "../../../common/erroResponse";
import { injectable, inject } from "tsyringe";

import { NextFunction, Request, Response } from "express";
import { IUpdateProfileUsecases } from "../../../application/repositories/IUpdateProfile";
import { NotFoundError, InternalServerError } from "../../../utils/errors";
import { IChangePasword } from "../../../application/repositories/IChangePassword";
import { IMemberRegister } from "../../../application/repositories/IMemberRegister";
@injectable()
export class MemberController {
  constructor(
    @inject("UpdateProfileUsecase")
    private updateProfileUsecase: IUpdateProfileUsecases,
    @inject("ChangePasswordUsecase") private changePassword: IChangePasword,
    @inject("MemberRegisterUsecase") private memberRegister: IMemberRegister
  ) {}

  async updateUserProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      let userId = req.params.id;
      console.log(userId, req.params, "userId from @controler", req.params, req.body,"$$$$$$$$$$");
      if (!userId || !req.body) {
        throw new NotFoundError("user is not found");
      }
      let updatedData = await this.updateProfileUsecase.execute(
        userId,
        req.body
      );
      res
        .status(HttpStatusCode.CREATED)
        .json({ message: ResponseMessages.SUCCESS, updatedData });
    } catch (error) {
      throw error;
    }
  }

  async changeUserPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    let { currentPassword, newPassword } = req.body;
    let userId = req.params.id;

    try {
      if (!currentPassword || !newPassword) {
        throw new NotFoundError("filed is emty please enter");
      }
      let status = await this.changePassword.execute(
        userId,
        currentPassword,
        newPassword
      );
      res.status(HttpStatusCode.OK).json(ResponseMessages.SUCCESS);
    } catch (error) {
      next(error);
    }
  }
  async inviteAndRegister(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    console.log(req.body, "invitaion from mener");
    let { name, email, password, workspaceSlug, title, role } = req.body;
    try {
      let {createMember,insertToWorkspce}:any = await this.memberRegister.execute(
        name,
        email,
        password,
        workspaceSlug,
        title,
        role
      );
      res.status(HttpStatusCode.CREATED).json({user:createMember,workspace:insertToWorkspce})
    } catch (error) {
      next(error);
    }
  }
}
