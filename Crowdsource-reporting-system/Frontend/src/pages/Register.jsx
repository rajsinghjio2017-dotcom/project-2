import React, { useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [user_role] = useState("");
  const [redirect, setRedirect] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate fields are not empty or spaces only
    if (!name.trim() || !email.trim() || !password.trim() || !phone.trim() || !user_role.trim()) {
      alert("All fields are required!");
      return;
    }

    // Phone validation: exactly 10 digits
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      alert("Phone number must be exactly 10 digits!");
      return;
    }

    // Email validation: must be a Gmail
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      alert("Email must be a valid Gmail address (example@gmail.com)!");
      return;
    }

    // Password validation: exactly 6 characters
    if (password.length !== 6) {
      alert("Password must be exactly 6 characters!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/users", {
        name: name.trim(),
        email: email.trim(),
        password,
        phone,
        user_role: user_role.trim(),
      });
      alert("Registration successful!");
      setRedirect(true);
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message || "Registration failed. Try again!"
      );
    }
  };

  if (redirect) {
    return <Navigate to="/login" />;
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://plus.unsplash.com/premium_photo-1673240845266-2f2c432cf194?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y3Jvd2RlZCUyMHN0cmVldHxlbnwwfHwwfHx8MA%3D%3D')",
      }}
    >
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-10 w-96 border-2 border-[#35ae5b]">
        <h1 className="text-3xl font-bold mb-6 text-center text-[#35ae5b]">
          Register
        </h1>

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="block font-medium text-[#35ae5b] mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full p-3 border border-[#35ae5b] rounded-lg focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="block font-medium text-[#35ae5b] mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              className="w-full p-3 border border-[#35ae5b] rounded-lg focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="block font-medium text-[#35ae5b] mb-1">
              Password (6 characters) <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              className="w-full p-3 border border-[#35ae5b] rounded-lg focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="block font-medium text-[#35ae5b] mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full p-3 border border-[#35ae5b] rounded-lg focus:outline-none"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/*<div className="mb-4">
            <label className="block font-medium text-[#35ae5b] mb-1">
              User Role (admin / user) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full p-3 border border-[#35ae5b] rounded-lg focus:outline-none"
              value={user_role}
              onChange={(e) => setUserRole(e.target.value)}
            />
          </div>*/}

          <button
            type="submit"
            className="w-full bg-[#35ae5b] text-white p-3 rounded-lg hover:bg-[#35ae5b] transition"
          >
            Register
          </button>

          <p className="text-center mt-4 text-sm text-[#35ae5b]">
            Already have an account?{" "}
            <span
              className="text-[#35ae5b] cursor-pointer hover:underline"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
