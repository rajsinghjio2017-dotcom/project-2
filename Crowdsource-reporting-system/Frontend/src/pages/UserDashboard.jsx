import React, { useEffect, useState } from "react";
import axios from "axios";

const UserDashboard = () => {
  const [reports, setReports] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    location: "",
  });

  const token = localStorage.getItem("token");

  // FETCH REPORTS AND CATEGORIES
  const fetchData = async () => {
    if (!token) {
      window.location.href = "/login";
      return;
    }

    setLoading(true);
    setError("");

    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [reportsRes, categoriesRes] = await Promise.all([
        axios.get("http://localhost:5000/reports", { headers }),
        axios.get("http://localhost:5000/categories"),
      ]);

      // Log to debug
      console.log("Reports response:", reportsRes.data);
      console.log("Categories response:", categoriesRes.data);

      setReports(reportsRes.data);
      setCategories(categoriesRes.data);

      // Set default category if empty
      if (categoriesRes.data.length > 0 && !formData.category_id) {
        setFormData((prev) => ({ ...prev, category_id: categoriesRes.data[0].category_id }));
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data. Check backend and token.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  // SUBMIT REPORT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.category_id) {
      alert("Title and Category are required");
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post("http://localhost:5000/reports", formData, { headers });

      // Reset form and close modal
      setFormData({ title: "", description: "", category_id: formData.category_id, location: "" });
      setShowModal(false);

      // Refresh reports
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to submit report. Check backend or category ID.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#35ae5b]">My Reports</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#35ae5b] text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition"
        >
          + New Report
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow-lg rounded-xl p-4 overflow-x-auto max-w-5xl mx-auto">
        {loading && <p className="text-center py-6">Loading...</p>}
        {error && <p className="text-center text-red-500 py-6">{error}</p>}
        {!loading && reports.length === 0 && !error && <p className="text-center py-6">No reports yet.</p>}

        {!loading && reports.length > 0 && (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#35ae5b] text-white text-left">
                <th className="p-3">ID</th>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Status</th>
                <th className="p-3">Assigned To</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.report_id} className="border-b hover:bg-gray-50">
                  <td className="p-3">#{r.report_id}</td>
                  <td className="p-3 font-semibold">{r.title}</td>
                  <td className="p-3">{r.category_name || r.category}</td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        r.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : r.status === "In Progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3 text-gray-600 italic">
                    {r.employee_name || (r.assigned_emp_id ? "Technician Assigned" : "Awaiting Assignment")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-[#35ae5b]">Report an Issue</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                required
                className="w-full border p-2 rounded focus:outline-none focus:border-[#35ae5b]"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />

              <select
                className="w-full border p-2 rounded focus:outline-none focus:border-[#35ae5b]"
                value={formData.category_id}
                required
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              >
                {categories.length === 0 && <option value="">No categories</option>}
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <textarea
                placeholder="Description"
                required
                className="w-full border p-2 rounded focus:outline-none focus:border-[#35ae5b]"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />

              <input
                type="text"
                placeholder="Location"
                className="w-full border p-2 rounded focus:outline-none focus:border-[#35ae5b]"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />

              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-500 hover:text-gray-700">
                  Cancel
                </button>
                <button type="submit" className="bg-[#35ae5b] text-white px-4 py-2 rounded font-bold hover:bg-green-700">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
