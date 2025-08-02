import  { useEffect, useState } from "react";
import { Link,useNavigate } from "react-router";

function LandingPage() {

  let navigate=useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <div className='min-h-screen bg-white flex flex-col'>
      {/* Navbar */}
      <header className='flex justify-between items-center px-4 sm:px-6 py-4 shadow relative'>
        <div className='text-2xl font-bold text-purple-700'>
          <img
            style={{ display: "inline" }}
            className='w-12 h-12'
            src='/images/company-logo.png'
            alt=''
          />
          GridSync
        </div>

        {/* Desktop Nav */}
        <nav className='hidden md:flex gap-6 items-center text-gray-700 text-sm'>
          
         
          <a href='#'>Pricing</a>
          <Link to="/login" className="hover:underline"> Log in</Link>
          
        
          <Link to="/signup" className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800 transition">  Start for free</Link>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className='md:hidden text-3xl text-gray-700 focus:outline-none'
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰
        </button>

        {/* Mobile Nav Dropdown */}
        {isMobileMenuOpen && (
          <div className='absolute top-full left-0 w-full bg-white shadow-md flex flex-col gap-4 px-6 py-4 text-gray-700 text-sm md:hidden z-50'>
            <a href='#'>Made For</a>
            <a href='#'>Resources</a>
            <a href='#'>Pricing</a>
            <a href='#'>Log in</a>
           
            <Link to='/signup'  className='bg-purple-700 text-white px-4 py-2 rounded-md text-center hover:bg-purple-800 transition'>Start for free</Link>
          </div>
        )}
      </header>

      {/* Hero Section (same as before) */}
      <main className='flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 md:px-20 py-12 gap-12'>
        {/* Left Content */}
        <div className='max-w-lg text-center md:text-left'>
          <h1 className='text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight'>
            Clarity, finally.
          </h1>
          <p className='text-base sm:text-lg text-gray-600 mb-8'>
            Join our professional community who simplify work and life with the
            world's #1 collaburation app.
          </p>
         <Link to="/signup" className='inline-block bg-purple-700 text-white px-6 py-3 rounded-lg text-base sm:text-lg font-medium hover:bg-purple-800 transition'>Signup for free</Link>
          <p className='text-sm text-gray-500 mt-3'>
            Calm the chaos in a matter of minutes!
          </p>
        </div>

        {/* Right Image */}
        <div className='rounded-lg overflow-hidden shadow-lg w-full max-w-sm sm:max-w-md md:max-w-xl'>
          <img
            src='/images/prevew-image.JPG'
            alt='App Preview'
            className='w-full h-auto object-cover'
          />
        </div>
      </main>
      <section className='bg-[#f4f7fe] text-[#1f1f1f]'>
        <div className='max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8'>
          <h2 className='text-3xl sm:text-4xl font-bold text-center mb-10'>
            Discover the features that make GridSync so easy to use
          </h2>

          {/* Feature Section 1 */}
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

          {/* Feature Section 2 */}
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

          {/* Feature Section 3 */}
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

          {/* Feature Section 4 */}
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

          {/* Final Call-to-Action */}
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
      <footer style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem" }}>
  <div>
    <p style={{ margin: 0 }}>Copyright © 2025 Atlassian</p>
  </div>
  <div style={{ display: "flex", gap: "1rem" }}>
    <p style={{ margin: 0 }}>Privacy Policy</p>
    <p style={{ margin: 0 }}>Terms</p>
  </div>
</footer>

    </div>
  );
}

export default LandingPage;
