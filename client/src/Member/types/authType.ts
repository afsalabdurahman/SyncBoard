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