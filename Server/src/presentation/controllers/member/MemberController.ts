import { HttpStatusCode } from "../../../common/errorCodes";
import { ResponseMessages } from "../../../common/erroResponse";
import { injectable, inject } from "tsyringe";
import { NextFunction, Request, Response } from "express";
import { IUpdateProfileUsecases } from "../../../application/repositories/IUpdateProfile";
import { NotFoundError } from "../../../utils/errors";
import { IChangePasword } from "../../../application/repositories/IChangePassword";
import { IMemberRegister } from "../../../application/repositories/IMemberRegister";
import { setTokensInCookies } from "../../../utils/CookieUtile";
import { IActivity } from "../../../application/repositories/IActivity";
import { MemeberRegisterRequestDTO } from "../../../application/dto/AuthDTOs";
@injectable()
export class MemberController {
  constructor(
    @inject("UpdateProfileUsecase")
    private _updateProfileUsecase: IUpdateProfileUsecases,
    @inject("ChangePasswordUsecase") private _changePasswordUsecase: IChangePasword,
    @inject("MemberRegisterUsecase") private _memberRegisterUsecase: IMemberRegister,
  ) {}

  async updateUserProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      let userId = req.params.id;
      if (!userId || !req.body) {
        throw new NotFoundError("user is not found");
      }
      let updatedData = await this._updateProfileUsecase.execute(
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
      let status = await this._changePasswordUsecase.execute(
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
    const input: MemeberRegisterRequestDTO = {
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
      role: req.body.role,
      title: req.body.title,
      slug: req.body.workspaceSlug,
    };
    try {
      let  response =
        await this._memberRegisterUsecase.execute(input);

      setTokensInCookies(res, response.token, response.refreshToken);
      res
        .status(HttpStatusCode.CREATED)
        .json({ user: response.user, workspace: response.workspace });
    } catch (error) {
      next(error);
    }
  }
  async changeOnlinestatus(userId: string): Promise<void> {
    try {
      await this._updateProfileUsecase.updateOnlineStatus(userId);
    } catch (error) {
      console.log(error);
    }
  }
}
