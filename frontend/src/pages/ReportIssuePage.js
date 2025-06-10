import React, { useState } from "react";
import Layout from "../components/Layout";
import axios from "axios";

export default function ReportIssuePage() {
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    location: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/issues/report", formData);
      alert("Issue reported successfully!");
      setFormData({ type: "", description: "", location: "" });
    } catch (error) {
      alert("Failed to report issue. Try again.");
      console.error(error);
    }
  };

  return (
    <Layout>
      <div
        className="-mt-16 relative h-[320px] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url('https://img.freepik.com/premium-photo/miami-florida-usa-skyline-bisayne-bay_1196024-61.jpg?semt=ais_hybrid&w=740')`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 text-white text-center px-4">
          <h1 className="text-4xl font-bold mb-2">Report an Issue</h1>
          <p className="text-md">Help us keep the city running smoothly by reporting problems in your area</p>
        </div>
      </div>

      <div className="min-h-screen bg-[#e4e9f4] text-[#1d234e] px-4 py-10 flex justify-center">
        <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold mb-6">Report Issue</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-medium mb-1">Issue Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full border rounded px-3 py-2"
              >
                <option value="">-- Select Issue Type --</option>
                <option value="Waste">Waste</option>
                <option value="Water">Water</option>
                <option value="Transport">Transport</option>
                <option value="Energy">Energy</option>
                <option value="Safety">Safety</option>
                <option value="Booking">Booking</option>
                <option value="Facilities">Facilities</option>
                <option value="Bug">Bug</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-1">Location</label>
              <input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter location of the issue"
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Description</label>
              <textarea
                name="description"
                rows={5}
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the issue in detail..."
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#1d234e] text-white py-2 rounded hover:bg-[#2f386b] transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
