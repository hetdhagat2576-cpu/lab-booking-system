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
import Swal from 'sweetalert2';

export default function LabTechnicianLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { UserCog, ArrowLeft, Mail, Lock, Eye, EyeOff } = IconConfig || {};
  const [formData, setFormData] = useState({ email: "", password: "" });
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
    setError("");
  };

  // reCAPTCHA utility function
  const showRecaptchaAlert = async (title, message, confirmButtonText = 'Continue') => {
    return new Promise((resolve, reject) => {
      let recaptchaToken = null;

      // Ensure reCAPTCHA script is loaded
      const loadRecaptchaScript = () => {
        return new Promise((scriptResolve, scriptReject) => {
          if (window.grecaptcha && window.grecaptcha.render) {
            scriptResolve();
            return;
          }

          const script = document.createElement('script');
          script.src = 'https://www.google.com/recaptcha/api.js?onload=recaptchaCallback&render=explicit';
          script.async = true;
          script.defer = true;
          
          // Set up global callback
          window.recaptchaCallback = () => {
            scriptResolve();
          };
          
          script.onload = scriptResolve;
          script.onerror = scriptReject;
          document.head.appendChild(script);
        });
      };

      const showAlert = async () => {
        try {
          await loadRecaptchaScript();

          // Wait for reCAPTCHA to be available
          let attempts = 0;
          const maxAttempts = 10;
          
          while (!window.grecaptcha || !window.grecaptcha.render) {
            if (attempts >= maxAttempts) {
              console.error('reCAPTCHA failed to load after multiple attempts');
              Swal.fire({
                icon: 'error',
                title: 'reCAPTCHA Error',
                text: 'reCAPTCHA failed to load. Please refresh the page and try again.',
                confirmButtonColor: '#d33',
              });
              return reject(new Error('reCAPTCHA failed to load'));
            }
            await new Promise(resolve => setTimeout(resolve, 500));
            attempts++;
          }

          const result = await Swal.fire({
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
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            didOpen: () => {
              // Render reCAPTCHA inside the SweetAlert
              const container = document.getElementById('recaptcha-container');
              
              if (container) {
                // Clear any existing content
                container.innerHTML = '';
                
                try {
                  // Render reCAPTCHA
                  const widgetId = window.grecaptcha.render(container, {
                    sitekey: process.env.REACT_APP_RECAPTCHA_SITE_KEY || "6LcolFcsAAAAAHu4qJFpMgWFj_SW9jD6obXysvES",
                    callback: (token) => {
                      recaptchaToken = token;
                      console.log('reCAPTCHA token received');
                    },
                    'expired-callback': () => {
                      recaptchaToken = null;
                      console.log('reCAPTCHA token expired');
                      // Reset the widget
                      if (widgetId) {
                        window.grecaptcha.reset(widgetId);
                      }
                    },
                    'error-callback': () => {
                      console.error('reCAPTCHA widget error');
                      Swal.showValidationMessage('reCAPTCHA verification failed. Please try again.');
                    }
                  });
                  console.log('reCAPTCHA widget rendered with ID:', widgetId);
                } catch (error) {
                  console.error('Error rendering reCAPTCHA:', error);
                  Swal.showValidationMessage('reCAPTCHA failed to render. Please refresh the page.');
                }
              }
            },
            preConfirm: () => {
              if (!recaptchaToken) {
                Swal.showValidationMessage('Please complete the reCAPTCHA verification');
                return false;
              }
              return recaptchaToken;
            }
          });

          if (result.isConfirmed && result.value) {
            resolve(result.value);
          } else {
            reject(new Error('User cancelled or reCAPTCHA not completed'));
          }
        } catch (error) {
          console.error('reCAPTCHA showAlert error:', error);
          reject(error);
        }
      };

      showAlert();
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = formData;
    setError("");
    setLoading(true);
    
    try {
      // Lab technician login always requires reCAPTCHA verification
      const recaptchaToken = await showRecaptchaAlert(
        'Lab Technician Verification',
        'Please complete the reCAPTCHA verification below to proceed with lab technician login.',
        'Verify & Login'
      );
      
      console.log('Lab technician login requires reCAPTCHA verification');
      console.log('Form data:', { email: formData.email, role: 'labtechnician' });

      const response = await fetch(createApiUrl("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: formData.email, 
          password: formData.password, 
          role: "labtechnician", // Match database role exactly
          recaptchaToken: recaptchaToken
        }),
      });
      
      // Handle different response scenarios
      if (!response.ok) {
        console.log('Response not ok:', response.status, response.statusText);
        const responseData = await response.clone().json();
        console.log('Response data:', responseData);
        
        if (response.status === 400) {
          // Bad request - likely reCAPTCHA or validation error
          const errorMessage = responseData?.message || 'Login validation failed. Please try again.';
          throw new Error(errorMessage);
        } else if (response.status === 401) {
          // Unauthorized - wrong credentials
          throw new Error('Invalid credentials. Please check your email and password.');
        } else if (response.status === 403) {
          // Forbidden - role mismatch
          const errorMessage = responseData?.message || 'Your account does not have lab technician access.';
          throw new Error(errorMessage);
        } else if (response.status === 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(responseData?.message || `Login failed with status ${response.status}`);
        }
      }
      
      const data = await response.json();
      if (response.ok && data.success) {
        // Show SweetAlert success message
        await Swal.fire({
          icon: 'success',
          title: 'Lab Technician Login Successful!',
          text: 'Welcome back, Technician!',
          confirmButtonColor: '#3085d6',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });
        
        login(data.data);
        navigate("/lab-technician-dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error('Login error:', err);
      // User cancelled reCAPTCHA or other error
      if (err.message === 'User cancelled or reCAPTCHA not completed') {
        // User cancelled, don't show error
        return;
      }
      // Show the actual error message from the exception
      const errorMessage = err.message || 'An error occurred during login. Please try again.';
      setError(errorMessage);
      
      // Show an alert with the error details for debugging
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: errorMessage,
        confirmButtonColor: '#d33',
      });
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

      <AuthLayout type="labTechnician">
        {/* Back Button */}
        <button
          onClick={() => navigate("/login-selection")}
          className="flex items-center text-gray-600 hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2" />
          Back to Role Selection
        </button>

        <div className="mb-8 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start mb-2">
            <UserCog className="w-8 h-8 text-primary mr-3" />
            <h2 className="text-3xl font-bold text-slate-800">
              Technician Login
            </h2>
          </div>
          <p className="text-slate-500">
            Please enter your credentials to access the dashboard.
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
              required
              placeholder=""
              icon={<Mail className="w-5 h-5" />}
            />
          
            <div className="relative">
              <CInput
                type={showPassword ? "text" : "password"}
                name="password"
                label="Password"
                value={formData.password}
                onChange={handleChange}
                required
                icon={<Lock className="w-5 h-5" />}
                className="pr-10"
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
            disabled={loading}
            className="text-white shadow-lg shadow-cyan-900/20 mt-2"
          >
            {loading ? "Signing In..." : "Sign In"}
          </CButton>
        </form>
      </AuthLayout>
    </div>
  );
}
