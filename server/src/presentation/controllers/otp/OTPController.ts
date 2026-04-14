import { injectable, inject } from "tsyringe";
import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../../../common/errorCodes";
import { ResponseMessages } from "../../../common/erroResponse";
import { IOTP } from "../../../application/repositories/IOTP";
import { MailRequestDTO } from "../../../application/dto/MailDTO";
import { setTokensInCookies } from "../../../utils/CookieUtile";
import {  AdminSignupResponseDTO } from "../../../application/dto/AuthDTOs";
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
    const input: MailRequestDTO = req.body as MailRequestDTO;

    try {
     const { user, token, refreshToken }:AdminSignupResponseDTO = await this._otpServiceUsecase.verifyOTP(input)
      setTokensInCookies(res, token, refreshToken);
    res.status(HttpStatusCode.CREATED).json({ user: user, token, refreshToken });
    }
    catch (error) {
      next(error)

    }
  }
  async reSendOTP(req:Request,res:Response,next:NextFunction):Promise<void>{
    try {
      const email=req.body.email;
      await this._otpServiceUsecase.reSendOTP(email)
        res.status(HttpStatusCode.OK).json({ message: ResponseMessages.OTP_SENT })
    } catch (error) {
      next(error)
    }
  }
}
