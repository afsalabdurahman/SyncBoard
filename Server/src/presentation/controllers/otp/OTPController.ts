import { injectable, inject } from "tsyringe";
import { OTPService } from "../../../application/use-cases/otp/SentOtpUsecases";
import { VerifyOtp } from "../../../application/use-cases/otp/VerifyOtpUsecases";
import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../../../common/errorCodes";
import { ResponseMessages } from "../../../common/erroResponse";
import { IOTP } from "../../../application/repositories/IOTP";
import { NotFoundError } from "../../../utils/errors";
import { MailRequestDTO } from "../../../application/dto/MailDTO";
@injectable()
export class OTPController {
  constructor(
    @inject(OTPService) private _otpService: IOTP,
    @inject(VerifyOtp) private _verifyOTPservice: IOTP
  ) {}

  async sendOTP(req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
      console.log(req.body,"body")
      const input :MailRequestDTO = req.body as MailRequestDTO;
      if (!input.email) {
        res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ message: ResponseMessages.NOT_FOUND + "email" });
        return;
      }
if(!this._otpService.sendOTP) throw new NotFoundError("Notfound")
      const otp = await this._otpService.sendOTP(input.email);

      res
        .status(HttpStatusCode.OK)
        .json({ message: ResponseMessages.OTP_SENT });
    } catch (error) {
     next(error)
    }
  }
  async verifyOtp(req: Request, res: Response,next:NextFunction): Promise<any> {
    let input:MailRequestDTO = req.body as MailRequestDTO;

    try {
       if(!input.email || !input.otp) throw new NotFoundError("OTP is Not found")
      if(!this._verifyOTPservice.verifyOTP) throw new NotFoundError("Not found")
      let isTrue = await this._verifyOTPservice.verifyOTP(input.email, input.otp);
   
      if (isTrue) {
        return res
          .status(HttpStatusCode.OK)
          .json({ message: ResponseMessages.OTP_VERIFIED });
      } else {
        return res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ message: ResponseMessages.NOT_FOUND });
      }
    } catch (error) {
      next(error)
    
    }
  }
}
