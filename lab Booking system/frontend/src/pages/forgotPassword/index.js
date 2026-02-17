import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../../components/header';
import Footer from '../../components/footer';
import Theme from '../../config/theam/index.js';
import IconConfig from '../../components/icon/index.js';
import CButton from '../../components/cButton';
import { createApiUrl } from '../../config/api';
import Swal from 'sweetalert2';
import { 
  Card, CardContent, Typography, TextField, Box, Paper, 
  CircularProgress, Alert, InputAdornment
} from '@mui/material';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const { Mail, ArrowLeft, Lock, CheckCircle } = IconConfig;
  
  const [formData, setFormData] = useState({
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(createApiUrl('/api/auth/forgot-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.toLowerCase()
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitted(true);
        Swal.fire({
          icon: 'success',
          title: 'Reset Link Sent!',
          text: 'If an account with this email exists, a password reset link has been sent to your email.',
          confirmButtonColor: Theme.colors.primary,
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      } else {
        throw new Error(data.message || 'Failed to send reset link');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setError(error.message || 'Unable to send reset link. Please try again.');
      Swal.fire({
        icon: 'error',
        title: 'Request Failed',
        text: error.message || 'Unable to send reset link. Please try again.',
        confirmButtonColor: Theme.colors.primary
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={Theme.layout.standardPage}>
      <Header hideNavItems={true} />
      
      <main className="flex-grow pt-8 pb-12 bg-slate-50/50">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            
            {/* Back to Login */}
            <div className="mb-6">
              <Link 
                to="/user-login"
                className="inline-flex items-center gap-2 text-slate-600 hover:text-primary transition-colors"
              >
                <ArrowLeft size={16} />
                <span className="font-medium">Back to Login</span>
              </Link>
            </div>

            {/* Forgot Password Card */}
            <Card elevation={0} className="rounded-2xl overflow-hidden border border-slate-200">
              <CardContent className="p-8">
                
                {!submitted ? (
                  <>
                    {/* Icon and Title */}
                    <div className="text-center mb-8">
                      <div 
                        className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${Theme.colors.primary}15` }}
                      >
                        <Lock size={32} style={{ color: Theme.colors.primary }} />
                      </div>
                      <Typography variant="h4" fontWeight="700" className="mb-2 text-slate-800">
                        Forgot Password?
                      </Typography>
                      <Typography variant="body1" className="text-slate-600">
                        No worries! Enter your email address and we'll send you a link to reset your password.
                      </Typography>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                      <Box className="space-y-6">
                        {error && (
                          <Alert severity="error" className="text-red-500 text-xs rounded-xl">
                            {error}
                          </Alert>
                        )}

                        <TextField
                          fullWidth
                          label="Email Address"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          variant="outlined"
                          required
                          disabled={loading}
                          placeholder="Enter your registered email"
                          error={!!error}
                          helperText={error && <span className="text-red-500 text-xs">{error}</span>}
                          InputLabelProps={{ 
                            shrink: true,
                            sx: { 
                              '&.Mui-focused': { color: Theme.colors.primary },
                              '&.Mui-error': { color: 'error.main' }
                            }
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Mail size={20} className="text-slate-400" />
                              </InputAdornment>
                            ),
                            sx: { 
                              borderRadius: '12px',
                              '&:hover fieldset': {
                                borderColor: Theme.colors.primary,
                              },
                              '&.Mui-focused fieldset': {
                                borderColor: Theme.colors.primary,
                              },
                            }
                          }}
                        />

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                          style={{ 
                            backgroundColor: loading ? Theme.colors.primaryHover : Theme.colors.primary,
                            '&:hover': { backgroundColor: Theme.colors.primaryHover }
                          }}
                        >
                          {loading ? (
                            <div className="flex items-center justify-center gap-2">
                              <CircularProgress size={20} className="text-white" />
                              <span>Sending Reset Link...</span>
                            </div>
                          ) : (
                            'Send Reset Link'
                          )}
                        </button>
                      </Box>
                    </form>
                  </>
                ) : (
                  /* Success State */
                  <div className="text-center py-8">
                    <div 
                      className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#10b98115' }}
                    >
                      <CheckCircle size={32} className="text-green-500" />
                    </div>
                    <Typography variant="h4" fontWeight="700" className="mb-2 text-slate-800">
                      Check Your Email
                    </Typography>
                    <Typography variant="body1" className="text-slate-600 mb-6">
                      We've sent a password reset link to <strong>{formData.email}</strong>. 
                      Please check your inbox and follow the instructions.
                    </Typography>
                    <Typography variant="body2" className="text-slate-500 mb-8">
                      Didn't receive the email? Check your spam folder or try again.
                    </Typography>
                    
                    <div className="space-y-3">
                      <button
                        onClick={() => setSubmitted(false)}
                        className="w-full py-3 px-4 rounded-xl font-semibold text-primary border border-primary transition-all duration-200 hover:bg-primary hover:text-white"
                      >
                        Try Again
                      </button>
                      
                      <Link 
                        to="/user-login"
                        className="block"
                      >
                        <button
                          type="button"
                          className="w-full py-3 px-4 rounded-xl font-semibold text-slate-600 transition-all duration-200 hover:bg-slate-100"
                        >
                          Back to Login
                        </button>
                      </Link>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Help Text */}
            {!submitted && (
              <div className="mt-6 text-center">
                <Typography variant="body2" className="text-slate-500">
                  Remember your password?{' '}
                  <Link 
                    to="/user-login"
                    className="font-medium text-primary hover:text-primaryHover"
                  >
                    Sign In
                  </Link>
                </Typography>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
