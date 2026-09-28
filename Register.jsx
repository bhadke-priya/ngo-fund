import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "DONOR",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:8080/api/auth/register", form);
      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error("Registration failed. Email may already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-green-700 mb-1">
          Create Account
        </h1>
        <p className="text-center text-gray-500 mb-6">
          Join the transparent NGO network
        </p>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Priya Bhadke"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2
                         focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

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
                         focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 9876543210"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2
                         focus:outline-none focus:ring-2 focus:ring-green-400"
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
              placeholder="Minimum 6 characters"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2
                         focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Register As
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2
                         focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="DONOR">Donor</option>
              <option value="NGO_ADMIN">NGO Admin</option>
              <option value="AUDITOR">Auditor</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white
                       font-semibold py-2 rounded-lg transition duration-200"
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        {/* Link */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-green-600 font-medium hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;