import { HttpStatusCode } from "../../../common/errorCodes";
import { ResponseMessages } from "../../../common/erroResponse";
import { injectable, inject } from "tsyringe";
import { NextFunction, Request, Response } from "express";
import { IUpdateProfileUsecases } from "../../../application/repositories/IUpdateProfile";
import { ConflictError, NotFoundError } from "../../../utils/errors";
import { IChangePasword } from "../../../application/repositories/IChangePassword";
import { IMemberRegister } from "../../../application/repositories/IMemberRegister";
import { setTokensInCookies } from "../../../utils/CookieUtile";
import { MemeberRegisterRequestDTO } from "../../../application/dto/AuthDTOs";
import { IUserUsecase } from "../../../application/repositories/IUser";
import { UserMapper } from "../../../application/mappers/UserMapper";
@injectable()
export class MemberController {
  constructor(
    @inject("UpdateProfileUsecase")
    private _updateProfileUsecase: IUpdateProfileUsecases,
    @inject("ChangePasswordUsecase") private _changePasswordUsecase: IChangePasword,
    @inject("MemberRegisterUsecase") private _memberRegisterUsecase: IMemberRegister,
    @inject("GetUserUsecase") private _getUserUsecase: IUserUsecase
  ) { }

  async updateUserProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.params.id;
      const updatedData = await this._updateProfileUsecase.execute(
        userId,
        req.body
      );

      res
        .status(HttpStatusCode.CREATED)
        .json({ message: ResponseMessages.SUCCESS, updatedData });
    } catch (error) {
      next(error)
    }
  }

  async changeUserPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const { currentPassword, newPassword } = req.body;
    const userId = req.params.id;

    try {
      if (!currentPassword || !newPassword) {
        throw new NotFoundError("filed is emty please enter");
      }
      await this._changePasswordUsecase.execute(
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
      const response =
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
    } catch  {
      throw new ConflictError("Updation failed")
    }
  }
  async findUserByEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const email = req.params.email;
  
      const userDocument = await this._getUserUsecase.findUserByEmail(email);;
      const user = UserMapper.userResponseDTO(userDocument)
      res.status(HttpStatusCode.OK).json({ user })
    } catch (error) {
      next(error)
    }
  }

}
