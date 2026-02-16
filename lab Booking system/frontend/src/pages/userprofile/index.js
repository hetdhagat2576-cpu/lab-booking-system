import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/header";
import Footer from "../../components/footer";
import Theme from "../../config/theam/index.js";
import IconConfig from "../../components/icon/index.js";
import CButton from "../../components/cButton";
import { safeFetch, createApiUrl } from "../../config/api";
import Swal from "sweetalert2";
import { useAuth } from "../../context/authContext";
import LogoutConfirmation from "../../components/logoutConfirmation/index.js";
import { 
  Card, CardContent, Avatar, Typography, Chip, Button, Paper, Box, 
  Tabs, Tab, Badge, Grid, Divider, TextField, InputAdornment 
} from "@mui/material";

export default function UserProfileIndex() {
  const navigate = useNavigate();
  const { user, updateUser, logout } = useAuth();
  const { User, Mail, MapPin, Activity, Award, Calendar, Phone, MessageSquare, Star, CheckCircle, Clock, AlertCircle, LogOut, FileText, Settings, History, ChevronLeft } = IconConfig;
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    address: "", 
    age: "",
    gender: ""
  });
  const [stats, setStats] = useState({ total: 0, upcoming: 0, completed: 0 });
  const [contacts, setContacts] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [bookings, setBookings] = useState([]);

  // Sidebar navigation items
  const sidebarItems = [
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
  ];

  useEffect(() => {
    if (!user || (user.role && user.role !== "user")) {
      navigate("/user-login");
      return;
    }
    
    const initialForm = {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      age: user?.age || "",
      gender: user?.gender || ""
    };
    
    console.log('Setting initial form:', initialForm);
    setForm(initialForm);    

    (async () => {
      try {
        const res = await fetch(createApiUrl('/api/user/profile'), {
          headers: { Authorization: `Bearer ${user?.token || ""}` },
        });
        const data = await res.json();
        if (res.ok && data.success && data.data) {
          const merged = { ...user, ...data.data, token: user?.token };
          updateUser(merged);
          setForm({
            name: merged?.name || "",
            email: merged?.email || "",
            phone: merged?.phone || "",
            address: merged?.address || "",
            age: merged?.age || "",
            gender: merged?.gender || ""
          });
        }
      } catch {}
    })();

    (async () => {
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
      } catch {}
    })();
    (async () => {
      try {
        const res = await fetch(createApiUrl('/api/contact/my'), {
          headers: { Authorization: `Bearer ${user?.token || ""}` 
        }
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setContacts(data.data || []);
        }
      } catch {}
    })();
    (async () => {
      try {
        const res = await fetch(createApiUrl('/api/feedback/my'), {
          headers: { Authorization: `Bearer ${user?.token || ""}` }
        });
        const data = await res.json();
        if (res.ok && data.success && Array.isArray(data.data)) {
          setFeedbacks(data.data);
        }
      } catch {}
    })();
    
    // Fetch user reports
    (async () => {
      try {
        const res = await fetch(createApiUrl(`/api/reports/patient/${user?._id}`), {
          headers: { Authorization: `Bearer ${user?.token || ""}` }
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setReports(data.data || []);
        } else {
          console.error('Failed to fetch reports:', data.message);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    })();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Input changed:', { name, value }); // Debug log
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user || !user.token) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Error',
        text: 'Please login to update your profile',
        confirmButtonColor: Theme.colors.primary
      });
      return;
    }
    
    try {
      const res = await fetch(createApiUrl('/api/user/profile'), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
        }),
      });
      const data = await res.json();
      
      if (res.ok && data.success && data.data) {
        updateUser(data.data);
        setForm({
          name: data.data?.name || "",
          email: data.data?.email || "",
          phone: data.data?.phone || "",
          address: data.data?.address || "",
          age: data.data?.age || "",
          gender: data.data?.gender || ""
        });
        
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
        Swal.fire({
          icon: 'error',
          title: 'Update Failed',
          text: data.message || 'Failed to update profile. Please try again.',
          confirmButtonColor: Theme.colors.primary
        });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        icon: 'error',
        title: 'Connection Error',
        text: 'Unable to connect to server. Please check your connection and try again.',
        confirmButtonColor: Theme.colors.primary
      });
    }
  };
  const handleClearFeedbacks = async () => {
    try {
      const res = await fetch(createApiUrl('/api/feedback/clear'), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.token || ""}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFeedbacks([]);
      }
    } catch {}
  };
  const handleClearContacts = async () => {
    try {
      const res = await fetch(createApiUrl('/api/contact/clear'), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.token || ""}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setContacts([]);
      }
    } catch {}
  };

  const handleLogout = (reason) => {
    logout();
    navigate("/user-login");
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
          showConfirmButton: false,
          customClass: {
            popup: 'rounded-lg shadow-xl',
            title: 'text-lg font-semibold'
          }
        });
      } else {
        throw new Error(data.message || 'Failed to refresh reports');
      }
    } catch (error) {
      console.error('Error refreshing reports:', error);
      Swal.fire({
        icon: 'error',
        title: 'Refresh Failed',
        text: 'Unable to refresh reports. Please try again.',
        confirmButtonColor: Theme.colors.primary,
        customClass: {
          popup: 'rounded-lg shadow-xl',
          title: 'text-lg font-semibold',
          confirmButton: 'px-6 py-2 text-white font-medium rounded-lg hover:opacity-90 transition-opacity'
        },
        buttonsStyling: false
      });
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

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

  const getNpsColor = (score) => {
    if (score >= 8) return 'success';
    if (score >= 5) return 'warning';
    return 'error';
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate50"> {/* Soft background color */}
      <Header hideNavItems={true} />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          
          {/* Hero Profile Section */}
          <Card elevation={0} className="rounded-3xl overflow-hidden border border-slate-200 mb-8">
            <div className="h-32 bg-gradient-to-r from-primary to-secondary" style={{ background: `linear-gradient(to right, ${Theme.colors.primary}, ${Theme.colors.secondary})` }} />
            <CardContent className="relative pt-0 px-8 pb-8">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-4 lg:gap-6 -mt-16">
                <Avatar 
                  sx={{ width: 100, height: 100, border: "4px solid white", bgcolor: Theme.colors.primary, fontSize: "2rem", fontWeight: 'bold' }}
                  className="shadow-xl"
                >
                  {form.name?.charAt(0)?.toUpperCase() || "U"}
                </Avatar>
                
                <div className="flex-grow text-center md:text-left mb-2">
                  <Typography variant="h3" fontWeight="800" className="text-slate-800 mb-1">
                    {form.name || "User Profile"}
                  </Typography>
                  <Typography className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2 mb-2">
                    <Mail size={16} /> {form.email}
                  </Typography>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <Chip 
                      icon={<Activity size={14} />} 
                      label={`${stats.total} Total Visits`} 
                      size="small" 
                      variant="outlined" 
                      className="text-xs"
                    />
                    <Chip 
                      icon={<Calendar size={14} />} 
                      label={`${stats.upcoming} Upcoming`} 
                      size="small" 
                      variant="outlined" 
                      className="text-xs"
                    />
                    <Chip 
                      icon={<Award size={14} />} 
                      label={`${stats.completed} Completed`} 
                      size="small" 
                      variant="outlined" 
                      className="text-xs"
                    />
                  </div>
                </div>

                <div className="flex gap-2 mb-2 flex-wrap justify-center md:justify-start">
                  <Button 
                    variant="outlined" 
                    onClick={() => navigate("/dashboard")} 
                    startIcon={<Activity size={18} />}
                    sx={{ borderRadius: '10px', textTransform: 'none', px: 2, py: 1, borderColor: Theme.colors.primary, color: Theme.colors.primary, "&:hover": { borderColor: Theme.colors.primaryHover, color: Theme.colors.primaryHover } }}
                    size="small"
                    className="text-sm"
                  >
                   Dashboard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content with Sidebar */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar Navigation */}
            <Paper elevation={0} className="w-full lg:w-64 rounded-2xl border border-slate-200 p-4 h-fit">
              <nav className="space-y-2">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                        activeTab === item.id
                          ? 'bg-primary-50 text-primary-700 border border-primary-200'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                    >
                      <Icon size={18} />
                      <span className="font-medium text-sm lg:text-base">{item.label}</span>
                      {item.badge !== null && item.badge > 0 && (
                        <Badge 
                          badgeContent={item.badge} 
                          color="primary" 
                          className="ml-auto"
                        />
                      )}
                    </button>
                  );
                })}
              </nav>
            </Paper>

            {/* Content Area */}
            <Paper elevation={0} className="flex-1 rounded-2xl border border-slate-200 p-6">
              {/* Account Settings Tab */}
              {activeTab === 0 && (
                <Grid container spacing={4}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="h6" fontWeight="700" className="mb-6">Personal Information</Typography>
                    <Box className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={form.name || ''}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        value={form.email || ''}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        label="Age"
                        name="age"
                        value={form.age || ''}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        label="Gender"
                        name="gender"
                        value={form.gender || ''}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={form.phone || ''}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        label="Home Address"
                        name="address"
                        value={form.address || ''}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{ mb: 2 }}
                      />
                    </Box>
                    <Divider className="my-8" />
                    <div className="flex justify-between items-center">
                      <Typography variant="body2" className="text-slate-400">
                        Last updated: {new Date().toLocaleDateString()}
                      </Typography>
                      <Button 
                        variant="contained" 
                        onClick={handleSave}
                        sx={{ backgroundColor: Theme.colors.primary, borderRadius: '10px', textTransform: 'none', px: 3, py: 1, "&:hover": { backgroundColor: Theme.colors.primaryHover } }}
                        size="small"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              )}

              {/* Feedback Requests Tab */}
              {activeTab === 1 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-6 h-6" style={{ color: Theme.colors.primary }} />
                      <Typography variant="h6" fontWeight="700">Your Feedback Requests</Typography>
                      <Chip 
                        label={feedbacks.length} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </div>
                  </div>
                  
                  {feedbacks.length === 0 ? (
                    <div className="rounded-2xl p-8 text-center bg-gray-50 border border-gray-200">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3" style={{ color: Theme.colors.primary }} />
                      <Typography variant="h6" className="mb-2" style={{ color: Theme.colors.primary }}>No Feedback Submitted Yet</Typography>
                      <Typography variant="body2" className="mb-4 text-gray-600">Share your experience to help us improve our services</Typography>
                      <Button 
                        variant="contained" 
                        onClick={() => navigate("/feedBack")}
                        sx={{ backgroundColor: Theme.colors.primary, "&:hover": { backgroundColor: Theme.colors.primaryHover } }}
                      >
                        Submit Feedback
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {feedbacks.map((fb) => (
                        <Card key={fb._id} elevation={2} className="rounded-2xl hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <Typography variant="h6" fontWeight="600" className="text-slate-800 mb-2">
                                  Feedback from {new Date(fb.createdAt).toLocaleDateString()}
                                </Typography>
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 text-amber-400" />
                                    <span className="text-sm font-semibold text-slate-700">
                                      {fb.bookingEaseRating}/5
                                    </span>
                                  </div>
                                  <Chip 
                                    label={fb.status || "new"}
                                    size="small"
                                    color={getFeedbackStatusColor(fb.status)}
                                    variant="outlined"
                                    className="font-medium"
                                  />
                                </div>
                              </div>
                            </div>
                            
                            {fb.comment && (
                              <Box className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                <Typography variant="body2" className="text-slate-700 leading-relaxed">{fb.comment}</Typography>
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Contact Requests Tab */}
              {activeTab === 2 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Mail className="w-6 h-6 text-blue-600" />
                      <Typography variant="h6" fontWeight="700">Your Contact Requests</Typography>
                      <Chip 
                        label={contacts.length} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </div>
                  </div>
                  
                  {contacts.length === 0 ? (
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center">
                      <Mail className="w-12 h-12 text-blue-400 mx-auto mb-3" />
                      <Typography variant="h6" className="text-gray-800 mb-2">No Contact Requests Yet</Typography>
                      <Typography variant="body2" className="text-gray-600 mb-4">Reach out to us for any questions or support</Typography>
                      <Button 
                        variant="contained" 
                        onClick={() => navigate("/contact-Us")}
                        sx={{ backgroundColor: Theme.colors.primary, "&:hover": { backgroundColor: Theme.colors.primaryHover } }}
                      >
                        Contact Us
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {contacts.map((c) => (
                        <Card key={c._id || c.id} elevation={2} className="rounded-2xl hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <Typography variant="h6" fontWeight="600" className="text-slate-800 mb-2">
                                  {c.subject}
                                </Typography>
                                <div className="flex items-center gap-3 mb-3">
                                  <Typography variant="caption" className="text-slate-500">
                                    {new Date(c.createdAt).toLocaleDateString()}
                                  </Typography>
                                  <Chip 
                                    label={c.status || "new"}
                                    size="small"
                                    color={getContactStatusColor(c.status)}
                                    variant="outlined"
                                    className="font-medium"
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <Box className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100">
                              <Typography variant="body2" className="text-slate-700 leading-relaxed">{c.message}</Typography>
                            </Box>
                            
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                              <Mail className="w-4 h-4" />
                              <span className="font-medium">{c.email}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Report Generate Tab */}
              {activeTab === 3 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-green-600" />
                      <Typography variant="h6" fontWeight="700">Report Generate</Typography>
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
                    <div className="space-y-4">
                      {reports.map((report) => (
                        <Card key={report._id} elevation={2} className="rounded-2xl hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <Typography variant="h6" fontWeight="600" className="text-slate-800 mb-2">
                                  {report.packageName}
                                </Typography>
                                <div className="flex items-center gap-3 mb-3">
                                  <Typography variant="body2" className="text-slate-600">
                                    {new Date(report.testDate).toLocaleDateString()}
                                  </Typography>
                                  <Chip 
                                    label="Completed"
                                    size="small"
                                    color="success"
                                    variant="outlined"
                                    className="font-medium"
                                  />
                                </div>
                                <Typography variant="body2" className="text-slate-600">
                                  {report.selectedTests?.length || 0} tests included • Technician: {report.technicianId?.name || 'Lab Technician'}
                                </Typography>
                              </div>
                            </div>
                            
                            <div className="flex gap-3 mt-4">
                              <Button 
                                variant="contained" 
                                size="small"
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
                                  textTransform: 'none'
                                }}
                              >
                                Download PDF
                              </Button>
                              <Button 
                                variant="outlined" 
                                size="small"
                                onClick={() => {
                                  Swal.fire({
                                    title: 'Report Details',
                                    html: `<div style="text-align: left; white-space: pre-line; line-height: 1.5;">
                                      <strong>Package:</strong> ${report.packageName}<br>
                                    <strong>Test Date:</strong> ${new Date(report.testDate).toLocaleDateString()}<br>
                                    <strong>Tests:</strong> ${report.selectedTests?.length || 0} tests included<br>
                                    <strong>Summary:</strong> ${report.summary}<br>
                                    <strong>Recommendations:</strong> ${report.recommendations}
                                  </div>`,
                                  icon: 'info',
                                  confirmButtonColor: Theme.colors.primary,
                                  confirmButtonText: 'OK'
                                });
                              }}
                              sx={{ 
                                  borderColor: Theme.colors.primary,
                                  color: Theme.colors.primary,
                                  borderRadius: '8px',
                                  textTransform: 'none'
                                }}
                              >
                                View Details
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Activity History Tab */}
              {activeTab === 4 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <History className="w-6 h-6 text-primary-600" />
                      <Typography variant="h6" fontWeight="700" className="text-slate-800">
                        Your Booking History
                      </Typography>
                    </div>
                    <button
                      onClick={() => navigate("/")}
                      className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back to Dashboard
                    </button>
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
                                    <Clock className="w-4 h-4" />
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
                </div>
              )}
            </Paper>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Helper Component for Stats
const StatCard = ({ icon, label, value, color }) => (
  <Paper elevation={0} className="p-5 rounded-2xl border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-slate-50 text-slate-600`}>
      {React.cloneElement(icon, { size: 24 })}
    </div>
    <div>
      <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</div>
      <div className="text-2xl font-black text-slate-800">{value}</div>
    </div>
  </Paper>
);

// Helper Component for Inputs
const StyledTextField = ({ label, icon, value, onChange, ...props }) => {
  const handleChange = (e) => {
    console.log('StyledTextField handleChange:', e.target.name, e.target.value);
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <TextField
      {...props}
      value={value ?? ''}
      onChange={handleChange}
      fullWidth
      label={label}
      variant="outlined"
      InputProps={{
        startAdornment: <InputAdornment position="start" className="text-slate-400">{icon}</InputAdornment>,
        sx: { borderRadius: '12px', bgcolor: Theme.colors.slate50 }
      }}
      InputLabelProps={{
        sx: { 
          '&.Mui-focused': { color: Theme.colors.primary },
          '&.Mui-error': { color: 'error.main' }
        }
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          '&:hover fieldset': {
            borderColor: Theme.colors.primary,
          },
          '&.Mui-focused fieldset': {
            borderColor: Theme.colors.primary,
          },
        }
      }}
    />
  );
};
