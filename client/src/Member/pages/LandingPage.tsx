import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../Redux/store";
import { HeaderLanding } from "./Header";

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
     <HeaderLanding/>

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
          <div className='flex flex-col lg:flex-row items-center gap-10 mb-20'>
            <div className='flex-1 space-y-4 text-sm'>
              <h3 className='text-lg font-semibold'>Powerful agile boards</h3>
              <ul className='space-y-2 list-disc pl-5'>
             
                <li>
                  <strong>Kanban boards:</strong> Agile and DevOps teams use
                  kanban boards to visualize workflows and improve efficiency.
                </li>
                <li>
                  <strong>Choose your own adventure:</strong> GridSync Software
                  is flexible enough to support Scrum, Kanban, or both.
                </li>
              </ul>
            </div>
            <div className='flex-1'>
              <img
                src='/images/landing-page-todotable.webp'
                alt='Agile Board Preview'
                className='rounded-lg shadow-lg w-full'
              />
            </div>
          </div>
 <div className='flex flex-col lg:flex-row-reverse items-center gap-10 mb-20'>
            <div className='flex-1'>
              <img
                src='/images/project.png'
                alt='Workflow Preview'
                className='rounded-lg shadow-lg w-full'
              />
            </div>
            <div className='flex-1'>
              <h3 className='text-lg font-semibold mb-2'>
                Customize how your team’s work flows
              </h3>
              <p className='text-sm text-gray-700'>
                Set up, clean up, and automate even the most complicated project
                workflows.
              </p>
            </div>
          </div>
            <div className='flex flex-col lg:flex-row items-center gap-10 mb-20'>
            <div className='flex-1'>
              <img
                src='/images/Task approval.JPG'
                alt='Timeline View'
                className='rounded-lg shadow-lg w-full'
              />
            </div>
            <div className='flex-1'>
              <h3 className='text-lg font-semibold mb-2'>
                Stay on track – even when the track changes
              </h3>
              <p className='text-sm text-gray-700'>
                Use the timeline view to map out the big picture, communicate
                updates to stakeholders, and ensure your team stays on the same
                page.
              </p>
            </div>
          </div>
 <div className='flex flex-col lg:flex-row-reverse items-center gap-10 mb-20'>
            <div className='flex-1'>
              <img
                src='/images/admin manage.JPG'
                alt='Issue Tracking'
                className='rounded-lg shadow-lg w-full'
              />
            </div>
            <div className='flex-1'>
              <h3 className='text-lg font-semibold mb-2'>
                Manage invitations
              </h3>
              <p className='text-sm text-gray-700'>
                Keep every detail of a project centralized in real time so info
                can flow freely across people, teams, and tools.
              </p>
            </div>
          </div>
          <div className='text-center bg-blue-600 text-white py-12 rounded-xl mt-12 relative overflow-hidden'>
            <h3 className='text-2xl font-semibold mb-4'>
              Move fast, stay aligned, and build better – together
            </h3>
            <button onClick={()=>navigate('/signup')} className='bg-yellow-400 text-black font-semibold px-6 py-3 rounded-lg hover:bg-yellow-300 transition'>
              Get it free
            </button>
          </div>
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