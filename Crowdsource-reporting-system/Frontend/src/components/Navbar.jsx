import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser({
        role: payload.user_role,       // "admin" or "user"
        userId: payload.user_id,       // store user id if needed
      });
    } catch (err) {
      console.error("Invalid token");
      localStorage.removeItem("token");
      setUser(null);
    }

    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setShowDropdown(false);
    navigate("/login");
  };

  if (loading) return null;

  return (
    <header className="bg-primary text-white w-full shadow-lg rounded-b-3xl">
      <div className="px-8 py-6 flex justify-between items-center">

        {/* Logo */}
        <div
          className="flex items-center space-x-3 text-2xl font-bold cursor-pointer"
          onClick={() => navigate(user?.role === "admin" ? "/admindashboard" : "/")}
        >
          <img src="/responsibility (1).png" alt="Logo" className="w-12 h-12" />
          <span>CivicConnect</span>
        </div>

        <nav className="flex items-center space-x-6">

          {/* Home: Only for guest or normal users */}
          {(!user || user.role === "user") && (
            <Link to="/" className="hover:text-gray-200 transition">
              Home
            </Link>
          )}

          {/* Dashboard: Only for normal users */}
          {user?.role === "user" && (
            <Link to="/userdashboard" className="hover:text-gray-200 transition">
              Dashboard
            </Link>
          )}

          {/* Admin Panel: Only for admins */}
          {user?.role === "admin" && (
            <Link to="/admindashboard" className="text-yellow-400 font-semibold">
              Admin Panel
            </Link>
          )}

          {/* Login: Only for guest */}
          {!user && (
            <Link to="/login" className="hover:text-gray-200 transition">
              Login
            </Link>
          )}

          {/* Avatar: Shows 'A' for admin, 'U' for user */}
          {user && (
            <div className="relative">
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold cursor-pointer
                  ${user.role === "admin" ? "bg-red-500" : "bg-green-500"}`}
              >
                {user.role === "admin" ? "A" : "U"}
              </div>

              <AnimatePresence>
                {showDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                    <motion.div
                      className="absolute right-0 mt-2 w-40 bg-white text-black rounded-xl shadow-xl z-20 overflow-hidden"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <div className="px-4 py-2 border-b text-sm font-semibold text-gray-500">
                        {user.role === "admin" ? "Admin" : "User"}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-3 hover:bg-gray-100 w-full text-left text-red-600 font-medium transition"
                      >
                        Logout
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
