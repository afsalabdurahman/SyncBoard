import { useState, useEffect, useRef } from "react";
import { Check, X } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/store";

import api from "../../../services/api";
import { useNavigate } from "react-router";
import axios, { AxiosResponse } from "axios";
const ForgotPasswordOtpPage = () => {
  let navigate=useNavigate()
  const email = useSelector((state: RootState) => state.register.user_email);
  
console.log(email,"from reduxxx")
  const [otp, setOtp] = useState([]);
  const [message,setMessage]=useState("")
  const [timer, setTimer] = useState(59);
  const [isValidTrue, setIsValidTrue] = useState(false);
  const [isValidFalse, setIsValidFalse] = useState(false);
  const inputRefs = useRef([]);
  console.log(otp);

  useEffect(() => {

    if (timer > 0) {
      const timerId = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timer]);

  useEffect (() => {
    if (otp.length === 7) {
    let  sendOtp = async() =>{

      
      const otpValue = otp.filter((value) => value !== undefined).join("");
      console.log("Full OTP:", otpValue);

      

      // show loading or send OTP

try {
  const response: AxiosResponse<any, any> = await api.post("/verify-otp", { email,otp:otpValue });
    setIsValidTrue(true)
    setIsValidFalse(false)
    setMessage("Please wait automatically redirect...")
    
    setTimeout(() => {
      navigate('/change-password ')
    }, 5000);
   
  
} catch (error) {
 
  setIsValidFalse(true)
  console.log(error,"default")
}
    }
    sendOtp()
    }
 
  }, [otp]);
  // Handle input change
  const handleChange = (index: any | number, value: any) => {
    if (isNaN(value)) return;

    const newOtp: any = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value !== "" && index < 6) {
      inputRefs.current[index + 1];
    }

    // Check if OTP is valid
   // setIsValid(!newOtp.includes(""));
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1];
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    if (/^\d+$/.test(pastedData) && pastedData.length <= 7) {
      const digits = pastedData.split("").slice(0, 7);
      const newOtp = [...otp];

      digits.forEach((digit: any, index: any) => {
        if (index < 5) {
          newOtp[index] = digit;
        }
      });

      setOtp(newOtp);

      // Focus last input with data or first empty input
      const lastIndex = Math.min(digits.length - 1, 6);
      inputRefs.current[lastIndex].focus();
    }
  };

  // Resend code
  const resendCode = async() => {
    const response: AxiosResponse<any, any> = await api.post("/send-otp", { email });
    setTimer(59);
    
   
    inputRefs.current[0].focus();
  };



  return (
    <div className='max-w-lg mx-auto px-4 py-8 flex flex-col items-center'>
      <h1 className='text-2xl md:text-3xl font-bold text-center text-gray-800 mb-2'>
        GrideSync
      </h1>

      <h2 className='text-3xl md:text-4xl font-bold text-center text-gray-800 mt-8 mb-2'>
        Check your email for a code
      </h2>

      <p className='text-gray-600 text-center mb-8'>
        We've sent a 6-character code to {email}. The code expires shortly
        <br />
        so please enter it soon.
      </p>

      {/* OTP Input Group */}
      <div className='flex items-center justify-center gap-1 mb-6'>
        {/* First 3 digits */}
        {[0, 1, 2].map((index) => (
          <input
            key={`otp-${index}`}
            ref={(el) => (inputRefs.current[index] = el)}
            type='text'
            maxLength='1'
            value={otp[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className='w-12 h-16 text-4xl font-bold text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        ))}

        {/* Dash separator */}
        <span className='text-2xl font-bold text-gray-400 mx-1'>-</span>

        {/* Last 3 digits */}
        {[3, 4, 5].map((index) => (
          <input
            key={`otp-${index + 1}`}
            ref={(el) => (inputRefs.current[index] = el)}
            type='text'
            maxLength:any='1'
            value={otp[index + 1]}
            onChange={(e) => handleChange(index + 1, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index + 1, e)}
            onPaste={handlePaste}
            className='w-12 h-16 text-4xl font-bold text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        ))}
        
        {isValidTrue?<div className='ml-2'>
            <Check className='w-8 h-8 text-green-500' />
          </div>:null}
       {isValidFalse?<div className='ml-2'>
            <X className='w-8 h-8 text-red-500' />
          </div>:null}
      </div>

      {/* Timer and Resend */}
      {message?message:
      <div className='flex items-center gap-2 mb-8'>
        Link :
        {timer? 
        <span className='text-gray-800'>{`${
          timer < 10 ? "0" : ""
        }${timer}`}</span>:
        <button
          onClick={resendCode}
          className='text-gray-500 hover:text-gray-700'
        >
          Resend Otp
        </button>}
      </div>}

      {/* Email shortcuts */}
      <div className='flex items-center justify-center gap-4 mb-6'>
        <a
          href='https://mail.google.com'
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center text-gray-600 hover:text-gray-800'
        >
          <img src='/images/gmail.png' alt='Gmail' className='w-6 h-6 mr-2' />
          <span>Open Gmail</span>
        </a>

        <a
          href='https://outlook.live.com'
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center text-gray-600 hover:text-gray-800'
        >
          <img
            src='images/outlook.jpeg'
            alt='Outlook'
            className='w-6 h-6 mr-2'
          />
          <span>Open Outlook</span>
        </a>
      </div>

      {/* Help text */}
      <div className='text-center mb-6'>
        <button className='text-gray-600 hover:text-gray-800'>
          Can't find your code? Request a new code.
        </button>
      </div>

      <div className='text-center mb-12'>
        <button className='text-blue-600 hover:text-blue-800'>
          Sign in a different way
        </button>
      </div>

      {/* Footer */}
      <div className='flex items-center justify-center gap-4 text-gray-500 text-sm'>
        <a href='#' className='hover:text-gray-700'>
          Privacy & Terms
        </a>
        <a href='#' className='hover:text-gray-700'>
          Contact Us
        </a>
      </div>
    </div>
  );
};

export default ForgotPasswordOtpPage;
