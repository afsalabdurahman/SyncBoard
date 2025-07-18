import { Request, Response, NextFunction } from "express";
import { NotFoundError } from "../../../utils/errors";
import { ILoginUseCase } from "../../../application/repositories/admin/ILoginUseCase";
import { inject, injectable } from "tsyringe";
import { HttpStatusCode } from "../../../common/errorCodes";

@injectable()
export class AdminAuthController {
  constructor(@inject("ILoginUsesCase") private IloginUseCase: ILoginUseCase) {}

  async LoginUsesCase(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    console.log(req.body, "bodyyyyy");
    let { email, password } = req.body;
    try {
      let { user, workspace }: any = await this.IloginUseCase.execute(
        email,
        password
      );

      if (!user) {
        throw new NotFoundError("user not found");
      }
      res.status(HttpStatusCode.OK).json({ user, workspace });
    } catch (error) {
      next(error);
    }
  }
}
