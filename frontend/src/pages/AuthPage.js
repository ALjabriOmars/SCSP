import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import FloatingShapes from "../components/FloatingShapes";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function AuthPage() {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState("Resident");
  const [showLogin, setShowLogin] = useState(true);
  const [department, setDepartment] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const roles = ["Resident", "Service Provider", "City Authority"];
  const departments = ["Waste", "Water", "Transport", "Energy", "Safety"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || (activeRole === "City Authority" && !department)) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        role: activeRole,
        department: activeRole === "City Authority" ? department : null,
      };
      const response = await axios.post("http://127.0.0.1:5000/api/auth/login", payload);
      const user = response.data.user;

      sessionStorage.setItem("user", JSON.stringify(user));
      setErrorMsg("");

      const userRole = user.role?.toLowerCase()?.trim();
      console.log("Logged in as:", userRole);

      if (userRole === "resident") {
        navigate("/resident-dashboard");
      } else if (userRole === "service provider") {
        navigate("/dashboard/provider");
      } else if (userRole === "city authority") {
        navigate("/dashboard/authority");
      } else {
        setErrorMsg("Unknown role received.");
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.error || "Login failed");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, phone, password, confirmPassword } = formData;

    if (!name || !email || !phone || !password || !confirmPassword || (activeRole === "City Authority" && !department)) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      const payload = {
        name,
        email,
        phone,
        password,
        role: activeRole,
        department: activeRole === "City Authority" ? department : null,
      };
      const response = await axios.post("http://127.0.0.1:5000/api/auth/register", payload);
      setErrorMsg("");
      alert("Registration successful!");
      setShowLogin(true);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#e4e9f4] px-4 py-10 overflow-hidden">
      <FloatingShapes />

      <div className="bg-white shadow-xl rounded-3xl p-8 max-w-md w-full relative z-10">
        {/* Role Tabs */}
        <div className="flex mb-6 border-b border-gray-200">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => {
                setActiveRole(role);
                setDepartment("");
                setErrorMsg("");
              }}
              className={`flex-1 py-2 font-medium text-sm ${
                activeRole === role
                  ? "border-b-2 border-[#1d234e] text-[#1d234e]"
                  : "text-gray-500"
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Toggle Login/Register */}
        <div className="flex justify-center mb-6 text-sm font-semibold text-[#1d234e]">
          <button
            className={`px-4 py-1 ${showLogin ? "border-b-2 border-[#1d234e]" : "text-gray-500"}`}
            onClick={() => {
              setShowLogin(true);
              setErrorMsg("");
            }}
          >
            Login
          </button>
          <span className="mx-2">/</span>
          <button
            className={`px-4 py-1 ${!showLogin ? "border-b-2 border-[#1d234e]" : "text-gray-500"}`}
            onClick={() => {
              setShowLogin(false);
              setErrorMsg("");
            }}
          >
            Register
          </button>
        </div>

        {/* ERROR MESSAGE */}
        {errorMsg && <p className="text-red-600 text-sm mb-4">{errorMsg}</p>}

        {/* Login Form */}
        {showLogin ? (
          <form className="space-y-4" onSubmit={handleLogin}>
            {activeRole === "City Authority" && (
              <div>
                <label className="block text-sm mb-1 font-medium">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Select department</option>
                  {departments.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm mb-1 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md pr-10"
                  placeholder="Enter password"
                />
                <span
                  className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            <div className="text-right text-xs">
              <Link to="/forgot-password" className="text-gray-500 hover:underline">
                Forgot password?
              </Link>
            </div>
            <button type="submit" className="w-full bg-[#1d234e] text-white py-2 rounded-md hover:bg-[#35406f]">
              Login
            </button>
          </form>
        ) : (
          <form className="space-y-4" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm mb-1 font-medium">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter email"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium">Phone Number</label>
              <div className="flex">
                <span className="flex items-center px-3 bg-gray-100 border border-r-0 rounded-l-md text-sm text-gray-600">
                  +968
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // remove non-digits
                    if (value.length <= 8) {
                      setFormData({ ...formData, phone: value });
                      setErrorMsg("");
                    }
                  }}
                  className="w-full px-3 py-2 border border-l-0 rounded-r-md"
                  placeholder="Enter 8-digit number"
                  maxLength={8}
                  pattern="\d{8}"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium">Role</label>
              <select
                value={activeRole}
                onChange={(e) => setActiveRole(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
              >
                {roles.map((role) => (
                  <option key={role}>{role}</option>
                ))}
              </select>
            </div>
            {activeRole === "City Authority" && (
              <div>
                <label className="block text-sm mb-1 font-medium">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Select department</option>
                  {departments.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm mb-1 font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md pr-10"
                  placeholder="Create password"
                />
                <span
                  className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md pr-10"
                  placeholder="Confirm password"
                />
                <span
                  className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            <button type="submit" className="w-full bg-[#1d234e] text-white py-2 rounded-md hover:bg-[#35406f]">
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
