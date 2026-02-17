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

  // Load reCAPTCHA script dynamically
  useEffect(() => {
    const loadRecaptchaScript = () => {
      // Check if script is already loaded
      if (window.grecaptcha && window.grecaptcha.render) {
        return;
      }

      // Check if script tag already exists
      const existingScript = document.querySelector('script[src*="recaptcha/api.js"]');
      if (existingScript) {
        return;
      }

      // Create and append reCAPTCHA script
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?onload=recaptchaCallback&render=explicit';
      script.async = true;
      script.defer = true;
      
      // Set up global callback
      window.recaptchaCallback = () => {
        console.log('reCAPTCHA script loaded successfully');
      };
      
      document.head.appendChild(script);
    };

    loadRecaptchaScript();
  }, []);

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

  // reCAPTCHA utility function
  const showRecaptchaAlert = async (title, message, confirmButtonText = 'Continue') => {
    return new Promise((resolve, reject) => {
      let recaptchaToken = null;
      let widgetId = null;

      // Ensure reCAPTCHA script is loaded
      const loadRecaptchaScript = () => {
        return new Promise((scriptResolve, scriptReject) => {
          if (window.grecaptcha && window.grecaptcha.render) {
            scriptResolve();
            return;
          }

          // Avoid duplicate script tags
          const existing = document.querySelector('script[src*="recaptcha/api.js"]');
          const script = existing || document.createElement('script');
          if (!existing) {
            script.src = 'https://www.google.com/recaptcha/api.js?onload=recaptchaCallback&render=explicit';
            script.async = true;
            script.defer = true;
          }
          
          // Set up global callback
          window.recaptchaCallback = () => {
            scriptResolve();
          };
          
          script.onload = scriptResolve;
          script.onerror = scriptReject;
          if (!existing) document.head.appendChild(script);
        });
      };

      const showAlert = async () => {
        try {
          await loadRecaptchaScript();

          Swal.fire({
            title: title,
            html: `
              <div style="text-align: left;">
                <p style="margin-bottom: 20px; color: #666;">${message}</p>
                <div id="recaptcha-container" style="display: flex; justify-content: center; margin: 20px 0;"></div>
              </div>
            `,
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: confirmButtonText,
            cancelButtonText: 'Cancel',
            confirmButtonColor: Theme.colors.primary,
            cancelButtonColor: '#d33',
            didOpen: () => {
              // Render reCAPTCHA inside the SweetAlert
              const container = document.getElementById('recaptcha-container');
              
              // Wait a bit for reCAPTCHA to be ready
              setTimeout(() => {
                if (container && window.grecaptcha && window.grecaptcha.render) {
                  // If previously rendered, reset instead of rendering again
                  try {
                    if (widgetId !== null) {
                      window.grecaptcha.reset(widgetId);
                    } else {
                      container.innerHTML = '';
                      widgetId = window.grecaptcha.render(container, {
                        sitekey: process.env.REACT_APP_RECAPTCHA_SITE_KEY || "6LcolFcsAAAAAHu4qJFpMgWFj_SW9jD6obXysvES",
                        callback: (token) => {
                          recaptchaToken = token;
                        },
                        'expired-callback': () => {
                          recaptchaToken = null;
                        }
                      });
                    }
                  } catch (e) {
                    console.error('reCAPTCHA render/reset error:', e);
                    Swal.showValidationMessage('reCAPTCHA error. Please reopen and try again.');
                  }
                } else {
                  console.error('reCAPTCHA not available');
                  Swal.showValidationMessage('reCAPTCHA failed to load. Please refresh the page.');
                }
              }, 500); // 500ms delay
            },
            willClose: () => {
              // Cleanup to avoid "already rendered" errors
              try {
                const container = document.getElementById('recaptcha-container');
                if (container) container.innerHTML = '';
                if (widgetId !== null && window.grecaptcha) {
                  window.grecaptcha.reset(widgetId);
                  widgetId = null;
                }
                recaptchaToken = null;
              } catch {}
            },
            preConfirm: () => {
              if (!recaptchaToken) {
                Swal.showValidationMessage('Please verify you are not a robot');
                return false;
              }
              return recaptchaToken;
            }
          }).then((result) => {
            if (result.isConfirmed && result.value) {
              resolve(result.value);
            } else {
              reject(new Error('User cancelled or reCAPTCHA not completed'));
            }
          }).catch((error) => {
            reject(error);
          });
        } catch (error) {
          reject(error);
        }
      };

      showAlert();
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setError("");
    setLoading(true);
    
    try {
      // DEVELOPMENT MODE: Skip reCAPTCHA for development
      let recaptchaToken = null;
      if (process.env.NODE_ENV === 'production') {
        recaptchaToken = await showRecaptchaAlert(
          'Admin Login Verification',
          'Please complete the reCAPTCHA verification below to proceed with admin login.',
          'Verify & Login'
        );
      }
      
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
        setError(data.message || "Login failed");
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
              required
              icon={<Mail className="w-5 h-5" />}
            />
          
            <div className="relative">
            <CInput
              type={showPassword ? "text" : "password"}
              name="password"
              label="Password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              icon={<Lock className="w-5 h-5" />}
              className="pr-10"
              style={{ textAlign: 'center' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors z-10"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          </div>

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
