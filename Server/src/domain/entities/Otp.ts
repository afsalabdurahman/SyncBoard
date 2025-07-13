export class OTP{
  email:string;
  otp:string;
  createdAt?:Date;
  expireAt:Date;
    constructor(email:string,otp:string,TTL=5){
      this.email=email;
      this.otp=otp;
      this.createdAt=new Date();
      this.expireAt = new Date(this.createdAt.getTime()+TTL*60*100)

    }

isExpired():boolean{
  return new Date() > this.expireAt
}

}