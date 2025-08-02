import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { AxiosResponse } from "axios";
import {

  setUserEmail,
 
} from "../../../Redux/features/RegisterSlice";
import api from "../../../services/api";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../Redux/store";
import LoadingSpinner from "../utility/loadingPages/LoadingSpinner";
export default function PasswordResetPage() {
   const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading,setLoading]=useState(false)
  let naviagte = useNavigate();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // Handle password reset logic here
    setLoading(true)
    console.log("Password reset requested for:", email);
    try {
      const response: AxiosResponse<any, any> = await api.post("/user-exist", {
        email,
      });
    
    } catch (error: any) {
      if (error.status == 409) {
        const response: AxiosResponse<any, any> = await api.post(
          "/newotp-send",
          {
            email,
          }
        );
         dispatch(setUserEmail(email));
        naviagte("/reset-password");
      }
      setLoading(false)
      setMessage("No account found. Please register.");
      console.log(error, "errorsss");

     
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-white p-4'>
      <div className='w-full max-w-4xl flex flex-col lg:flex-row items-center justify-between gap-8'>
        {/* Left side - Form */}
        <div className='w-full lg:w-1/2'>
          <div className='flex items-center mb-8'>
            <div>
           
              <img
                className='h-15 w-15'
                src='/images/company-logo.png'
                alt=''
                
              />
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5 text-white'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <h1 className='text-xl text-purple-700 font-medium'>GrideSync</h1>
          </div>

          <h2 className='text-3xl font-bold text-gray-800 mb-4'>
            Forgot your password?
          </h2>
          <p className='text-gray-600 mb-6'>
            To reset your password, please enter the email address of your
            Todoist account.
          </p>
         <p style={{color:"red"}}>{message}</p> 
          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Email
              </label>
              <input
                type='email'
                id='email'
                className='w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500'
                placeholder='Enter your email...'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
         {loading?<LoadingSpinner/>:null}
            <button
              type='submit'
              className='w-full bg-purple-800 text-white py-3 rounded font-medium hover:bg-purple-900 transition duration-200 cursor-pointer'
            >
              Reset my password
            </button>
          </form>

          <div className='mt-6 text-center'>
            <Link
              to={"/login"}
              className='text-gray-500 hover:text-purple-700 text-sm'
            >
              Go to login
            </Link>
          </div>
        </div>

        {/* Right side - Image */}
        <div className='w-full lg:w-1/2 flex justify-center'>
          <div className='relative w-full max-w-md'>
            {/* Computer screen with lock */}
            <div className='flex flex-col items-center'>
              {/* Question mark icons */}
              <div className='flex mb-2'>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className='mx-1 w-8 h-8 rounded bg-green-100 flex items-center justify-center text-green-700'
                  >
                    ?
                  </div>
                ))}
              </div>

              {/* Computer with lock */}
              <div className='relative'>
                <div className='w-48 h-32 border-4 border-green-100 bg-white rounded-md flex items-center justify-center'>
                  <div className='w-12 h-12 bg-yellow-400 rounded-md flex items-center justify-center'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-8 w-8'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                </div>
                <div className='w-48 h-3 bg-green-100 rounded-b-lg mx-auto'></div>
                <div className='w-8 h-16 bg-green-100 mx-auto'></div>
                <div className='w-24 h-2 bg-green-100 rounded-lg mx-auto'></div>
              </div>

              {/* Laptop */}
              <div className='absolute bottom-0 left-0'>
                <div className='w-32 h-20 bg-white border-2 border-green-100 rounded-t-md relative -rotate-12'>
                  <div className='absolute inset-2 bg-green-50 rounded'>
                    <div className='w-4 h-4 bg-green-100 absolute right-2 top-2'></div>
                  </div>
                </div>
                <div className='w-32 h-2 bg-green-100 -rotate-12'></div>
              </div>

              {/* Warning sign */}
              <div className='absolute bottom-10 left-8'>
                <div className='w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center'>
                  <span className='text-2xl font-bold'>!</span>
                </div>
              </div>

              {/* Mobile device */}
              <div className='absolute right-8 bottom-4'>
                <div className='w-10 h-16 bg-white border-2 border-green-100 rounded-md flex flex-col items-center'>
                  <div className='w-1 h-1 bg-red-500 rounded-full mt-1'></div>
                  <div className='w-8 h-12 bg-green-50 mt-1 rounded'></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
