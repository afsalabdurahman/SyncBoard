import { injectable } from "tsyringe";
import { IOtpRepository } from "../../domain/interfaces/repositories/IOtpRepository";
import { OTP } from "../../domain/entities/Otp";
import { OTPModel } from "../database/models/OtpModels";
import { User } from "../../domain/entities/User";
@injectable()
export class OTPRepository implements IOtpRepository {
  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async save(entity: OTP): Promise<void> {
    try {
      let document = new OTPModel({
        email: entity.email,
        otp: entity.otp,
        expAt: entity.expireAt,
      });
      const savedDocument = await document.save();
    } catch (error) {
      console.log(error, "error");
    }

    //    OTPModel.create()
    return Promise.resolve();
  }
  async findByEmail(email: string): Promise<OTP | any> {
   let otp = await OTPModel.findOne({ email }).sort({ createdAt: -1 });


    return otp;
  }
}
