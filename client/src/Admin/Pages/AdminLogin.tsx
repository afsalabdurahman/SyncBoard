import React, { useState } from "react";
import api from "../../services/api";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setUserData } from "../../Redux/features/UserDataSlice";
import { setWorkspace } from "../../Redux/features/WorkspaceSlice";
import { setLog } from "../../Redux/features/LogSlice";
import LoadingSpinner from "../../components/page-components/utility/loadingPages/LoadingSpinner";

const AdminLogin = () => {


  let dispatch = useDispatch();
 let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
const [loading, setLoading] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Logging in with:", { email, password });
    try {
      const response: AxiosResponse<any, any> = await api.post(
        "auth/admin/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      console.log(response,"response++++")
      if(response.status !== 200) {
        setLoading(false);
        throw new Error("Login failed");
      }
      console.log(response,"response")
      // Handle successful login response
       dispatch(setWorkspace(response.data.workspace))
            //  dispatch(setLog(response.data.logs))
            dispatch(setUserData(response.data.user))
      navigate("/admin-dashboard");
   
    } catch (error) {
      setLoading(false);
      setError(true);
      console.error("Login failed:", error);
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
        {error ?
        <p className="text-center text-red-800">Invalid email or password</p>:null}
        <form onSubmit={handleLogin} className='space-y-4'>
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
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Password
            </label>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='••••••••'
            />
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
          >
            Login
          </button>
        </form>
        {loading?
        <LoadingSpinner/>:null}
      </div>
    </div>
  );
};

export default AdminLogin;
