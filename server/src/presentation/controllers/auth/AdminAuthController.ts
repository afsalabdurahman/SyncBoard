import { Request, Response } from "express";
import { NotFoundError } from "../../../utils/errors";
import { ILoginUseCase } from "../../../application/repositories/admin/ILoginUseCase";
import { inject, injectable } from "tsyringe";
import { HttpStatusCode } from "../../../common/errorCodes";
import { LoginRequestDTO } from "../../../application/dto/AuthDTOs";
import { setTokensInCookies } from "../../../utils/CookieUtile";

@injectable()
export class AdminAuthController {
  constructor(@inject("ILoginUsesCase") private _loginUseCase: ILoginUseCase) { }

  async LoginUsesCase(req: Request,res: Response): Promise<void> {
  const input: LoginRequestDTO = req.body as LoginRequestDTO;
  const response = await this._loginUseCase.execute(input);
    if (!response) {
      throw new NotFoundError("User is found");
    }
    setTokensInCookies(res, response.token, response.refreshToken);
    res.status(HttpStatusCode.OK).json({ user: response.user, workspace: response.workspace, suscribe: response.suscribe });
  }
  async googleAdminAuth(req: Request, res: Response): Promise<void> {

    const { credential } = req.body;
    const response = await this._loginUseCase.googleAuthAdmin(credential);
    if (!response) {
      throw new NotFoundError("User is found");
    }
    setTokensInCookies(res, response.token, response.refreshToken);
    res.status(HttpStatusCode.OK).json({ user: response.user, workspace: response.workspace, suscribe: response.suscribe });

  }
}
