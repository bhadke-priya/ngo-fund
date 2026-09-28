import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend
} from "recharts";

const AuditorPanel = () => {
  const navigate = useNavigate();
  const [expenditures, setExpenditures] = useState([]);
  const [donations, setDonations]       = useState([]);
  const [flags, setFlags]               = useState([]);
  const [activeTab, setActiveTab]       = useState("expenditures");
  const [loading, setLoading]           = useState(true);
  const [flagForm, setFlagForm]         = useState({
    campaignId: "",
    remarks: "",
  });
  const [showFlagForm, setShowFlagForm] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchExpenditures();
    fetchDonations();
    fetchFlags();
  }, []);

  const fetchExpenditures = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/audit/expenditures",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExpenditures(res.data);
    } catch (err) {
      toast.error("Failed to load expenditures.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDonations = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/audit/donations",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDonations(res.data);
    } catch (err) {
      toast.error("Failed to load donations.");
    }
  };

  const fetchFlags = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/audit/flags",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFlags(res.data);
    } catch (err) {
      toast.error("Failed to load flags.");
    }
  };

  const handleVerify = async (expenditureId) => {
    try {
      await axios.put(
        `http://localhost:8080/api/audit/verify/${expenditureId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Expenditure verified successfully!");
      fetchExpenditures();
    } catch (err) {
      toast.error("Verification failed.");
    }
  };

  const handleFlag = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8080/api/audit/flag",
        flagForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Irregularity flagged! Admin has been alerted.");
      setShowFlagForm(false);
      setFlagForm({ campaignId: "", remarks: "" });
      fetchFlags();
    } catch (err) {
      toast.error("Failed to raise flag.");
    }
  };

  const handleGenerateReport = async (ngoId) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/report/generate/${ngoId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `audit_report_${ngoId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Report downloaded successfully!");
    } catch (err) {
      toast.error("Failed to generate report.");
    }
  };

  // Summary stats
  const totalDonations  = donations.reduce((s, d) => s + d.amount, 0);
  const totalSpent      = expenditures.reduce((s, e) => s + e.amount, 0);
  const verifiedCount   = expenditures.filter((e) => e.verifiedBy).length;
  const pendingCount    = expenditures.filter((e) => !e.verifiedBy).length;

  // Chart data
  const chartData = [
    { name: "Total Donated", amount: totalDonations },
    { name: "Total Spent",   amount: totalSpent },
    { name: "Difference",    amount: totalDonations - totalSpent },
  ];

  // Tab styles
  const tabStyle = (tab) =>
    `px-5 py-2 rounded-xl font-semibold text-sm transition duration-150 ${
      activeTab === tab
        ? "bg-red-600 text-white"
        : "bg-white text-gray-600 hover:bg-red-50 border border-gray-200"
    }`;

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-red-700 text-white px-8 py-4
                      flex justify-between items-center">
        <h1 className="text-xl font-bold">🔍 Auditor Panel</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-white text-red-700 px-4 py-1 rounded-lg
                       font-medium hover:bg-red-100"
          >
            Public Dashboard
          </button>
          <button
            onClick={() => { localStorage.clear(); navigate("/login"); }}
            className="bg-gray-800 px-4 py-1 rounded-lg
                       font-medium hover:bg-gray-900"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="p-8">

        {/* Page Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Audit & Compliance Dashboard 🛡️
        </h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl shadow p-5 text-center">
            <p className="text-gray-500 text-sm mb-1">Total Donated</p>
            <p className="text-2xl font-bold text-blue-600">
              ₹{totalDonations.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5 text-center">
            <p className="text-gray-500 text-sm mb-1">Total Spent</p>
            <p className="text-2xl font-bold text-green-600">
              ₹{totalSpent.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5 text-center">
            <p className="text-gray-500 text-sm mb-1">Verified Entries</p>
            <p className="text-2xl font-bold text-purple-600">
              {verifiedCount}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-5 text-center">
            <p className="text-gray-500 text-sm mb-1">Pending Review</p>
            <p className="text-2xl font-bold text-orange-500">
              {pendingCount}
            </p>
          </div>
        </div>

        {/* Chart + Flag Button Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          {/* Bar Chart */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Fund Flow Overview
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip formatter={(v) => `₹${v}`} />
                <Legend />
                <Bar
                  dataKey="amount"
                  fill="#C0392B"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Flag Irregularity Card */}
          <div className="bg-white rounded-2xl shadow p-6
                          flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                🚩 Flag an Irregularity
              </h3>
              <p className="text-gray-500 text-sm mb-3">
                Found suspicious fund usage or missing bills?
                Raise a flag — the Super Admin will be alerted immediately.
              </p>
              <div className="bg-red-50 border border-red-200
                              rounded-xl p-3 mb-4">
                <p className="text-red-600 text-sm font-medium">
                  ⚠️ Active Flags: {flags.length}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowFlagForm(!showFlagForm)}
              className="bg-red-600 hover:bg-red-700 text-white
                         font-semibold px-6 py-3 rounded-xl w-full"
            >
              {showFlagForm ? "✕ Cancel" : "🚩 Raise Flag"}
            </button>
          </div>
        </div>

        {/* Flag Form */}
        {showFlagForm && (
          <div className="bg-white rounded-2xl shadow p-6 mb-8
                          border-l-4 border-red-500">
            <h4 className="text-lg font-semibold text-red-700 mb-4">
              Report Irregularity
            </h4>
            <form onSubmit={handleFlag} className="space-y-4">
              <div>
                <label className="block text-sm font-medium
                                  text-gray-700 mb-1">
                  Campaign ID
                </label>
                <input
                  type="text"
                  value={flagForm.campaignId}
                  onChange={(e) =>
                    setFlagForm({ ...flagForm, campaignId: e.target.value })
                  }
                  placeholder="Enter campaign ID"
                  required
                  className="w-full border border-gray-300 rounded-xl
                             px-4 py-2 focus:outline-none
                             focus:ring-2 focus:ring-red-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium
                                  text-gray-700 mb-1">
                  Remarks / Description of Irregularity
                </label>
                <textarea
                  value={flagForm.remarks}
                  onChange={(e) =>
                    setFlagForm({ ...flagForm, remarks: e.target.value })
                  }
                  placeholder="Describe the irregularity in detail..."
                  rows={4}
                  required
                  className="w-full border border-gray-300 rounded-xl
                             px-4 py-2 focus:outline-none
                             focus:ring-2 focus:ring-red-400"
                />
              </div>
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white
                           font-semibold px-6 py-2 rounded-xl"
              >
                Submit Flag
              </button>
            </form>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveTab("expenditures")}
            className={tabStyle("expenditures")}
          >
            📋 Expenditures
          </button>
          <button
            onClick={() => setActiveTab("donations")}
            className={tabStyle("donations")}
          >
            💚 Donations
          </button>
          <button
            onClick={() => setActiveTab("flags")}
            className={tabStyle("flags")}
          >
            🚩 Flags ({flags.length})
          </button>
        </div>

        {/* Tab — Expenditures */}
        {activeTab === "expenditures" && (
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Expenditure Review
              </h3>
              <button
                onClick={() => handleGenerateReport("1")}
                className="bg-blue-600 hover:bg-blue-700 text-white
                           px-4 py-2 rounded-xl text-sm font-semibold"
              >
                📄 Download Audit Report
              </button>
            </div>
            {loading ? (
              <p className="text-center text-gray-400 py-10">
                Loading...
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600">
                      <th className="px-4 py-3">Campaign</th>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Bill</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenditures.length > 0 ? (
                      expenditures.map((e, i) => (
                        <tr key={i}
                            className="border-t hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">
                            {e.campaignTitle}
                          </td>
                          <td className="px-4 py-3 text-gray-600
                                         max-w-xs truncate">
                            {e.description}
                          </td>
                          <td className="px-4 py-3 text-green-600
                                         font-semibold">
                            ₹{e.amount?.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-gray-500">
                            {e.spentOn}
                          </td>
                          <td className="px-4 py-3">
                            {e.billUrl ? (
                              
                                href={e.billUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-500 hover:underline
                                           text-xs"
                              >
                                View Bill
                              </a>
                            ) : (
                              <span className="text-red-400 text-xs">
                                Missing
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {e.verifiedBy ? (
                              <span className="bg-green-100 text-green-700
                                               px-2 py-1 rounded-full
                                               text-xs font-semibold">
                                ✓ Verified
                              </span>
                            ) : (
                              <span className="bg-yellow-100 text-yellow-700
                                               px-2 py-1 rounded-full
                                               text-xs font-semibold">
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {!e.verifiedBy && (
                              <button
                                onClick={() =>
                                  handleVerify(e.expenditureId)
                                }
                                className="bg-green-500 hover:bg-green-600
                                           text-white px-3 py-1 rounded-lg
                                           text-xs font-semibold"
                              >
                                ✓ Verify
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7"
                            className="text-center text-gray-400 py-8">
                          No expenditure records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab — Donations */}
        {activeTab === "donations" && (
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              All Donation Records
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-gray-50 text-gray-600">
                    <th className="px-4 py-3">Donor</th>
                    <th className="px-4 py-3">Campaign</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Transaction ID</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.length > 0 ? (
                    donations.map((d, i) => (
                      <tr key={i}
                          className="border-t hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">
                          {d.donorName}
                        </td>
                        <td className="px-4 py-3">{d.campaignTitle}</td>
                        <td className="px-4 py-3 text-blue-600
                                       font-semibold">
                          ₹{d.amount?.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-gray-400
                                       text-xs font-mono">
                          {d.transactionId}
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {d.donatedOn}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full
                            text-xs font-semibold ${
                              d.paymentStatus === "SUCCESS"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600"
                            }`}>
                            {d.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6"
                          className="text-center text-gray-400 py-8">
                        No donation records found.
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
              Raised Irregularity Flags
            </h3>
            {flags.length > 0 ? (
              <div className="space-y-4">
                {flags.map((f, i) => (
                  <div key={i}
                       className="border-l-4 border-red-500 bg-red-50
                                  rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold text-red-700">
                        🚩 Campaign ID: {f.campaignId}
                      </p>
                      <span className="text-xs text-gray-400">
                        {f.flaggedOn}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{f.remarks}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      Flagged by: {f.auditorName}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-green-600 text-lg font-semibold">
                  ✅ No irregularities flagged!
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  All fund records look clean and verified.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default AuditorPanel;