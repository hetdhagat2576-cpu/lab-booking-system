import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Theme from "../../config/theam/index.js";
import IconConfig from "../../components/icon/index.js";
import CButton from "../../components/cButton";
import { safeFetch, createApiUrl } from "../../config/api";
import Swal from "sweetalert2";
import { useAuth } from "../../context/authContext";
import { 
  Card, CardContent, Avatar, Typography, Chip, Button, Paper, Box, 
  Grid, Divider, TextField, InputAdornment, Badge 
} from "@mui/material";

export default function UserProfileIndex() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { User, Mail, MapPin, Activity, Award, Calendar, Phone, MessageSquare, FileText, Settings, History, Star, ChevronLeft, Trash2, X, Clock } = IconConfig;
  
  // State for user profile fields
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    homeAddress: "",
    email: "",
    phone: ""
  });
  
  const [errors, setErrors] = useState({});
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stats, setStats] = useState({ total: 0, upcoming: 0, completed: 0 });
  const [contacts, setContacts] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [bookings, setBookings] = useState([]);

  // Memoized sidebar navigation items to prevent infinite re-render
  const sidebarItems = React.useMemo(() => [
    {
      id: 0,
      label: "Account Settings",
      icon: Settings,
      badge: null
    },
    {
      id: 1,
      label: "Feedback Requests",
      icon: MessageSquare,
      badge: feedbacks.length
    },
    {
      id: 2,
      label: "Contact Requests", 
      icon: Mail,
      badge: contacts.length
    },
    {
      id: 3,
      label: "Generate Reports",
      icon: FileText,
      badge: reports.length
    },
    {
      id: 4,
      label: "Activity History",
      icon: History,
      badge: null
    }
  ], [feedbacks.length, contacts.length, reports.length]);

  const fetchAllUserData = useCallback(async () => {
    if (!user || !user.token) return;

    // Fetch user profile data
    try {
      const res = await fetch(createApiUrl('/api/user/profile'), {
        headers: { Authorization: `Bearer ${user?.token || ""}` },
      });
      const data = await res.json();
      if (res.ok && data.success && data.data) {
        const merged = { ...user, ...data.data, token: user?.token };
        updateUser(merged);
        // Only update formData if values actually changed
        setFormData(prev => {
          const newFormData = {
            fullName: merged?.name || merged?.fullName || "",
            email: merged?.email || "",
            phone: merged?.phone || "",
            homeAddress: merged?.address || merged?.homeAddress || "",
            age: merged?.age || "",
            gender: merged?.gender || ""
          };
          const hasChanged = Object.keys(newFormData).some(key => prev[key] !== newFormData[key]);
          return hasChanged ? newFormData : prev;
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }

    // Fetch bookings data
    try {
      const response = await fetch(createApiUrl('/api/bookings'), {
        headers: {
          Authorization: `Bearer ${user?.token || ""}`,
        },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        const userBookings = Array.isArray(data.data) ? data.data : [];
        setBookings(userBookings);
        setStats({
          total: userBookings.length,
          upcoming: userBookings.filter(b => ["pending", "confirmed"].includes(b.status)).length,
          completed: userBookings.filter(b => b.status === "completed").length,
        });
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }

    // Fetch contact requests
    try {
      const res = await fetch(createApiUrl('/api/contact/my'), {
        headers: { Authorization: `Bearer ${user?.token || ""}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setContacts(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }

    // Fetch feedback requests
    try {
      const res = await fetch(createApiUrl('/api/feedback/my'), {
        headers: { Authorization: `Bearer ${user?.token || ""}` }
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.data)) {
        setFeedbacks(data.data);
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
    
    // Fetch user reports
    try {
      const res = await fetch(createApiUrl(`/api/reports/patient/${user?._id}`), {
        headers: { Authorization: `Bearer ${user?.token || ""}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReports(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  }, [user]); // Dependencies for useCallback - removed updateUser to prevent infinite loop

  // Fetch all user data on component mount
  useEffect(() => {
    if (!user || (user.role && user.role !== "user")) {
      navigate("/user-login");
      return;
    }
    
    const initialForm = {
      fullName: user?.name || user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      homeAddress: user?.address || user?.homeAddress || "",
      age: user?.age || "",
      gender: user?.gender || ""
    };
    
    // Only update formData if it's different from current values to prevent unnecessary re-renders
    setFormData(prev => {
      const hasChanged = Object.keys(initialForm).some(key => prev[key] !== initialForm[key]);
      return hasChanged ? initialForm : prev;
    });
  }, [user?._id, user?.token, navigate]); // Removed fetchAllUserData from dependencies

  // Separate effect to fetch user data when user changes
  useEffect(() => {
    if (user && user.token && user.role === "user") {
      fetchAllUserData();
    }
  }, [user?._id, user?.token]); // Only depend on user ID and token

  // Single handleChange function for all form inputs
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    // Prevent unnecessary re-renders by checking if value actually changed
    setFormData(prev => {
      if (prev[name] === value) {
        return prev; // No change needed
      }
      return {
        ...prev,
        [name]: value
      };
    });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]); // Add errors dependency

  // Handle form submission with API call
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    if (!user || !user.token) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: 'Please login to update your profile',
        confirmButtonColor: Theme.colors.primary
      });
      return;
    }

    setSaving(true);

    try {
      const response = await safeFetch(createApiUrl('/api/user/profile'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          name: formData.fullName,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.homeAddress,
          homeAddress: formData.homeAddress,
          age: formData.age,
          gender: formData.gender
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update local user context with new data
        const updatedUser = { ...user, ...data.data };
        updateUser(updatedUser);
        
        // Update form data with the saved values to ensure persistence
        setFormData(prev => ({
          ...prev,
          fullName: data.data?.name || data.data?.fullName || prev.fullName,
          email: data.data?.email || prev.email,
          phone: data.data?.phone || prev.phone,
          homeAddress: data.data?.address || data.data?.homeAddress || prev.homeAddress,
          age: data.data?.age || prev.age,
          gender: data.data?.gender || prev.gender
        }));
        
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated!',
          text: 'Your information has been saved successfully.',
          confirmButtonColor: Theme.colors.primary,
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false
        });
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.message || 'Unable to save your changes. Please try again.',
        confirmButtonColor: Theme.colors.primary
      });
    } finally {
      setSaving(false);
    }
  };

  // Form validation function
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    if (formData.age && (isNaN(formData.age) || formData.age < 1 || formData.age > 120)) {
      newErrors.age = 'Age must be between 1 and 120';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper functions for status colors
  const getFeedbackStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'success';
      case 'reviewed': return 'warning';
      default: return 'default';
    }
  };

  const getContactStatusColor = (status) => {
    switch (status) {
      case 'resolved': return 'success';
      case 'reviewed': return 'warning';
      default: return 'default';
    }
  };

  const handleRefreshReports = async () => {
    try {
      const res = await fetch(createApiUrl(`/api/reports/patient/${user?._id}`), {
        headers: { Authorization: `Bearer ${user?.token || ""}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReports(data.data || []);
        Swal.fire({
          icon: 'success',
          title: 'Reports Refreshed',
          text: 'Your reports have been updated.',
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error('Error refreshing reports:', error);
    }
  };

  // Handle delete contact request
  const handleDeleteContact = async (contactId) => {
    const result = await Swal.fire({
      title: 'Remove Contact Request',
      text: "This will remove the contact request from your view. The admin may still have access to this request.",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Remove from View',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        // Remove from local state only (client-side deletion)
        setContacts(prev => prev.filter(c => (c._id || c.id) !== contactId));
        
        Swal.fire({
          icon: 'success',
          title: 'Removed!',
          text: 'Contact request has been removed from your view.',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Error removing contact:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to remove contact request from view.'
        });
      }
    }
  };

  // Handle cancel booking
  const handleCancelBooking = async (bookingId) => {
    const result = await Swal.fire({
      title: 'Cancel Booking',
      text: "Are you sure you want to cancel this booking? This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, Cancel Booking',
      cancelButtonText: 'No, Keep Booking'
    });

    if (result.isConfirmed) {
      try {
        const response = await safeFetch(createApiUrl(`/api/bookings/${bookingId}/status`), {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token || ""}`
          },
          body: JSON.stringify({ status: 'cancelled' })
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // Update local state to reflect the change
          setBookings(prev => prev.map(booking => 
            booking._id === bookingId 
              ? { ...booking, status: 'cancelled' }
              : booking
          ));

          // Update stats
          setStats(prev => ({
            ...prev,
            upcoming: prev.upcoming - 1
          }));

          Swal.fire({
            icon: 'success',
            title: 'Booking Cancelled',
            text: 'Your booking has been successfully cancelled.',
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          throw new Error(data.message || 'Failed to cancel booking');
        }
      } catch (error) {
        console.error('Error cancelling booking:', error);
        Swal.fire({
          icon: 'error',
          title: 'Cancellation Failed',
          text: error.message || 'Unable to cancel booking. Please try again.',
          confirmButtonColor: Theme.colors.primary
        });
      }
    }
  };

  // Handle reschedule booking
  const handleRescheduleBooking = (booking) => {
    // Navigate to booking page with pre-filled data
    const queryParams = new URLSearchParams();
    
    if (booking.packageName) {
      queryParams.append('name', booking.packageName);
    }
    if (booking.packagePrice) {
      queryParams.append('price', booking.packagePrice);
    }
    if (booking.selectedTests && booking.selectedTests.length > 0) {
      queryParams.append('tests', JSON.stringify(booking.selectedTests));
    }
    queryParams.append('reschedule', 'true');
    queryParams.append('originalBookingId', booking._id);
    
    navigate(`/new-booking?${queryParams.toString()}`);
  };
  // Loading state
  if (loading) {
    return (
      <div className={Theme.layout.standardPage}>
        <Header />
        <main className="flex-grow pt-8 pb-12 bg-slate-50/50">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-slate-600">Loading profile...</p>
              </div>
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
      
      <main className="flex-grow pt-6 pb-8 bg-slate-50/30">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            
            {/* Welcome Banner */}
            <Card elevation={0} className="rounded-2xl overflow-hidden border border-slate-200 mb-6">
              <div className="min-h-32 bg-gradient-to-r from-primary to-secondary" style={{ background: `linear-gradient(to right, ${Theme.colors.primary}, ${Theme.colors.secondary})` }}>
                <CardContent className="relative pt-8 px-6 pb-8">
                  <div className="flex flex-col md:flex-row items-center md:items-center gap-4">
                    <Avatar 
                      sx={{ width: 80, height: 80, border: "3px solid rgba(255,255,255,0.3)", bgcolor: "rgba(255,255,255,0.2)", fontSize: "1.5rem", fontWeight: 'bold', color: 'white' }}
                      className="shadow-lg"
                    >
                      {formData.fullName?.charAt(0)?.toUpperCase() || "U"}
                    </Avatar>
                    
                    <div className="flex-grow text-center md:text-left">
                      <Typography variant="h4" fontWeight="700" className="text-white mb-1">
                        Welcome, {formData.fullName || "User"}!
                      </Typography>
                      <Typography className="text-white/90 font-medium flex items-center justify-center md:justify-start gap-2">
                        <Mail size={16} /> {formData.email}
                      </Typography>
                    </div>

                    <Button 
                      variant="contained" 
                      onClick={() => navigate("/dashboard")} 
                      startIcon={<Activity size={18} />}
                      sx={{ 
                        backgroundColor: "white", 
                        color: Theme.colors.primary,
                        borderRadius: '10px', 
                        textTransform: 'none', 
                        px: 3, 
                        py: 1.5,
                        fontWeight: 'bold',
                        "&:hover": { 
                          backgroundColor: "rgba(255,255,255,0.9)",
                          transform: 'translateY(-1px)'
                        }
                      }}
                      size="medium"
                    >
                      Book New Test
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Overview Section */}
                <Card elevation={0} className="rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <Typography variant="h6" fontWeight="700" className="mb-4" style={{ color: Theme.colors.primary }}>
                    Overview
                  </Typography>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <Typography variant="body2" className="text-slate-600 mb-1">Number of Active Tests</Typography>
                          <Typography variant="h4" fontWeight="700" style={{ color: Theme.colors.primary }}>
                            {stats.upcoming}
                          </Typography>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <Activity className="w-6 h-6" style={{ color: Theme.colors.primary }} />
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-secondary/20 to-secondary/10 rounded-xl p-4 border border-secondary/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <Typography variant="body2" className="text-slate-600 mb-1">Total Number of Tests</Typography>
                          <Typography variant="h4" fontWeight="700" style={{ color: Theme.colors.primary }}>
                            {stats.total}
                          </Typography>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center">
                          <FileText className="w-6 h-6" style={{ color: Theme.colors.secondary }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Personal Information Section - Only show when Account Settings is active */}
                {activeTab === 0 && (
                  <Card elevation={0} className="rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <Typography variant="h6" fontWeight="700" className="mb-4" style={{ color: Theme.colors.primary }}>
                      Personal Information
                    </Typography>
                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <TextField
                            fullWidth
                            label="Full Name"
                            name="fullName"
                            value={formData.fullName || ''}
                            onChange={handleChange}
                            variant="outlined"
                            error={!!errors.fullName}
                            helperText={errors.fullName}
                            InputLabelProps={{ 
                              shrink: true,
                              sx: { 
                                '&.Mui-focused': { color: Theme.colors.primary },
                                '&.Mui-error': { color: 'error.main' }
                              }
                            }}
                            InputProps={{
                              sx: { 
                                borderRadius: '12px',
                                '&:hover fieldset': { borderColor: Theme.colors.primary },
                                '&.Mui-focused fieldset': { borderColor: Theme.colors.primary },
                              }
                            }}
                          />
                        </div>
                        <div>
                          <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={formData.email || ''}
                            onChange={handleChange}
                            variant="outlined"
                            type="email"
                            error={!!errors.email}
                            helperText={errors.email}
                            InputLabelProps={{ 
                              shrink: true,
                              sx: { 
                                '&.Mui-focused': { color: Theme.colors.primary },
                                '&.Mui-error': { color: 'error.main' }
                              }
                            }}
                            InputProps={{
                              sx: { 
                                borderRadius: '12px',
                                '&:hover fieldset': { borderColor: Theme.colors.primary },
                                '&.Mui-focused fieldset': { borderColor: Theme.colors.primary },
                              }
                            }}
                          />
                        </div>
                        <div>
                          <TextField
                            fullWidth
                            label="Age"
                            name="age"
                            value={formData.age || ''}
                            onChange={handleChange}
                            variant="outlined"
                            type="number"
                            error={!!errors.age}
                            helperText={errors.age}
                            InputLabelProps={{ 
                              shrink: true,
                              sx: { 
                                '&.Mui-focused': { color: Theme.colors.primary },
                                '&.Mui-error': { color: 'error.main' }
                              }
                            }}
                            InputProps={{
                              sx: { 
                                borderRadius: '12px',
                                '&:hover fieldset': { borderColor: Theme.colors.primary },
                                '&.Mui-focused fieldset': { borderColor: Theme.colors.primary },
                              }
                            }}
                          />
                        </div>
                        <div>
                          <TextField
                            fullWidth
                            label="Gender"
                            name="gender"
                            value={formData.gender || ''}
                            onChange={handleChange}
                            variant="outlined"
                            select
                            SelectProps={{ native: true }}
                            InputLabelProps={{ 
                              shrink: true,
                              sx: { 
                                '&.Mui-focused': { color: Theme.colors.primary },
                                '&.Mui-error': { color: 'error.main' }
                              }
                            }}
                            InputProps={{
                              sx: { 
                                borderRadius: '12px',
                                '&:hover fieldset': { borderColor: Theme.colors.primary },
                                '&.Mui-focused fieldset': { borderColor: Theme.colors.primary },
                              }
                            }}
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </TextField>
                        </div>
                        <div>
                          <TextField
                            fullWidth
                            label="Phone Number"
                            name="phone"
                            value={formData.phone || ''}
                            onChange={handleChange}
                            variant="outlined"
                            type="tel"
                            error={!!errors.phone}
                            helperText={errors.phone}
                            InputLabelProps={{ 
                              shrink: true,
                              sx: { 
                                '&.Mui-focused': { color: Theme.colors.primary },
                                '&.Mui-error': { color: 'error.main' }
                              }
                            }}
                            InputProps={{
                              sx: { 
                                borderRadius: '12px',
                                '&:hover fieldset': { borderColor: Theme.colors.primary },
                                '&.Mui-focused fieldset': { borderColor: Theme.colors.primary },
                              }
                            }}
                          />
                        </div>
                        <div>
                          <TextField
                            fullWidth
                            label="Home Address"
                            name="homeAddress"
                            value={formData.homeAddress || ''}
                            onChange={handleChange}
                            variant="outlined"
                            InputLabelProps={{ 
                              shrink: true,
                              sx: { 
                                '&.Mui-focused': { color: Theme.colors.primary },
                                '&.Mui-error': { color: 'error.main' }
                              }
                            }}
                            InputProps={{
                              sx: { 
                                borderRadius: '12px',
                                '&:hover fieldset': { borderColor: Theme.colors.primary },
                                '&.Mui-focused fieldset': { borderColor: Theme.colors.primary },
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end mt-6">
                        <Button 
                          type="submit"
                          variant="contained" 
                          disabled={saving}
                          sx={{ 
                            backgroundColor: Theme.colors.primary, 
                            borderRadius: '10px', 
                            textTransform: 'none', 
                            px: 4, 
                            py: 1.5,
                            fontWeight: 'bold',
                            boxShadow: `0 4px 12px ${Theme.colors.primary}30`,
                            "&:hover": { 
                              backgroundColor: Theme.colors.primaryHover,
                              boxShadow: `0 6px 16px ${Theme.colors.primaryHover}40`,
                              transform: 'translateY(-1px)'
                            },
                            "&:disabled": {
                              backgroundColor: Theme.colors.textMuted,
                              boxShadow: 'none'
                            }
                          }}
                          size="medium"
                          className="transition-all"
                        >
                          {saving ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    </form>
                  </Card>
                )}

                {/* Feedback Requests Tab */}
                {activeTab === 1 && (
                  <Card elevation={0} className="rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="w-6 h-6" style={{ color: Theme.colors.primary }} />
                        <Typography variant="h6" fontWeight="700" style={{ color: Theme.colors.primary }}>Your Feedback Requests</Typography>
                        <Chip 
                          label={feedbacks.length} 
                          size="small" 
                          variant="outlined"
                          sx={{ 
                            borderColor: Theme.colors.primary, 
                            color: Theme.colors.primary,
                            backgroundColor: `${Theme.colors.primary}08`
                          }}
                        />
                      </div>
                    </div>
                    
                    {feedbacks.length === 0 ? (
                      <div className="rounded-2xl p-8 text-center border-2 border-dashed" style={{ backgroundColor: `${Theme.colors.primary}05`, borderColor: Theme.colors.primary }}>
                        <MessageSquare className="w-12 h-12 mx-auto mb-3" style={{ color: Theme.colors.primary }} />
                        <Typography variant="h6" className="mb-2" style={{ color: Theme.colors.primary }}>No Feedback Submitted Yet</Typography>
                        <Typography variant="body2" className="mb-4" style={{ color: Theme.colors.textSecondary }}>Share your experience to help us improve our services</Typography>
                        <Button 
                          variant="contained" 
                          onClick={() => navigate("/feedBack")}
                          sx={{ 
                            backgroundColor: Theme.colors.primary, 
                            "&:hover": { 
                              backgroundColor: Theme.colors.primaryHover,
                              boxShadow: `0 4px 12px ${Theme.colors.primary}30`
                            },
                            borderRadius: '10px',
                            px: 3,
                            py: 1.5,
                            fontWeight: 'bold'
                          }}
                        >
                          Submit Feedback
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {feedbacks.map((fb) => (
                          <Card key={fb._id} elevation={1} className="rounded-xl hover:shadow-md transition-all duration-200 border border-gray-100 bg-white">
                            <CardContent className="p-5">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold text-teal-600 mb-1">
                                    Feedback Request
                                  </h3>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                                  <Star className="w-4 h-4 text-gray-300" />
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400">
                                  {new Date(fb.createdAt).toLocaleDateString()}
                                </span>
                                <Chip 
                                  label={fb.status || "new"}
                                  size="small"
                                  color={getFeedbackStatusColor(fb.status)}
                                  variant="outlined"
                                  className="font-medium text-xs"
                                />
                              </div>
                              
                              {fb.comment && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                  <p className="text-sm text-gray-600 line-clamp-2">{fb.comment}</p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </Card>
                )}

                {/* Contact Requests Tab */}
                {activeTab === 2 && (
                  <Card elevation={0} className="rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <Mail className="w-6 h-6" style={{ color: Theme.colors.primary }} />
                        <Typography variant="h6" fontWeight="700" style={{ color: Theme.colors.primary }}>Your Contact Requests</Typography>
                        <Chip 
                          label={contacts.length} 
                          size="small" 
                          variant="outlined"
                          sx={{ 
                            borderColor: Theme.colors.primary, 
                            color: Theme.colors.primary,
                            backgroundColor: `${Theme.colors.primary}08`
                          }}
                        />
                      </div>
                    </div>
                    
                    {contacts.length === 0 ? (
                      <div className="rounded-2xl p-8 text-center border-2 border-dashed" style={{ backgroundColor: `${Theme.colors.primary}05`, borderColor: Theme.colors.primary }}>
                        <Mail className="w-12 h-12 mx-auto mb-3" style={{ color: Theme.colors.primary }} />
                        <Typography variant="h6" className="mb-2" style={{ color: Theme.colors.primary }}>No Contact Requests Yet</Typography>
                        <Typography variant="body2" className="mb-4" style={{ color: Theme.colors.textSecondary }}>Reach out to us for any questions or support</Typography>
                        <Button 
                          variant="contained" 
                          onClick={() => navigate("/contact-Us")}
                          sx={{ 
                            backgroundColor: Theme.colors.primary, 
                            "&:hover": { 
                              backgroundColor: Theme.colors.primaryHover,
                              boxShadow: `0 4px 12px ${Theme.colors.primary}30`
                            },
                            borderRadius: '10px',
                            px: 3,
                            py: 1.5,
                            fontWeight: 'bold'
                          }}
                        >
                          Contact Us
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {contacts.map((c) => (
                          <Card key={c._id || c.id} elevation={1} className="rounded-xl hover:shadow-md transition-all duration-200 border border-gray-100 bg-white relative">
                            <CardContent className="p-5">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold text-teal-600 mb-1">
                                    Contact Request
                                  </h3>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400">
                                  {new Date(c.createdAt).toLocaleDateString()}
                                </span>
                                <Chip 
                                  label={c.status || "new"}
                                  size="small"
                                  color={getContactStatusColor(c.status)}
                                  variant="outlined"
                                  className="font-medium text-xs"
                                />
                              </div>
                              
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <p className="text-sm font-medium text-gray-800 mb-2">{c.subject}</p>
                                <p className="text-sm text-gray-600 line-clamp-2">{c.message}</p>
                              </div>
                              
                              <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                                <Mail className="w-3 h-3" />
                                <span>{c.email}</span>
                              </div>
                            </CardContent>
                            
                            {/* Delete Icon */}
                            <button
                              onClick={() => handleDeleteContact(c._id || c.id)}
                              className="absolute top-3 right-3 p-2 rounded-full hover:bg-red-50 group transition-colors duration-200"
                              title="Delete contact request"
                            >
                              <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors duration-200" />
                            </button>
                          </Card>
                        ))}
                      </div>
                    )}
                  </Card>
                )}

                {/* Generate Reports Tab */}
                {activeTab === 3 && (
                  <Card elevation={0} className="rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <FileText className="w-6 h-6 text-green-600" />
                        <Typography variant="h6" fontWeight="700">Generate Reports</Typography>
                        <Chip 
                          label={reports.length} 
                          size="small" 
                          color="success" 
                          variant="outlined"
                        />
                      </div>
                      <Button 
                        variant="outlined" 
                        size="small"
                        onClick={handleRefreshReports}
                        sx={{ 
                          borderRadius: '8px', 
                          textTransform: 'none',
                          borderColor: Theme.colors.primary,
                          color: Theme.colors.primary,
                          "&:hover": { 
                            borderColor: Theme.colors.primaryHover, 
                            color: Theme.colors.primaryHover 
                          }
                        }}
                        startIcon={<FileText size={16} />}
                      >
                        Refresh
                      </Button>
                    </div>
                    
                    {reports.length === 0 ? (
                      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
                        <FileText className="w-12 h-12 text-green-400 mx-auto mb-3" />
                        <Typography variant="h6" className="text-gray-800 mb-2">No Reports Available Yet</Typography>
                        <Typography variant="body2" className="text-gray-600 mb-4">Your lab reports will appear here once they are generated by the lab technician</Typography>
                        <Button 
                          variant="contained" 
                          onClick={() => navigate("/dashboard")}
                          sx={{ backgroundColor: Theme.colors.primary, "&:hover": { backgroundColor: Theme.colors.primaryHover } }}
                        >
                          Book a Test
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {reports.map((report) => (
                          <Card key={report._id} elevation={1} className="rounded-xl hover:shadow-md transition-all duration-200 border border-gray-100 bg-white">
                            <CardContent className="p-5">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold text-teal-600 mb-1">
                                    Lab Report
                                  </h3>
                                </div>
                                <div className="flex items-center gap-1">
                                  <FileText className="w-4 h-4 text-teal-500" />
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400">
                                  {new Date(report.testDate).toLocaleDateString()}
                                </span>
                                <Chip 
                                  label="Completed"
                                  size="small"
                                  color="success"
                                  variant="outlined"
                                  className="font-medium text-xs"
                                />
                              </div>
                              
                              <div className="mt-3 pt-3 border-t border-gray-100">
                                <p className="text-sm font-medium text-gray-800 mb-2">{report.packageName}</p>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {report.selectedTests?.length || 0} tests included • Technician: {report.technicianId?.name || 'Lab Technician'}
                                </p>
                              </div>
                              
                              <div className="mt-4">
                                <Button 
                                  variant="contained" 
                                  size="small"
                                  fullWidth
                                  onClick={async () => {
                                    try {
                                      const response = await fetch(createApiUrl(`/api/reports/${report._id}/download`), {
                                        headers: {
                                          Authorization: `Bearer ${user?.token || ""}`
                                        }
                                      });
                                      
                                      if (!response.ok) {
                                        throw new Error('Failed to fetch PDF');
                                      }
                                      
                                      const blob = await response.blob();
                                      const url = window.URL.createObjectURL(blob);
                                      const link = document.createElement('a');
                                      link.href = url;
                                      link.download = `Lab_Report_${report.packageName}_${report._id.toString().slice(-8)}.pdf`;
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                      window.URL.revokeObjectURL(url);
                                      
                                      Swal.fire({
                                        icon: 'success',
                                        title: 'Download Started',
                                        text: 'Your lab report is being downloaded.',
                                        timer: 2000,
                                        showConfirmButton: false
                                      });
                                    } catch (error) {
                                      console.error('Download error:', error);
                                      Swal.fire({
                                        icon: 'error',
                                        title: 'Download Failed',
                                        text: 'Unable to download the report. Please try again.',
                                        confirmButtonColor: Theme.colors.primary
                                      });
                                    }
                                  }}
                                  sx={{ 
                                    backgroundColor: Theme.colors.primary, 
                                    "&:hover": { backgroundColor: Theme.colors.primaryHover },
                                    borderRadius: '8px',
                                    textTransform: 'none',
                                    fontSize: '0.75rem',
                                    py: 1
                                  }}
                                >
                                  Download PDF
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </Card>
                )}

                {/* Activity History Tab */}
                {activeTab === 4 && (
                  <Card elevation={0} className="rounded-2xl border border-slate-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <History className="w-6 h-6 text-primary-600" />
                        <Typography variant="h6" fontWeight="700" className="text-slate-800">
                          Your Booking History
                        </Typography>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {bookings.length > 0 ? (
                        bookings.map((booking, index) => (
                          <Paper key={index} elevation={0} className="p-4 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
                            <div className="flex items-start gap-4">
                              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                                <FileText className="w-5 h-5 text-slate-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                  <Typography variant="h6" className="font-semibold text-slate-800 truncate">
                                    {booking.testName || booking.packageName || "Lab Test"}
                                  </Typography>
                                  <Chip
                                    label={booking.status || "pending"}
                                    size="small"
                                    className={`${
                                      booking.status === "completed" ? "bg-green-100 text-green-700" :
                                      booking.status === "confirmed" ? "bg-blue-100 text-blue-700" :
                                      booking.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                                      "bg-amber-100 text-amber-700"
                                    }`}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <MapPin className="w-4 h-4" />
                                    <span>{booking.location || "Wellness Center Lab Appointment"}</span>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-slate-600">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="w-4 h-4" />
                                      <span>{new Date(booking.date || booking.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Calendar className="w-4 h-4" />
                                      <span>{new Date(booking.date || booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Paper>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                          <Typography variant="h6" className="text-slate-600 mb-2">
                            No Bookings Found
                          </Typography>
                          <Typography variant="body2" className="text-slate-500">
                            You haven't made any lab appointments yet.
                          </Typography>
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {/* Recent Applications/Bookings */}
                <Card elevation={0} className="rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <Typography variant="h6" fontWeight="700" className="mb-4" style={{ color: Theme.colors.primary }}>
                    Recent Bookings
                  </Typography>
                  {bookings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {bookings.slice(0, 6).map((booking, index) => (
                        <Card key={index} elevation={1} className="rounded-xl hover:shadow-md transition-all duration-200 border border-gray-100 bg-white">
                          <CardContent className="p-5">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-teal-600 mb-1">
                                  Lab Test
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {new Date(booking.date || booking.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center gap-1">
                                <FileText className="w-4 h-4 text-teal-500" />
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-medium text-gray-700">
                                {booking.testName || booking.packageName || "Lab Test"}
                              </span>
                              <Chip 
                                label={booking.status || "pending"}
                                size="small"
                                color={booking.status === "completed" ? "success" : 
                                       booking.status === "confirmed" ? "primary" : 
                                       booking.status === "cancelled" ? "error" :
                                       "warning"}
                                variant="outlined"
                                className="font-medium text-xs"
                              />
                            </div>
                            
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <p className="text-sm text-gray-600 mb-3">
                                {booking.location || "Wellness Center Lab"}
                              </p>
                              
                              {/* Action buttons based on booking status */}
                              {booking.status === "pending" && (
                                <div className="flex gap-2">
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleCancelBooking(booking._id)}
                                    startIcon={<X className="w-4 h-4" />}
                                    sx={{
                                      fontSize: '0.75rem',
                                      py: 0.5,
                                      px: 1,
                                      borderColor: '#ef4444',
                                      color: '#ef4444',
                                      '&:hover': {
                                        borderColor: '#dc2626',
                                        backgroundColor: '#fef2f2'
                                      }
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              )}
                              
                              {/* Show Reschedule button only for cancelled bookings */}
                              {booking.status === "cancelled" && (
                                <div className="flex gap-2">
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => handleRescheduleBooking(booking)}
                                    startIcon={<Clock className="w-4 h-4" />}
                                    sx={{
                                      fontSize: '0.75rem',
                                      py: 0.5,
                                      px: 1,
                                      borderColor: Theme.colors.primary,
                                      color: Theme.colors.primary,
                                      '&:hover': {
                                        borderColor: Theme.colors.primaryHover,
                                        backgroundColor: `${Theme.colors.primary}08`
                                      }
                                    }}
                                  >
                                    Reschedule
                                  </Button>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <Typography variant="body1" className="text-slate-600">
                        No recent bookings found
                      </Typography>
                    </div>
                  )}
                </Card>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                
                {/* Quick Actions */}
                <Card elevation={0} className="rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <Typography variant="h6" fontWeight="700" className="mb-4" style={{ color: Theme.colors.primary }}>
                    Quick Actions
                  </Typography>
                  <div className="space-y-2">
                    {sidebarItems.slice(0, 4).map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveTab(item.id)}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left text-slate-600 hover:bg-slate-50 hover:text-slate-800 hover:shadow-sm"
                        >
                          <Icon size={18} />
                          <span className="font-medium text-sm">{item.label}</span>
                          {item.badge !== null && item.badge > 0 && (
                            <Badge 
                              badgeContent={item.badge} 
                              sx={{
                                '& .MuiBadge-badge': {
                                  backgroundColor: Theme.colors.primary,
                                  color: 'white',
                                }
                              }}
                              className="ml-auto"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </Card>

                
                {/* Upcoming Tests */}
                <Card elevation={0} className="rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <Typography variant="h6" fontWeight="700" className="mb-4" style={{ color: Theme.colors.primary }}>
                    Upcoming Tests
                  </Typography>
                  <div className="space-y-3">
                    {bookings.filter(b => ["pending", "confirmed"].includes(b.status)).slice(0, 3).map((booking, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-4 h-4" style={{ color: Theme.colors.primary }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Typography variant="body2" fontWeight="600" className="text-slate-800 truncate">
                            {booking.testName || booking.packageName || "Lab Test"}
                          </Typography>
                          <Typography variant="caption" className="text-slate-500">
                            {new Date(booking.date || booking.createdAt).toLocaleDateString()}
                          </Typography>
                        </div>
                      </div>
                    ))}
                    {bookings.filter(b => ["pending", "confirmed"].includes(b.status)).length === 0 && (
                      <Typography variant="body2" className="text-slate-500 text-center py-4">
                        No upcoming tests
                      </Typography>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

  
