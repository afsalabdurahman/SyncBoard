import React from 'react'
import { Link } from 'react-router-dom'

export const HeaderLanding = ()=> {
  return (
    <div>
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
          <Link to={"/"}>Home</Link>
          <Link to={"/feature"}>Features</Link>
          <Link  to={"/price"}>Pricing</Link>
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
    </div>
  )
}


