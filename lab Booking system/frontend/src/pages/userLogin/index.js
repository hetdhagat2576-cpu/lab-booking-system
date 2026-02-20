import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import IconConfig from "../../components/icon/index.js";
import Header from "../../components/header";
import CButton from "../../components/cButton";
import CInput from "../../components/cInput";
import AuthLayout from "../../components/AuthLayout";
import { useAuth } from "../../context/authContext";
import Theme from "../../config/theam/index.js";
import { createApiUrl } from "../../config/api.js";
import Swal from 'sweetalert2';

// Add CSS for visible SweetAlert buttons
const sweetAlertStyles = `
  .swal2-visible-buttons .swal2-confirm {
    background-color: #3085d6 !important;
    color: white !important;
    border: none !important;
    padding: 12px 24px !important;
    font-weight: 600 !important;
    border-radius: 6px !important;
    cursor: pointer !important;
    font-size: 16px !important;
    min-width: 120px !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
  
  .swal2-visible-buttons .swal2-cancel {
    background-color: #6c757d !important;
    color: white !important;
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
  }
`;

// Inject styles into document
const injectSweetAlertStyles = () => {
  if (document.getElementById('sweet-alert-styles')) return;
  
  const styleElement = document.createElement('style');
  styleElement.id = 'sweet-alert-styles';
  styleElement.textContent = sweetAlertStyles;
  document.head.appendChild(styleElement);
};

export default function UserLogin() {
  const navigate = useNavigate(); 
  const { login } = useAuth();
  
  // Inject styles on component mount
  React.useEffect(() => {
    injectSweetAlertStyles();
  }, []);
  
  const { FaUser, FaArrowLeft, Lock, Eye, EyeOff } = IconConfig || {};
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showForgetPassword, setShowForgetPassword] = useState(false);
  const [forgetEmail, setForgetEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /* Handlers */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
    if (errors.form) setErrors({ ...errors, form: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email address";

    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (
      formData.email === "admin@labbooking.com" || 
      formData.email === "labtech@labbooking.com"
    ) {
      const msg = "Access Denied: Please use the dedicated portal for your role.";
      setErrors((prev) => ({ ...prev, email: msg }));
      await Swal.fire({
        icon: 'error',
        title: 'Access Denied',
        text: msg,
        confirmButtonColor: Theme.colors.primary
      });
      return;
    }

    try {
      setIsLoading(true);
      
      console.log('Login attempt with:', { email: formData.email, role: "user" });
      
      const payload = { 
        email: formData.email, 
        password: formData.password, 
        role: "user"
      };
      
      console.log('Sending login payload:', { ...payload, password: '[HIDDEN]' });

      const response = await fetch(createApiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      console.log('Login response status:', response.status);
      
      const data = await response.json();
      console.log('Login response data:', data);
      
      // Handle different response scenarios
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error(data.message || 'Invalid credentials. Please check your email and password.');
        } else if (response.status === 403) {
          throw new Error(data.message || 'Access denied. Please check your credentials.');
        } else if (response.status === 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(data.message || `Login failed with status ${response.status}`);
        }
      }
      
      if (data.success) {
        // Show SweetAlert success message
        await Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: 'Welcome back! You are now logged in.',
          confirmButtonColor: Theme.colors.primary,
          confirmButtonText: 'Continue',
          showConfirmButton: true,
          showCancelButton: false,
          customClass: {
            popup: 'swal2-visible-buttons'
          },
          didOpen: () => {
            setTimeout(() => {
              const confirmBtn = document.querySelector('.swal2-confirm');
              if (confirmBtn) {
                confirmBtn.style.backgroundColor = '#3085d6';
                confirmBtn.style.color = 'white';
                confirmBtn.style.display = 'block';
                confirmBtn.style.visibility = 'visible';
              }
            }, 100);
          }
        });
        
        login(data.data);
        navigate("/dashboard");
      } else {
        if (data.requiresVerification) {
          // Redirect to OTP verification for unverified email
          navigate("/otp-verification", {
            state: {
              email: formData.email,
              redirectPath: "/dashboard",
              isLoginFlow: true
            }
          });
        } else {
          setErrors({ form: data.message || "Login failed" });
        }
      }
    } catch (err) {
      console.error(err);
      await Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: err.message || 'Invalid credentials. Please try again.',
        confirmButtonColor: Theme.colors.primary
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgetPassword = async (e) => {
    e.preventDefault();
    if (!forgetEmail) return;
      await Swal.fire({
        icon: 'success',
        title: 'Password Reset Sent',
        text: `Password reset link sent to ${forgetEmail}`,
        confirmButtonColor: Theme.colors.primary
      });
    setShowForgetPassword(false);
    setForgetEmail("");
  };

  const headerNav = {
    goToHome: () => navigate("/"),
    goToAbout: () => navigate("/about"),
    goToServices: () => navigate("/services"),
    goToLogin: () => navigate("/login-selection"),
    goToRegister: () => navigate("/register"),
  };

  /* UI COMPONENTS */
  if (showForgetPassword) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header hideNavItems={true} />
        <main className="flex-grow flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-100 p-10">
            <form onSubmit={handleForgetPassword} className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-primary">Forgot Password</h2>
                <p className="text-slate-500 mt-2">Enter your email to receive a reset link.</p>
              </div>
              <CInput
                type="email"
                label="Email Address"
                value={forgetEmail}
                onChange={(e) => setForgetEmail(e.target.value)}
                required
              />
              <CButton
                type="submit"
                fullWidth
                variant="primary"
                className="text-white hover:opacity-90 transition-opacity"
              >
                Send Reset Link
              </CButton>
              <CButton
                type="button"
                onClick={() => setShowForgetPassword(false)}
                className="w-full text-center text-sm font-medium text-primary hover:underline"
                variant="outline"
              >
                Back to Login
              </CButton>
            </form>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`${Theme.layout.standardPage} h-screen overflow-hidden`}>
      <Header {...headerNav} hideNavItems={true} />

      <AuthLayout type="user" rightScrollable={false}>
        {/* Back Button */}
        <CButton
          onClick={() => navigate("/login-selection")}
          className="flex items-center text-gray-600 hover:text-primary mb-6 transition-colors"
          variant="outline"
        >
          <FaArrowLeft className="mr-2" />
          Back to Role Selection
        </CButton>

        <div className="mb-10 text-center lg:text-left">
          <h2 className="text-3xl font-bold text-slate-800">User Login</h2>
          <p className="text-slate-500 mt-2">Please enter your details to sign in.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {errors.form && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {errors.form}
            </div>
          )}
          <CInput
            type="email"
            name="email"
            label="Email Address"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <div className="space-y-1">
            <CInput
              type="password"
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              icon={<Lock className="w-5 h-5" />}
              showPasswordToggle={true}
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-sm font-semibold text-primary hover:text-primaryHover"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <CButton
            type="submit"
            fullWidth
            size="lg"
            variant="primary"
            disabled={isLoading}
            className="text-white shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all px-16">
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Sign In'
            )}
          </CButton>

        </form>
      </AuthLayout>
    </div>
  );
}
