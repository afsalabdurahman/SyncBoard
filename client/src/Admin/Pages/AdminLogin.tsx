import React, { useState } from "react";
import api from "../../Services/apiServices/apiService";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserData } from "../../Redux/feature/user/userSlice";
import { setWorkspace } from "../../Redux/feature/WorkspaceSlice";
import LoadingSpinner from "../../Custom/reusecomponents/LoadingSpinner";
import { setSubscription } from "../../Redux/feature/subscription/subscriptionSlice";
import { adminLogin, googleAdminAuth } from "../apis/authApi";
import { setUserAuth } from "../../Redux/feature/AuthSlice";
import { GoogleLogin } from "@react-oauth/google";

// Import Lucide Eye Icons
import { Eye, EyeOff } from "lucide-react";

const AdminLogin = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // New state
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await adminLogin(email, password);


      dispatch(setUserAuth(response?.user?._id));
      dispatch(setWorkspace(response.workspace));
      dispatch(setSubscription(response.suscribe));
      dispatch(setUserData(response.user));
      navigate("/admin/dashboard");

    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };

  const handleSuccess = async (credentialResponse: any) => {
    try {
      const response = await googleAdminAuth(credentialResponse.credential);

      dispatch(setUserAuth(response?.user?._id));
      dispatch(setWorkspace(response.workspace));
      dispatch(setSubscription(response.suscribe));
      dispatch(setUserData(response.user));
      navigate("/admin/dashboard");
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='w-full max-w-sm p-6 bg-white rounded-2xl shadow-lg'>
        <h1 className='text-3xl font-extrabold text-center text-blue-600 mb-2'>
          Gridesync
        </h1>
        <h2 className='text-2xl font-bold text-center text-gray-800 mb-6'>
          Admin Login
        </h2>

        {error && (
          <p className="text-center text-red-800 mb-4">Invalid email or password</p>
        )}

        <form onSubmit={handleLogin} className='space-y-4'>
          {/* Email Field */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Email
            </label>
            <input
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='admin@example.com'
            />
          </div>

          {/* Password Field with Eye Toggle */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10'
                placeholder='••••••••'
              />
              
              {/* Eye Icon Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline focus:outline-none"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </button>
          </div>

          <button
            type='submit'
            className='w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200'
            disabled={loading}
          >
            Login
          </button>
        </form>

        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => console.log('Login Failed')}
          useOneTap
          theme="outline"
          size="large"
          text="continue_with"
        />

        {loading && <LoadingSpinner />}
      </div>
    </div>
  );
};

export default AdminLogin;