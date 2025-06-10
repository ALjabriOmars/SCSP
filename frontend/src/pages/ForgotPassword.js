import React from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-[#e4e9f4] flex items-center justify-center relative overflow-hidden px-4">
      {/* Background Animation */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute w-48 h-48 bg-white opacity-40 blur-xl rounded-full top-[10%] left-[15%] animate-float1" />
        <div className="absolute w-40 h-40 bg-[#1d234e] opacity-30 blur-lg rounded-full top-[40%] left-[70%] animate-float2" />
        <div className="absolute w-72 h-72 bg-[#9dbcf3] opacity-40 blur-lg rounded-full top-[70%] left-[30%] animate-float3" />
        <div className="absolute w-32 h-32 bg-[#c5d7f8] opacity-35 blur-md rounded-full top-[20%] left-[85%] animate-float4" />
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-[#1d234e] mb-2">Forgot Password</h2>
        <p className="text-sm text-gray-600 mb-6">
          Enter your email address below and we'll send you a reset link.
        </p>
        <form className="space-y-4">
          <div className="text-left">
            <label className="block text-sm mb-1 font-medium text-[#1d234e]">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#1d234e] text-white py-2 rounded-md hover:bg-[#35406f] transition"
          >
            Send Reset Link
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-500">
          Remember your password?{" "}
          <Link to="/auth" className="text-[#1d234e] font-semibold hover:underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
