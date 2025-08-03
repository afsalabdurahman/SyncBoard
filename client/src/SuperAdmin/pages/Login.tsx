import React, { useState } from "react";
import apiService from "../../services/api";
import { useNavigate } from "react-router";
export const Login = () => {
let navigate=useNavigate()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Logging in with:", { email, password });
try {
  navigate("/platform/admin")
  let response=await apiService.post("/super/login",{email,password})
  console.log(response,"res")
  if(response.status==200){
navigate("/platform/admin")
  }else{
    setError(true)
  }

} catch (error) {
 setError(true)
}


   
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='w-full max-w-sm p-6 bg-white rounded-2xl shadow-lg'>
        <h1 className='text-3xl font-extrabold text-center text-blue-600 mb-2'>
          Gridesync PvtLtd.
        </h1>
        <h2 className='text-2xl font-bold text-center text-gray-800 mb-6'>
         Super Admin Login
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
            
          <button
            type='submit'
            className='w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200'
          >
            Login
          </button>
        </form>
        
      </div>
    </div>
  );
};


