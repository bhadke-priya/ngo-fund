import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", form);
      const { token, role } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      toast.success("Login successful!");

      // Redirect based on role
      if (role === "DONOR")      navigate("/donor-dashboard");
      if (role === "NGO_ADMIN")  navigate("/ngo-admin");
      if (role === "AUDITOR")    navigate("/auditor");
      if (role === "SUPER_ADMIN") navigate("/super-admin");

    } catch (err) {
      toast.error("Invalid email or password!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-1">
          NGO Fund Portal
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Transparent. Accountable. Trusted.
        </p>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2
                         focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2
                         focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold
                       py-2 rounded-lg transition duration-200"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Links */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-600 font-medium hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;