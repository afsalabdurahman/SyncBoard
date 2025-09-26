import { NextFunction, Request, Response } from "express";

import {
  AdminSignupRequestDTO,
  AdminSignupResponseDTO,
  LoginRequestDTO,
} from "../../../application/dto/AuthDTOs";
import { injectable, inject } from "tsyringe";
import { HttpStatusCode } from "../../../common/errorCodes";
import { ResponseMessages } from "../../../common/erroResponse";
import { ValidationError } from "../../../utils/errors";
import { setTokensInCookies } from "../../../utils/CookieUtile";
import { IAuth } from "../../../application/repositories/iauth/IAuth";
import { ILogin } from "../../../application/repositories/iauth/ILogin";
import { IWorkspace } from "../../../application/repositories/iworkspace/IWorkspace";

@injectable()
export class AuthController {
  constructor(
    @inject("RegisterUseCase") private _registerUseCase: IAuth,
    @inject("LoginUseCase") private _loginUsecase: ILogin,
    @inject("Workspaceuse")
    private _CreateWorkspaceUsecases: IWorkspace
  ) {}

  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const input: AdminSignupRequestDTO = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: "Admin",
      };

      if (
        !input.email ||
        !input.email.includes("@") ||
        !input.password ||
        input.password.length < 6 ||
        !input.name
      ) {
        throw new ValidationError("Invalid user name or password");
      }
      const { user, token, refreshToken }: AdminSignupResponseDTO =
        await this._registerUseCase.execute(input);

      setTokensInCookies(res, token, refreshToken);

      res.status(201).json({ user: user, token, refreshToken });
    } catch (error) {
      next(error);
    }
  }
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    let input: LoginRequestDTO = {
      email: req.body.email,
      password: req.body.password,
    };
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
