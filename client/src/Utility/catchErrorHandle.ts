import { AxiosError } from "axios";

export  const catchErrorHandle = (err:unknown,message:string)=>{
let errorMessage = message;
   if (err && typeof err === "object" && "isAxiosError" in err) {
      const axiosError = err as AxiosError<unknown>;
    
      errorMessage = axiosError.response?.data?.message || axiosError.message;
    } else if (err instanceof Error) {
      errorMessage = err.message;
    }

    return (errorMessage);
  }
