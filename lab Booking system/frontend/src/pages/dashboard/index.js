import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Header from "../../components/header";
import Footer from "../../components/footer";
import { useAuth } from "../../context/authContext";
import { Alert } from "@mui/material";
import { FileText } from "lucide-react";
import Theme from "../../config/theam/index.js";
import IconConfig from "../../components/icon/index.js";
import CButton from "../../components/cButton";
import {
  DASHBOARD_HEALTH_CONCERNS,
  RECOMMENDED_TESTS,
  FULL_BODY_PACKAGES,
  LIVER_HEALTH_PACKAGES,
  LUNG_HEALTH_PACKAGES,
  KIDNEY_HEALTH_PACKAGES,
  THYROID_HEALTH_PACKAGES,
  DIABETES_PACKAGES,
  FEVER_PACKAGES,
} from "../../config/staticData";

export default function DashboardIndex() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hasApprovedBooking, setHasApprovedBooking] = useState(false);
  const [view, setView] = useState(null);
  const [userReports, setUserReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("lab_user");
    if (userData) {
      const user = JSON.parse(userData);
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (user.role === "labtechnician") {
        navigate("/lab-technician-dashboard");
      }
    }
  }, []);

  const handleHealthConcernClick = (id) => {
    navigate(`/health-packages/${id}`);
  };

  const fetchUserReports = async () => {
    if (!user?.token) return;
    
    setLoadingReports(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/reports/patient/${user._id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserReports(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoadingReports(false);
    }
  };

  const handleDownloadReport = async (reportId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/reports/${reportId}/download`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lab-report-${reportId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report');
    }
  };

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/bookings`, {
          headers: {
            Authorization: `Bearer ${user?.token || ""}`,
          },
        });
        const data = await response.json();
        if (response.ok && data.success) {
          const approved = (data.data || []).some(
            (b) => b.adminStatus === "approved"
          );
          setHasApprovedBooking(approved);
        }
      } catch (err) {
      }
    };
    if (user && (!user.role || user.role === "user")) {
      fetchUserBookings();
      fetchUserReports();
    }
  }, [user]);

  const healthConcerns = DASHBOARD_HEALTH_CONCERNS;

  return (
    <div className={Theme.layout.standardPage}>
      <div className="fixed top-0 w-full z-50">
        <Header hideNavItems={false} />
      </div>

      <main className="flex-grow container mx-auto px-4 py-8 pt-[72px]">
        <div className="mb-6 mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="flex">
              <div></div>
              <CButton
                fullWidth
                variant="primary"
                onClick={() => navigate("/tests")}
                className="h-12 font-bold rounded-xl uppercase tracking-widest"
              >
                All Tests
              </CButton>
            </div>
            <div className="flex">
              <CButton
                fullWidth
                variant="outline"
                onClick={() => navigate("/health-packages/all")}
                className="h-12 font-bold rounded-xl uppercase tracking-widest border-2"
                style={{ borderColor: Theme.colors.primary, color: Theme.colors.primary }}
              >
                Health Packages
              </CButton>
            </div>
          </div>
        </div>
        {/* Header Section */}
        <div className="mb-2 flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ backgroundColor: Theme.colors.secondary }}>
              {React.createElement(IconConfig.FlaskConical, { className: "w-8 h-8 text-gray-800" })}
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
              Browse By Health Concern
            </h1>
            <p className="text-lg text-gray-600 font-medium">
              Tailor Made Packages Under One Roof
            </p>
          </div>
        </div>

        {/* User Greeting */}
        <div className="mb-8">
          <div className="rounded-xl bg-secondary/10 border border-secondary/30 px-4 py-3">
            <p className="text-sm font-bold text-gray-700">
              {user?.name ? `Welcome, ${user.name}` : "Welcome"}
            </p>
            <p className="text-xs text-gray-600">
              Explore Services and About from the header navigation
            </p>
          </div>
        </div>

        {/* Health Concern Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-8 max-w-6xl mx-auto">
          {healthConcerns.map((concern) => (
            <button
              key={concern.id}
              onClick={() => handleHealthConcernClick(concern.id)}
              className="group relative bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 p-6 flex flex-col items-center text-center border overflow-hidden"
              style={{ borderColor: Theme.colors.secondary }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = Theme.colors.primary;
                e.currentTarget.style.transform = 'translateY(-8px) rotateX(5deg)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(42, 122, 142, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = Theme.colors.secondary;
                e.currentTarget.style.transform = 'translateY(0) rotateX(0deg)';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              {/* Hover Background Effect */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `linear-gradient(135deg, ${Theme.colors.primary}10 0%, ${Theme.colors.secondary}10 100%)`
                }}
              />
              
                {/* Icon Circle */}
              <div 
                className="relative w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all duration-500"
                style={{ backgroundColor: Theme.colors.secondary }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = Theme.colors.primary;
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(42, 122, 142, 0.4)';
                  e.currentTarget.parentElement.querySelector('h3').style.color = Theme.colors.primary;
                  // Add pulse effect to icon
                  const icon = e.currentTarget.querySelector('svg');
                  if (icon) {
                    icon.style.transform = 'scale(1.2) rotate(360deg)';
                    icon.style.transition = 'transform 0.6s ease-in-out';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = Theme.colors.secondary;
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '';
                  e.currentTarget.parentElement.querySelector('h3').style.color = Theme.colors.textDark;
                  // Reset icon
                  const icon = e.currentTarget.querySelector('svg');
                  if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                  }
                }}
              >
                {React.createElement(IconConfig[concern.iconKey], { 
                  className: "w-10 h-10 text-gray-800 transition-all duration-600",
                  style: { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }
                })}
              </div>
              
              {/* Title */}
              <h3 className="relative text-lg font-semibold mb-1 transition-all duration-300" style={{ color: Theme.colors.textDark }}>
                {concern.title}
              </h3>
              
              {/* Description */}
              <p className="relative text-sm text-gray-500 line-clamp-2 transition-all duration-300 group-hover:text-gray-600">
                {concern.description}
              </p>

              {/* Decorative Elements */}
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: Theme.colors.primary }} />
              <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ backgroundColor: Theme.colors.secondary }} />
            </button>
          ))}
        </section>

        {/* Reports Section */}
        {userReports.length > 0 && (
          <section className="mb-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: Theme.colors.primary }}>
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Your Lab Reports</h2>
                  <p className="text-sm text-gray-600">Download your completed test reports</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {userReports.map((report) => (
                  <div key={report._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{report.packageName}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(report.createdAt).toLocaleDateString()} • {report.selectedTests?.length || 0} tests
                        </p>
                      </div>
                    </div>
                    <CButton
                      variant="primary"
                      size="sm"
                      onClick={() => handleDownloadReport(report._id)}
                      className="text-xs px-4 py-2"
                    >
                      Download PDF
                    </CButton>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        
      </main>

      <Footer />
    </div>
  );
}
