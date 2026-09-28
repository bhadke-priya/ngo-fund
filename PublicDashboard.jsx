import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  Legend, ResponsiveContainer, LineChart, Line,
  PieChart, Pie, Cell
} from "recharts";

const COLORS = ["#2E86C1", "#27AE60", "#E74C3C", "#F39C12", "#7D3C98", "#1ABC9C"];

const PublicDashboard = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns]     = useState([]);
  const [stats, setStats]             = useState({});
  const [monthlyData, setMonthlyData] = useState([]);
  const [ngos, setNgos]               = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    fetchPublicData();
  }, []);

  const fetchPublicData = async () => {
    try {
      const [campaignRes, statsRes, monthlyRes, ngoRes] = await Promise.all([
        axios.get("http://localhost:8080/api/public/campaigns"),
        axios.get("http://localhost:8080/api/public/stats"),
        axios.get("http://localhost:8080/api/public/monthly-donations"),
        axios.get("http://localhost:8080/api/public/ngos"),
      ]);
      setCampaigns(campaignRes.data);
      setStats(statsRes.data);
      setMonthlyData(monthlyRes.data);
      setNgos(ngoRes.data);
    } catch (err) {
      console.error("Failed to load public data.");
    } finally {
      setLoading(false);
    }
  };

  const getProgress = (raised, target) => {
    if (!target || target === 0) return 0;
    return Math.min(Math.round((raised / target) * 100), 100);
  };

  // Pie chart — donations per NGO
  const ngoChartData = ngos.map((n) => ({
    name: n.name,
    value: n.totalRaised,
  }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center
                      justify-center bg-gray-100">
        <p className="text-gray-500 text-lg">
          Loading public dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-teal-700 text-white px-8 py-4
                      flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">🌍 NGO Transparency Portal</h1>
          <p className="text-teal-200 text-xs">
            Live fund usage — open to all
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/login")}
            className="bg-white text-teal-700 px-4 py-1 rounded-lg
                       font-medium hover:bg-teal-100"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-teal-500 px-4 py-1 rounded-lg
                       font-medium hover:bg-teal-600 border
                       border-white"
          >
            Register
          </button>
        </div>
      </nav>

      {/* Hero Banner */}
      <div className="bg-teal-600 text-white text-center py-12 px-4">
        <h2 className="text-4xl font-bold mb-3">
          Transparent NGO Fund Management
        </h2>
        <p className="text-teal-100 text-lg max-w-2xl mx-auto">
          Every rupee donated is tracked, verified, and reported publicly.
          Join us in building trust between donors and NGOs across India.
        </p>
        <button
          onClick={() => navigate("/register")}
          className="mt-6 bg-white text-teal-700 font-bold
                     px-8 py-3 rounded-xl hover:bg-teal-50
                     transition duration-200"
        >
          🤝 Start Donating Today
        </button>
      </div>

      <div className="p-8">

        {/* Platform Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
          <div className="bg-white rounded-2xl shadow p-5 text-center">
            <p className="text-gray-400 text-sm mb-1">Total Donated</p>
            <p className="text-3xl font-bold text-teal-600">
              ₹{stats.totalDonated?.toLocaleString() || "0"}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5 text-center">
            <p className="text-gray-400 text-sm mb-1">Active Campaigns</p>
            <p className="text-3xl font-bold text-blue-600">
              {stats.activeCampaigns || 0}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5 text-center">
            <p className="text-gray-400 text-sm mb-1">NGOs Registered</p>
            <p className="text-3xl font-bold text-purple-600">
              {stats.totalNgos || 0}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5 text-center">
            <p className="text-gray-400 text-sm mb-1">Total Donors</p>
            <p className="text-3xl font-bold text-green-600">
              {stats.totalDonors || 0}
            </p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">

          {/* Monthly Donation Line Chart */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              📈 Monthly Donation Trend
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip formatter={(v) => `₹${v}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#0E9F6E"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Donations"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* NGO Pie Chart */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              🏢 Funds Raised per NGO
            </h3>
            {ngoChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={ngoChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    dataKey="value"
                    label={({ name, value }) =>
                      `${name.substring(0, 8)}: ₹${value}`
                    }
                  >
                    {ngoChartData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `₹${v}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-400 mt-16">
                No NGO data available.
              </p>
            )}
          </div>
        </div>

        {/* Campaign Progress Bar Chart */}
        <div className="bg-white rounded-2xl shadow p-6 mb-10">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            📊 Campaign Fund Progress
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={campaigns.slice(0, 6).map((c) => ({
                name: c.title.length > 14
                  ? c.title.substring(0, 14) + "..."
                  : c.title,
                Raised: c.raisedAmount,
                Target: c.targetAmount,
              }))}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip formatter={(v) => `₹${v}`} />
              <Legend />
              <Bar dataKey="Raised" fill="#0E9F6E" radius={[4,4,0,0]} />
              <Bar dataKey="Target" fill="#D1FAE5" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Live Campaign Cards */}
        <h3 className="text-xl font-bold text-gray-800 mb-5">
          🔴 Live Campaigns
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {campaigns
            .filter((c) => c.status === "ACTIVE")
            .map((c) => {
              const pct = getProgress(c.raisedAmount, c.targetAmount);
              return (
                <div key={c.campaignId}
                     className="bg-white rounded-2xl shadow
                                hover:shadow-lg transition duration-200">
                  <div className="bg-teal-600 px-6 py-4 rounded-t-2xl">
                    <h4 className="text-white font-bold text-base
                                   leading-tight">
                      {c.title}
                    </h4>
                    <p className="text-teal-200 text-xs mt-1">
                      by {c.ngoName}
                    </p>
                  </div>
                  <div className="px-6 py-4">
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                      {c.description}
                    </p>
                    {/* Progress */}
                    <div className="mb-2">
                      <div className="flex justify-between text-xs
                                      text-gray-500 mb-1">
                        <span>
                          ₹{c.raisedAmount?.toLocaleString()} raised
                        </span>
                        <span>{pct}%</span>
                      </div>
                      <div className="w-full bg-gray-200
                                      rounded-full h-2.5">
                        <div
                          className="bg-teal-500 h-2.5 rounded-full
                                     transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Goal: ₹{c.targetAmount?.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate("/register")}
                      className="w-full mt-3 bg-teal-500 hover:bg-teal-600
                                 text-white font-semibold py-2 rounded-xl
                                 text-sm transition duration-200"
                    >
                      💚 Donate Now
                    </button>
                  </div>
                </div>
              );
            })}
        </div>

        {/* How It Works Section */}
        <div className="bg-white rounded-2xl shadow p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-800 text-center mb-8">
            🔄 How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                icon: "📝",
                title: "Register",
                desc: "Create your donor account in 60 seconds",
                color: "bg-blue-100 text-blue-700",
              },
              {
                step: "2",
                icon: "🔍",
                title: "Browse",
                desc: "Explore verified NGO campaigns",
                color: "bg-green-100 text-green-700",
              },
              {
                step: "3",
                icon: "💳",
                title: "Donate",
                desc: "Secure payment via Razorpay",
                color: "bg-purple-100 text-purple-700",
              },
              {
                step: "4",
                icon: "📊",
                title: "Track",
                desc: "Watch your funds being used live",
                color: "bg-orange-100 text-orange-700",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center
                                justify-center text-2xl mx-auto mb-3
                                ${item.color}`}>
                  {item.icon}
                </div>
                <p className="font-bold text-gray-800 mb-1">{item.title}</p>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-sm py-4">
          <p>
            🌱 NGO Transparency Portal — Built with React + Spring Boot
          </p>
          <p className="mt-1">
            Making every donation count, transparently.
          </p>
        </div>

      </div>
    </div>
  );
};

export default PublicDashboard;