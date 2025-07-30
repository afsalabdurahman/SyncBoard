import { injectable,inject } from "tsyringe";
import {IRefreshtoken} from "../../../application/repositories/ishared/IRefreshToken"
import { NotFoundError } from "../../../utils/errors";
import { HttpStatusCode } from "../../../common/errorCodes";
import { ResponseMessages } from "../../../common/erroResponse";
import { Request,Response,NextFunction } from "express";
import { setTokensInCookies } from "../../../utils/CookieUtile";
@injectable()
export class sharedController{
    constructor(@inject ("RefreshToken")private refreshTokenUsecase:IRefreshtoken){}

   async generateNewToken( req: Request,
    res: Response,
    next: NextFunction):Promise<void>{
        try {
             const token  = req.cookies.refreshToken;
             console.log(token,req.cookies,"refresh token")
                if (!token) throw new NotFoundError("Token not found")
     let {accessToken,refreshToken}  = await this.refreshTokenUsecase.exceute(token)
     if(!accessToken||!refreshToken) throw new NotFoundError("Tokens are not generated")
        setTokensInCookies(res,accessToken,refreshToken)
      res.status(HttpStatusCode.OK).json({ message: ResponseMessages.SUCCESS })
    }
    catch (error) {
            next(error)
        }
    
        } 

}