import { injectable, inject } from "tsyringe";
import { OTPService } from "../../../application/use-cases/otp/SentOtpUsecases";
import { VerifyOtp } from "../../../application/use-cases/otp/VerifyOtpUsecases";
import { Request, Response } from "express";
import { HttpStatusCode } from "../../../common/errorCodes";
import { ResponseMessages } from "../../../common/erroResponse";
@injectable()
export class OTPController {
  constructor(
    @inject(OTPService) private otpService: OTPService,
    @inject(VerifyOtp) private verifyOTPservice: VerifyOtp
  ) {}

  async sendOTP(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      if (!email) {
        res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ message: ResponseMessages.NOT_FOUND + "email" });
        return;
      }

      const otp = await this.otpService.sendOTP(email);

      res
        .status(HttpStatusCode.OK)
        .json({ message: ResponseMessages.OTP_SENT });
    } catch (error) {
      res.status(500).json({ error: "Failed to send OTP" });
    }
  }
  async verifyOtp(req: Request, res: Response): Promise<any> {
    let { email, otp } = req.body;
    console.log(req.body, "body");
    try {
      let isTrue = await this.verifyOTPservice.verifyOTP(email, otp);
      console.log(isTrue);
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
      return res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ message: ResponseMessages.INTERNAL_SERVER_ERROR });
      console.log(error, "errr");
    }
  }
}
