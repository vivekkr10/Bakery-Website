import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ email: "" });

  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputsRef = useRef([]);

  const [message, setMessage] = useState("");

  // Load local user
  useEffect(() => {
    const saved = localStorage.getItem("userInfo");
    if (saved) {
      const parsed = JSON.parse(saved);
      setUserDetails({ email: parsed.email, phone: parsed.phone });
    } else {
      setMessage("⚠️ User info missing. Please register again.");
    }
  }, []);

  const handleInputChange = (value, index) => {
    if (/[^0-9]/.test(value)) return; // allow only digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value && index < 3) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpValue = otp.join(""); // join 4 boxes → "1234"

    try {
      const payload = {
        email: userDetails.email || undefined,
        phone: userDetails.phone || undefined,
        otp: otpValue,
      };

      const res = await axios.post(
        `http://localhost:5000/api/auth/verify-otp`,
        payload
      );
      setMessage("✅ OTP verified. Redirecting...");
      setTimeout(() => navigate("/set-username"), 1000);
    } catch (err) {
      setMessage("❌ OTP verification failed. Please try again.");
    }
  };

  const handleResendOtp = async () => {
    try {
      await axios.post(`http://localhost:5000/api/auth/send-otp`, {
        email: userDetails.email || undefined,
        phone: userDetails.phone || undefined,
      });
      setMessage("🔁 OTP resent successfully.");
    } catch {
      setMessage("❌ Could not resend OTP. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleVerifyOtp}
        className="bg-white shadow-md rounded-xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Verify OTP
        </h2>

        {/* OTP BOXES */}
        <div className="flex justify-between mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(e.target.value, index)}
              onKeyDown={(e) => handleBackspace(e, index)}
              className="w-14 h-14 text-center text-xl border border-gray-400 rounded-lg
                         focus:ring-2 focus:ring-blue-500 outline-none"
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium
                     hover:bg-blue-700 transition"
        >
          Verify OTP
        </button>

        {/* Resend Button */}
        <button
          type="button"
          onClick={handleResendOtp}
          className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-medium mt-3
                     hover:bg-gray-300 transition"
        >
          Resend OTP
        </button>

        {message && (
          <p className="mt-4 text-center font-medium text-gray-700">{message}</p>
        )}
      </form>
    </div>
  );
};

export default VerifyOTP;
