import { Link } from "react-router";
import { use, useEffect, useState } from "react";
import api from "../../../services/api";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../Redux/store";
import LoadingSpinner from "../utility/loadingPages/LoadingSpinner";
import {
  setUserName,
  setUserEmail,
  setUserRole,
} from "../../../Redux/features/RegisterSlice";
import { setUserData } from "../../../Redux/features/UserDataSlice";
import { setWorkspace } from "../../../Redux/features/WorkspaceSlice";
import { setLog } from "../../../Redux/features/LogSlice";
function Login() {
  let [load, setLoad] = useState(false);
  let dispatch = useDispatch();
  let navigate = useNavigate();
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [error, setError] = useState("");

  let handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!email) {
      setError("please enter valid email");
      return false;
    }
    setError("");
    if (password.trim() == "") {
      setError("please enter valid password");

      return false;
    }
    setError("");
    setLoad(true);
    try {
      const response: AxiosResponse<any, any> = await api.post(
        "auth/user/login",
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      if (response.status == 200) {
        console.log("response from login:", response);

        dispatch(setWorkspace(response.data.workspaceData));
        //  dispatch(setLog(response.data.logs))
        dispatch(setUserData(response.data.user));
        navigate("/work-space");
      }
    } catch (error: any) {
      console.log(error,"error")
      setLoad(false);
      setError(error.response.data.message);
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

          {/* <div className='space-y-3 mb-6'>
            <button className='w-full flex items-center justify-center gap-2 border px-4 py-2 rounded'>
              <img
                src='https://img.icons8.com/color/16/google-logo.png'
                alt='Google'
              />
              Continue with Google
            </button>
            <button className='w-full flex items-center justify-center gap-2 border px-4 py-2 rounded'>
              <img
                src='https://img.icons8.com/color/16/facebook.png'
                alt='Facebook'
              />
              Continue with Facebook
            </button>
            <button className='w-full flex items-center justify-center gap-2 border px-4 py-2 rounded'>
              <img
                src='https://img.icons8.com/ios-filled/16/mac-os.png'
                alt='Apple'
              />
              Continue with Apple
            </button>
          </div> */}
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
