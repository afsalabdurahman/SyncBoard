import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from "../../../Redux/store";
import axios, { AxiosResponse } from "axios";
import LoadingSpinner from '../utility/loadingPages/LoadingSpinner';
import api from "../../../services/api";
import { useParams,useLocation } from 'react-router';
import { current } from '@reduxjs/toolkit';
import { useNavigate } from 'react-router';

export default function ChangePasswordPage() {
  let naviagte=useNavigate()

const userId=useSelector((state:RootState) =>state?.user?.user?._id);
console.log(userId,"userId")
  const [user,setUser]=useState(false)
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
     const userStatus = queryParams.get("user");
     useEffect(() => { if(userStatus){
    setUser(true)
   }else{
    setUser(false)}}, [userStatus]);
  
    
  const [formData, setFormData] = useState({
    currentPassword: '',
    password: '',
    confirmPassword: ''
  });
  const email = useSelector((state: RootState) => {
    return state.user.user?.email
    });
   
  interface Errors {
    password?: string;
    confirmPassword?: string;
    api?: string;
    [key: string]: string | undefined;
  }
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [loading,setLoading]=useState(false)

  useEffect(() => {
    let timer:any;
    if (isSuccess) {
      timer = setTimeout(() => {
        redirectToLogin();
      }, 5000);
      
      // Countdown timer
      const countdownInterval = setInterval(() => {
        setCountdown(prevCount => {
          if (prevCount <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
      
      return () => {
        clearTimeout(timer);
        clearInterval(countdownInterval);
      };
    }
  }, [isSuccess]);

  const redirectToLogin = () => {
    // In a real application, this would navigate to your login page
    window.location.href = '/login'; // Replace with your actual login URL
    // For React Router, you would use: navigate('/login')
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name,value)
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async(e:any) => {
    e.preventDefault();
    if(validateForm()){

    console.log("form data:",formData)
    setLoading(true)
    try {
  const response: AxiosResponse<any, any> = await api.patch(
        `/api/member/change/password/${userId}`,
        { currentPassword:formData.currentPassword, newPassword: formData.confirmPassword }
      );
if(response.status){
   setIsSuccess(true);
    // Simulate API call to change password
    setTimeout(() => {
      console.log('Password changed successfully:', formData);
      
      naviagte("/login")
    }, 5000);
  
}



if(user){
  const response1: AxiosResponse<any, any> = await api.post(
        "/login",
        { email:email, password:formData.currentPassword }
      );
if(response1.status !== 200){
  console.log("error in current password")
  throw new Error("Current password is incorrect");
}
 
    }else{
        const response: AxiosResponse<any, any> = await api.post(
        "/change-password",
        { email:email, password: formData.confirmPassword }
      );
if(response.status){
   
    // Simulate API call to change password
    setTimeout(() => {
      console.log('Password changed successfully:', formData);
      setIsSuccess(true);
    }, 500);
}}
    } catch (error) {
      console.error('Error changing password:', error);
      setErrors({ api: 'Failed to change password. Please try again.' });
      setLoading(false)
    }


  }
  
  };

// ...existing code...
const togglePasswordVisibility = (field) => {
  console.log(field)
  if (field === 'password') {
    setShowPassword(!showPassword);
  } else if (field === 'current') {
    setShowCurrentPassword(!showCurrentPassword);
  } else if (field === 'confirm') {
    setShowConfirmPassword(!showConfirmPassword);
  }
};
console.log(showCurrentPassword)
// ...existing code...

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      {/* Success Message Popup */}
      {isSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded relative shadow-lg">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <span className="font-medium">Password changed successfully!</span>
            </div>
            <p className="text-sm mt-1">Redirecting to login page in {countdown} seconds...</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Left side - Form */}
        <div className="w-full lg:w-1/2">
          <div className="flex items-center mb-8">
            <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-xl text-purple-700 font-medium">GrideSync</h1>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Reset your password</h2>
          <p className="text-gray-600 mb-6">
            
            Please enter your new password below.
            <br />
           <p className='text-red-500 text-sm mt-1'> {errors?errors.api:null}</p> 
          </p>
          
          
          <form onSubmit={handleSubmit}>
            {/* CurrentPassword Field */}
            <div className="mb-4">
             {user? <><label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <div className="relative">
               <input
  type={showCurrentPassword ? "password" : "text"}
  id="currentPassword"
  name="currentPassword"
  className={`w-full p-3 pr-10 border ${errors.currentPassword ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-2 focus:ring-purple-500`}
  placeholder="Enter your current Password"
  value={formData.currentPassword}
  onChange={handleChange}
  disabled={isSuccess}
/>
                <button 
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 flex items-center"
                  onClick={() => togglePasswordVisibility('current')}
                  disabled={isSuccess}
                >
                  {showCurrentPassword ? (
                    <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  )}
                </button>
              </div></>:null}
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className={`w-full p-3 pr-10 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="Enter your new password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSuccess}
                />
                <button 
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 flex items-center"
                  onClick={() => togglePasswordVisibility('password')}
                  disabled={isSuccess}
                >
                  {showPassword ? (
                      <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    
                  ) : (
                   <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                     </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              <p className="mt-1 text-sm text-gray-500">Password must be at least 8 characters</p>
            </div>
            
            {/* New Password Field */}
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  className={`w-full p-3 pr-10 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="Confirm your new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isSuccess}
                />
                <button 
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 flex items-center"
                  onClick={() => togglePasswordVisibility('confirm')}
                  disabled={isSuccess}
                >
                  {showConfirmPassword ? (
                    <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                 
                  ) : (
                        <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                     </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>
           {loading? <LoadingSpinner/>:null}
            <button
              type="submit"
              className={`w-full ${isSuccess ? 'bg-green-600' : 'bg-purple-800 hover:bg-purple-900'} text-white py-3 rounded font-medium transition duration-200`}
              disabled={isSuccess}
            >
              {isSuccess ? 'Password Changed' : 'Reset my password'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <a href="#" onClick={isSuccess ? redirectToLogin : undefined} className="text-gray-500 hover:text-purple-700 text-sm">
              Go to login
            </a>
          </div>
        </div>
        
        {/* Right side - Image */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md">
            {/* Computer screen with lock */}
            <div className="flex flex-col items-center">
              {/* Question mark icons */}
              <div className="flex mb-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="mx-1 w-8 h-8 rounded bg-green-100 flex items-center justify-center text-green-700">
                    ?
                  </div>
                ))}
              </div>
              
              {/* Computer with lock */}
              <div className="relative">
                <div className="w-48 h-32 border-4 border-green-100 bg-white rounded-md flex items-center justify-center">
                  <div className="w-12 h-12 bg-yellow-400 rounded-md flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="w-48 h-3 bg-green-100 rounded-b-lg mx-auto"></div>
                <div className="w-8 h-16 bg-green-100 mx-auto"></div>
                <div className="w-24 h-2 bg-green-100 rounded-lg mx-auto"></div>
              </div>
              
              {/* Laptop */}
              <div className="absolute bottom-0 left-0">
                <div className="w-32 h-20 bg-white border-2 border-green-100 rounded-t-md relative -rotate-12">
                  <div className="absolute inset-2 bg-green-50 rounded">
                    <div className="w-4 h-4 bg-green-100 absolute right-2 top-2"></div>
                  </div>
                </div>
                <div className="w-32 h-2 bg-green-100 -rotate-12"></div>
              </div>
              
              {/* Warning sign */}
              <div className="absolute bottom-10 left-8">
                <div className="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold">!</span>
                </div>
              </div>
              
              {/* Mobile device */}
              <div className="absolute right-8 bottom-4">
                <div className="w-10 h-16 bg-white border-2 border-green-100 rounded-md flex flex-col items-center">
                  <div className="w-1 h-1 bg-red-500 rounded-full mt-1"></div>
                  <div className="w-8 h-12 bg-green-50 mt-1 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}