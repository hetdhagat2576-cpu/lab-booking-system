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
  const { User, Mail, MapPin, Activity, Award, Calendar, Phone, MessageSquare, Star, CheckCircle, Clock, AlertCircle, LogOut, FileText } = IconConfig;
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [stats, setStats] = useState({ total: 0, upcoming: 0, completed: 0 });
  const [contacts, setContacts] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [reports, setReports] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (!user || (user.role && user.role !== "user")) {
      navigate("/user-login");
      return;
    }
    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
    });    

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
            name: merged.name || "",
            email: merged.email || "",
            phone: merged.phone || "",
            address: merged.address || "",
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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    if (!user || !user.token) {
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
          name: data.data.name || "",
          email: data.data.email || "",
          phone: data.data.phone || "",
          address: data.data.address || "",
        });
      }
    } catch {}
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
              <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16">
                <Avatar 
                  sx={{ width: 120, height: 120, border: "4px solid white", bgcolor: Theme.colors.primary, fontSize: "2.5rem", fontWeight: 'bold' }}
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

                <div className="flex gap-2 mb-2">
                  <Button 
                    variant="outlined" 
                    onClick={() => navigate("/dashboard")} 
                    startIcon={<Activity size={18} />}
                    sx={{ borderRadius: '10px', textTransform: 'none', px: 2, py: 1, borderColor: Theme.colors.primary, color: Theme.colors.primary, "&:hover": { borderColor: Theme.colors.primaryHover, color: Theme.colors.primaryHover } }}
                    size="small"
                  >
                   Dashboard
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={() => navigate("/user-history")} 
                    startIcon={<Calendar size={18} />}
                    sx={{ borderRadius: '10px', textTransform: 'none', px: 2, py: 1, borderColor: Theme.colors.primary, color: Theme.colors.primary, "&:hover": { borderColor: Theme.colors.primaryHover, color: Theme.colors.primaryHover } }}
                    size="small"
                  >
                    History
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={handleSave}
                    sx={{ backgroundColor: Theme.colors.primary, borderRadius: '10px', textTransform: 'none', px: 3, py: 1, "&:hover": { backgroundColor: Theme.colors.primaryHover } }}
                    size="small"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content with Tabs */}
          <Paper elevation={0} className="rounded-3xl border border-slate-200">
            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 2 }}>
              <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                <Tab 
                  icon={<User size={18} />} 
                  label="Account Settings" 
                  iconPosition="start"
                  sx={{ textTransform: 'none', minHeight: 48, fontSize: '14px' }}
                />
                <Tab 
                  icon={<Badge badgeContent={feedbacks.length} color="primary"><MessageSquare size={18} /></Badge>} 
                  label="Your Feedback Requests" 
                  iconPosition="start"
                  sx={{ textTransform: 'none', minHeight: 48, fontSize: '14px' }}
                />
                <Tab 
                  icon={<Badge badgeContent={contacts.length} color="primary"><Mail size={18} /></Badge>} 
                  label="Your Contact Requests" 
                  iconPosition="start"
                  sx={{ textTransform: 'none', minHeight: 48, fontSize: '14px' }}
                />
                <Tab 
                  icon={<Badge badgeContent={reports.length} color="primary"><FileText size={18} /></Badge>} 
                  label="Report Generate" 
                  iconPosition="start"
                  sx={{ textTransform: 'none', minHeight: 48, fontSize: '14px' }}
                />
              </Tabs>
            </Box>

            <Box sx={{ p: 4 }}>
              {/* Account Settings Tab */}
              {activeTab === 0 && (
                <Grid container spacing={4}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="h6" fontWeight="700" className="mb-6">Personal Information</Typography>
                    <Box className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <StyledTextField label="Full Name" name="name" value={form.name} icon={<User size={18}/>} onChange={handleChange} />
                      <StyledTextField label="Email" name="email" value={form.email} icon={<Mail size={18}/>} onChange={handleChange} />
                      <StyledTextField label="Phone Number" name="phone" value={form.phone} icon={<Phone size={18}/>} onChange={handleChange} />
                      <StyledTextField label="Home Address" name="address" value={form.address} icon={<MapPin size={18}/>} onChange={handleChange} />
                    </Box>
                    <Divider className="my-8" />
                    <div className="flex justify-between items-center">
                      <Typography variant="body2" className="text-slate-400">
                        Last updated: {new Date().toLocaleDateString()}
                      </Typography>
                                          </div>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Typography variant="h6" fontWeight="700" className="mb-4">Quick Stats</Typography>
                    <div className="space-y-3">
                      <StatCard icon={<Activity />} label="Total Visits" value={stats.total} color="blue" />
                      <StatCard icon={<Calendar />} label="Upcoming" value={stats.upcoming} color="emerald" />
                      <StatCard icon={<Award />} label="Completed" value={stats.completed} color="amber" />
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
                    {feedbacks.length > 0 && (
                      <Button 
                        variant="outlined" 
                        color="error" 
                        onClick={handleClearFeedbacks} 
                        size="small"
                        sx={{ borderRadius: '8px', textTransform: 'none' }}
                      >
                        Clear All
                      </Button>
                    )}
                  </div>
                  
                  {feedbacks.length === 0 ? (
                    <div className="rounded-2xl p-12 text-center" style={{ background: `linear-gradient(135deg, ${Theme.colors.secondary}20, ${Theme.colors.primary}20)`, border: `1px solid ${Theme.colors.primary}40` }}>
                      <MessageSquare className="w-16 h-16 mx-auto mb-4" style={{ color: Theme.colors.primary }} />
                      <Typography variant="h6" className="mb-2" style={{ color: Theme.colors.primary }}>No Feedback Submitted Yet</Typography>
                      <Typography variant="body2" className="mb-4" style={{ color: Theme.colors.textMuted }}>Share your experience to help us improve our services</Typography>
                      <Button 
                        variant="contained" 
                        onClick={() => navigate("/feedBack")}
                        sx={{ backgroundColor: Theme.colors.primary, "&:hover": { backgroundColor: Theme.colors.primaryHover } }}
                      >
                        Submit Feedback
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {feedbacks.map((fb) => (
                        <Card key={fb._id} elevation={2} className="rounded-2xl hover:shadow-lg transition-all duration-300" style={{ border: `1px solid ${Theme.colors.primary}40` }}>
                          <CardContent className="p-5">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-2">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  getNpsColor(fb.npsScore) === 'success' ? 'bg-green-100' :
                                  getNpsColor(fb.npsScore) === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
                                }`}>
                                  <Star className={`w-5 h-5 ${
                                    getNpsColor(fb.npsScore) === 'success' ? 'text-green-600' :
                                    getNpsColor(fb.npsScore) === 'warning' ? 'text-yellow-600' : 'text-red-600'
                                  }`} fill="currentColor" />
                                </div>
                                <div>
                                  <Typography variant="h6" fontWeight="700" className="text-slate-800">
                                    NPS Score: {fb.npsScore}/10
                                  </Typography>
                                  <Typography variant="caption" className="text-slate-500">
                                    {new Date(fb.createdAt).toLocaleDateString()}
                                  </Typography>
                                </div>
                              </div>
                              <Chip 
                                label={fb.status || "new"}
                                size="small"
                                color={getFeedbackStatusColor(fb.status)}
                                variant={fb.status === 'resolved' ? 'filled' : 'outlined'}
                                icon={fb.status === 'resolved' ? <CheckCircle size={14} /> : fb.status === 'reviewed' ? <Clock size={14} /> : <AlertCircle size={14} />}
                              />
                            </div>
                            
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-lg p-3" style={{ backgroundColor: `${Theme.colors.primary}20` }}>
                                  <Typography variant="caption" className="font-medium" style={{ color: Theme.colors.primary }}>Booking Ease</Typography>
                                  <div className="flex items-center gap-1 mt-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} size={12} className={i < fb.bookingEaseRating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'} fill="currentColor" />
                                    ))}
                                    <span className="text-sm font-bold ml-1" style={{ color: Theme.colors.primary }}>{fb.bookingEaseRating}/5</span>
                                  </div>
                                </div>
                                <div className="bg-purple-50 rounded-lg p-3">
                                  <Typography variant="caption" className="text-purple-600 font-medium">Portal Ease</Typography>
                                  <div className="flex items-center gap-1 mt-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star key={i} size={12} className={i < fb.portalEaseRating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'} fill="currentColor" />
                                    ))}
                                    <span className="text-sm font-bold text-purple-800 ml-1">{fb.portalEaseRating}/5</span>
                                  </div>
                                </div>
                              </div>
                              
                              {fb.comment && (
                                <div className="bg-slate-50 rounded-lg p-3">
                                  <Typography variant="caption" className="text-slate-600 font-medium">Comment</Typography>
                                  <Typography variant="body2" className="text-slate-700 mt-1">{fb.comment}</Typography>
                                </div>
                              )}
                            </div>
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
                      <Mail className="w-6 h-6 text-purple-600" />
                      <Typography variant="h6" fontWeight="700">Your Contact Requests</Typography>
                      <Chip 
                        label={contacts.length} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </div>
                    {contacts.length > 0 && (
                      <Button 
                        variant="outlined" 
                        color="error" 
                        onClick={handleClearContacts} 
                        size="small"
                        sx={{ borderRadius: '8px', textTransform: 'none' }}
                      >
                        Clear All
                      </Button>
                    )}
                  </div>
                  
                  {contacts.length === 0 ? (
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-12 text-center">
                      <Mail className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                      <Typography variant="h6" className="text-purple-800 mb-2">No Contact Requests Yet</Typography>
                      <Typography variant="body2" className="text-purple-600 mb-4">Reach out to us for any questions or support</Typography>
                      <Button 
                        variant="contained" 
                        onClick={() => navigate("/contact-Us")}
                        sx={{ backgroundColor: Theme.colors.primary, "&:hover": { backgroundColor: Theme.colors.primaryHover } }}
                      >
                        Contact Us
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {contacts.map((c) => (
                        <Card key={c._id || c.id} elevation={2} className="rounded-2xl border border-purple-100 hover:shadow-lg transition-all duration-300">
                          <CardContent className="p-5">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                  <Mail className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                  <Typography variant="h6" fontWeight="700" className="text-slate-800">
                                    {c.subject}
                                  </Typography>
                                  <Typography variant="caption" className="text-slate-500">
                                    {new Date(c.createdAt).toLocaleDateString()}
                                  </Typography>
                                </div>
                              </div>
                              <Chip 
                                label={c.status || "new"}
                                size="small"
                                color={getContactStatusColor(c.status)}
                                variant={c.status === 'resolved' ? 'filled' : 'outlined'}
                                icon={c.status === 'resolved' ? <CheckCircle size={14} /> : c.status === 'reviewed' ? <Clock size={14} /> : <AlertCircle size={14} />}
                              />
                            </div>
                            
                            <div className="space-y-3">
                              <div className="bg-slate-50 rounded-lg p-3">
                                <Typography variant="caption" className="text-slate-600 font-medium">Message</Typography>
                                <Typography variant="body2" className="text-slate-700 mt-1">{c.message}</Typography>
                              </div>
                              
                              <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Mail size={14} />
                                <span>{c.email}</span>
                              </div>
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
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-12 text-center">
                      <FileText className="w-16 h-16 text-green-400 mx-auto mb-4" />
                      <Typography variant="h6" className="text-green-800 mb-2">No Reports Available Yet</Typography>
                      <Typography variant="body2" className="text-green-600 mb-4">Your lab reports will appear here once they are generated by the lab technician</Typography>
                      <Button 
                        variant="contained" 
                        onClick={() => navigate("/dashboard")}
                        sx={{ backgroundColor: Theme.colors.primary, "&:hover": { backgroundColor: Theme.colors.primaryHover } }}
                      >
                        Book a Test
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {reports.map((report) => (
                        <Card key={report._id} elevation={2} className="rounded-2xl border border-green-100 hover:shadow-lg transition-all duration-300">
                          <CardContent className="p-5">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-2">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                  <FileText className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                  <Typography variant="h6" fontWeight="700" className="text-slate-800">
                                    {report.packageName}
                                  </Typography>
                                  <Typography variant="caption" className="text-slate-500">
                                    {new Date(report.testDate).toLocaleDateString()}
                                  </Typography>
                                </div>
                              </div>
                              <Chip 
                                label="Completed"
                                size="small"
                                color="success"
                                variant="filled"
                                icon={<CheckCircle size={14} />}
                              />
                            </div>
                            
                            <div className="space-y-3">
                              <div className="bg-slate-50 rounded-lg p-3">
                                <Typography variant="caption" className="text-slate-600 font-medium">Test Details</Typography>
                                <Typography variant="body2" className="text-slate-700 mt-1">
                                  {report.selectedTests?.length || 0} tests included
                                </Typography>
                                {report.bookingId && (
                                  <Typography variant="body2" className="text-slate-600 mt-1">
                                    Booking: {new Date(report.testDate).toLocaleDateString()}
                                  </Typography>
                                )}
                                <Typography variant="body2" className="text-slate-600 mt-1">
                                  Technician: {report.technicianId?.name || 'Lab Technician'}
                                </Typography>
                              </div>
                              
                              <div className="bg-slate-50 rounded-lg p-3">
                                <Typography variant="caption" className="text-slate-600 font-medium">Summary</Typography>
                                <Typography variant="body2" className="text-slate-700 mt-1">
                                  {report.summary}
                                </Typography>
                              </div>
                              
                              <div className="bg-slate-50 rounded-lg p-3">
                                <Typography variant="caption" className="text-slate-600 font-medium">Recommendations</Typography>
                                <Typography variant="body2" className="text-slate-700 mt-1">
                                  {report.recommendations}
                                </Typography>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button 
                                  variant="contained" 
                                  size="small"
                                  onClick={async () => {
                                    try {
                                      const link = document.createElement('a');
                                      link.href = createApiUrl(`/api/reports/${report._id}/download`);
                                      link.target = '_blank';
                                      link.download = `Lab_Report_${report.packageName}_${report._id.toString().slice(-8)}.pdf`;
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                      
                                      // Show success message
                                      Swal.fire({
                                        icon: 'success',
                                        title: 'Download Started',
                                        text: 'Your lab report is being downloaded.',
                                        timer: 2000,
                                        showConfirmButton: false,
                                        customClass: {
                                          popup: 'rounded-lg shadow-xl',
                                          title: 'text-lg font-semibold'
                                        }
                                      });
                                    } catch (error) {
                                      console.error('Download error:', error);
                                      Swal.fire({
                                        icon: 'error',
                                        title: 'Download Failed',
                                        text: 'Unable to download the report. Please try again.',
                                        confirmButtonColor: Theme.colors.primary,
                                        customClass: {
                                          popup: 'rounded-lg shadow-xl',
                                          title: 'text-lg font-semibold',
                                          confirmButton: 'px-6 py-2 text-white font-medium rounded-lg hover:opacity-90 transition-opacity'
                                        },
                                        buttonsStyling: false
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
                                    // Show detailed report information
                                    const testDetails = report.selectedTests?.map(test => 
                                      `${test.name}: ${test.result} ${test.unit || ''} (${test.status})`
                                    ).join('\n') || 'No test details available';
                                    
                                    Swal.fire({
                                      title: 'Report Details',
                                      html: `<div style="text-align: left; white-space: pre-line; line-height: 1.5;">
                                        <strong>Package:</strong> ${report.packageName}<br>
                                        <strong>Test Date:</strong> ${new Date(report.testDate).toLocaleDateString()}<br><br>
                                        <strong>Tests:</strong><br>
                                        ${testDetails}<br><br>
                                        <strong>Summary:</strong><br>
                                        ${report.summary}<br><br>
                                        <strong>Recommendations:</strong><br>
                                        ${report.recommendations}
                                      </div>`,
                                      icon: 'info',
                                      confirmButtonColor: Theme.colors.primary,
                                      confirmButtonText: 'OK',
                                      customClass: {
                                        popup: 'rounded-lg shadow-xl',
                                        title: 'text-xl font-semibold',
                                        content: 'text-gray-700',
                                        confirmButton: 'px-6 py-2 text-white font-medium rounded-lg hover:opacity-90 transition-opacity'
                                      },
                                      buttonsStyling: false
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
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Box>
          </Paper>
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
const StyledTextField = ({ label, icon, ...props }) => (
  <TextField
    {...props}
    fullWidth
    label={label}
    variant="outlined"
    InputProps={{
      startAdornment: <InputAdornment position="start" className="text-slate-400">{icon}</InputAdornment>,
      sx: { borderRadius: '12px', bgcolor: Theme.colors.slate50 }
    }}
  />
);
