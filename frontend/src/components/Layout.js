// src/components/Layout.js
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaFacebookF, FaInstagram, FaTwitter, FaGithub, FaYoutube
} from 'react-icons/fa';
import { HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi';

export default function Layout({ children }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const navLinks = (
    <>
      <Link to="/services" className={`block px-4 py-2 hover:text-[#35406f] transition ${location.pathname === "/services" ? "underline font-semibold" : ""}`}>
        Services
      </Link>
      <Link to="/facilities" className={`block px-4 py-2 hover:text-[#35406f] transition ${location.pathname === "/facilities" ? "underline font-semibold" : ""}`}>
        Facilities
      </Link>
      <Link to="/book-facility" className={`block px-4 py-2 hover:text-[#35406f] transition ${location.pathname === "/book-facility" ? "underline font-semibold" : ""}`}>
        Booking
      </Link>
      <Link to="/report-issue" className={`block px-4 py-2 hover:text-[#35406f] transition ${location.pathname === "/report-issue" ? "underline font-semibold" : ""}`}>
        Report Issue
      </Link>
    </>
  );

  return (
    <div className="min-h-screen bg-[#e4e9f4] text-[#1d234e] relative overflow-hidden">
      {/* Background Animation */}
      <div className="area fixed top-0 left-0 w-full h-full -z-10">
        <ul className="circles">
          {[...Array(10)].map((_, i) => <li key={i}></li>)}
        </ul>
      </div>

      {/* Header */}
      <header className="fixed top-0 w-full z-30 bg-[#e4e9f4] shadow-sm py-4">
        <nav className="max-w-screen-xl mx-auto flex justify-between items-center px-6">
          {/* Logo */}
          <div className="text-2xl font-bold tracking-wide text-[#1d234e]">
            <Link to="/">Wasl</Link>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex space-x-6 font-medium text-[#1d234e]">
            {navLinks}
          </ul>

          {/* Mobile Hamburger */}
          <div className="lg:hidden text-2xl cursor-pointer text-[#1d234e]" onClick={toggleMenu}>
            {menuOpen ? <HiOutlineX /> : <HiOutlineMenuAlt3 />}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link to="/auth" className="text-[#1d234e] font-semibold hover:text-[#35406f] transition">Login</Link>
            <Link to="/auth" className="px-4 py-2 bg-white border border-[#9dbcf3] text-[#1d234e] rounded-full font-semibold hover:bg-[#9dbcf3] transition text-sm">Register</Link>
          </div>
        </nav>

        {/* Mobile Navigation Dropdown */}
        {menuOpen && (
          <div className="lg:hidden bg-[#e4e9f4] border-t border-gray-200 px-6 pt-4 pb-2">
            <div className="flex flex-col space-y-2 font-medium text-[#1d234e]">
              {navLinks}
              <Link to="/auth" className="px-4 py-2 rounded-md bg-white text-sm border border-[#9dbcf3] text-[#1d234e] font-semibold text-center hover:bg-[#9dbcf3] transition">
                Register
              </Link>
              <Link to="/auth" className="text-sm text-[#1d234e] text-center hover:text-[#35406f] transition">
                Login
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-24 relative z-10 pb-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#e4e9f4] pt-12 mt-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col items-start text-left">
            <div className="mb-4">
              <span className="inline-block text-[#1d234e] text-2xl font-bold">Wasl</span>
            </div>
            <p className="text-base text-gray-600 mb-4 max-w-xl">
              Making the world a better place through elegant, connected urban hierarchies.
            </p>
            <div className="flex gap-4 mb-10">
              <a href="#" className="text-gray-500 hover:text-[#1d234e]"><FaFacebookF /></a>
              <a href="#" className="text-gray-500 hover:text-[#1d234e]"><FaInstagram /></a>
              <a href="#" className="text-gray-500 hover:text-[#1d234e]"><FaTwitter /></a>
              <a href="#" className="text-gray-500 hover:text-[#1d234e]"><FaGithub /></a>
              <a href="#" className="text-gray-500 hover:text-[#1d234e]"><FaYoutube /></a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t pt-12">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Solutions</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#">Marketing</a></li>
                <li><a href="#">Analytics</a></li>
                <li><a href="#">Automation</a></li>
                <li><a href="#">Commerce</a></li>
                <li><a href="#">Insights</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#">Submit ticket</a></li>
                <li><a href="#">Documentation</a></li>
                <li><a href="#">Guides</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#">About</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Jobs</a></li>
                <li><a href="#">Press</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="#">Terms of service</a></li>
                <li><a href="#">Privacy policy</a></li>
                <li><a href="#">License</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t pt-6 text-center text-sm text-gray-400 mb-6">
            &copy; {new Date().getFullYear()} Wasl. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
