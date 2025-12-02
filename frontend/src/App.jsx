import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";
import AuthLayout from "./components/layout/AuthLayout";

import Homepage from "./components/homePage/Homepage";
import About from "./components/About/About";
import Register from "./components/auth/Register";
import VerifyOTP from "./components/auth/VerifyOTP";
import SetUsername from "./components/auth/SetUsername";
import Login from "./components/auth/Login";

import ContactUs from "./components/ContactUs";
import ForgetPassword from "./components/auth/ForgetPassword";
import ResetPassword from "./components/auth/ResetPassword";

export default function App() {
  return (
    <Routes>
      {/* Default route → Homepage */}
      <Route path="/" element={<Navigate to="/home" />} />

      {/* Public Pages */}
      <Route
        path="/home"
        element={
          <MainLayout>
            <Homepage />
          </MainLayout>
        }
      />

      <Route
        path="/about"
        element={
          <MainLayout>
            <About />
          </MainLayout>
        }
      />

      <Route
        path="/contact-us"
        element={
          <MainLayout>
            <ContactUs />
          </MainLayout>
        }
      />

      {/* Auth Pages */}
      <Route
        path="/register"
        element={
          <AuthLayout>
            <Register />
          </AuthLayout>
        }
      />
      <Route
        path="/login"
        element={
          <AuthLayout>
            <Login />
          </AuthLayout>
        }
      />

      <Route
        path="/verify-otp"
        element={
          <AuthLayout>
            <VerifyOTP />
          </AuthLayout>
        }
      />

      <Route
        path="/set-username"
        element={
          <AuthLayout>
            <SetUsername />
          </AuthLayout>
        }
      />
      <Route
        path="/forget-password"
        element={
          <AuthLayout>
            <ForgetPassword />
          </AuthLayout>
        }
      />


  <Route
        path="/reset-password"
        element={
          <AuthLayout>
            <ResetPassword/>
          </AuthLayout>
        }
      />



    </Routes>
  );
}
