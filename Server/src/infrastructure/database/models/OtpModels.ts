import {Schema,Document, model} from "mongoose"
interface IOTP extends Document {
email:string;
otp:string;
createAt:Date;
expAt:Date;
}

const OTPschema:Schema<IOTP> = new Schema({
email:{type:String,required:true},
otp:{type:String,required:true},
createAt:{type:Date,default:Date.now},
expAt:{type:Date,required:true}


})

OTPschema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OTPModel = model<IOTP>("OTP",OTPschema) 