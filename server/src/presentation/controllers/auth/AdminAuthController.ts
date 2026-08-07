import { Request, Response } from "express";
import { NotFoundError } from "../../../utils/errors";
import { ILoginUseCase } from "../../../application/repositories/admin/ILoginUseCase";
import { inject, injectable } from "tsyringe";
import { HttpStatusCode } from "../../../common/errorCodes";

import { CustomRequest } from "../../types/CustomRequest";

@injectable()
export class AdminAuthController {
  constructor(@inject("ILoginUsesCase") private _loginUseCase: ILoginUseCase) { }

  async LoginUsesCase(req: CustomRequest,res: Response): Promise<void> {
  
    const userId =  req.user?.id as string
    const response = await this._loginUseCase.execute(userId,req.params.workspaceId);
      res.status(HttpStatusCode.OK).json({ user: response?.user, workspace: response?.workspace, suscribe: response?.suscribe });
  // const input: LoginRequestDTO = req.body as LoginRequestDTO;
  // const response = await this._loginUseCase.execute(input);
    // if (!response) {
    //   throw new NotFoundError("User is found");
    // }
    // setTokensInCookies(res, response.token, response.refreshToken);
    // res.status(HttpStatusCode.OK).json({ user: response.user, workspace: response.workspace, suscribe: response.suscribe });
  }
  async googleAdminAuth(req: Request, res: Response): Promise<void> {

    const { credential } = req.body;
    const response = await this._loginUseCase.googleAuthAdmin(credential);
    if (!response) {
      throw new NotFoundError("User is found");
    }
    
    res.status(HttpStatusCode.OK).json({ user: response.user, workspace: response.workspace, suscribe: response.suscribe });

  }

}
