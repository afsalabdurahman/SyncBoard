import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../Redux/store";

function LandingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth?.isAuthenticated ?? false
  );

  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const isSessionExpired = searchParams.get("session") === "expired";

    if (isAuthenticated && !isSessionExpired) {
      navigate("/workspace", { replace: true });
    } else {
      setShowContent(true);
    }
  }, [isAuthenticated, navigate, searchParams]);

  if (!showContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-purple-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <header className="flex justify-between items-center px-4 sm:px-6 py-4 shadow relative">
        <div className="text-2xl font-bold text-purple-700 flex items-center gap-2">
          <img
            className="w-12 h-12"
            src="/images/company-logo.png"
            alt="GridSync Logo"
          />
          GridSync
        </div>

        <nav className="hidden md:flex gap-6 items-center text-gray-700 text-sm">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <Link to="/login" className="hover:underline">
            Log in
          </Link>
          <Link
            to="/signup"
            className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800 transition"
          >
            Start for free
          </Link>
        </nav>

        {/* Mobile menu button and dropdown - keep your existing code */}
      </header>

      {/* Hero Section */}
      <main className="flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 md:px-20 py-12 gap-12">
        <div className="max-w-lg text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Clarity, finally.
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-8">
            Join our professional community who simplify work and life with the
            world's #1 collaboration app.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-purple-700 text-white px-6 py-3 rounded-lg text-base sm:text-lg font-medium hover:bg-purple-800 transition"
          >
            Signup for free
          </Link>
        </div>

        <div className="rounded-lg overflow-hidden shadow-lg w-full max-w-sm sm:max-w-md md:max-w-xl">
          <img
            src="/images/prevew-image.JPG"
            alt="App Preview"
            className="w-full h-auto object-cover"
          />
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-[#f4f7fe] text-[#1f1f1f]">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10">
            Discover the features that make GridSync so easy to use
          </h2>
          {/* Add your features content here */}
        </div>
      </section>

      <footer className="flex justify-between items-center px-6 py-6 text-sm text-gray-500 border-t">
        <p>Copyright © 2025 GridSync</p>
        <div className="flex gap-6">
          <p>Privacy Policy</p>
          <p>Terms</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;