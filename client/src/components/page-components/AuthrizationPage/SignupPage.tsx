import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { RootState, AppDispatch } from "../../../Redux/store";
import {
  setUserName,
  setUserEmail,
  setUserPassword,
  
} from "../../../Redux/features/RegisterSlice";
import { setUserData } from "../../../Redux/features/UserDataSlice";
import api from "../../../services/api";
import { AxiosResponse } from "axios";
import { useNavigate } from "react-router";
import LoadingSpinner from "../utility/loadingPages/LoadingSpinner";

const SignupPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [error, setError] = useState({
    names: "",
    passwords: "",
    api: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
  
    if (name.trim() == "") {
      setError((prv) => ({
        ...prv,
        names: "Please enter your name",
      }));
      return false;
    } else {
      setError((prv) => ({
        ...prv,
        names: "",
      }));
    }
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,})/;
    if (!regex.test(password)) {
      setError((prv) => ({
        ...prv,
        passwords:
          "The password must have at least six characters and must include a capital letter, a lowercase letter, and a special character.",
      }));

      return false;
    } else {
      setError((prv) => ({
        ...prv,
        passwords: "",
      }));
    }
    setLoading(true);
    console.log("Signup with:", { email, password });

    try {
      const response: AxiosResponse<any, any> = await api.post("auth/user/sendotp", {
        email,
      });
console.log(response,"sent otp")
      if (response.status === 200) {
        setLoading(false);
        
        // dispatch(setUserEmail(email));
        // dispatch(setUserPassword(password));
        // dispatch(setUserName(name));
      let data={email,password,name,isAdmin:true,superAdmin:true}
        dispatch(setUserData(data))
        navigate("/verify-otp");
      }
    } catch (error) {
      setLoading(false);
      setError((prv) => ({
        ...prv,
        api: "Email already in use",
      }));
      console.log(error, "error try block");
    }
  };

  return (
    <div className='flex flex-col md:flex-row w-full max-w-6xl mx-auto p-6'>
      {/* Left side - Form */}
      <div className='w-full md:w-1/2 md:pr-8'>
        <h1 className='text-3xl font-bold text-gray-800 mb-8'>Sign up</h1>

        {/* Social sign up buttons */}
        {/* <div className='space-y-4 mb-6'>
          <button className='flex items-center justify-center w-full border border-gray-300 rounded py-2 px-4 font-medium text-gray-700'>
            <img
              src='/images/google.png'
              alt='Google'
              className='w-5 h-5 mr-3'
            />
            Continue with Google
          </button>

          <button className='flex items-center justify-center w-full border border-gray-300 rounded py-2 px-4 font-medium text-gray-700'>
            <img
              src='/images/facebook.png'
              alt='Facebook'
              className='w-5 h-5 mr-3'
            />
            Continue with Facebook
          </button>
        </div> */}

        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label htmlFor='name' className='block text-sm text-gray-700 mb-1'>
              Name
            </label>
            <input
              id='name'
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Enter your Name'
              className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600'
              required
            />
            <p style={{ color: "red" }}>{error.names ? error.names : null}</p>
            <label htmlFor='email' className='block text-sm text-gray-700 mb-1'>
              Email
            </label>
            <input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter your personal or work email...'
              className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600'
              required
            />
          </div>

          <div className='mb-6'>
            <label
              htmlFor='password'
              className='block text-sm text-gray-700 mb-1'
            >
              Password
            </label>
            <div className='relative'>
              <input
                id='password'
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter your password...'
                className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600'
                required
              />

              <button
                type='button'
                onClick={togglePasswordVisibility}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400'
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>

              
            </div>
            <p className="p-2" style={{ color: "red" }}>
                {error.passwords ? error.passwords : null}
              </p>
            {loading ? <LoadingSpinner /> : null}
            <p style={{ color: "red" }}>{error.api ? error.api : null}</p>
          </div>

          <button
            type='submit'
            className='w-full bg-purple-800 text-white py-3 rounded font-medium hover:bg-purple-900 transition duration-200'
          >
            Sign up with Email
          </button>
        </form>

        {/* Terms */}
        <p className='text-xs text-gray-600 mt-4'>
          By continuing with Google, Apple, or Email, you agree to Todoist's
          <a href='/terms' className='text-purple-800 hover:underline'>
            {" "}
            Terms of Service{" "}
          </a>
          and
          <a href='/privacy' className='text-purple-800 hover:underline'>
            {" "}
            Privacy Policy
          </a>
          .
        </p>
      </div>

      {/* Right side - Statistics */}
      <div className='w-full md:w-1/2 mt-10 md:mt-0 flex flex-col justify-center'>
        <div className='grid grid-cols-2 gap-8'>
          {/* 30 million+ */}
          <div className='flex flex-col items-center'>
            <div className='mb-4'>
              <img
                src='/images/mission.jpeg'
                alt='Users icon'
                className='w-32 h-24'
              />
            </div>
            <p className='font-bold text-xl'>30 million+</p>
            <p className='text-gray-500'>app downloads</p>
          </div>

          {/* 15 years+ */}
          <div className='flex flex-col items-center'>
            <div className='mb-4'>
              <img
                src='/images/mission1.jpeg'
                alt='Years icon'
                className='w-32 h-24'
              />
            </div>
            <p className='font-bold text-xl'>15 years+</p>
            <p className='text-gray-500'>in business</p>
          </div>

          {/* 2 billion+ */}
          <div className='flex flex-col items-center'>
            <div className='mb-4'>
              <img
                src='images/mission2.jpeg'
                alt='Tasks icon'
                className='w-32 h-24'
              />
            </div>
            <p className='font-bold text-xl'>2 billion+</p>
            <p className='text-gray-500'>tasks completed</p>
          </div>

          {/* 100,000+ */}
          <div className='flex flex-col items-center'>
            <div className='mb-4'>
              <img
                src='/images/mission3.jpeg'
                alt='Teams icon'
                className='w-32 h-24'
              />
            </div>
            <p className='font-bold text-xl'>100,000+</p>
            <p className='text-gray-500'>team users</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
