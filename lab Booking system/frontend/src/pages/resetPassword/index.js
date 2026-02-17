import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
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

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { Mail, ArrowLeft, Lock, Eye, EyeOff, CheckCircle, AlertCircle } = IconConfig;
  
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Verify token on component mount
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setVerifying(false);
      setError('Reset token is missing. Please request a new password reset.');
      return;
    }

    // We'll validate the token when the user tries to reset the password
    // This prevents unnecessary API calls and allows for better UX
    setVerifying(false);
    setTokenValid(true);
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const validateForm = () => {
    if (!formData.newPassword) {
      setError('Please enter a new password');
      return false;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (!formData.confirmPassword) {
      setError('Please confirm your new password');
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!token) {
      setError('Reset token is missing. Please request a new password reset.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(createApiUrl('/api/auth/reset-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        Swal.fire({
          icon: 'success',
          title: 'Password Reset Successful!',
          text: 'Your password has been reset successfully. You can now login with your new password.',
          confirmButtonColor: Theme.colors.primary,
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false
        });
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/user-login');
        }, 3000);
      } else {
        throw new Error(data.message || 'Failed to reset password');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setError(error.message || 'Unable to reset password. The link may have expired.');
      Swal.fire({
        icon: 'error',
        title: 'Reset Failed',
        text: error.message || 'Unable to reset password. Please request a new reset link.',
        confirmButtonColor: Theme.colors.primary
      });
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className={Theme.layout.standardPage}>
        <Header />
        <main className="flex-grow pt-8 pb-12 bg-slate-50/50">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <Card elevation={0} className="rounded-2xl overflow-hidden border border-slate-200">
                <CardContent className="p-8 text-center">
                  <CircularProgress className="mb-4" style={{ color: Theme.colors.primary }} />
                  <Typography variant="h6" className="text-slate-600">
                    Verifying reset link...
                  </Typography>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (success) {
    return (
      <div className={Theme.layout.standardPage}>
        <Header />
        <main className="flex-grow pt-8 pb-12 bg-slate-50/50">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <Card elevation={0} className="rounded-2xl overflow-hidden border border-slate-200">
                <CardContent className="p-8 text-center">
                  <div 
                    className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: '#10b98115' }}
                  >
                    <CheckCircle size={32} className="text-green-500" />
                  </div>
                  <Typography variant="h4" fontWeight="700" className="mb-2 text-slate-800">
                    Password Reset Successful!
                  </Typography>
                  <Typography variant="body1" className="text-slate-600 mb-6">
                    Your password has been successfully reset. You will be redirected to the login page shortly.
                  </Typography>
                  <CircularProgress size={20} className="mb-4" style={{ color: Theme.colors.primary }} />
                  <Typography variant="body2" className="text-slate-500">
                    Redirecting to login...
                  </Typography>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={Theme.layout.standardPage}>
      <Header />
      
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

            {/* Reset Password Card */}
            <Card elevation={0} className="rounded-2xl overflow-hidden border border-slate-200">
              <CardContent className="p-8">
                
                {tokenValid === false ? (
                  /* Invalid Token State */
                  <div className="text-center py-8">
                    <div 
                      className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#ef444415' }}
                    >
                      <AlertCircle size={32} className="text-red-500" />
                    </div>
                    <Typography variant="h4" fontWeight="700" className="mb-2 text-slate-800">
                      Invalid Reset Link
                    </Typography>
                    <Typography variant="body1" className="text-slate-600 mb-6">
                      This password reset link is invalid or has expired. Please request a new password reset.
                    </Typography>
                    
                    <div className="space-y-3">
                      <Link 
                        to="/forgot-password"
                        className="block"
                      >
                        <button
                          type="button"
                          className="w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 hover:shadow-lg"
                          style={{ backgroundColor: Theme.colors.primary }}
                        >
                          Request New Reset Link
                        </button>
                      </Link>
                      
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
                ) : (
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
                        Reset Password
                      </Typography>
                      <Typography variant="body1" className="text-slate-600">
                        Enter your new password below.
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
                          label="New Password"
                          name="newPassword"
                          type={showPassword ? 'text' : 'password'}
                          value={formData.newPassword}
                          onChange={handleChange}
                          variant="outlined"
                          required
                          disabled={loading}
                          placeholder="Enter your new password"
                          error={!!error}
                          helperText={error && error.includes('password') && <span className="text-red-500 text-xs">{error}</span>}
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
                                <Lock size={20} className="text-slate-400" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="text-slate-400 hover:text-slate-600"
                                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                >
                                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
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

                        <TextField
                          fullWidth
                          label="Confirm New Password"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          variant="outlined"
                          required
                          disabled={loading}
                          placeholder="Confirm your new password"
                          error={!!error}
                          helperText={error && error.includes('match') && <span className="text-red-500 text-xs">{error}</span>}
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
                                <Lock size={20} className="text-slate-400" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                <button
                                  type="button"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                  className="text-slate-400 hover:text-slate-600"
                                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                >
                                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
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

                        {/* Password Requirements */}
                        <Box className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                          <Typography variant="body2" className="text-slate-600 font-medium mb-2">
                            Password Requirements:
                          </Typography>
                          <ul className="text-sm text-slate-500 space-y-1">
                            <li className="flex items-center gap-2">
                              <span className={`w-4 h-4 rounded-full ${formData.newPassword.length >= 6 ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                              At least 6 characters long
                            </li>
                            <li className="flex items-center gap-2">
                              <span className={`w-4 h-4 rounded-full ${formData.newPassword === formData.confirmPassword && formData.newPassword ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                              Passwords match
                            </li>
                          </ul>
                        </Box>

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
                              <span>Resetting Password...</span>
                            </div>
                          ) : (
                            'Reset Password'
                          )}
                        </button>
                      </Box>
                    </form>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Help Text */}
            {tokenValid !== false && (
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
      
      <Footer />
    </div>
  );
}
