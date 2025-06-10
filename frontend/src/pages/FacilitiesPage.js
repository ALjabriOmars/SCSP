import React from "react";
import { motion } from "framer-motion";
import Layout from "../components/Layout";

const facilitiesData = {
  "Community Halls": [
    {
      name: "Al Noor Hall",
      description: "A spacious hall ideal for weddings, exhibitions, and events.",
      image: "https://interclass.co.uk/wp-content/uploads/Southam-Community-Hall-13.jpg",
    },
    {
      name: "Seeb Community Center",
      description: "Multipurpose venue with seating for 300+ guests.",
      image: "https://cdn.prod.website-files.com/5f5f802796e665f5a78839b3/680763ebffc07a404220a6c9_HVCC_MainHall-09_20250416_100403.jpg",
    },
    {
      name: "Mutrah Conference Hall",
      description: "High-tech equipped conference space for business events.",
      image: "https://www.enfield.gov.uk/__data/assets/image/0026/28772/Community-halls.JPG",
    },
  ],
  "Sports Facilities": [
    {
      name: "Tennis Court A",
      description: "Synthetic surface tennis court with lighting.",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfgjyme4eZ8IM5ljhMwkdnlOfi1g4B3ko2WQ&s",
    },
    {
      name: "Olympic Swimming Pool",
      description: "Indoor heated pool with Olympic dimensions.",
      image: "https://www.rubbuk.com/wp-content/uploads/sites/2/2024/04/Multisport-1400x1400-1.webp",
    },
    {
      name: "Seeb Football Ground",
      description: "Professional football turf suitable for leagues.",
      image: "https://sportencommun.org/wp-content/uploads/2021/01/ddsc-900x477.png",
    },
  ],
  "Parks & Gardens": [
    {
      name: "Ruwi Central Park",
      description: "Large public park with walking trails and benches.",
      image: "https://pags.b-cdn.net/assets/uploads/places/_1200xAUTO_fit_center-center_none/Hestercombe-gardens.jpg?token=952b5efc-3cc6-48c3-b7b2-c52ee2a76609&width=1200&height=500",
    },
    {
      name: "Seeb Flower Garden",
      description: "Colorful garden with floral displays and fountains.",
      image: "https://hips.hearstapps.com/hmg-prod/images/park-monceau-in-paris-france-royalty-free-image-1576527110.jpg",
    },
    {
      name: "Mutrah Green Belt",
      description: "Urban green area with picnic spots and shade.",
      image: "https://www.visitpreston.com/image/13306/Winckley-Square-Gardens-in-Preston/related.jpg?m=1677682918407",
    },
  ],
  "Recreational Centers": [
    {
      name: "Ghala Activity Hub",
      description: "Indoor games, VR booths and learning pods.",
      image: "https://static.zawya.com/view/acePublic/alias/contentid/MTc4ZDgwNzUtNGZjMy00/0/boardroom-alsharqiyah-jpg.webp",
    },
    {
      name: "Kids Adventure World",
      description: "Playground, trampoline, and soft play zones for kids.",
      image: "https://www.nrpa.org/uploadedImages/wwwparksandrecreationorg/Articles/2015/May/RecCenter.gif",
    },
    {
      name: "Youth Culture Club",
      description: "Performance and rehearsal space for youth programs.",
      image: "https://laredoparksandrec.com/wp-content/uploads/2020/02/Fasken-Senior-Center-1.jpg",
    },
  ],
};

export default function FacilitiesPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <div
        className="-mt-16 relative h-[320px] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1513735539099-cf6e5d559d82?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFub3JhbWF8ZW58MHx8MHx8fDA%3D')`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 text-white text-center px-4">
          <h1 className="text-4xl font-bold mb-2">Available Facilities</h1>
          <p className="text-md">Discover, book, and enjoy our top-notch city amenities</p>
        </div>
      </div>

      <div className="bg-[#e4e9f4] px-6 py-12 text-[#1d234e]">
        {Object.entries(facilitiesData).map(([category, items]) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {items.map((facility, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition"
                >
                  <img
                    src={facility.image}
                    alt={facility.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{facility.name}</h3>
                    <p className="text-sm text-gray-600">{facility.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
