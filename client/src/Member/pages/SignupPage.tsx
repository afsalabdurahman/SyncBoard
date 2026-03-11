import { useState, FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Redux/store";
import { setUserData } from "../../Redux/feature/user/userSlice";
import { registerUser } from "../apis/authApi";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../Custom/reusecomponents/LoadingSpinner";

interface ErrorState {
  names: string;
  passwords: string;
  api: string;
}

const SignupPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<ErrorState>({
    names: "",
    passwords: "",
    api: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  /* ---------------- VALIDATION ---------------- */

  const validateForm = () => {
    const newErrors: ErrorState = {
      names: "",
      passwords: "",
      api: "",
    };

    if (!name.trim()) {
      newErrors.names = "Please enter your name";
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,})/;

    if (!passwordRegex.test(password)) {
      newErrors.passwords =
        "Password must contain uppercase, lowercase, special character and 6+ length";
    }

    setError(newErrors);

    return !newErrors.names && !newErrors.passwords;
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const user = await registerUser(name, email, password);

      dispatch(setUserData({ email: user.email }));

      navigate("/verify/otp", { replace: true });

    } catch (err: unknown) {

      let message = "Signup failed";

      if (err instanceof Error) {
        message = err.message;
      }

      if (message.includes("Name")) {
        setError((prev) => ({ ...prev, names: message }));
      } else {
        setError((prev) => ({ ...prev, api: message }));
      }

    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto p-6">

      {/* LEFT FORM */}

      <div className="w-full md:w-1/2 md:pr-8">

        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Sign up
        </h1>

        <form onSubmit={handleSubmit}>

          {/* NAME */}

          <div className="mb-4">

            <label className="block text-sm text-gray-700 mb-1">
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-600"
              required
            />

            {error.names && (
              <p className="text-red-500 text-sm mt-1">
                {error.names}
              </p>
            )}

          </div>

          {/* EMAIL */}

          <div className="mb-4">

            <label className="block text-sm text-gray-700 mb-1">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-600"
              required
            />

          </div>

          {/* PASSWORD */}

          <div className="mb-6">

            <label className="block text-sm text-gray-700 mb-1">
              Password
            </label>

            <div className="relative">

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-600"
                required
              />

              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>

            </div>

            {error.passwords && (
              <p className="text-red-500 text-sm mt-1">
                {error.passwords}
              </p>
            )}

          </div>

          {loading && <LoadingSpinner />}

          {error.api && (
            <p className="text-red-500 text-sm mb-2">
              {error.api}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-purple-800 text-white py-3 rounded hover:bg-purple-900 transition"
          >
            Sign up with Email
          </button>

        </form>

      </div>

      {/* RIGHT SIDE STATS */}

      <div className="w-full md:w-1/2 mt-10 md:mt-0 flex flex-col justify-center">

        <div className="grid grid-cols-2 gap-8">

          {[
            { img: "/images/mission.jpeg", title: "30 million+", desc: "app downloads" },
            { img: "/images/mission1.jpeg", title: "15 years+", desc: "in business" },
            { img: "/images/mission2.jpeg", title: "2 billion+", desc: "tasks completed" },
            { img: "/images/mission3.jpeg", title: "100,000+", desc: "team users" },
          ].map((item, i) => (

            <div key={i} className="flex flex-col items-center">

              <img src={item.img} className="w-32 h-24 mb-4" />

              <p className="font-bold text-xl">{item.title}</p>

              <p className="text-gray-500">{item.desc}</p>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
};

export default SignupPage;