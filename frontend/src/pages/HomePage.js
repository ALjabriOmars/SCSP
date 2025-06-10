import React from "react";
import Layout from "../components/Layout";
import waslHero from "../assets/wasl_hero.png";
import about1 from "../assets/about1.png";
import about2 from "../assets/about2.png";
import about3 from "../assets/about3.png";
import { FaBus, FaRecycle, FaBolt, FaShieldAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function HomePage() {
  const services = [
    {
      icon: <FaBus />,
      title: "Transport",
      description: "Get real-time updates on public transport schedules and route changes.",
    },
    {
      icon: <FaRecycle />,
      title: "Waste",
      description: "Track garbage collection days and report waste-related issues instantly.",
    },
    {
      icon: <FaBolt />,
      title: "Energy",
      description: "Monitor energy usage patterns and receive outage alerts in your area.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Safety",
      description: "Receive emergency alerts and safety notifications from city authorities.",
    },
  ];

  const aboutSections = [
    {
      title: "Our Vision",
      text: "Wasl is committed to enhancing urban life in Oman by integrating essential public services through one seamless digital platform. From daily transport to public utility tracking, we empower residents with real-time access and control.",
      image: about1,
      reverse: false,
    },
    {
      title: "Smart Integration",
      text: "Every service on Wasl is optimized with IoT and data-driven insights. Our smart modules sync with city departments to ensure timely updates, energy management, waste scheduling, and citizen feedback loops.",
      image: about2,
      reverse: true,
    },
    {
      title: "People First",
      text: "Designed for ease and accessibility, Wasl adapts to the everyday needs of both citizens and visitors. Multilingual support, secure payment systems, and booking tools ensure everyone feels at home in the city.",
      image: about3,
      reverse: false,
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="-mt-7 relative z-10 bg-white min-h-[100vh] flex items-center px-6 md:px-12">
        <div className="relative z-10 flex flex-col-reverse md:flex-row items-center justify-between max-w-6xl mx-auto w-full">
          <div className="md:w-1/2 text-center md:text-left space-y-6 pb-10 md:pb-0">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Smarter Cities <br /> Begin with <span className="text-[#1d234e]">Wasl</span>
            </h1>
            <p className="text-lg">
              Seamlessly manage transportation, utilities, and safety from a single smart platform built for Oman.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4 mb-6">
              <Link to="/facilities">
                <button className="bg-[#1d234e] text-white px-5 py-2 text-sm rounded-md hover:bg-[#35406f] transition">
                  Explore!
                </button>
              </Link>
              <Link to="/auth">
                <button className="border border-[#1d234e] text-sm px-5 py-2 rounded-md hover:bg-[#9dbcf3] transition">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 mb-8 md:mb-0 flex justify-center">
            <img
              src={waslHero}
              alt="Wasl Smart City"
              className="w-4/5 max-w-xs md:max-w-md lg:max-w-lg object-contain"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-[#e4e9f4] px-4 sm:px-6 md:px-12 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">Smart City Services</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-md p-5 sm:p-6 flex flex-col items-center text-center hover:shadow-lg transition-all"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="text-4xl sm:text-5xl mb-3 text-[#1d234e]">{service.icon}</div>
              <h3 className="font-semibold text-base sm:text-lg mb-2">{service.title}</h3>
              <p className="text-sm sm:text-[0.9rem] text-gray-600">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Emergency Ticker */}
      <section className="relative w-full overflow-hidden bg-[#1d234e] py-4">
        <div className="whitespace-nowrap animate-marquee hover:[animation-play-state:paused] px-6">
          <p className="inline-block text-white font-semibold text-sm sm:text-base">
            🚨 Emergency Alert: Water disruption in Al Khuwair — Estimated restore by 8PM 🚨 Traffic diversion at Qurum roundabout 🚨 Hot weather advisory issued for Ruwi and Muttrah 🚨 New waste pickup schedule for Seeb starting tomorrow 🚨
          </p>
        </div>
      </section>

      {/* About Sections */}
      {aboutSections.map((section, index) => (
        <section key={index} className="relative bg-white py-20 px-6 md:px-12 overflow-hidden">
          <div
            className={`relative z-10 max-w-6xl mx-auto flex flex-col ${
              section.reverse ? "lg:flex-row-reverse" : "lg:flex-row"
            } items-center gap-12`}
          >
            <div className="lg:w-1/2 text-center lg:text-left space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">{section.title}</h2>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed">{section.text}</p>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <img
                src={section.image}
                alt={section.title}
                className="rounded-xl shadow-md max-w-xs w-full h-auto"
              />
            </div>
          </div>
        </section>
      ))}

      {/* Contact Section */}
      <section className="relative isolate bg-[#cdd5e4] px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Contact Us
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-600">
            We're here to help with any questions about Wasl or smart city integration.
          </p>
        </div>
        <form className="mx-auto mt-16 max-w-xl sm:mt-20">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <input className="border p-3 rounded-md" placeholder="First Name" />
            <input className="border p-3 rounded-md" placeholder="Last Name" />
            <input className="border p-3 rounded-md sm:col-span-2" placeholder="Company" />
            <input className="border p-3 rounded-md sm:col-span-2" placeholder="Email" />
            <textarea
              rows="4"
              className="border p-3 rounded-md sm:col-span-2"
              placeholder="Message"
            ></textarea>
          </div>
          <div className="mt-10">
            <button
              type="submit"
              className="block w-full rounded-md bg-[#1d234e] px-3.5 py-2.5 text-white text-sm font-semibold shadow-sm hover:bg-[#35406f]"
            >
              Let's talk
            </button>
          </div>
        </form>
      </section>
    </Layout>
  );
}
