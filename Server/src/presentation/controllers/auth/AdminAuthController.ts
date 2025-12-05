import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../../../utils/errors";
import { ILoginUseCase } from "../../../application/repositories/admin/ILoginUseCase";
import { inject, injectable } from "tsyringe";
import { HttpStatusCode } from "../../../common/errorCodes";
import { LoginRequestDTO } from "../../../application/dto/AuthDTOs";
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
      let { user, workspace,suscribe,token,refreshToken }: any = await this._loginUseCase.execute(input );

      if (!user) {
        throw new NotFoundError("User is found");
      }
        setTokensInCookies(res, token, refreshToken);
      res.status(HttpStatusCode.OK).json({ user, workspace,suscribe });
    } catch (error) {
      next(error);
    }
  }
}
