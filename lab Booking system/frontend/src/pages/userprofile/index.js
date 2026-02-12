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
          name: data.data.name || "",
          email: data.data.email || "",
          phone: data.data.phone || "",
          address: data.data.address || "",
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
                    <div className="space-y-3">
                      {feedbacks.map((fb) => (
                        <div key={fb._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <Typography variant="h6" fontWeight="600" className="text-gray-800 mb-1">
                                Feedback from {new Date(fb.createdAt).toLocaleDateString()}
                              </Typography>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium" style={{ color: Theme.colors.primary }}>
                                  Rating: {fb.bookingEaseRating}/5
                                </span>
                                <Chip 
                                  label={fb.status || "new"}
                                  size="small"
                                  color={getFeedbackStatusColor(fb.status)}
                                  variant="outlined"
                                />
                              </div>
                            </div>
                          </div>
                          
                          {fb.comment && (
                            <div className="bg-gray-50 rounded p-3">
                              <Typography variant="body2" className="text-gray-700">{fb.comment}</Typography>
                            </div>
                          )}
                        </div>
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
                    <div className="space-y-3">
                      {contacts.map((c) => (
                        <div key={c._id || c.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <Typography variant="h6" fontWeight="600" className="text-gray-800 mb-1">
                                {c.subject}
                              </Typography>
                              <Typography variant="caption" className="text-gray-500 mb-2">
                                {new Date(c.createdAt).toLocaleDateString()}
                              </Typography>
                              <Chip 
                                label={c.status || "new"}
                                size="small"
                                color={getContactStatusColor(c.status)}
                                variant="outlined"
                              />
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 rounded p-3 mb-3">
                            <Typography variant="body2" className="text-gray-700">{c.message}</Typography>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Mail size={14} />
                            <span>{c.email}</span>
                          </div>
                        </div>
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
                    <div className="space-y-3">
                      {reports.map((report) => (
                        <div key={report._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <Typography variant="h6" fontWeight="600" className="text-gray-800 mb-1">
                                {report.packageName}
                              </Typography>
                              <Typography variant="caption" className="text-gray-500 mb-2">
                                {new Date(report.testDate).toLocaleDateString()}
                              </Typography>
                              <Chip 
                                label="Completed"
                                size="small"
                                color="success"
                                variant="outlined"
                              />
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 rounded p-3 mb-3">
                            <Typography variant="body2" className="text-gray-700">
                              {report.selectedTests?.length || 0} tests included • Technician: {report.technicianId?.name || 'Lab Technician'}
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
                                  
                                  Swal.fire({
                                    icon: 'success',
                                    title: 'Download Started',
                                    text: 'Your lab report is being downloaded.',
                                    timer: 2000,
                                    showConfirmButton: false
                                  });
                                } catch (error) {
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
                        </div>
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
