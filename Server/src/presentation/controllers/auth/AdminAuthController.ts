import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../../../utils/errors";
import { ILoginUseCase } from "../../../application/repositories/admin/ILoginUseCase";
import { inject, injectable } from "tsyringe";
import { HttpStatusCode } from "../../../common/errorCodes";
import { LoginRequestDTO } from "../../../application/dto/AuthDTOs";

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
      let { user, workspace,suscribe }: any = await this._loginUseCase.execute(
        input
      );

      if (!user) {
        throw new NotFoundError("user not found");
      }
      res.status(HttpStatusCode.OK).json({ user, workspace,suscribe });
    } catch (error) {
      next(error);
    }
  }
}
