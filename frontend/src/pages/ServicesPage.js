import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";
import Layout from "../components/Layout";

export default function ServicesPage() {
  return (
    <Layout>
      {/* Background Shapes */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
            <div
            key={i}
            className={`absolute rounded-full ${
                i % 2 === 0 ? "bg-[#9dbcf3]" : "bg-[#1d234e]"
            } animate-float-fast`}
            style={{
                width: `${20 + (i % 5) * 10}px`,
                height: `${20 + (i % 5) * 10}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.3 + (i % 3) * 0.2,
                animationDelay: `${Math.random() * 3}s`,
            }}
            ></div>
        ))}
      </div>

      {/* Hero */}
      <section
        className="-mt-16 relative h-[320px] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://img.lovepik.com/photo/20211124/small/lovepik-the-city-panorama-of-the-city-under-the-sunset-picture_500908664.jpg')",
        }}
      >
        <div className="px-6 py-8 rounded-md text-center text-white">
          <h1 className="text-3xl font-bold mb-2">Services</h1>
          <p className="text-sm">Explore smart city services across Muscat in real-time.</p>
        </div>
      </section>

      {/* Transport */}
      <section className="py-12 px-4 md:px-16 relative z-10">
        <h2 className="text-2xl font-bold mb-6">Transport</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            className="bg-white shadow-md p-6 rounded-xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-2">Real-time Delays</h3>
            <p className="text-sm text-gray-600">Live data coming from bus terminals...</p>
            <div className="mt-4 text-gray-800">
              🚌 Ruwi to Seeb – 10 min delay<br />
              🚍 Al Khuwair route running on time<br />
              🚏 Mabela Express: Minor congestion
            </div>
          </motion.div>

          <motion.div
            className="bg-white shadow-md p-6 rounded-xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-2">Route Maps</h3>
            <div className="w-full h-[200px] rounded-md overflow-hidden mt-3">
              <MapContainer
                center={[23.588, 58.382]}
                zoom={12}
                scrollWheelZoom={true}
                className="w-full h-full"
              >
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </MapContainer>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Waste */}
      <motion.section
        className="py-10 px-4 md:px-16 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-bold mb-4">Waste</h2>
        <div className="bg-white shadow-md p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">Collection Schedule</h3>
          <ul className="text-gray-700 space-y-1">
            <li>📍 Muttrah – Every Tuesday & Friday (7AM)</li>
            <li>📍 Al Khuwair – Monday, Wednesday, Saturday</li>
            <li>📍 Qurum – Thursday & Sunday</li>
          </ul>
        </div>
      </motion.section>

      {/* Energy */}
      <motion.section
        className="py-10 px-4 md:px-16 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-bold mb-4">Energy</h2>
        <div className="bg-white shadow-md p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">Energy Updates</h3>
          <ul className="text-gray-700 space-y-1">
            <li>⚡ Scheduled maintenance: Ruwi Substation (May 7th, 2AM–4AM)</li>
            <li>💡 Energy savings alert: Reduce consumption 6PM–9PM today</li>
            <li>🌤️ Solar panel performance forecast available for registered users</li>
          </ul>
        </div>
      </motion.section>

      {/* Water */}
      <motion.section
        className="py-10 px-4 md:px-16 mb-20 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-bold mb-4">Water</h2>
        <div className="bg-white shadow-md p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-2">Water Updates</h3>
          <ul className="text-gray-700 space-y-1">
            <li>🚱 Low pressure alert in Qurum Heights</li>
            <li>💧 Tanker refill schedule updated for Seeb area</li>
            <li>🔧 Pipeline upgrade ongoing in Al Ghubra (until May 10)</li>
          </ul>
        </div>
      </motion.section>
    </Layout>
  );
}
