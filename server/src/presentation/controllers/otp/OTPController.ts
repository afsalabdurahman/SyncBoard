import { injectable, inject } from "tsyringe";
import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../../../common/errorCodes";
import { ResponseMessages } from "../../../common/erroResponse";
import { IOTP } from "../../../application/repositories/IOTP";
import { MailRequestDTO } from "../../../application/dto/MailDTO";
@injectable()
export class OTPController {
  constructor(
    @inject("OTPService") private _otpServiceUsecase: IOTP,
  ) {}

  async sendOTP(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const input: MailRequestDTO = req.body as MailRequestDTO;
      await this._otpServiceUsecase.sendOTP(input)
      res.status(HttpStatusCode.OK).json({ message: ResponseMessages.OTP_SENT })
    } catch (error) {
      next(error)
    }
  }
  async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    let input: MailRequestDTO = req.body as MailRequestDTO;

    try {
       await this._otpServiceUsecase.verifyOTP(input)
      res.status(HttpStatusCode.OK).json({ message: ResponseMessages.OTP_VERIFIED })
    }
    catch (error) {
      next(error)

    }
  }
}
