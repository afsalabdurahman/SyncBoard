import { injectable,inject } from "tsyringe";
import {IRefreshtoken} from "../../../application/repositories/ishared/IRefreshToken"
import { AuthenticationError, NotFoundError } from "../../../utils/errors";
import { HttpStatusCode } from "../../../common/errorCodes";
import { ResponseMessages } from "../../../common/erroResponse";
import { Request,Response,NextFunction } from "express";
import { setTokensInCookies } from "../../../utils/CookieUtile";
@injectable()
export class sharedController{
    constructor(@inject ("RefreshToken")private _refreshTokenUsecase:IRefreshtoken){}

   async generateNewToken( req: Request,
    res: Response,
    next: NextFunction):Promise<void>{
        try {
          console.log("calling refreshtoken.....")
             const token  = req.cookies.refreshToken;
               console.log(token,"YTOKEN EXPIRED IS WORKOIGNGG")
                if (!token) throw new AuthenticationError("Token not found")
     const {accessToken,refreshToken}  = await this._refreshTokenUsecase.exceute(token)
     if(!accessToken||!refreshToken) throw new NotFoundError("Tokens are not generated")
       
      setTokensInCookies(res,accessToken,refreshToken)
      res.status(HttpStatusCode.OK).json({ message: ResponseMessages.SUCCESS })
    }
    catch (error) {
            next(error)
        }
    
        } 

}