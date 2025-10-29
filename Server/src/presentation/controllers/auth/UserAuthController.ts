import { NextFunction, Request, Response } from "express";

import {
  AdminSignupRequestDTO,
  AdminSignupResponseDTO,
  LoginRequestDTO,
} from "../../../application/dto/AuthDTOs";
import { injectable, inject } from "tsyringe";
import { HttpStatusCode } from "../../../common/errorCodes";
import { setTokensInCookies } from "../../../utils/CookieUtile";
import { IAuth } from "../../../application/repositories/iauth/IAuth";
import { ILogin } from "../../../application/repositories/iauth/ILogin";


@injectable()
export class AuthController {
  constructor(
    @inject("RegisterUseCase") private _registerUseCase: IAuth,
    @inject("LoginUseCase") private _loginUsecase: ILogin,
    
  ) {}

  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const input: AdminSignupRequestDTO = req.body as AdminSignupRequestDTO
      const { user, token, refreshToken }: AdminSignupResponseDTO = await this._registerUseCase.execute(input);

      setTokensInCookies(res, token, refreshToken);

      res.status(201).json({ user: user, token, refreshToken });
    } catch (error) {
      next(error);
    }
  }
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    let input: LoginRequestDTO = req.body as LoginRequestDTO;
    try {
       const responseDTO = await this._loginUsecase.loginUser(input);

    setTokensInCookies(res, responseDTO.token, responseDTO.refreshToken);
    res
      .status(HttpStatusCode.OK)
      .json({ workspace: responseDTO.workspace, user: responseDTO.user });
  
    } catch (error) {
      next(error)
    }
   
    }
}
