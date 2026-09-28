import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend
} from "recharts";

const SuperAdminPanel = () => {
  const navigate = useNavigate();
  const [ngos, setNgos]           = useState([]);
  const [users, setUsers]         = useState([]);
  const [flags, setFlags]         = useState([]);
  const [stats, setStats]         = useState({});
  const [activeTab, setActiveTab] = useState("ngos");
  const [loading, setLoading]     = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [ngoRes, userRes, flagRes, statsRes] = await Promise.all([
        axios.get("http://localhost:8080/api/admin/ngos",
          { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:8080/api/admin/users",
          { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:8080/api/admin/flags",
          { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:8080/api/admin/stats",
          { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setNgos(ngoRes.data);
      setUsers(userRes.data);
      setFlags(flagRes.data);
      setStats(statsRes.data);
    } catch (err) {
      toast.error("Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  const handleApproveNGO = async (ngoId) => {
    try {
      await axios.put(
        `http://localhost:8080/api/admin/ngos/${ngoId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("NGO approved successfully!");
      fetchAll();
    } catch (err) {
      toast.error("Failed to approve NGO.");
    }
  };

  const handleRejectNGO = async (ngoId) => {
    try {
      await axios.put(
        `http://localhost:8080/api/admin/ngos/${ngoId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.warning("NGO rejected.");
      fetchAll();
    } catch (err) {
      toast.error("Failed to reject NGO.");
    }
  };

  const handleResolveFlag = async (flagId) => {
    try {
      await axios.put(
        `http://localhost:8080/api/admin/flags/${flagId}/resolve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Flag resolved.");
      fetchAll();
    } catch (err) {
      toast.error("Failed to resolve flag.");
    }
  };

  const handleToggleUser = async (userId, active) => {
    try {
      await axios.put(
        `http://localhost:8080/api/admin/users/${userId}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(active ? "User deactivated." : "User activated.");
      fetchAll();
    } catch (err) {
      toast.error("Failed to update user.");
    }
  };

  // Chart data
  const chartData = [
    { name: "Total Donated",  value: stats.totalDonated  || 0 },
    { name: "Total Spent",    value: stats.totalSpent    || 0 },
    { name: "Total NGOs",     value: stats.totalNgos     || 0 },
    { name: "Total Donors",   value: stats.totalDonors   || 0 },
  ];

  const tabStyle = (tab) =>
    `px-5 py-2 rounded-xl font-semibold text-sm transition duration-150 ${
      activeTab === tab
        ? "bg-gray-800 text-white"
        : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
    }`;

  const getNGOStatusStyle = (status) => {
    if (status === "APPROVED") return "bg-green-100 text-green-700";
    if (status === "PENDING")  return "bg-yellow-100 text-yellow-700";
    if (status === "REJECTED") return "bg-red-100 text-red-600";
    return "bg-gray-100 text-gray-500";
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-gray-900 text-white px-8 py-4
                      flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">⚙️ Super Admin Panel</h1>
          <p className="text-gray-400 text-xs">
            Full platform control & oversight
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-teal-500 px-4 py-1 rounded-lg
                       font-medium hover:bg-teal-600"
          >
            Public Dashboard
          </button>
          <button
            onClick={() => { localStorage.clear(); navigate("/login"); }}
            className="bg-red-600 px-4 py-1 rounded-lg
                       font-medium hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="p-8">

        {/* Page Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Platform Overview 🎛️
        </h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl shadow p-5 text-center">
            <p className="text-gray-400 text-sm mb-1">Total Donated</p>
            <p className="text-2xl font-bold text-teal-600">
              ₹{stats.totalDonated?.toLocaleString() || "0"}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5 text-center">
            <p className="text-gray-400 text-sm mb-1">NGOs Registered</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.totalNgos || 0}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5 text-center">
            <p className="text-gray-400 text-sm mb-1">Total Donors</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.totalDonors || 0}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5 text-center">
            <p className="text-gray-400 text-sm mb-1">Open Flags</p>
            <p className="text-2xl font-bold text-red-600">
              {flags.filter((f) => !f.resolved).length}
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Platform Statistics Overview
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="value"
                fill="#1F2937"
                radius={[4, 4, 0, 0]}
                name="Value"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab("ngos")}
            className={tabStyle("ngos")}
          >
            🏢 NGO Approvals
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={tabStyle("users")}
          >
            👥 All Users
          </button>
          <button
            onClick={() => setActiveTab("flags")}
            className={tabStyle("flags")}
          >
            🚩 Flags ({flags.filter((f) => !f.resolved).length})
          </button>
        </div>

        {/* Tab — NGO Approvals */}
        {activeTab === "ngos" && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              NGO Registration Requests
            </h3>
            {loading ? (
              <p className="text-center text-gray-400 py-10">
                Loading...
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600">
                      <th className="px-4 py-3">NGO Name</th>
                      <th className="px-4 py-3">Reg. No.</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Certificate</th>
                      <th className="px-4 py-3">Registered On</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ngos.length > 0 ? (
                      ngos.map((n, i) => (
                        <tr key={i}
                            className="border-t hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">
                            {n.name}
                          </td>
                          <td className="px-4 py-3 text-gray-500
                                         font-mono text-xs">
                            {n.registrationNo}
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {n.email}
                          </td>
                          <td className="px-4 py-3">
                            {n.certificateUrl ? (
                              
                                href={n.certificateUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-500 hover:underline
                                           text-xs"
                              >
                                View
                              </a>
                            ) : (
                              <span className="text-gray-400 text-xs">
                                N/A
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-400 text-xs">
                            {n.registeredOn}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full
                              text-xs font-semibold
                              ${getNGOStatusStyle(n.status)}`}>
                              {n.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {n.status === "PENDING" && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() =>
                                    handleApproveNGO(n.ngoId)
                                  }
                                  className="bg-green-500 hover:bg-green-600
                                             text-white px-3 py-1 rounded-lg
                                             text-xs font-semibold"
                                >
                                  ✓ Approve
                                </button>
                                <button
                                  onClick={() =>
                                    handleRejectNGO(n.ngoId)
                                  }
                                  className="bg-red-500 hover:bg-red-600
                                             text-white px-3 py-1 rounded-lg
                                             text-xs font-semibold"
                                >
                                  ✕ Reject
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7"
                            className="text-center text-gray-400 py-8">
                          No NGO registrations found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab — Users */}
        {activeTab === "users" && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              All Registered Users
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-gray-50 text-gray-600">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Joined On</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((u, i) => (
                      <tr key={i}
                          className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{u.name}</td>
                        <td className="px-4 py-3 text-gray-500">
                          {u.email}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {u.phone}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs
                            font-semibold ${
                              u.role === "DONOR"
                                ? "bg-blue-100 text-blue-700"
                                : u.role === "NGO_ADMIN"
                                ? "bg-purple-100 text-purple-700"
                                : u.role === "AUDITOR"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-gray-100 text-gray-600"
                            }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs">
                          {u.joinedOn}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs
                            font-semibold ${
                              u.active
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600"
                            }`}>
                            {u.active ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() =>
                              handleToggleUser(u.userId, u.active)
                            }
                            className={`px-3 py-1 rounded-lg text-xs
                              font-semibold text-white ${
                                u.active
                                  ? "bg-red-500 hover:bg-red-600"
                                  : "bg-green-500 hover:bg-green-600"
                              }`}
                          >
                            {u.active ? "Deactivate" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7"
                          className="text-center text-gray-400 py-8">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab — Flags */}
        {activeTab === "flags" && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Irregularity Flags from Auditors
            </h3>
            {flags.length > 0 ? (
              <div className="space-y-4">
                {flags.map((f, i) => (
                  <div
                    key={i}
                    className={`rounded-xl p-4 border-l-4 ${
                      f.resolved
                        ? "border-green-400 bg-green-50"
                        : "border-red-500 bg-red-50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-800">
                          🚩 Campaign ID: {f.campaignId}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Flagged by: {f.auditorName} · {f.flaggedOn}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs
                        font-semibold ${
                          f.resolved
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}>
                        {f.resolved ? "Resolved" : "Open"}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mb-3">
                      {f.remarks}
                    </p>
                    {!f.resolved && (
                      <button
                        onClick={() => handleResolveFlag(f.flagId)}
                        className="bg-green-500 hover:bg-green-600
                                   text-white px-4 py-1.5 rounded-lg
                                   text-xs font-semibold"
                      >
                        ✓ Mark as Resolved
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-green-600 text-lg font-semibold">
                  ✅ No flags raised!
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Platform is running clean with no irregularities.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default SuperAdminPanel;