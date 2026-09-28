import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CampaignPage = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    filterCampaigns();
  }, [search, statusFilter, campaigns]);

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/campaigns", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCampaigns(res.data);
      setFiltered(res.data);
    } catch (err) {
      toast.error("Failed to load campaigns.");
    } finally {
      setLoading(false);
    }
  };

  const filterCampaigns = () => {
    let data = [...campaigns];

    // Search filter
    if (search.trim() !== "") {
      data = data.filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "ALL") {
      data = data.filter((c) => c.status === statusFilter);
    }

    setFiltered(data);
  };

  // Progress percentage
  const getProgress = (raised, target) => {
    if (!target || target === 0) return 0;
    return Math.min(Math.round((raised / target) * 100), 100);
  };

  // Status badge color
  const getStatusStyle = (status) => {
    if (status === "ACTIVE")    return "bg-green-100 text-green-700";
    if (status === "COMPLETED") return "bg-blue-100 text-blue-700";
    if (status === "CLOSED")    return "bg-red-100 text-red-600";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-blue-700 text-white px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🌱 NGO Fund Portal</h1>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/donor-dashboard")}
            className="bg-white text-blue-700 px-4 py-1 rounded-lg
                       font-medium hover:bg-blue-100"
          >
            My Dashboard
          </button>
          <button
            onClick={() => { localStorage.clear(); navigate("/login"); }}
            className="bg-red-500 px-4 py-1 rounded-lg font-medium hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="p-8">

        {/* Page Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Browse Campaigns
        </h2>
        <p className="text-gray-500 mb-6">
          Support a cause — every donation is tracked transparently.
        </p>

        {/* Search + Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2
                       focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2
                       focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center text-gray-500 py-20 text-lg">
            Loading campaigns...
          </div>
        )}

        {/* No Results */}
        {!loading && filtered.length === 0 && (
          <div className="text-center text-gray-400 py-20 text-lg">
            No campaigns found.
          </div>
        )}

        {/* Campaign Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((campaign) => (
            <div
              key={campaign.campaignId}
              className="bg-white rounded-2xl shadow hover:shadow-lg
                         transition duration-200 overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-blue-600 px-6 py-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-white font-bold text-lg leading-tight">
                    {campaign.title}
                  </h3>
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full
                                ${getStatusStyle(campaign.status)}`}
                  >
                    {campaign.status}
                  </span>
                </div>
                <p className="text-blue-100 text-sm mt-1">
                  by {campaign.ngoName}
                </p>
              </div>

              {/* Card Body */}
              <div className="px-6 py-4">

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {campaign.description}
                </p>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>₹{campaign.raisedAmount?.toLocaleString()} raised</span>
                    <span>{getProgress(campaign.raisedAmount, campaign.targetAmount)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${getProgress(campaign.raisedAmount, campaign.targetAmount)}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Goal: ₹{campaign.targetAmount?.toLocaleString()}
                  </p>
                </div>

                {/* Dates */}
                <div className="flex justify-between text-xs text-gray-400 mb-4">
                  <span>Start: {campaign.startDate}</span>
                  <span>End: {campaign.endDate}</span>
                </div>

                {/* Donate Button */}
                <button
                  disabled={campaign.status !== "ACTIVE"}
                  onClick={() => navigate(`/donate/${campaign.campaignId}`)}
                  className={`w-full py-2 rounded-xl font-semibold transition duration-200
                    ${campaign.status === "ACTIVE"
                      ? "bg-green-500 hover:bg-green-600 text-white"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    }`}
                >
                  {campaign.status === "ACTIVE" ? "💚 Donate Now" : "Campaign Closed"}
                </button>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default CampaignPage;