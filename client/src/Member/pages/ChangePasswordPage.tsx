import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch, store } from "../../Redux/store";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

import LoadingSpinner from "../../Custom/reusecomponents/LoadingSpinner";
import { toggleForward } from "../../Redux/feature/ForwardSlice";
import { logoutUserAuth } from "../../Redux/feature/AuthSlice";

import { logout } from "../../Worksapce/apis/workspaceapis";
import { changePassword, resetPassword } from "../apis/authApi";

/* ---------- TYPES ---------- */

interface FormData {
  currentPassword: string;
  password: string;
  confirmPassword: string;
}

interface Errors {
  password?: string;
  confirmPassword?: string;
  api?: string;
}

/* ---------- COMPONENT ---------- */

export default function ChangePasswordPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();

  const userId = useSelector((state: RootState) => state.user.user?._id);

  const [formData, setFormData] = useState<FormData>({
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // 👁 visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const isUserPasswordChange = Boolean(queryParams.get("user"));

  /* ---------- FORWARD STATE ---------- */

  useEffect(() => {
    dispatch(toggleForward());
  }, [dispatch]);

  /* ---------- SUCCESS REDIRECT ---------- */

  useEffect(() => {
    if (!isSuccess) return;

    const redirectTimer = setTimeout(() => redirectToLogin(), 5000);

    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearTimeout(redirectTimer);
      clearInterval(interval);
    };
  }, [isSuccess]);

  /* ---------- REDIRECT ---------- */

  const redirectToLogin = async () => {
    if (!userId) return;

    const res = await logout(userId);

    if (res === 204) {
      store.dispatch(logoutUserAuth());
      navigate("/login");
    }
  };

  /* ---------- INPUT ---------- */

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof Errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  /* ---------- VALIDATION ---------- */

  const validateForm = () => {
    const newErrors: Errors = {};

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------- SUBMIT ---------- */

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !userId) return;

    setLoading(true);

    try {
      if (isUserPasswordChange) {
        await changePassword(
          userId,
          formData.currentPassword,
          formData.confirmPassword
        );
      } else {
        await resetPassword(userId, formData.confirmPassword);
      }

      setIsSuccess(true);
      setErrors({});
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
        setErrors({ api: error.message });
      }
    } finally {
      setLoading(false);
    }
  };

  /* ---------- UI ---------- */

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&w=1600&q=80')",
      }}
    >
      <div className="bg-white/90 backdrop-blur-md p-10 rounded-xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-purple-800 mb-4">
          Reset Password
        </h2>

        <p className="text-gray-500 text-center mb-6">
          Enter your new password below
        </p>

        {isSuccess && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4 text-center">
            Password changed successfully. Redirecting in {countdown}s...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Current Password */}
          {isUserPasswordChange && (
            <div className="relative">
              <input
                type={showCurrentPassword ? "password" : "text"}
                name="currentPassword"
                placeholder="Current Password"
                className="w-full border p-3 rounded pr-10 focus:ring-2 focus:ring-purple-500"
                value={formData.currentPassword}
                onChange={handleChange}
              />
              <span
                className="absolute right-3 top-3 cursor-pointer"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
            </div>
          )}

          {/* New Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="New Password"
              className="w-full border p-3 rounded pr-10 focus:ring-2 focus:ring-purple-500"
              value={formData.password}
              onChange={handleChange}
            />
            <span
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </span>
          </div>

          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full border p-3 rounded pr-10 focus:ring-2 focus:ring-purple-500"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <span
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? (
                <Eye size={18} />
              ) : (
                <EyeOff size={18} />
              )}
            </span>
          </div>

          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}

          {errors.api && (
            <p className="text-red-500 text-sm">{errors.api}</p>
          )}

          {loading && <LoadingSpinner />}

          <button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-900 text-white py-3 rounded-lg font-semibold transition"
            disabled={isSuccess}
          >
            {isSuccess ? "Password Changed" : "Reset Password"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={redirectToLogin}
            className="text-purple-700 hover:underline text-sm"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}