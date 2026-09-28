import React from "react";
import { useNavigate } from "react-router-dom";

const CampaignCard = ({ campaign }) => {
  const navigate = useNavigate();

  const {
    campaignId,
    title,
    description,
    ngoName,
    targetAmount,
    raisedAmount,
    startDate,
    endDate,
    status,
  } = campaign;

  // Progress percentage
  const progress = targetAmount
    ? Math.min(Math.round((raisedAmount / targetAmount) * 100), 100)
    : 0;

  // Days remaining
  const daysLeft = () => {
    if (!endDate) return null;
    const end  = new Date(endDate);
    const now  = new Date();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  // Status styles
  const statusStyle = {
    ACTIVE:    "bg-green-100 text-green-700",
    COMPLETED: "bg-blue-100 text-blue-700",
    CLOSED:    "bg-red-100 text-red-600",
  };

  // Progress bar color
  const progressColor = () => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    return "bg-orange-400";
  };

  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-xl
                    transition duration-300 overflow-hidden flex flex-col">

      {/* Card Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800
                      px-5 py-4">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-white font-bold text-base leading-snug
                         flex-1">
            {title}
          </h3>
          <span className={`text-xs font-semibold px-2 py-1
                            rounded-full whitespace-nowrap
                            ${statusStyle[status] ||
                              "bg-gray-100 text-gray-600"}`}>
            {status}
          </span>
        </div>
        <p className="text-blue-200 text-xs mt-1">🏢 {ngoName}</p>
      </div>

      {/* Card Body */}
      <div className="px-5 py-4 flex flex-col flex-1">

        {/* Description */}
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
          {description}
        </p>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs
                          text-gray-500 mb-1">
            <span className="font-medium text-gray-700">
              ₹{raisedAmount?.toLocaleString()} raised
            </span>
            <span className="font-semibold text-blue-600">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all
                          duration-700 ${progressColor()}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs
                          text-gray-400 mt-1">
            <span>
              Goal: ₹{targetAmount?.toLocaleString()}
            </span>
            <span>
              ₹{(targetAmount - raisedAmount)
                ?.toLocaleString()} remaining
            </span>
          </div>
        </div>

        {/* Info Row */}
        <div className="flex justify-between items-center
                        text-xs text-gray-400 mb-4">
          <span>📅 Start: {startDate}</span>
          {daysLeft() !== null && status === "ACTIVE" && (
            <span className={`font-semibold ${
              daysLeft() <= 5
                ? "text-red-500"
                : "text-gray-500"
            }`}>
              ⏳ {daysLeft()} days left
            </span>
          )}
          <span>🏁 End: {endDate}</span>
        </div>

        {/* Raised Milestone Badge */}
        {progress >= 100 && (
          <div className="bg-green-50 border border-green-200
                          rounded-xl px-3 py-2 mb-3 text-center">
            <p className="text-green-600 text-xs font-semibold">
              🎉 Goal Achieved! Fully Funded.
            </p>
          </div>
        )}
        {progress >= 50 && progress < 100 && (
          <div className="bg-blue-50 border border-blue-200
                          rounded-xl px-3 py-2 mb-3 text-center">
            <p className="text-blue-600 text-xs font-semibold">
              🔥 Halfway there! Keep the momentum going.
            </p>
          </div>
        )}

        {/* Donate Button */}
        <button
          disabled={status !== "ACTIVE"}
          onClick={() => navigate(`/donate/${campaignId}`)}
          className={`w-full py-2.5 rounded-xl font-semibold
                      text-sm transition duration-200 mt-auto
            ${status === "ACTIVE"
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
        >
          {status === "ACTIVE"
            ? "💚 Donate Now"
            : status === "COMPLETED"
            ? "✅ Campaign Completed"
            : "🔒 Campaign Closed"}
        </button>

      </div>
    </div>
  );
};

export default CampaignCard;