import { useState, useEffect, useRef } from "react";
import { Check, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../Redux/store";
import { setUserData } from "../../Redux/feature/user/userSlice";
import api from "../../Services/apiServices/apiService";
import { useNavigate } from "react-router-dom";
import { AxiosResponse } from "axios";
import { useLayoutEffect } from "react";
import { signupApi, verifyOTP } from "../apiservice/authApi";
const OTP_LENGTH = 6;

const OtpVerification = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userData = useSelector((state: RootState) => ({
    email: state?.user?.user?.email,
    name: state?.user?.user?.name,
    password:state?.user?.user?.password
 
  }));
console.log(userData,"dataaa")
  const [otp, setOtp] = useState<string[]>(
    Array(OTP_LENGTH).fill("")
  );
  const [message, setMessage] = useState("");
  const [timer, setTimer] = useState(59);
  const [isValidTrue, setIsValidTrue] = useState(false);
  const [isValidFalse, setIsValidFalse] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* ---------------- Redirect if no email ---------------- */

useLayoutEffect(() => {
  if (!userData?.email) {
    navigate("/signup", { replace: true });
  }
}, [userData, navigate]);

  /* ---------------- Countdown Timer ---------------- */
  useEffect(() => {
    if (timer > 0) {
      const id = setTimeout(() => setTimer((prev) => prev - 1), 1000);
      return () => clearTimeout(id);
    }
  }, [timer]);

  /* ---------------- Auto Verify ---------------- */
  useEffect(() => {
    if (otp.every((digit) => digit !== "")) {
      verifyOtp();
    }
  }, [otp]);

  /* ---------------- Verify OTP ---------------- */
  const verifyOtp = async () => {
    const otpValue = otp.join("");

    try {
   await verifyOTP(userData?.email,otpValue)


      setIsValidTrue(true);
     
      setMessage("Please wait automatically redirect...");

      const registerRes: AxiosResponse<any> = await api.post(
        "auth/user/register",
        {
          name: userData.name,
          email: userData.email,
          password:userData.password,
          role: "Admin",

        },
        { withCredentials: true }
      );

      dispatch(setUserData(registerRes.data.user));

      setTimeout(() => {
        navigate("/create-workspace");
      }, 3000);
    } catch (error) {
      setIsValidFalse(true);
    }
  };

  /* ---------------- Handle Change ---------------- */
  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  /* ---------------- Handle Backspace ---------------- */
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  /* ---------------- Strong Copy–Paste ---------------- */
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, OTP_LENGTH).split("");
    const newOtp = Array(OTP_LENGTH).fill("");

    digits.forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);

    const lastIndex = digits.length - 1;
    if (lastIndex >= 0) {
      inputRefs.current[lastIndex]?.focus();
    }
  };

  /* ---------------- Resend OTP ---------------- */
  const resendCode = async () => {
   const response= await signupApi(userData?.email,userData.name,userData.password)
if(response){
 setOtp(Array(OTP_LENGTH).fill(""));
    setTimer(59);
    setIsValidFalse(false);
    setIsValidTrue(false);
    inputRefs.current[0]?.focus();
  };
}
   

  return (
    <div className="max-w-lg mx-auto px-4 py-8 flex flex-col items-center">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-2">
        GrideSync
      </h1>

      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mt-8 mb-2">
        Check your email for a code
      </h2>

      <p className="text-gray-600 text-center mb-8">
        We've sent a 6-digit code to {userData.email}. The code expires shortly
        <br />
        so please enter it soon.
      </p>

      {/* OTP INPUTS */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) =>
              handleChange(index, e.target.value)
            }
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-12 h-16 text-3xl font-bold text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ))}

        {isValidTrue && (
          <Check className="w-8 h-8 text-green-500 ml-2" />
        )}
        {isValidFalse && (
          <X className="w-8 h-8 text-red-500 ml-2" />
        )}
      </div>

      {/* TIMER */}
      {message ? (
        <div className="text-green-600 mb-6">{message}</div>
      ) : (
        <div className="flex items-center gap-2 mb-8">
          {timer > 0 ? (
            <span className="text-gray-800">
              Resend in 00:{timer < 10 ? `0${timer}` : timer}
            </span>
          ) : (
            <button
              onClick={resendCode}
              className="text-gray-600 hover:text-gray-800"
            >
              Resend OTP
            </button>
          )}
        </div>
      )}

      {/* EMAIL SHORTCUTS */}
      <div className="flex items-center justify-center gap-6 mb-6">
        <a
          href="https://mail.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <img
            src="/images/gmail.png"
            alt="Gmail"
            className="w-6 h-6 mr-2"
          />
          <span>Open Gmail</span>
        </a>

        <a
          href="https://outlook.live.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <img
            src="/images/outlook.jpeg"
            alt="Outlook"
            className="w-6 h-6 mr-2"
          />
          <span>Open Outlook</span>
        </a>
      </div>

      {/* HELP */}
      <div className="text-center mb-6">
        <button
          onClick={resendCode}
          className="text-gray-600 hover:text-gray-800"
        >
          Can't find your code? Request a new code.
        </button>
      </div>

      <div className="text-center mb-12">
        <button className="text-blue-600 hover:text-blue-800">
          Sign in a different way
        </button>
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-center gap-4 text-gray-500 text-sm">
        <a href="#" className="hover:text-gray-700">
          Privacy & Terms
        </a>
        <a href="#" className="hover:text-gray-700">
          Contact Us
        </a>
      </div>
    </div>
  );
};

export default OtpVerification;
