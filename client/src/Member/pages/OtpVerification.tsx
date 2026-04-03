import { useState, useEffect, useRef } from "react";
import { Check, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { RootState } from "../../Redux/store";
import { setUserData } from "../../Redux/feature/user/userSlice";
import { reSendOTP, verifyOTP } from "../apis/authApi";
import { setUserAuth } from "../../Redux/feature/AuthSlice";

const OTP_LENGTH = 6;
const OTP_TIMER_SECONDS = 60; // 5 minutes

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const forward = useSelector((state: RootState) => state.forward);
  console.log(forward,"formward")
  const userData = useSelector((state: RootState) => state.user?.user);

  const email = userData?.email || location.state?.email;

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(OTP_TIMER_SECONDS);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const STORAGE_KEY = `otp_expiry_${email}`; // Better key: include email

  // ====================== LOAD REMAINING TIME FROM LOCALSTORAGE ======================
  useEffect(() => {
    if (!email) return;

    const savedExpiry = localStorage.getItem(STORAGE_KEY);
    
    if (savedExpiry) {
      const expiryTime = parseInt(savedExpiry, 10);
      const now = Date.now();
      const remaining = Math.floor((expiryTime - now) / 1000);

      if (remaining > 0) {
        setTimer(remaining);
      } else {
        // Expired
        localStorage.removeItem(STORAGE_KEY);
        setTimer(0);
      }
    } else {
      // First time or after resend
      const expiryTime = Date.now() + OTP_TIMER_SECONDS * 1000;
      localStorage.setItem(STORAGE_KEY, expiryTime.toString());
      setTimer(OTP_TIMER_SECONDS);
    }
  }, [email, STORAGE_KEY]);

  // ====================== TIMER LOGIC ======================
  useEffect(() => {
    if (timer <= 0) {
      localStorage.removeItem(STORAGE_KEY);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        const newTime = prev - 1;
        
        if (newTime <= 0) {
          localStorage.removeItem(STORAGE_KEY);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer, STORAGE_KEY]);

  // ====================== REDIRECT IF NO EMAIL ======================
  useEffect(() => {
    if (!email) {
      navigate("/signup", { replace: true });
    }
  }, [email, navigate]);

  // ====================== AUTO VERIFY WHEN OTP COMPLETE ======================
  useEffect(() => {
    if (otp.every((digit) => digit !== "")) {
      verifyOtp();
    }
  }, [otp]);

  // ====================== VERIFY OTP ======================
  const verifyOtp = async () => {
    if (loading) return;
    
    const otpValue = otp.join("");
    setLoading(true);
    setIsError(false);

    try {
      const data = await verifyOTP(email, otpValue);

      setIsSuccess(true);
      setMessage("Verification successful! Redirecting...");

      // Clear timer on success
      localStorage.removeItem(STORAGE_KEY);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      if (forward) {
        navigate("/change/password", { replace: true });
      } else {
        const userPayload = {
          email: data.email,
          name: data.name,
          isAdmin: true,
          id: data.id,
        };

        dispatch(setUserData(userPayload));
// dispatch(setUserAuth(userPayload))
        setTimeout(() => {
          navigate("/create/workspace", { replace: true });
        }, 2500);
      }
    } catch (error: any) {
      setIsError(true);
      setMessage(error?.response?.data?.message || "Invalid or expired OTP. Please try again.");
      
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // ====================== RESEND OTP ======================
  const resendCode = async () => {
    if (!email || timer > 0) return;

    try {
      await reSendOTP(email);
      
      // Reset UI
      setOtp(Array(OTP_LENGTH).fill(""));
      setIsError(false);
      setIsSuccess(false);
      setMessage("");

      // Start fresh 5-minute timer
      const newExpiry = Date.now() + OTP_TIMER_SECONDS * 1000;
      localStorage.setItem(STORAGE_KEY, newExpiry.toString());
      setTimer(OTP_TIMER_SECONDS);

      inputRefs.current[0]?.focus();
    } catch (err) {
      setMessage("Failed to resend OTP. Please try again.");
    }
  };

  // ====================== HANDLERS ======================
  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pasted)) return;

    const digits = pasted.slice(0, OTP_LENGTH).split("");
    setOtp(digits.concat(Array(OTP_LENGTH - digits.length).fill("")));
    inputRefs.current[digits.length - 1]?.focus();
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  // ====================== RENDER ======================
  return (
    <div className="max-w-lg mx-auto px-4 py-8 flex flex-col items-center min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">GridSync</h1>

      <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mt-10 mb-3">
        Check your email
      </h2>

      <p className="text-gray-600 text-center mb-10">
        We've sent a 6-digit verification code to<br />
        <span className="font-medium text-gray-800">{email}</span>
      </p>

      {/* OTP Inputs */}
      <div className="flex gap-3 mb-8">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={isSuccess || loading}
            className="w-14 h-16 text-4xl font-bold text-center border-2 border-gray-300 rounded-xl 
                       focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200
                       disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        ))}
      </div>

      {/* Status Icons */}
      <div className="h-8 mb-6">
        {isSuccess && <Check className="w-9 h-9 text-green-500" />}
        {isError && <X className="w-9 h-9 text-red-500" />}
      </div>

      {/* Timer / Message */}
      {message ? (
        <p className={`text-center font-medium mb-8 ${isSuccess ? "text-green-600" : "text-red-600"}`}>
          {message}
        </p>
      ) : (
        <div className="text-center mb-8">
          {timer > 0 ? (
            <p className="text-gray-700">
              Resend code in <span className="font-semibold">{formatTime(timer)}</span>
            </p>
          ) : (
            <button
              onClick={resendCode}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Resend OTP
            </button>
          )}
        </div>
      )}

      {/* Quick Links */}
      <div className="flex gap-8 mb-10">
        <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <img src="/images/gmail.png" alt="Gmail" className="w-6 h-6" />
          <span>Gmail</span>
        </a>
        <a href="https://outlook.live.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
          <img src="/images/outlook.jpeg" alt="Outlook" className="w-6 h-6" />
          <span>Outlook</span>
        </a>
      </div>

      <div className="text-center">
        <button
          onClick={resendCode}
          disabled={timer > 0 || loading}
          className={`text-sm ${timer > 0 || loading ? "text-gray-400 cursor-not-allowed" : "text-gray-600 hover:text-gray-800"}`}
        >
          Didn't receive the code? Request again
        </button>
      </div>
    </div>
  );
};

export default OtpVerification;