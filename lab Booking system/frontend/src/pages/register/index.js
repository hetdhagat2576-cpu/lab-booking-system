import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, ArrowLeft, Lock, Mail, User, Eye, EyeOff } from "lucide-react";
import { Button, Box, Paper, Typography, Alert, InputAdornment, TextField, MenuItem } from "@mui/material";
import Header from "../../components/header";
import CButton from "../../components/cButton";
import CInput from "../../components/cInput";
import AuthLayout from "../../components/AuthLayout";
import { useAuth } from "../../context/authContext";
import Theme from "../../config/theam/index.js";
import { REGISTER_PAGE_CONTENT } from "../../config/staticData";
import { createApiUrl } from "../../config/api.js";
import Swal from 'sweetalert2';

export default function RegisterIndex() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "", role: "user" });
  const [errors, setErrors] = useState({});
  const [registerError, setRegisterError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
    if (registerError) setRegisterError("");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = REGISTER_PAGE_CONTENT.labels.name + " is required";
    if (!formData.email) {
      newErrors.email = REGISTER_PAGE_CONTENT.labels.email + " is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    const strongPwd = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#^()[\]{}._-]).{8,}$/;
    if (!strongPwd.test(formData.password)) newErrors.password = "Password must be 8+ chars, include upper, lower, number, and symbol";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

          Swal.fire({
            title: title,
            html: `
              <div style="text-align: left;">
                <p style="margin-bottom: 20px; color: #666;">${message}</p>
                <div id="recaptcha-container" style="display: flex; justify-content: center; margin: 20px 0; transform: scale(0.85); transform-origin: 0 0;"></div>
              </div>
            `,
            showConfirmButton: false,
            showCancelButton: false,
            showCloseButton: true,
            didOpen: () => {
              // Render reCAPTCHA inside the SweetAlert
              const container = document.getElementById('recaptcha-container');
              
              // Wait a bit for reCAPTCHA to be ready
              setTimeout(() => {
                if (container && window.grecaptcha && window.grecaptcha.render) {
                  // Clear any existing content
                  container.innerHTML = '';
                  
                  // Render reCAPTCHA
                  window.grecaptcha.render(container, {
                    sitekey: process.env.REACT_APP_RECAPTCHA_SITE_KEY || "6LcolFcsAAAAAHu4qJFpMgWFj_SW9jD6obXysvES",
                    callback: (token) => {
                      recaptchaToken = token;
                      // Auto-close SweetAlert and proceed when captcha is completed
                      Swal.close();
                      resolve(token);
                    },
                    'expired-callback': () => {
                      recaptchaToken = null;
                    }
                  });
                } else {
                  console.error('reCAPTCHA not available');
                  Swal.showValidationMessage('reCAPTCHA failed to load. Please refresh the page.');
                }
              }, 500); // 500ms delay
            }
          }).then((result) => {
            // This will only be triggered if user cancels, since we auto-resolve on captcha completion
            if (result.isDismissed) {
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

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setRegisterError("");
    setSuccessMessage("");

    try {
      // Show reCAPTCHA in SweetAlert before proceeding
      const recaptchaToken = await showRecaptchaAlert(
        'Verify You Are Human',
        'Please complete the reCAPTCHA verification to proceed with registration.',
        'Sign Up'
      );

      const response = await fetch(createApiUrl("/api/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: formData.name,
          email: formData.email, 
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          recaptchaToken: recaptchaToken
        }),
      });

      let data = null;
      try {
        data = await response.json();
      } catch (e) {
      }

      if (!response.ok) {
        if (response.status === 401 && (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost')) {
          // Direct navigation to OTP without success message
          navigate("/otp-verification", { 
            state: { 
              email: formData.email,
              isRegistrationFlow: true,
              redirectPath: "/user-login"
            } 
          });
          return;
        }

        // Prefer backend message when available
        if (data && data.message) {
          if (data.message.toLowerCase().includes('already exists')) {
            setRegisterError("This email is already registered. Please login instead.");
          } else {
            setRegisterError(data.message);
          }
        } else if (response.status === 500) {
          setRegisterError('Server error. Please try again later.');
        } else {
          setRegisterError(`Registration failed with status ${response.status}`);
        }
        setIsLoading(false);
        return;
      }

      if (data && data.success) {
        // Direct navigation to OTP verification page without success message
        navigate("/otp-verification", { 
          state: { 
            email: formData.email,
            isRegistrationFlow: true,
            redirectPath: "/user-login"
          } 
        });
      } else {
        if (data.message && data.message.includes("already exists")) {
          setRegisterError("This email is already registered. Please login instead.");
        } else {
          setRegisterError(data.message || "Registration failed. Please try again.");
        }
      }
    } catch (err) {
      console.error(err);
      // User cancelled reCAPTCHA or other error
      if (err.message === 'User cancelled or reCAPTCHA not completed') {
        // User cancelled, don't show error
        return;
      }
      setRegisterError("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
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
    <AuthLayout 
      type="register"
      bgColor="bg-gradient-to-br from-primary to-primary/90"
      accentColor="text-secondary"
    >
      {/* Header Navigation */}
      <div className="flex justify-between items-center mb-6">
        <Button
          startIcon={<ArrowLeft />}
          onClick={() => navigate("/")}
          sx={{ 
            color: "white",
            fontWeight: "bold",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.2)" }
          }}
        >
          {REGISTER_PAGE_CONTENT.buttons.back}
        </Button>
      </div>

      {/* Registration Form */}
      <Paper elevation={8} sx={{ p: 4, borderRadius: 3, boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}>
        <form onSubmit={handleRegister}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              fullWidth
              name="name"
              label={REGISTER_PAGE_CONTENT.labels.name}
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name && <span className="text-red-500 text-xs font-medium">{errors.name}</span>}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <User size={16} style={{ color: Theme.colors.primary }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: errors.name ? "#ef4444" : Theme.colors.primary,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: errors.name ? "#ef4444" : Theme.colors.primary,
                    borderWidth: 2,
                  },
                  "&.Mui-error fieldset": {
                    borderColor: "#ef4444",
                    borderWidth: 2,
                  },
                  "&.Mui-error": {
                    backgroundColor: "#fef2f2",
                  },
                },
                "& .MuiFormHelperText-root": {
                  fontSize: '0.75rem',
                  marginTop: '4px',
                  fontWeight: 'medium',
                  color: '#dc2626',
                },
              }}
            />

            <TextField
              fullWidth
              name="email"
              label={REGISTER_PAGE_CONTENT.labels.email}
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email && <span className="text-red-500 text-xs font-medium">{errors.email}</span>}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={16} style={{ color: Theme.colors.primary }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: errors.email ? "#ef4444" : Theme.colors.primary,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: errors.email ? "#ef4444" : Theme.colors.primary,
                    borderWidth: 2,
                  },
                  "&.Mui-error fieldset": {
                    borderColor: "#ef4444",
                    borderWidth: 2,
                  },
                  "&.Mui-error": {
                    backgroundColor: "#fef2f2",
                  },
                },
                "& .MuiFormHelperText-root": {
                  fontSize: '0.75rem',
                  marginTop: '4px',
                  fontWeight: 'medium',
                  color: '#dc2626',
                },
              }}
            />

            <TextField
              fullWidth
              name="password"
              type={showPassword ? "text" : "password"}
              label={REGISTER_PAGE_CONTENT.labels.password}
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password && <span className="text-red-500 text-xs font-medium">{errors.password}</span>}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={16} style={{ color: Theme.colors.primary }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                    >
                      {showPassword ? <EyeOff size={16} style={{ color: Theme.colors.primary }} /> : <Eye size={16} style={{ color: Theme.colors.primary }} />}
                    </button>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: errors.password ? "#ef4444" : Theme.colors.primary,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: errors.password ? "#ef4444" : Theme.colors.primary,
                    borderWidth: 2,
                  },
                  "&.Mui-error fieldset": {
                    borderColor: "#ef4444",
                    borderWidth: 2,
                  },
                  "&.Mui-error": {
                    backgroundColor: "#fef2f2",
                  },
                },
                "& .MuiFormHelperText-root": {
                  fontSize: '0.75rem',
                  marginTop: '4px',
                  fontWeight: 'medium',
                  color: '#dc2626',
                },
              }}
            />

            <TextField
              fullWidth
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              label={REGISTER_PAGE_CONTENT.labels.confirmPassword}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword && <span className="text-red-500 text-xs font-medium">{errors.confirmPassword}</span>}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={16} style={{ color: Theme.colors.primary }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{ border: 'none', background: 'none', cursor: 'pointer' }}
                    >
                      {showConfirmPassword ? <EyeOff size={16} style={{ color: Theme.colors.primary }} /> : <Eye size={16} style={{ color: Theme.colors.primary }} />}
                    </button>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: errors.confirmPassword ? "#ef4444" : Theme.colors.primary,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: errors.confirmPassword ? "#ef4444" : Theme.colors.primary,
                    borderWidth: 2,
                  },
                  "&.Mui-error fieldset": {
                    borderColor: "#ef4444",
                    borderWidth: 2,
                  },
                  "&.Mui-error": {
                    backgroundColor: "#fef2f2",
                  },
                },
                "& .MuiFormHelperText-root": {
                  fontSize: '0.75rem',
                  marginTop: '4px',
                  fontWeight: 'medium',
                  color: '#dc2626',
                },
              }}
            />

            <TextField
              fullWidth
              select
              name="role"
              label="Register as"
              value={formData.role}
              onChange={handleChange}
              error={!!errors.role}
              helperText={errors.role && <span className="text-red-500 text-xs font-medium">{errors.role}</span>}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Shield size={16} style={{ color: Theme.colors.primary }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: errors.role ? "#ef4444" : Theme.colors.primary,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: errors.role ? "#ef4444" : Theme.colors.primary,
                    borderWidth: 2,
                  },
                  "&.Mui-error fieldset": {
                    borderColor: "#ef4444",
                    borderWidth: 2,
                  },
                  "&.Mui-error": {
                    backgroundColor: "#fef2f2",
                  },
                },
                "& .MuiFormHelperText-root": {
                  fontSize: '0.75rem',
                  marginTop: '4px',
                  fontWeight: 'medium',
                  color: '#dc2626',
                },
              }}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="admin">Administrator</MenuItem>
              <MenuItem value="labtechnician">Lab Technician</MenuItem>
            </TextField>

            {registerError && (
              <Alert severity="error" sx={{ borderRadius: 2 }}>
                {registerError}
              </Alert>
            )}

            {successMessage && (
              <Alert severity="success" sx={{ borderRadius: 2 }}>
                {successMessage}
              </Alert>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isLoading}
              fullWidth
              sx={{
                backgroundColor: Theme.colors.primary,
                color: "white",
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold',
                "&:hover": {
                  backgroundColor: Theme.colors.primaryHover,
                },
              }}
            >
              {isLoading ? 'Creating Account...' : REGISTER_PAGE_CONTENT.buttons.submit}
            </Button>

            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Already have an account?{" "}
              <Button
                variant="text"
                onClick={() => navigate("/login-selection")}
                sx={{
                  color: Theme.colors.primary,
                  fontWeight: "bold",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "transparent",
                    textDecoration: "underline",
                  },
                }}
              >
                {REGISTER_PAGE_CONTENT.buttons.signIn}
              </Button>
            </Typography>
          </Box>
        </form>
      </Paper>
    </AuthLayout>
  );
}
