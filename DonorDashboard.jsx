import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toast } from "react-toastify";

const COLORS = ["#2E86C1", "#27AE60", "#E74C3C", "#F39C12"];

const DonorDashboard = () => {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({
    totalDonated: 0,
    totalCampaigns: 0,
    lastDonation: "",
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/donor/my-donations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDonations(res.data);

      // Calculate stats
      const total = res.data.reduce((sum, d) => sum + d.amount, 0);
      const campaigns = new Set(res.data.map((d) => d.campaignId)).size;
      const last = res.data.length > 0 ? res.data[0].donatedOn : "N/A";
      setStats({ totalDonated: total, totalCampaigns: campaigns, lastDonation: last });
    } catch (err) {
      toast.error("Failed to load donations.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Chart data
  const chartData = donations.slice(0, 4).map((d) => ({
    name: d.campaignTitle,
    value: d.amount,
  }));

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-blue-700 text-white px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🌱 NGO Fund Portal</h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/campaigns")}
            className="bg-white text-blue-700 px-4 py-1 rounded-lg font-medium hover:bg-blue-100"
          >
            Browse Campaigns
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-1 rounded-lg font-medium hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="p-8">

        {/* Welcome */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Welcome back, Donor 👋
        </h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-gray-500 text-sm mb-1">Total Donated</p>
            <p className="text-3xl font-bold text-blue-600">
              ₹{stats.totalDonated.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-gray-500 text-sm mb-1">Campaigns Supported</p>
            <p className="text-3xl font-bold text-green-600">
              {stats.totalCampaigns}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-gray-500 text-sm mb-1">Last Donation</p>
            <p className="text-3xl font-bold text-orange-500">
              {stats.lastDonation}
            </p>
          </div>
        </div>

        {/* Chart + Table Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Pie Chart */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Donation Breakdown
            </h3>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ₹${value}`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400 text-center mt-10">
                No donations yet. Browse campaigns to donate!
              </p>
            )}
          </div>

          {/* Donation History Table */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Donation History
            </h3>
            <div className="overflow-y-auto max-h-60">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-gray-50 text-gray-600">
                    <th className="px-3 py-2">Campaign</th>
                    <th className="px-3 py-2">Amount</th>
                    <th className="px-3 py-2">Date</th>
                    <th className="px-3 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.length > 0 ? (
                    donations.map((d, i) => (
                      <tr key={i} className="border-t hover:bg-gray-50">
                        <td className="px-3 py-2 font-medium">{d.campaignTitle}</td>
                        <td className="px-3 py-2 text-blue-600 font-semibold">
                          ₹{d.amount}
                        </td>
                        <td className="px-3 py-2 text-gray-500">{d.donatedOn}</td>
                        <td className="px-3 py-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              d.paymentStatus === "SUCCESS"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {d.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-gray-400 py-6">
                        No donations found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Browse Campaigns Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/campaigns")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold
                       px-8 py-3 rounded-xl text-lg transition duration-200"
          >
            🔍 Browse All Campaigns
          </button>
        </div>

      </div>
    </div>
  );
};

export default DonorDashboard;