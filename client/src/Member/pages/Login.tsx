import { Link } from "react-router-dom";
import { use, useEffect, useState } from "react";
import api from "../../Services/apiServices/apiService";
import { AxiosError, AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../Redux/store";
import LoadingSpinner from "../../Custom/reusecomponents/LoadingSpinner";

import {
  setUserName,
  setUserEmail,
  setUserRole,
} from "../../Redux/feature/RegisterSlice";
import { setUserData } from "../../Redux/feature/user/userSlice";
import { setWorkspace } from "../../Redux/feature/WorkspaceSlice";
import { setLog } from "../../Redux/feature/logs/LogSlice";
import { loginApi } from "../apiservice/authApi";
function Login() {
  const [load, setLoad] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("please enter valid email");
      return false;
    }
    setError("");
    if (password.trim() == "") {
      setError("invalidPassword");

      return false;
    }
    setError("");
    setLoad(true);
    try {
      const {workspace,user} = await loginApi(email,password)
     

        dispatch(setWorkspace(workspace));
        //  dispatch(setLog(response.data.logs))
        dispatch(setUserData(user));
        
        navigate("/work-space");
      
    } catch (error) {
    
      let message = "Login failed"
       if (error instanceof Error) {
      message = error.message;
    }
       setError(message);
  
      setLoad(false);
    
    }
  };

  return (
    <div className='min-h-screen flex'>
      {/* Left section: login form */}
      <div className='w-full lg:w-1/2 flex flex-col justify-center items-center p-8'>
        <div className='w-full max-w-md'>
          <div className='flex items-center mb-6'>
            <div className='text-4xl text-green-600 mr-2'></div>
            <img
              style={{ display: "inline" }}
              className='w-12 h-12'
              src='/images/company-logo.png'
              alt=''
            />
            <h1 className='text-2xl font-bold text-purple-700'>GridSync</h1>
          </div>
          <h2 className='text-2xl font-semibold mb-6'>Log in</h2>

         
          <p style={{ color: "red" }}> {error ? error : null} </p>
          <form onSubmit={handleSubmit}>
            <div className='space-y-4'>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type='email'
                placeholder='Enter your email...'
                className='w-full px-4 py-2 border rounded'
              />
              <input
                type='password'
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter your password...'
                className='w-full px-4 py-2 border rounded'
              />
              <div className='flex justify-between text-sm'>
                <Link to='/forgot-password' className='text-gray-600'>
                  forgot password?
                </Link>
                <Link to='/signup' className='text-purple-700'>
                  signup now
                </Link>
              </div>
            </div>
            {load ? <LoadingSpinner /> : null}

            <button className='mt-6 w-full bg-purple-700 text-white py-2 rounded'>
              Log in
            </button>
          </form>
        </div>
      </div>

      {/* Right section: image and description */}
      <div className='hidden lg:flex w-1/2 flex-col justify-center items-center bg-gray-100 p-8'>
        <img
          src='/images/Login-preview.JPG'
          alt='Preview'
          className='rounded-lg border'
        />
        <div className='mt-6 text-center'>
          <p className='text-lg font-medium'>Explore ways to use GridSync</p>
          <p className='text-gray-600 mt-2'>
            GridSync is powerful enough for any workflow, but easy enough for
            everyone.
          </p>
          <p className='italic text-sm mt-3 text-gray-700 font-semibold'>
            Online GridSync maker for project management
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
