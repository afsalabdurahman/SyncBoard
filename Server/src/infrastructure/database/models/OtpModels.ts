import {Schema,Document, model} from "mongoose"
interface OTPDocument extends Document {
email:string;
otp:string;
createAt:Date;
expAt:Date;
}

const OTPschema:Schema<OTPDocument> = new Schema({
email:{type:String,required:true},
otp:{type:String,required:true},
createAt:{type:Date,default:Date.now},
expAt:{type:Date,required:true}


})

OTPschema.index({ expAt: 1 }, { expireAfterSeconds: 300 });

export const OTPModel = model<OTPDocument>("OTP",OTPschema) 