import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // ✅ named import

const ReportForm = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [location, setLocation] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must log in first!");
      navigate("/login");
      return;
    }

    const decoded = jwtDecode(token);
    const user_id = decoded.users_id || decoded.admin_id;

    // Trim values to prevent only-space inputs
    if (!title.trim() || !categoryId.trim() || !location.trim()) {
      alert("Please fill all required fields (Title, Category, Location)!");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/reports",
        {
          title: title.trim(),
          description: description.trim(), // optional
          user_id,
          category_id: Number(categoryId),
          location: location.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Report submitted successfully!");
      navigate("/userdashboard");
    } catch (err) {
      console.error("Error submitting report:", err);
      alert("Failed to submit report.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-6"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1513682121497-80211f36a7d3')",
      }}
    >
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl p-10 w-full max-w-lg border-2 border-[#35ae5b]">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#35ae5b]">
          Submit a Report
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block font-medium text-[#35ae5b] mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-[#35ae5b] p-3 rounded-lg"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description (optional) */}
          <div>
            <label className="block font-medium text-[#35ae5b] mb-1">
              Description
            </label>
            <textarea
              className="w-full border border-[#35ae5b] p-3 rounded-lg"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block font-medium text-[#35ae5b] mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full border border-[#35ae5b] p-3 rounded-lg"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block font-medium text-[#35ae5b] mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full border border-[#35ae5b] p-3 rounded-lg"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#35ae5b] text-white p-3 rounded-lg hover:opacity-90"
          >
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;
