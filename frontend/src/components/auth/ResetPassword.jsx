import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  // get email from URL (given after OTP verification)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userEmail = params.get("email");
    if (!userEmail) {
      setMessage("⚠️ Something went wrong — Email missing!");
    } else {
      setEmail(userEmail);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        { email, newPassword: password }
      );

      setMessage("✅ Password reset successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1200);

    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "❌ Failed to reset password. Try again."
      );
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-orange-100 to-yellow-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md "
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Reset Password
        </h2>

        {/* New Password */}
        <div className="mb-4">
          <label className="block font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            placeholder="Enter new password"
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="block font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 outline-none"
            placeholder="Re-enter new password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-orange-600 transition"
        >
          Reset Password
        </button>

        {message && (
          <p className="text-center font-medium mt-4 text-gray-700">
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default ResetPassword;
