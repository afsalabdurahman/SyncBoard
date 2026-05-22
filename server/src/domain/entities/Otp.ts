export class OTP {
  email: string;
  otp: string;
  createdAt: Date;
  expAt: Date;

  constructor(email: string, otp: string, TTLMinutes: number = 1) {
    this.email = email;
    this.otp = otp;
    this.createdAt = new Date();
    this.expAt = new Date(this.createdAt.getTime() + TTLMinutes * 60 * 1000);
  }

  // isExpired(): boolean {
  //   return new Date() > this.expAt;
  // }

  // Optional: Helper to create a plain object ready for MongoDB
  // toDocument() {
  //   return {
  //     email: this.email,
  //     otp: this.otp,
  //     createdAt: this.createdAt,
  //     expAt: this.expAt,
  //   };
  // }
}