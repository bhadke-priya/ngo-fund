import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const role  = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Active link style
  const isActive = (path) =>
    location.pathname === path
      ? "bg-white text-blue-700 font-bold"
      : "text-white hover:bg-blue-600";

  // Role-based nav links
  const getNavLinks = () => {
    if (!token) {
      return (
        <>
          <button
            onClick={() => navigate("/dashboard")}
            className={`px-4 py-1.5 rounded-lg text-sm
                        transition duration-150 ${isActive("/dashboard")}`}
          >
            🌍 Public Dashboard
          </button>
          <button
            onClick={() => navigate("/login")}
            className={`px-4 py-1.5 rounded-lg text-sm
                        transition duration-150 ${isActive("/login")}`}
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-4 py-1.5 rounded-lg text-sm bg-green-500
                       hover:bg-green-600 text-white transition duration-150"
          >
            Register
          </button>
        </>
      );
    }

    if (role === "DONOR") {
      return (
        <>
          <button
            onClick={() => navigate("/donor-dashboard")}
            className={`px-4 py-1.5 rounded-lg text-sm
                        transition duration-150
                        ${isActive("/donor-dashboard")}`}
          >
            🏠 Dashboard
          </button>
          <button
            onClick={() => navigate("/campaigns")}
            className={`px-4 py-1.5 rounded-lg text-sm
                        transition duration-150
                        ${isActive("/campaigns")}`}
          >
            🔍 Campaigns
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className={`px-4 py-1.5 rounded-lg text-sm
                        transition duration-150
                        ${isActive("/dashboard")}`}
          >
            🌍 Public Dashboard
          </button>
        </>
      );
    }

    if (role === "NGO_ADMIN") {
      return (
        <>
          <button
            onClick={() => navigate("/ngo-admin")}
            className={`px-4 py-1.5 rounded-lg text-sm
                        transition duration-150
                        ${isActive("/ngo-admin")}`}
          >
            🏢 Admin Panel
          </button>
          <button
            onClick={() => navigate("/expenditure")}
            className={`px-4 py-1.5 rounded-lg text-sm
                        transition duration-150
                        ${isActive("/expenditure")}`}
          >
            💰 Expenditures
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className={`px-4 py-1.5 rounded-lg text-sm
                        transition duration-150
                        ${isActive("/dashboard")}`}
          >
            🌍 Public Dashboard
          </button>
        </>
      );
    }

    if (role === "AUDITOR") {
      return (
        <>
          <button
            onClick={() => navigate("/auditor")}
            className={`px-4 py-1.5 rounded-lg text-sm
                        transition duration-150
                        ${isActive("/auditor")}`}
          >
            🔍 Audit Panel
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className={`px-4 py-1.5 rounded-lg text-sm
                        transition duration-150
                        ${isActive("/dashboard")}`}
          >
            🌍 Public Dashboard
          </button>
        </>
      );
    }

    if (role === "SUPER_ADMIN") {
      return (
        <>
          <button
            onClick={() => navigate("/super-admin")}
            className={`px-4 py-1.5 rounded-lg text-sm
                        transition duration-150
                        ${isActive("/super-admin")}`}
          >
            ⚙️ Super Admin
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className={`px-4 py-1.5 rounded-lg text-sm
                        transition duration-150
                        ${isActive("/dashboard")}`}
          >
            🌍 Public Dashboard
          </button>
        </>
      );
    }
  };

  // Role badge color
  const getRoleBadge = () => {
    if (!role) return null;
    const colors = {
      DONOR:       "bg-blue-500",
      NGO_ADMIN:   "bg-purple-500",
      AUDITOR:     "bg-orange-500",
      SUPER_ADMIN: "bg-gray-700",
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full text-white
                        font-semibold ${colors[role] || "bg-gray-500"}`}>
        {role?.replace("_", " ")}
      </span>
    );
  };

  return (
    <nav className="bg-blue-700 text-white shadow-lg sticky top-0 z-50">
      <div className="px-6 py-3 flex justify-between items-center">

        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        >
          <span className="text-2xl">🌱</span>
          <div>
            <h1 className="text-lg font-bold leading-tight">
              NGO Fund Portal
            </h1>
            <p className="text-blue-200 text-xs leading-tight">
              Transparent · Accountable · Trusted
            </p>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-2">
          {getNavLinks()}

          {/* Role Badge + Logout */}
          {token && (
            <div className="flex items-center gap-2 ml-3
                            border-l border-blue-500 pl-3">
              {getRoleBadge()}
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 rounded-lg text-sm bg-red-500
                           hover:bg-red-600 transition duration-150"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-800 px-6 pb-4 flex flex-col gap-2">
          {getNavLinks()}
          {token && (
            <>
              <div className="pt-2 border-t border-blue-600">
                {getRoleBadge()}
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg text-sm bg-red-500
                           hover:bg-red-600 text-left"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;