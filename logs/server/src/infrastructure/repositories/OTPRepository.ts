import { injectable } from "tsyringe";
import { IOtpRepository } from "../../domain/interfaces/repositories/IOtpRepository";
import { OTP } from "../../domain/entities/Otp";
import { OTPModel } from "../database/models/OtpModels";
@injectable()
export class OTPRepository implements IOtpRepository {
  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async save(entity: OTP): Promise<void> {

    const document = new OTPModel({
      email: entity.email,
      otp: entity.otp,
      expAt: entity.expireAt,
    });
     await document.save();


    //    OTPModel.create()
    return Promise.resolve();
  }
  async findOTPbyEMAIL(email: string): Promise<OTP|null> {
    const otp = await OTPModel.findOne({ email }).sort({ createAt: -1 }).lean().exec()
    if(!otp) return null
   return  new OTP(otp.email,otp.otp)
   
  }
async deleteOTP(email: string): Promise<boolean> {
  const isDeleted=await OTPModel.deleteOne({email:email})
  if (isDeleted.deletedCount === 1) {
    return true
}else{
  return false
}
}

}
