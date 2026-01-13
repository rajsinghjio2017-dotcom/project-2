import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [view, setView] = useState("dashboard");
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [inProgressCount, setInProgressCount] = useState(0); // Renamed from processed
  const [resolvedCount, setResolvedCount] = useState(0);
  const [totalReports, setTotalReports] = useState(0);
  const [updatingReportId, setUpdatingReportId] = useState(null);

  const token = localStorage.getItem("token");

  
  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:5000/reports", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      setReports(data);
      setTotalReports(data.length);

      setPendingCount(data.filter((r) => r.status === "Pending").length);
      setInProgressCount(data.filter((r) => r.status === "In Progress").length);
      setResolvedCount(data.filter((r) => r.status === "Resolved").length);
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://localhost:5000/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => {
    if (view === "dashboard" || view === "allReports") fetchReports();
    if (view === "dashboard" || view === "employees") fetchEmployees();
    if (view === "users") fetchUsers();
  }, [view]);

  // ================== JSX ==================
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#35ae5b] text-white p-5 shadow-xl hidden md:block">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        <nav className="space-y-4">
          <button onClick={() => setView("dashboard")} className="block w-full text-left p-2 rounded hover:bg-green-800">Dashboard</button>
          <button onClick={() => setView("allReports")} className="block w-full text-left p-2 rounded hover:bg-green-800">Show All Reports</button>
          <button onClick={() => setView("users")} className="block w-full text-left p-2 rounded hover:bg-green-800">Users</button>
          <button onClick={() => setView("employees")} className="block w-full text-left p-2 rounded hover:bg-green-800">Employees</button>
          <button onClick={handleLogout} className="block w-full text-left p-2 rounded hover:bg-green-800">Logout</button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#35ae5b]">Admin Dashboard</h1>
          <span className="font-semibold">Welcome, Admin</span>
        </div>

        {/* DASHBOARD VIEW */}
        {view === "dashboard" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
              <div className="bg-white p-5 shadow-md rounded-xl border-l-4 border-yellow-500">
                <h3 className="text-lg font-semibold">Pending</h3>
                <p className="text-3xl font-bold mt-2">{pendingCount}</p>
              </div>
              <div className="bg-white p-5 shadow-md rounded-xl border-l-4 border-orange-500">
                <h3 className="text-lg font-semibold">In Progress</h3>
                <p className="text-3xl font-bold mt-2">{inProgressCount}</p>
              </div>
              <div className="bg-white p-5 shadow-md rounded-xl border-l-4 border-green-500">
                <h3 className="text-lg font-semibold">Resolved</h3>
                <p className="text-3xl font-bold mt-2">{resolvedCount}</p>
              </div>
              <div className="bg-white p-5 shadow-md rounded-xl border-l-4 border-blue-500">
                <h3 className="text-lg font-semibold">Total Reports</h3>
                <p className="text-3xl font-bold mt-2">{totalReports}</p>
              </div>
              <div className="bg-white p-5 shadow-md rounded-xl border-l-4 border-purple-600">
                <h3 className="text-lg font-semibold">Employees</h3>
                <p className="text-3xl font-bold mt-2">{employees.length}</p>
              </div>
            </div>

            {/* Latest Reports Table */}
            <div className="bg-white shadow-lg rounded-xl p-5 overflow-x-auto">
              <h2 className="text-xl font-bold text-[#35ae5b] mb-4">Latest Reports</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#35ae5b] text-white text-left">
                    <th className="p-3">Report ID</th>
                    <th className="p-3">Title</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Created At</th>
                    <th className="p-3">Assigned</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => (
                    <tr key={r.report_id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{r.report_id}</td>
                      <td className="p-3 font-semibold">{r.title}</td>
                      <td className="p-3">{r.location}</td>

                      <td className="p-3">
                        <select
                          value={r.status}
                          onChange={async (e) => {
                            const newStatus = e.target.value;
                            setUpdatingReportId(r.report_id);
                            try {
                              await axios.put(
                                `http://localhost:5000/reports/${r.report_id}/status`,
                                { status: newStatus },
                                { headers: { Authorization: `Bearer ${token}` } }
                              );
                              fetchReports(); 
                            } catch (err) {
                              console.error("Update failed:", err);
                              alert("Update failed! Database only allows: Pending, In Progress, Resolved");
                            } finally {
                              setUpdatingReportId(null);
                            }
                          }}
                          className="border rounded px-2 py-1"
                          disabled={updatingReportId === r.report_id}
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </td>

                      <td className="p-3">{r.created_at}</td>

                      <td className="p-3">
                        <select
                          value={r.assigned_emp_id || ""}
                          onChange={async (e) => {
                            const empId = e.target.value || null;
                            setUpdatingReportId(r.report_id);
                            try {
                              if (empId) {
                                await axios.put(
                                  `http://localhost:5000/reports/${r.report_id}/assign`,
                                  { assigned_emp_id: empId },
                                  { headers: { Authorization: `Bearer ${token}` } }
                                );
                              } else {
                                await axios.put(
                                  `http://localhost:5000/reports/${r.report_id}/unassign`,
                                  {},
                                  { headers: { Authorization: `Bearer ${token}` } }
                                );
                              }
                              fetchReports();
                              fetchEmployees();
                            } catch (err) {
                              console.error(err);
                              alert("Failed to assign employee!");
                            } finally {
                              setUpdatingReportId(null);
                            }
                          }}
                          className="border rounded px-2 py-1"
                          disabled={updatingReportId === r.report_id}
                        >
                          <option value="">Not Assigned</option>
                          {employees.map((emp) => (
                            <option
                              key={emp.emp_id}
                              value={emp.emp_id}
                              disabled={emp.availability?.toLowerCase() === "busy" && r.assigned_emp_id !== emp.emp_id}
                            >
                              {emp.name} {emp.availability?.toLowerCase() === "busy" && r.assigned_emp_id !== emp.emp_id ? "(Busy)" : ""}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

       
        {view === "users" && (
          <div className="bg-white shadow-lg rounded-xl p-5 overflow-x-auto">
            <h2 className="text-xl font-bold text-[#35ae5b] mb-4">Users</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#35ae5b] text-white text-left">
                  <th className="p-3">User ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.user_id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{u.user_id}</td>
                    <td className="p-3">{u.name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{u.phone}</td>
                    <td className="p-3">{u.user_role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === "employees" && (
          <div className="bg-white shadow-lg rounded-xl p-5 overflow-x-auto">
            <h2 className="text-xl font-bold text-[#35ae5b] mb-4">Employees</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#35ae5b] text-white text-left">
                  <th className="p-3">ID</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Specialization</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Area</th>
                  <th className="p-3">Availability</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((e) => (
                  <tr key={e.emp_id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{e.emp_id}</td>
                    <td className="p-3">{e.name}</td>
                    <td className="p-3">{e.specialization}</td>
                    <td className="p-3">{e.contact_number}</td>
                    <td className="p-3">{e.assigned_area}</td>
                    <td className="p-3">{e.availability}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {view === "allReports" && (
          <div className="bg-white shadow-lg rounded-xl p-5 overflow-x-auto">
            <h2 className="text-xl font-bold text-[#35ae5b] mb-4">All Reports</h2>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#35ae5b] text-white text-left">
                  <th className="p-3">Report ID</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Location</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Created At</th>
                  <th className="p-3">Assigned Employee</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.report_id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{r.report_id}</td>
                    <td className="p-3 font-semibold">{r.title}</td>
                    <td className="p-3">{r.location}</td>
                    <td className="p-3">{r.status}</td>
                    <td className="p-3">{r.created_at}</td>
                    <td className="p-3">{r.employee_name || "Not Assigned"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;