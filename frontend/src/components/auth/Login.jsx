import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: form.email,
          password: form.password,
        }
      );

      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          id: response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email,
        })
      );

      localStorage.setItem("userToken", response.data.token);

      navigate("/userHomePage");
    } catch (err) {
      setMessage(err?.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-pink-50 to-orange-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200"
      >
        <h1 className="text-3xl font-bold text-center text-[#c85a32] mb-6">
          Login
        </h1>

        {/* Email */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="font-semibold text-gray-700 block mb-1"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#dfa26d] outline-none transition"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="font-semibold text-gray-700 block mb-1"
          >
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#dfa26d] outline-none transition"
            />

            <i
              className={`absolute right-3 top-3.5 text-xl cursor-pointer text-gray-500 ${
                showPassword ? "bx bx-hide" : "bx bx-show"
              }`}
              onClick={togglePasswordVisibility}
            ></i>
          </div>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#dfa26d] text-white font-semibold py-3 rounded-lg shadow-md hover:bg-[#e6b07c] transition-all duration-300 disabled:opacity-60"
        >
          {loading ? (
            <span className="animate-pulse">Logging in...</span>
          ) : (
            "Login"
          )}
        </button>

        {/* Register Link */}
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <NavLink
            to="/register"
            className="text-[#c85a32] font-semibold hover:underline"
          >
            Register here
          </NavLink>
        </p>

        {/* Error Message */}
        {message && (
          <p className="text-center text-red-600 font-semibold mt-3">
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default Login;
