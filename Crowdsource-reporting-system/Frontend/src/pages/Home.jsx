import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Home = () => {
  const [showCards, setShowCards] = useState([false, false, false]);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ✅ New state

  useEffect(() => {
    // Animate feature cards
    setTimeout(() => setShowCards([true, false, false]), 700);
    setTimeout(() => setShowCards([true, true, false]), 1300);
    setTimeout(() => setShowCards([true, true, true]), 1900);

    // Check login status
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Blurred Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/forest-231066_1280.jpg')",
          filter: "blur(2px)",
        }}
      ></div>

      {/* Content */}
      <section className="relative py-16 min-h-screen flex flex-col items-center">
        <div className="container mx-auto px-6 flex flex-col items-center gap-10">

          {/* White Section */}
          <motion.div
            className="w-full bg-white/70 backdrop-blur-sm p-6 rounded-xl"
            style={{
              width: '100vw',
              marginLeft: 'calc(-50vw + 50%)',
              marginRight: 'calc(-50vw + 50%)'
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Text Above Slider */}
            <motion.div
              className="text-center max-w-3xl mx-auto mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-primary leading-tight mb-4">
                CivicConnect — Your Voice, Your City's Progress
              </h1>
              <p className="text-lg text-gray-700">
                Potholes, street light failures, water leakage, sanitation issues — 
                submit complaints quickly and track real-time updates through our public service system.
              </p>
            </motion.div>

            {/* Call to Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link
                to="/report"
                className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-secondary transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Report an Issue
              </Link>

              {/* ✅ Only show login button if not logged in */}
              {!isLoggedIn && (
                <Link
                  to="/login"
                  className="bg-accent text-primary px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Login to Dashboard
                </Link>
              )}
            </motion.div>

            {/* Image Slider */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000 }}
                loop={true}
                className="rounded-xl shadow-2xl max-w-4xl mx-auto"
              >
                <SwiperSlide>
                  <img
                    src="/pothole.png"
                    alt="Pothole"
                    className="w-full h-96 object-cover rounded-xl"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="/broken light (1).jpg"
                    alt="Street Light Issue"
                    className="w-full h-96 object-cover rounded-xl"
                  />
                </SwiperSlide>
                <SwiperSlide>
                  <img
                    src="/garbage.png"
                    alt="Garbage Issue"
                    className="w-full h-96 object-cover rounded-xl"
                  />
                </SwiperSlide>
              </Swiper>
            </motion.div>
          </motion.div>

          {/* Features Cards */}
          <div className="flex flex-col gap-6 mt-12 w-full max-w-4xl">
            {["Quick Reporting","Transparent Tracking","Community Impact"].map((title, idx) => (
              <motion.div
                key={idx}
                className={`bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center ${showCards[idx] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[-100px]'}`}
                initial={{ opacity: 0, y: -100 }}
                animate={showCards[idx] ? { opacity: 1, y: 0 } : { opacity: 0, y: -100 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="text-xl font-bold text-primary mb-3">{title}</h3>
                <p className="text-gray-600">
                  {idx === 0 && "Submit reports instantly with our user-friendly interface and track progress in real-time."}
                  {idx === 1 && "Monitor the status of your reports and see how authorities are addressing community issues."}
                  {idx === 2 && "Join thousands of citizens making a difference in building better, safer communities."}
                </p>
              </motion.div>
            ))}
          </div>

          {/* About Us */}
          <motion.div
            className="max-w-4xl text-center mt-12 bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <h2 className="text-3xl font-bold text-primary mb-4">About Us</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Our Smart Grievance Portal provides a fast and transparent way for citizens
              to report public issues. Whether it's damaged roads, faulty street lights,
              sanitation problems, water leakage, or waste management — this platform helps
              citizens connect directly with government departments and track the progress
              of their complaints.
              <br /><br />
              We aim to build a cleaner, safer, and more efficient community by encouraging
              active participation and improving communication between the public and officials.
            </p>
          </motion.div>

        </div>
      </section>
    </div>
  );
};

export default Home;
