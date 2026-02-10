import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, Paper, Typography, TextField, Button, 
  Card, CardContent, InputAdornment, Avatar, Divider 
} from "@mui/material";
import Header from "../../components/header";
import Footer from "../../components/footer";
import IconConfig from "../../components/icon/index.js";
import { useAuth } from "../../context/authContext";
import Theme from "../../config/theam/index.js";
import LogoutConfirmation from "../../components/logoutConfirmation/index.js";


const StatCard = ({ icon, label, value, mainColor, lightBg }) => (
  <Paper 
    elevation={0} 
    className="p-5 rounded-3xl border border-slate-100 flex items-center gap-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white group"
  >
    <div 
      className="w-14 h-14 rounded-2xl flex items-center justify-center transition-colors"
      style={{ backgroundColor: lightBg }}
    >
      {React.cloneElement(icon, { 
        size: 26, 
        style: { color: mainColor },
        strokeWidth: 2.5 
      })}
    </div>
    <div>
      <Typography variant="caption" className="text-slate-400 font-bold uppercase tracking-widest block mb-0.5">
        {label}
      </Typography>
      <Typography variant="h4" className="font-black text-slate-800 leading-none group-hover:text-primary transition-colors">
        {value}
      </Typography>
    </div>
  </Paper>
);

const StyledTextField = ({ label, icon, ...props }) => (
  <TextField
    {...props}
    fullWidth
    label={label}
    variant="outlined"
    InputProps={{
      startAdornment: (
        <InputAdornment position="start" className="text-slate-400">
          {icon}
        </InputAdornment>
      ),
      sx: { 
        borderRadius: '16px', 
        bgcolor: Theme.colors.slate50,
        '& .MuiOutlinedInput-notchedOutline': { borderColor: Theme.colors.slate200 }
      }
    }}
  />
);

export default function LabTechnicianProfileIndex() {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();
  const { UserCog, Mail, MapPin, CalendarCheck, Clock, CheckCircle2, AlertCircle, LogOut, Phone } = IconConfig;
  
  const [form, setForm] = useState({ name: "", email: "", phone: "", labLocation: "" });
  const [stats, setStats] = useState({ today: 0, inProgress: 0, completed: 0, pending: 0 });

  useEffect(() => {
    if (!user || user.role !== "labtechnician") {
      navigate("/lab-technician-login");
      return;
    }
    setForm({
      name: user.name || "Lab Technician",
      email: user.email || "",
      phone: user.phone || "",
      labLocation: user.labLocation || "",
    });

    const response = fetch("/api/bookings", {
      headers: {
        Authorization: `Bearer ${user?.token || ""}`,
      },
    });
    response.then((res) => res.json())
    .then((data) => {
      if (data.success) {
        const approved = (data.data || []).filter((b) => b.adminStatus === "approved");
        const today = new Date().toISOString().split("T")[0];
        const todayBookings = approved.filter((b) => b.date === today);
        setStats({
          total: approved.length,
          today: todayBookings.length,
          completed: approved.filter((b) => b.status === "completed").length,
          pending: approved.filter((b) => ["pending", "confirmed"].includes(b.status)).length,
        });
      }
    });
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSave = () => updateUser({ ...user, ...form, role: "labtechnician" });

  const handleLogout = (reason) => {
    logout();
    navigate("/lab-technician-login");
  };

 
  const getLightColor = (hex) => hex + "15"; 

  return (
    <div className="min-h-screen flex flex-col bg-slate50">
      <Header hideNavItems={true} />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          
          {/* --- HERO SECTION --- */}
          <Card elevation={0} className="rounded-[2rem] overflow-hidden border border-slate-200 mb-8 bg-white shadow-sm">
            <div className="h-44" style={{ background: `linear-gradient(to right, ${Theme.colors.primary}, ${Theme.colors.secondary})` }} />
            <CardContent className="relative pt-0 px-8 pb-8">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16">
                <Avatar 
                  sx={{ 
                    width: 140, height: 140, 
                    border: "6px solid white", 
                    bgcolor: Theme.colors.secondary, 
                    fontSize: "3.5rem"
                  }}
                  className="shadow-2xl"
                >
                  <UserCog size={60} />
                </Avatar>
                
                <div className="flex-grow text-center md:text-left mb-2">
                  <Typography variant="h4" fontWeight="800" className="text-slate-800">
                    {form.name}
                  </Typography>
                  <Typography className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2">
                    <Mail size={16} /> {form.email}
                  </Typography>
                </div>

                <div className="flex gap-3 mb-2">
                  <Button 
                    variant="outlined" 
                    onClick={() => navigate("/lab-technician-dashboard")} 
                    startIcon={<CalendarCheck size={18} />}
                    sx={{ borderRadius: '14px', textTransform: 'none', px: 3, fontWeight: 600, color: Theme.colors.primary, borderColor: Theme.colors.primary }}
                  >
                    Dashboard
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={handleSave}
                    sx={{ 
                      backgroundColor: Theme.colors.primary, 
                      borderRadius: '14px', 
                      textTransform: 'none', 
                      px: 4, 
                      fontWeight: 600,
                      "&:hover": { backgroundColor: Theme.colors.primaryHover } 
                    }}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* --- DAILY PERFORMANCE SIDEBAR --- */}
            <div className="space-y-4">
              <Typography variant="subtitle2" className="px-1 text-slate-500 font-bold uppercase tracking-wider">
                Daily Performance
              </Typography>

              <StatCard 
                icon={<CalendarCheck />} 
                label="Today's Tests" 
                value={stats.today} 
                mainColor={Theme.colors.primary} 
                lightBg={getLightColor(Theme.colors.primary)}
              />
              <StatCard 
                icon={<CheckCircle2 />} 
                label="Completed" 
                value={stats.completed} 
                mainColor={Theme.colors.primary} 
                lightBg={getLightColor(Theme.colors.primary)}
              />
              <StatCard 
                icon={<AlertCircle />} 
                label="Pending" 
                value={stats.pending} 
                mainColor={Theme.colors.slate500} 
                lightBg={Theme.colors.slate100}
              />
            </div>

            {/* --- SETTINGS FORM --- */}
            <Paper elevation={0} className="lg:col-span-2 p-10 rounded-[2rem] border border-slate-200 bg-white">
              <Typography variant="h5" fontWeight="800" className="mb-8 text-slate-800">
                Technician Account
              </Typography>
              
              <dir></dir>
              <dir></dir>
              
              <Box className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StyledTextField label="Full Name" name="name" value={form.name} icon={<UserCog size={18}/>} onChange={handleChange} />
                <StyledTextField label="Email Address" name="email" value={form.email} icon={<Mail size={18}/>} onChange={handleChange} />
                <StyledTextField label="Phone Number" name="phone" value={form.phone} icon={<Phone size={18}/>} onChange={handleChange} />
                <StyledTextField label="Lab Location" name="labLocation" value={form.labLocation} icon={<MapPin size={18}/>} onChange={handleChange} />
              </Box>

              <Divider className="my-10" />
              
              <div className="flex justify-between items-center">
                <Typography variant="body2" className="text-slate-400 font-medium">
                  Account Status: Active Lab Technician
                </Typography>
                <LogoutConfirmation onConfirm={handleLogout} userRole="labtechnician">
                    <Button 
                      color="error" 
                      startIcon={<LogOut size={18} />} 
                      sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '12px' }}
                    >
                      Logout
                    </Button>
                  </LogoutConfirmation>
              </div>
            </Paper>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
