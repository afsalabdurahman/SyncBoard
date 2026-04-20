import { NextFunction, Request, Response } from "express";
import {
  AdminSignupRequestDTO,
  LoginRequestDTO,
} from "../../../application/dto/AuthDTOs";
import { injectable, inject } from "tsyringe";
import { HttpStatusCode } from "../../../common/errorCodes";
import { removeTokensInCookies, setTokensInCookies } from "../../../utils/CookieUtile";
import { IAuth } from "../../../application/repositories/iauth/IAuth";
import { ILogin } from "../../../application/repositories/iauth/ILogin";
import { ResponseMessages } from "../../../common/erroResponse";
import { CustomRequest } from "../../types/CustomRequest";
import { ForbiddenError } from "../../../utils/errors";

@injectable()
export class AuthController {
  constructor(
    @inject("RegisterUseCase") private _registerUseCase: IAuth,
    @inject("LoginUseCase") private _loginUsecase: ILogin) {}

  async register(
    req: Request,
    res: Response,
    next: NextFunction): Promise<void> {
    try {
      const input: AdminSignupRequestDTO = req.body as AdminSignupRequestDTO
      console.log("is calling.. IVNVYTE link")
      const  user = await this._registerUseCase.execute(input);
console.log(user,"userssCONTROLL")
      // setTokensInCookies(res, token, refreshToken);

      res.status(HttpStatusCode.CREATED).json({ user: user });
    } catch (error) {
      console.log(error,"INCONTROLLER")
      next(error);
    }
  }
  async login(req: Request, res: Response, ): Promise<void> {
    const input: LoginRequestDTO = req.body as LoginRequestDTO;
    
       const {token,refreshToken,user,workspace} = await this._loginUsecase.loginUser(input);

    setTokensInCookies(res, token, refreshToken);
    res
      .status(HttpStatusCode.OK)
      .json({ workspace: workspace, user: user });
  
  
   
    }
     async logout(req: Request, res: Response, ): Promise<void> {
 
       const userId=req.params.id
         await this._loginUsecase.logoutUser(userId)
          removeTokensInCookies(res)
          res.status(HttpStatusCode.NO_CONTENT).json({message:ResponseMessages.LOGGED_OUT})
 
    }
    async authMe(req:CustomRequest,res:Response):Promise<void>{
     
    
    console.log(req.user,"auth USER calling....")
    if(!req.user){throw new ForbiddenError("User not found")}
        res.status(200).json({
    user: req?.user?.id,
    })
    
}
async googleAuth(req:Request,res:Response):Promise<void>{
  const { credential } = req.body;

 
  const  {workspace,savedUser,token,refreshToken}=await this._registerUseCase.googleAuth(credential);
  if(workspace){
        setTokensInCookies(res, token, refreshToken);
    res.status(HttpStatusCode.OK).json({workspace,savedUser})
  }else{
        setTokensInCookies(res, token, refreshToken);
    res.status(HttpStatusCode.CREATED).json({savedUser})
  }
  
 
}
}
