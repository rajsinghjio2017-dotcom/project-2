import React from "react";
import { FaEnvelope, FaPhone } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-8 mt-10 font-serif">
      <div className="container mx-auto px-6">

        <div className="grid md:grid-cols-3 gap-6 text-center md:text-left">

          <div>
            <h2 className="text-2xl font-bold mb-2 font-serif">CivicConnect</h2>
            <p className="text-base text-accent font-light">
              Your Voice, Your City's Progress —<br />
              A simple and secure platform for managing reports and dashboards.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 font-serif">Quick Links</h3>
            <ul className="space-y-2 text-base font-light">
              <li><a href="/" className="hover:text-secondary transition-colors duration-300">Home</a></li>
              <li><a href="/report" className="hover:text-secondary transition-colors duration-300">Report</a></li>
              <li><a href="/login" className="hover:text-secondary transition-colors duration-300">Login</a></li>
              <li><a href="/userdashboard" className="hover:text-secondary transition-colors duration-300">Dashboard</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 font-serif">Contact Us</h3>
            <div className="space-y-2">
              <p className="text-base text-accent flex items-center justify-center md:justify-start gap-2 font-light">
                <FaEnvelope className="text-secondary" />
                <a
                  href="mailto:support@civicconnect.com"
                  className="hover:text-secondary transition-colors duration-300"
                >
                  support@civicconnect.com
                </a>
              </p>
              <p className="text-base text-accent flex items-center justify-center md:justify-start gap-2 font-light">
                <FaPhone className="text-secondary" />
                <a
                  href="tel:+919999999999"
                  className="hover:text-secondary transition-colors duration-300"
                >
                  +91 99999 99999
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary mt-8 pt-4 text-center text-base text-accent font-light">
          © {new Date().getFullYear()} CivicConnect. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
