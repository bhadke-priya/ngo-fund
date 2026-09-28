import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const DonatePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const quickAmounts = [100, 500, 1000, 2000, 5000];

  useEffect(() => {
    fetchCampaign();
  }, []);

  const fetchCampaign = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/campaigns/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCampaign(res.data);
    } catch (err) {
      toast.error("Failed to load campaign details.");
    }
  };

  const handleDonate = async () => {
    if (!amount || amount <= 0) {
      toast.warning("Please enter a valid donation amount.");
      return;
    }
    setLoading(true);
    try {
      // Step 1 — Create Razorpay Order
      const orderRes = await axios.post(
        "http://localhost:8080/api/donate/create-order",
        { campaignId: id, amount: amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { orderId, razorpayKey } = orderRes.data;

      // Step 2 — Open Razorpay Checkout
      const options = {
        key: razorpayKey,
        amount: amount * 100,
        currency: "INR",
        name: "NGO Fund Portal",
        description: campaign.title,
        order_id: orderId,
        handler: async (response) => {
          // Step 3 — Verify Payment
          await axios.post(
            "http://localhost:8080/api/donate/verify",
            {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              campaignId: id,
              amount: amount,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success("🎉 Donation successful! Receipt sent to your phone.");
          navigate("/donor-dashboard");
        },
        prefill: { name: "Donor", email: "donor@example.com" },
        theme: { color: "#2E86C1" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading campaign...
      </div>
    );
  }

  const progress = Math.min(
    Math.round((campaign.raisedAmount / campaign.targetAmount) * 100), 100
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-8">

        {/* Header */}
        <button
          onClick={() => navigate("/campaigns")}
          className="text-blue-500 text-sm mb-4 hover:underline"
        >
          ← Back to Campaigns
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-1">
          {campaign.title}
        </h2>
        <p className="text-gray-500 text-sm mb-4">by {campaign.ngoName}</p>
        <p className="text-gray-600 mb-4">{campaign.description}</p>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>₹{campaign.raisedAmount?.toLocaleString()} raised</span>
            <span>{progress}% of ₹{campaign.targetAmount?.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Quick Amount Buttons */}
        <p className="text-sm font-medium text-gray-700 mb-2">
          Select Amount (₹)
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {quickAmounts.map((val) => (
            <button
              key={val}
              onClick={() => setAmount(val)}
              className={`px-4 py-2 rounded-lg border font-medium text-sm
                transition duration-150
                ${amount === val
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                }`}
            >
              ₹{val}
            </button>
          ))}
        </div>

        {/* Custom Amount */}
        <input
          type="number"
          placeholder="Or enter custom amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border border-gray-300 rounded-xl px-4 py-2 mb-6
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Donate Button */}
        <button
          onClick={handleDonate}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 text-white
                     font-bold py-3 rounded-xl text-lg transition duration-200"
        >
          {loading ? "Processing..." : `💚 Donate ₹${amount || "0"}`}
        </button>

        <p className="text-center text-xs text-gray-400 mt-3">
          🔒 Secured by Razorpay · SMS receipt will be sent after payment
        </p>

      </div>
    </div>
  );
};

export default DonatePage;