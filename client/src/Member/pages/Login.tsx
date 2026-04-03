import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { Eye, EyeOff } from "lucide-react";
import LoadingSpinner from "../../Custom/reusecomponents/LoadingSpinner";

import { setUserData } from "../../Redux/feature/user/userSlice";
import { setWorkspace } from "../../Redux/feature/WorkspaceSlice";
import { setUserAuth } from "../../Redux/feature/AuthSlice";

import { loginApi } from "../apis/authApi";
import { GoogleLogin } from "@react-oauth/google";
import apiService from "../../Services/apiServices/apiService";

function Login() {
  const [load, setLoad] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false); // ← New state

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email.trim()) {
      setError("Please enter a valid email");
      return;
    }

    if (!password.trim()) {
      setError("Invalid password");
      return;
    }

    setError("");
    setLoad(true);

    try {
      const { workspace, user } = await loginApi(email, password);

      dispatch(setUserAuth(user._id));
      dispatch(setWorkspace(workspace));
      dispatch(setUserData(user));

      navigate("/workspace", { replace: true });
    } catch (err) {
      let message = "Login failed";

      if (err instanceof Error) {
        message = err.message;
      }

      if (message.includes("createdAt")) {
        const parsed = JSON.parse(message);
        const id = parsed._id;
        delete parsed._id;
        parsed.id = id;

        dispatch(setUserData(parsed));
        navigate("/create/workspace");
        return;
      }

      setError(message);
    } finally {
      setLoad(false);
    }
  };
const handleSuccess =async (credentialResponse) =>{
  try {
  const response= await apiService.post('/auth/google',{credential:credentialResponse.credential,})
if(response.status==200){
  const userPayload = {
            email: response.data.savedUser.email,
            name: response.data.savedUser.name,
            isAdmin: true,
            role:response.data.savedUser.role,
            id: response.data.savedUser._id,
          };
   dispatch(setUserAuth(userPayload.id));
          dispatch(setUserData(userPayload));
          dispatch(setWorkspace(response.data.workspace))
  navigate("/workspace")
}else if(response.status == 201){

    const userPayload = {
              email: response.data.savedUser.email,
              name: response.data.savedUser.name,
              isAdmin: true,
              id: response.data.savedUser._id,
            };
    
            dispatch(setUserData(userPayload));
    navigate("/create/workspace")
  }
  
}catch (error) {
    console.log(error,"error")
  }
}
  return (
    <div className="min-h-screen flex">
      {/* Login Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center mb-6">
            <img
              className="w-12 h-12 mr-2"
              src="/images/company-logo.png"
              alt="logo"
            />
            <h1 className="text-2xl font-bold text-purple-700">GridSync</h1>
          </div>

          <h2 className="text-2xl font-semibold mb-6">Log in</h2>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email Field */}
              <input
                type="email"
                placeholder="Enter your email..."
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-purple-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* Password Field with Toggle */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password..."
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:border-purple-500 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {/* Eye Icon Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
  <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log('Login Failed')}
      useOneTap   
      theme="outline"
      size="large"
      text="continue_with"
    />
              <div className="flex justify-between text-sm">
                <Link to="/forgot/password" className="text-gray-600 hover:underline">
                  Forgot password?
                </Link>

                <Link to="/signup" className="text-purple-700 hover:underline">
                  Sign up now
                </Link>
              </div>
            </div>

            {load && <LoadingSpinner />}

            <button
              type="submit"
              disabled={load}
              className="mt-6 w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {load ? "Logging in..." : "Log in"}
            </button>
          </form>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center items-center bg-gray-100 p-8">
        <img
          src="/images/Login-preview.JPG"
          alt="Preview"
          className="rounded-lg border"
        />

        <div className="mt-6 text-center">
          <p className="text-lg font-medium">Explore ways to use GridSync</p>
          <p className="text-gray-600 mt-2">
            GridSync is powerful enough for any workflow, but easy enough for everyone.
          </p>
          <p className="italic text-sm mt-3 text-gray-700 font-semibold">
            Online GridSync maker for project management
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;