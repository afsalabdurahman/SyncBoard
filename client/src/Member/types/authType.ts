export interface SignupResponse {
  
  success: boolean;
  message: string;
  otpSent?: boolean;
  status?:number;
}