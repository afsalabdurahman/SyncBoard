import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../../../utils/errors";
import { ILoginUseCase } from "../../../application/repositories/admin/ILoginUseCase";
import { inject, injectable } from "tsyringe";
import { HttpStatusCode } from "../../../common/errorCodes";

@injectable()
export class AdminAuthController {
  constructor(@inject("ILoginUsesCase") private loginUseCase: ILoginUseCase) {}

  async LoginUsesCase(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {

    let { email, password } = req.body;
    try {
      let { user, workspace,suscribe }: any = await this.loginUseCase.execute(
        email,
        password
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
