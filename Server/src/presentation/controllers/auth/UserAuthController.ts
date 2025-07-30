import { NextFunction, Request, Response } from "express";
import {
  RegisterUseCase,
  RegisterInput,
} from "../../../application/use-cases/auth/admin/RegisterUsecase";
import { LoginUsecase } from "../../../application/use-cases/auth/member/LoginUsecase";
import { injectable, inject } from "tsyringe";
import { HttpStatusCode } from "../../../common/errorCodes";
import { ResponseMessages } from "../../../common/erroResponse";
import { NotFoundError, ValidationError } from "../../../utils/errors";
import {setTokensInCookies} from "../../../utils/CookieUtile"
import { CreateWorkspaceUsecases } from "../../../application/use-cases/workspace/CreateWorkspaceUsecase";
@injectable()
export class AuthController {
  constructor(
    @inject("RegisterUseCase") private registerUseCase: RegisterUseCase,
    @inject("LoginUseCase") private loginUsecase: LoginUsecase,
    @inject("Workspaceuse")
    private CreateWorkspaceUsecases: CreateWorkspaceUsecases
    // @inject('')
  ) {}

  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const input: RegisterInput = req.body;
      if (
        !input.email ||
        !input.email.includes("@") ||
        !input.password ||
        input.password.length < 6 ||
        !input.name
      ) {
        throw new ValidationError("Invalid user name or password");
      }
      const { user, token, refreshToken } = await this.registerUseCase.execute(input);
      console.log(user, "userss");
setTokensInCookies(res,token,refreshToken)
      
      res.status(201).json({ user: user, token, refreshToken });
    } catch (error) {
      next(error);
    }
  }
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log(req);
    let { email, password } = req.body;
    console.log(email, password, "pasw+email");
    const isValid = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9]).{5,}$/;
    try {
      if (!email || !password || !isValid.test(password)) {
        throw new ValidationError("Invalid user name or password");
      }
      let { user, token, refreshToken }: any = await this.loginUsecase.loginUser(email, password);
     

      let workspaceData: any = await this.CreateWorkspaceUsecases.findWorkspace(
        user.workspace[0].workspaceId
      );
  setTokensInCookies(res,token,refreshToken)
      res
        .status(HttpStatusCode.OK)
        .json({ workspaceData, user, token, refreshToken });
    } catch (error) {
      next(error);
    }
  }
}
