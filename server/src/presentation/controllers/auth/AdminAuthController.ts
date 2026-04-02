import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../../../utils/errors";
import { ILoginUseCase } from "../../../application/repositories/admin/ILoginUseCase";
import { inject, injectable } from "tsyringe";
import { HttpStatusCode } from "../../../common/errorCodes";
import {  LoginRequestDTO } from "../../../application/dto/AuthDTOs";
import { setTokensInCookies } from "../../../utils/CookieUtile";

@injectable()
export class AdminAuthController {
  constructor(@inject("ILoginUsesCase") private _loginUseCase: ILoginUseCase) {}

  async LoginUsesCase(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {

    const input:LoginRequestDTO = req.body as LoginRequestDTO;
    try {
      const response= await this._loginUseCase.execute(input );

      if (!response) {
        throw new NotFoundError("User is found");
      }
        setTokensInCookies(res, response.token, response.refreshToken);
      res.status(HttpStatusCode.OK).json({ user:response.user, workspace:response.workspace,suscribe:response.suscribe });
    } catch (error) {
      next(error);
    }
  }
  async googleAdminAuth(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {
      console.log(req.body,"BODYYYY");
       const { credential } = req.body;
       const response = await this._loginUseCase.googleAuthAdmin(credential);
         if (!response) {
        throw new NotFoundError("User is found");
      }
       setTokensInCookies(res, response.token, response.refreshToken);
        res.status(HttpStatusCode.OK).json({ user:response.user, workspace:response.workspace,suscribe:response.suscribe });
    } catch (error) {
      next(error)
    }
  }
}
