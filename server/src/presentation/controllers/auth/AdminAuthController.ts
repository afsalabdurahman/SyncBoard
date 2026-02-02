import { Request, Response, NextFunction, response } from "express";
import { NotFoundError } from "../../../utils/errors";
import { ILoginUseCase } from "../../../application/repositories/admin/ILoginUseCase";
import { inject, injectable } from "tsyringe";
import { HttpStatusCode } from "../../../common/errorCodes";
import { adminResponseDTO, LoginRequestDTO } from "../../../application/dto/AuthDTOs";
import { setTokensInCookies } from "../../../utils/CookieUtile";

@injectable()
export class AdminAuthController {
  constructor(@inject("ILoginUsesCase") private _loginUseCase: ILoginUseCase) {}

  async LoginUsesCase(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {

    let input:LoginRequestDTO = req.body as LoginRequestDTO;
    try {
      let response= await this._loginUseCase.execute(input );

      if (!response) {
        throw new NotFoundError("User is found");
      }
        setTokensInCookies(res, response.token, response.refreshToken);
      res.status(HttpStatusCode.OK).json({ user:response.user, workspace:response.workspace,suscribe:response.suscribe });
    } catch (error) {
      next(error);
    }
  }
}
