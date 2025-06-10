import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBell, FaTimes, FaUserCircle } from "react-icons/fa";

export default function ResidentDashboard() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/auth");
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/auth");
  };

  const activeIssues = [
    { title: "Broken streetlight", date: "May 5, 2025" },
    { title: "Garbage overflow", date: "May 6, 2025" },
  ];

  const bookings = [
    { title: "Community Hall", date: "May 10, 2025" },
    { title: "Tennis Court", date: "May 12, 2025" },
  ];

  const notifications = [
    "🛠️ Issue 'Broken streetlight' is being resolved.",
    "✅ Your booking for the Community Hall on May 10 is confirmed.",
    "📢 New recycling policy update for your area.",
    "🚧 Street maintenance planned on May 8 in your neighborhood.",
  ];

  return (
    <div className="min-h-screen bg-[#e4e9f4] text-[#1d234e] px-4 py-6 md:px-12 lg:px-24">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">Resident Dashboard</h1>
          <p className="text-sm text-gray-600">Welcome to your smart city portal</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNotifications(true)}
            className="flex items-center gap-2 bg-white text-[#1d234e] px-4 py-2 rounded-md shadow hover:shadow-md transition"
          >
            <FaBell className="text-lg" />
            Notifications
          </button>
          <button onClick={() => setShowProfile(true)}>
            <FaUserCircle className="text-3xl text-[#1d234e]" />
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Active Issues</h2>
          <ul className="space-y-4">
            {activeIssues.map((issue, i) => (
              <li key={i} className="p-4 rounded-lg border border-gray-200 hover:shadow-sm transition">
                <p className="font-medium">{issue.title}</p>
                <p className="text-sm text-gray-500">{issue.date}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Upcoming Bookings</h2>
          <ul className="space-y-4">
            {bookings.map((booking, i) => (
              <li key={i} className="p-4 rounded-lg border border-gray-200 hover:shadow-sm transition">
                <p className="font-medium">{booking.title}</p>
                <p className="text-sm text-gray-500">{booking.date}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-center gap-6">
        <Link to="/report-issue">
          <button className="bg-[#1d234e] text-white px-6 py-3 rounded-md hover:bg-[#2a3159] transition font-medium w-60">
            Report Issue
          </button>
        </Link>
        <Link to="/book-facility">
          <button className="bg-[#1d234e] text-white px-6 py-3 rounded-md hover:bg-[#2a3159] transition font-medium w-60">
            Book Facility
          </button>
        </Link>
      </div>

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg relative shadow-lg">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={() => setShowNotifications(false)}
            >
              <FaTimes size={18} />
            </button>
            <h2 className="text-lg font-semibold text-[#1d234e] mb-4">Your Notifications</h2>
            <ul className="space-y-3 text-sm">
              {notifications.map((note, i) => (
                <li key={i} className="border-b pb-2">{note}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && user && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm relative shadow-lg">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={() => setShowProfile(false)}
            >
              <FaTimes size={18} />
            </button>
            <h2 className="text-lg font-semibold text-[#1d234e] mb-4">Your Profile</h2>
            <ul className="text-sm text-[#1d234e] space-y-2">
              <li><strong>Name:</strong> {user.full_name}</li>
              <li><strong>Email:</strong> {user.email}</li>
              <li><strong>Role:</strong> {user.role}</li>
            </ul>
            <button
              onClick={handleLogout}
              className="mt-6 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
