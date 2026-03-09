import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IconConfig from "../../components/icon/index.js";
import Header from "../../components/header";
import { useAuth } from "../../context/authContext";
import AuthLayout from "../../components/AuthLayout";
import CButton from "../../components/cButton";
import CInput from "../../components/cInput";
import Theme from "../../config/theam/index.js";
import { createApiUrl } from "../../config/api.js";
import { roleOptions } from "../../config/staticData";
import Swal from 'sweetalert2';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { Shield, ArrowLeft, Mail, Lock, Eye, EyeOff, User, UserCog } = IconConfig || {};
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
    setError("");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setError("");
    setLoading(true);
    
    try {
      // Skip reCAPTCHA for admin login
      let recaptchaToken = null;
      
      console.log('Admin login attempt:', { 
        email: formData.email, 
        role: "admin",
        apiUrl: createApiUrl("/api/auth/login")
      });
      
      const response = await fetch(createApiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: formData.email, 
          password: formData.password, 
          role: "admin",
          recaptchaToken: recaptchaToken
        }),
      });
      
      console.log('Admin login response status:', response.status);
      
      // Handle different response scenarios
      if (!response.ok) {
        if (response.status === 401) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Invalid credentials. Please check your email and password.');
        } else if (response.status === 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(`Login failed with status ${response.status}`);
        }
      }
      
      const data = await response.json();
      console.log('Admin login response data:', data);
      
      if (response.ok && data.success) {
        // Show SweetAlert success message
        await Swal.fire({
          icon: 'success',
          title: 'Admin Login Successful!',
          text: 'Welcome back, Administrator!',
          confirmButtonColor: Theme.colors.primary,
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });
        
        login(data.data);
        navigate("/admin-dashboard");
      } else {
        if (data.requiresEmailVerification) {
          // Show error for admin requiring email verification
          await Swal.fire({
            icon: 'error',
            title: 'Email Verification Required',
            text: 'Admin accounts must verify their email before accessing the dashboard. Please check your inbox for the OTP verification email.',
            confirmButtonColor: Theme.colors.primary,
            confirmButtonText: 'OK'
          });
        } else {
          setError(data.message || "Login failed");
        }
      }
    } catch (err) {
      console.error(err);
      // User cancelled reCAPTCHA or other error
      if (err.message === 'User cancelled or reCAPTCHA not completed') {
        // User cancelled, don't show error
        return;
      }
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const headerNav = {
    goToHome: () => navigate("/"),
    goToAbout: () => navigate("/about"),
    goToServices: () => navigate("/services"),
    goToLogin: () => navigate("/login-selection"),
    goToRegister: () => navigate("/register"),
  };

  return (
    <div className={`${Theme.layout.standardPage} h-screen overflow-hidden`}>
      <Header {...headerNav} hideNavItems={true} />

      <AuthLayout type="admin">
        {/* Back Button */}
        <button
          onClick={() => navigate("/login-selection")}
          className="flex items-center text-gray-600 hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2" />
          Back to Role Selection
        </button>

        <div className="mb-8 text-center lg:text-left">
          <h2 className="text-3xl font-bold text-slate-800">
            Admin Login
          </h2>
          <p className="text-slate-500">
            Please enter your credentials to access dashboard.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
            <CInput
              type="email"
              name="email"
              label="Email Address"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={<Mail className="w-5 h-5" />}
            />
          
            <CInput
              type="password"
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={<Lock className="w-5 h-5" />}
              showPasswordToggle={true}
            />

          {error && error.includes("robot") && (
            <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <CButton
            type="submit"
            fullWidth
            size="lg"
            variant="primary"
            className="text-white shadow-lg shadow-cyan-900/20 mt-2 px-16"
          >
            Sign In
          </CButton>
        </form>
      </AuthLayout>
    </div>
  );
}
