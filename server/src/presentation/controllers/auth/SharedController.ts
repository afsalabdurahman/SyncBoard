import { injectable, inject } from "tsyringe";
import { IRefreshtoken } from "../../../application/repositories/ishared/IRefreshToken"
import { NotFoundError } from "../../../utils/errors";
import { HttpStatusCode } from "../../../common/errorCodes";
import { ResponseMessages } from "../../../common/erroResponse";
import { Request, Response } from "express";
import { setTokensInCookies } from "../../../utils/CookieUtile";
@injectable()
export class sharedController {
   constructor(@inject("RefreshToken") private _refreshTokenUsecase: IRefreshtoken) { }

   async generateNewToken(req: Request,
      res: Response,
   ): Promise<void> {
      const token = req.cookies.refreshToken;

      if (!token) throw new NotFoundError("Token not found")
      const { accessToken, refreshToken } = await this._refreshTokenUsecase.exceute(token)
      if (!accessToken || !refreshToken) throw new NotFoundError("Tokens are not generated")
      setTokensInCookies(res, accessToken, refreshToken)
      res.status(HttpStatusCode.OK).json({ message: ResponseMessages.SUCCESS })
   }
}