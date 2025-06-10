import React, { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import Layout from "../components/Layout";

export default function BookingPage() {
  const [filters, setFilters] = useState({ type: "", capacity: 0 });
  const [booking, setBooking] = useState({ name: "", email: "" });
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize for accurate comparison

  const handleBookingSubmit = (e) => {
    e.preventDefault();

    if (!selectedDateRange) {
      setError("Please select a date or range of dates.");
      return;
    }

    const [startDate, endDate] = Array.isArray(selectedDateRange)
      ? selectedDateRange
      : [selectedDateRange, selectedDateRange];

    if (startDate < today) {
      setError("Cannot book a date in the past.");
      setSelectedDateRange(today);
      return;
    }

    setError("");
    setSummary({
      ...booking,
      startDate: startDate.toDateString(),
      endDate: endDate.toDateString(),
    });
  };

  const availableFacilities = [
    { type: "Hall", name: "Community Hall", capacity: 100 },
    { type: "Court", name: "Tennis Court", capacity: 20 },
    { type: "Park", name: "Sunshine Park", capacity: 200 },
  ];

  const filteredFacilities = availableFacilities.filter(
    (f) =>
      (!filters.type || f.type === filters.type) &&
      (!filters.capacity || f.capacity >= filters.capacity)
  );

  return (
    <Layout>

      {/* Hero Section */}
      <div
        className="-mt-16 relative h-[320px] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url('https://img.freepik.com/premium-photo/miami-florida-usa-skyline-bisayne-bay_1196024-61.jpg?semt=ais_hybrid&w=740')`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 text-white text-center px-4">
          <h1 className="text-4xl font-bold mb-2">Booking</h1>
          <p className="text-md">Discover, book, and enjoy our top-notch city amenities</p>
        </div>
      </div>

      <div className="min-h-screen bg-[#e4e9f4] text-[#1d234e] px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Calendar */}
          <div className="bg-white rounded-xl p-4 shadow-md text-center">
            <h2 className="text-lg font-semibold mb-2">Availability Calendar</h2>
            <Calendar
              selectRange={true}
              onChange={setSelectedDateRange}
              value={selectedDateRange}
              className="w-full max-w-sm mx-auto border-none"
              tileDisabled={({ date, view }) =>
                view === 'month' && date < today
              }
            />
            <p className="mt-2 text-sm text-gray-600">
              Selected:{" "}
              {selectedDateRange
                ? Array.isArray(selectedDateRange)
                  ? `${selectedDateRange[0].toDateString()} to ${selectedDateRange[1]?.toDateString() || selectedDateRange[0].toDateString()}`
                  : selectedDateRange.toDateString()
                : "No date selected"}
            </p>
            {error && (
              <p className="mt-2 text-sm text-red-600 font-semibold">{error}</p>
            )}
          </div>

          {/* Booking Form */}
          <div className="md:col-span-2 bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Booking Confirmation</h2>
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your name"
                value={booking.name}
                onChange={(e) => setBooking({ ...booking, name: e.target.value })}
                className="w-full border px-4 py-2 rounded"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={booking.email}
                onChange={(e) => setBooking({ ...booking, email: e.target.value })}
                className="w-full border px-4 py-2 rounded"
                required
              />
              <input
                type="text"
                value={
                  selectedDateRange
                    ? Array.isArray(selectedDateRange)
                      ? `${selectedDateRange[0].toDateString()} to ${selectedDateRange[1]?.toDateString() || selectedDateRange[0].toDateString()}`
                      : selectedDateRange.toDateString()
                    : ""
                }
                disabled
                className="w-full border px-4 py-2 rounded bg-gray-100"
              />
              <button
                type="submit"
                className="w-full bg-[#1d234e] text-white py-2 rounded hover:bg-[#2f386b]"
              >
                Confirm Booking
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Facility Filters */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-lg font-semibold mb-4">Facility Filters</h2>
            <div className="flex items-center space-x-4">
              <select
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                className="border px-3 py-2 rounded w-1/2"
              >
                <option value="">Type</option>
                <option value="Hall">Hall</option>
                <option value="Court">Court</option>
                <option value="Park">Park</option>
              </select>
              <input
                type="number"
                placeholder="Capacity"
                value={filters.capacity}
                onChange={(e) => setFilters({ ...filters, capacity: parseInt(e.target.value) })}
                className="border px-3 py-2 rounded w-1/2"
              />
            </div>
            <div className="mt-4 text-sm">
              <p className="font-semibold mb-1">Matching Facilities:</p>
              {filteredFacilities.length > 0 ? (
                <ul className="list-disc ml-4 space-y-1">
                  {filteredFacilities.map((f, idx) => (
                    <li key={idx}>
                      {f.name} – Type: {f.type}, Capacity: {f.capacity}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No facilities found.</p>
              )}
            </div>
          </div>

          {/* Reservation Summary */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-lg font-semibold mb-4">Reservation Summary</h2>
            {summary ? (
              <ul className="text-sm space-y-1">
                <li><strong>Name:</strong> {summary.name}</li>
                <li><strong>Email:</strong> {summary.email}</li>
                <li><strong>Date(s):</strong> {summary.startDate} to {summary.endDate}</li>
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No booking yet.</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
