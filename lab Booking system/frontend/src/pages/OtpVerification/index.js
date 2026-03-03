import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Shield, Mail } from 'lucide-react';
import { Button, Box, Paper, Typography, Alert } from '@mui/material';
import Header from '../../components/header';
import Theme from '../../config/theam/index.js';
import { createApiUrl } from '../../config/api.js';
import OtpInput from '../../components/OtpInput';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/authContext';

// CSS Styles
const styles = `
.otp-verification-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
}

.otp-verification-container {
  width: 100%;
  max-width: 500px;
  position: relative;
}

.otp-header {
  margin-bottom: 2rem;
  text-align: left;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.back-button:hover {
  background: #f8fafc;
  color: #2a7a8e;
  border-color: #2a7a8e;
  transform: translateX(-2px);
}

.back-button:focus-visible {
  outline: 2px solid #2a7a8e;
  outline-offset: 2px;
}

.otp-verification-footer {
  margin-top: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.security-notice {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #f1fcfb;
  border: 1px solid #98d2e0;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  color: #2a7a8e;
  font-size: 0.875rem;
}

.help-section {
  text-align: center;
}

.help-title {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
}

.help-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
}

.help-list li {
  color: #64748b;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  padding-left: 1rem;
  position: relative;
}

.help-list li::before {
  content: "•";
  color: #2a7a8e;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.contact-support-btn {
  padding: 0.625rem 1.25rem;
  background: transparent;
  border: 1px solid #2a7a8e;
  color: #2a7a8e;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.contact-support-btn:hover {
  background: #2a7a8e;
  color: white;
}

.contact-support-btn:focus-visible {
  outline: 2px solid #2a7a8e;
  outline-offset: 2px;
}

/* Background decoration */
.otp-verification-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: none;
  pointer-events: none;
  z-index: 0;
}

/* Responsive Design */
@media (max-width: 640px) {
  .otp-verification-page {
    padding: 1rem;
  }
  
  .otp-verification-container {
    max-width: 100%;
  }
  
  .otp-header {
    margin-bottom: 1rem;
  }
  
  .otp-verification-footer {
    margin-top: 1.5rem;
    padding: 1rem;
  }
  
  .security-notice {
    padding: 0.625rem;
    font-size: 0.8rem;
  }
  
  .help-title {
    font-size: 0.9rem;
  }
  
  .help-list li {
    font-size: 0.8rem;
  }
}

/* Animation for page entry */
.otp-verification-container {
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`;

export default function OtpVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [redirectPath, setRedirectPath] = useState('/dashboard');
  const [isRegistrationFlow, setIsRegistrationFlow] = useState(false);
  const [isLoginFlow, setIsLoginFlow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // Try to get email from localStorage
      const user = JSON.parse(localStorage.getItem('lab_user') || '{}');
      if (user.email) {
        setEmail(user.email);
      } else {
        navigate('/register');
      }
    }
    
    if (location.state?.redirectPath) {
      setRedirectPath(location.state.redirectPath);
    }
    
    setIsRegistrationFlow(location.state?.isRegistrationFlow || false);
    setIsLoginFlow(location.state?.isLoginFlow || false);
  }, [location.state, navigate]);

  // Inject CSS styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const handleOtpComplete = async (otp) => {
    setIsLoading(true);
    setError('');

    try {
      const payload = JSON.stringify({ email, code: otp });
      const options = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload };
      
      const response = await fetch(createApiUrl('/api/auth/verify-otp'), options);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        // Wait 5 seconds then show SweetAlert success message
        setTimeout(async () => {
          await Swal.fire({
            icon: 'success',
            title: 'Registration Successful',
            text: 'Your account has been verified successfully!',
            confirmButtonColor: Theme.colors.primary,
            confirmButtonText: 'OK',
            showConfirmButton: true,
            showCancelButton: false,
            allowOutsideClick: false,
            allowEscapeKey: false
          }).then((result) => {
            // Redirect to login after user clicks OK or alert closes
            navigate('/user-login');
          });
        }, 5000); // Wait exactly 5 seconds
      } else {
        setError(data.message || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setError(err.message || 'Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Use the auth controller's resend endpoint
      const endpoint = '/api/auth/resend-otp';
      const response = await fetch(createApiUrl(endpoint), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setTimeLeft(600); // Reset timer to 10 minutes
      } else {
        setError(data.message || 'Failed to resend OTP. Please try again.');
      }
    } catch (err) {
      console.error('Resend OTP error:', err);
      setError('Server error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeExpire = () => {
    setError('OTP has expired. Please request a new one.');
  };

  const headerNav = {
    goToHome: () => navigate('/'),
    goToAbout: () => navigate('/about'),
    goToServices: () => navigate('/services'),
    goToLogin: () => navigate('/login-selection'),
    goToRegister: () => navigate('/register'),
  };

  // Removed OTP success page; success now shows SweetAlert and redirects to login

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header {...headerNav} />

      <main className="flex-grow flex flex-col lg:flex-row">
        {/* LEFT SIDE: DECORATIVE/INFO */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary/90 p-16 flex-col justify-center items-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary opacity-10 rounded-full -ml-24 -mb-24"></div>
          
          <div className="relative z-10 max-w-lg text-center">
            <div className="mb-8">
              <Shield className="w-20 h-20 text-secondary mx-auto" />
            </div>
            <span className="inline-block px-4 py-2 rounded-full bg-secondary text-primary font-bold text-xs uppercase tracking-widest mb-6">
              Verify Your Email
            </span>
            <h1 className="text-6xl font-extrabold leading-tight mb-6">
              Check Your <br/>
              <span className="text-secondary">Email</span>
            </h1>
            <p className="text-slate-100 text-xl mb-12 opacity-90 leading-relaxed">
              We've sent a verification code to your email address. Enter the code below to complete your registration.
            </p>
            <div className="space-y-6">
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-secondary" />
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold">Secure Verification</div>
                  <div className="text-sm text-slate-200">Protect your account</div>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold">Quick Process</div>
                  <div className="text-sm text-slate-200">Verify in seconds</div>
                </div>
              </div>
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold">Instant Access</div>
                  <div className="text-sm text-slate-200">Start using features immediately</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: OTP FORM */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="w-full max-w-md">
            {/* Back Button */}
            <Button
              startIcon={<ArrowLeft />}
              onClick={() => navigate('/register')}
              sx={{ 
                mb: 4,
                color: Theme.colors.primary,
                fontWeight: "bold",
                "&:hover": { backgroundColor: Theme.colors.secondaryLight }
              }}
            >
              Back to Register
            </Button>

            <Box mb={6}>
              <Box display="flex" alignItems="center" gap={3} mb={3}>
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <Shield size={32} className="text-white" />
                </div>
                <div>
                  <Typography variant="h3" component="h2" fontWeight="bold" color="text.primary">
                    Verify Email
                  </Typography>
                  <Typography variant="body1" color="text.secondary" mt={1}>
                    Enter the verification code sent to your email
                  </Typography>
                </div>
              </Box>
            </Box>

            <Paper elevation={8} sx={{ p: 6, borderRadius: 3, boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}>
              {error && (
                <Alert severity="error" className="text-red-500 text-xs" sx={{ mb: 4, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <OtpInput
                length={6}
                onComplete={handleOtpComplete}
                onResend={handleResendOtp}
                email={email}
                isLoading={isLoading}
                error={error}
                timeLeft={timeLeft}
                onTimeExpire={handleTimeExpire}
              />
            </Paper>
          </div>
        </div>
      </main>
    </div>
  );
}
