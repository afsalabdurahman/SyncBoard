import { HttpStatusCode } from "../../../common/errorCodes";
import { ResponseMessages } from "../../../common/erroResponse";
import { injectable, inject } from "tsyringe";
import {  Request, Response } from "express";
import { IUpdateProfileUsecases } from "../../../application/repositories/IUpdateProfile";
import { NotFoundError } from "../../../utils/errors";
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
  ): Promise<void> {
    const userId = req.params.id;
    const updatedData = await this._updateProfileUsecase.execute(
      userId,
      req.body
    );
    res
      .status(HttpStatusCode.CREATED)
      .json({ message: ResponseMessages.SUCCESS, updatedData });
  }

  async changeUserPassword(
    req: Request,
    res: Response,
  ): Promise<void> {
    const { currentPassword, newPassword } = req.body;
    const userId = req.params.id;
    if (!currentPassword || !newPassword) {
      throw new NotFoundError("filed is emty please enter");
    }
    await this._changePasswordUsecase.execute(
      userId,
      currentPassword,
      newPassword
    );
    res.status(HttpStatusCode.OK).json(ResponseMessages.SUCCESS);
  }
  async inviteAndRegister(
    req: Request,
    res: Response,
  ): Promise<void> {
    const input: MemeberRegisterRequestDTO = {
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
      role: req.body.role,
      title: req.body.title,
      slug: req.body.workspaceSlug,
    };


    const response = await this._memberRegisterUsecase.execute(input);
    setTokensInCookies(res, response.token, response.refreshToken);
    res
      .status(HttpStatusCode.CREATED)
      .json({ user: response.user, workspace: response.workspace });
  }
  async changeOnlinestatus(userId: string): Promise<void> {
  await this._updateProfileUsecase.updateOnlineStatus(userId);

  }

  async findUserByEmail(req: Request, res: Response,): Promise<void> {

    const email = req.params.email;
    const userDocument = await this._getUserUsecase.findUserByEmail(email);;
    const user = UserMapper.userResponseDTO(userDocument)
    res.status(HttpStatusCode.OK).json({ user })
  }

  async resetPassword(req: Request): Promise<void> {
    const userId = req.params.id;
    const password = req.body.password;
    await this._changePasswordUsecase.resetPassword(userId, password)
  }
}
