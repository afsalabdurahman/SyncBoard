export interface SignupResponse {
  
  success: boolean;
  message: string;
  otpSent?: boolean;
  status?:number;
}

export interface commentType {
  name:string;
  text:string;
  url:string[];
  timestamp:Date | string;
  attachments?: string[] 
}
export interface ErrorState {
  names: string;
  passwords: string;
  cpasswords: string;
  emails: string;
  api: string;
}