import { Link, useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";

import LoadingSpinner from "../../Custom/reusecomponents/LoadingSpinner";

import { setUserData } from "../../Redux/feature/user/userSlice";
import { setWorkspace } from "../../Redux/feature/WorkspaceSlice";
import { setUserAuth } from "../../Redux/feature/AuthSlice";

import { loginApi } from "../apis/authApi";

function Login() {
  const [load, setLoad] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

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

          {error && <p className="text-red-500">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">

              <input
                type="email"
                placeholder="Enter your email..."
                className="w-full px-4 py-2 border rounded"
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Enter your password..."
                className="w-full px-4 py-2 border rounded"
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="flex justify-between text-sm">
                <Link to="/forgot/password" className="text-gray-600">
                  forgot password?
                </Link>

                <Link to="/signup" className="text-purple-700">
                  signup now
                </Link>
              </div>

            </div>

            {load && <LoadingSpinner />}

            <button
              type="submit"
              className="mt-6 w-full bg-purple-700 text-white py-2 rounded"
            >
              Log in
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
          <p className="text-lg font-medium">
            Explore ways to use GridSync
          </p>

          <p className="text-gray-600 mt-2">
            GridSync is powerful enough for any workflow,
            but easy enough for everyone.
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