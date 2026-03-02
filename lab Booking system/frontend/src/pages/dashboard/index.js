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
import { safeFetch } from "../../config/api";
import Swal from 'sweetalert2';
import {
  DASHBOARD_HEALTH_CONCERNS,
} from "../../config/staticData";

export default function DashboardIndex() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hasApprovedBooking, setHasApprovedBooking] = useState(false);
  const [view, setView] = useState(null);
  const [userReports, setUserReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [tests, setTests] = useState([]);
  const [loadingTests, setLoadingTests] = useState(false);
  const [categorizedTests, setCategorizedTests] = useState({});
  const [healthConcerns, setHealthConcerns] = useState([]);
  const [loadingHealthConcerns, setLoadingHealthConcerns] = useState(false);

  // Fetch health concerns from API
  const fetchHealthConcerns = async () => {
    try {
      setLoadingHealthConcerns(true);
      const response = await safeFetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/health-concerns`);
      if (response.ok) {
        const result = await response.json();
        const healthConcernsData = result.data || [];
        setHealthConcerns(healthConcernsData);
        console.log('Health concerns fetched:', healthConcernsData);
      } else {
        console.error('Failed to fetch health concerns - Status:', response.status);
        // Fallback to static data if API doesn't exist
        setHealthConcerns(DASHBOARD_HEALTH_CONCERNS);
      }
    } catch (error) {
      console.error('Error fetching health concerns:', error);
      // Fallback to static data
      setHealthConcerns(DASHBOARD_HEALTH_CONCERNS);
    } finally {
      setLoadingHealthConcerns(false);
    }
  };
  useEffect(() => {
    const userData = localStorage.getItem("lab_user");
    if (userData) {
      const user = JSON.parse(userData);
      fetchUserReports(user.token);
      fetchTests(user.token);
      fetchHealthConcerns(); // Fetch health concerns from API
      // Clear old categorized data to force refresh
      const healthConcerns = ['liver', 'lungs', 'kidney', 'thyroid', 'diabetes', 'fever'];
      healthConcerns.forEach(concern => {
        localStorage.removeItem(`health_concern_${concern}_tests`);
      });
    } else {
      navigate("/user-login");
    }
  }, [navigate]);
  const handleHealthConcernClick = (id) => {
    // Store the categorized tests for this health concern
    const concernTests = categorizedTests[id] || [];
    localStorage.setItem(`health_concern_${id}_tests`, JSON.stringify(concernTests));
    navigate(`/health-packages/${id}`);
  };
  const fetchTests = async () => {
    try {
      setLoadingTests(true);
      const response = await safeFetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/tests?isActive=true`);
      if (response.ok) {
        const data = await response.json();
        const apiTests = data.data || [];
        setTests(apiTests);
        // Categorize tests by health concern
        const categorized = {};
        // Initialize categories
        DASHBOARD_HEALTH_CONCERNS.forEach(concern => {
          categorized[concern.id] = [];
        });
        // Categorize tests based on their category or name
        apiTests.forEach((test, index) => {
          const category = test.category?.toLowerCase() || '';
          const testName = test.name?.toLowerCase() || '';
          console.log(`Processing test ${index + 1}:`, {
            name: test.name,
            category: test.category,
            _id: test._id
          });
          // Categorize based on category field or name patterns
          if (category.includes('liver') || testName.includes('liver') || testName.includes('sgpt') || testName.includes('sgot') || testName.includes('alt')) {
            console.log('✓ Added to liver category:', test.name);
            categorized.liver.push(test);
          } else if (category.includes('lung') || category.includes('respiratory') || testName.includes('lung') || testName.includes('checkup')) {
            console.log('✓ Added to lungs category:', test.name);
            categorized.lungs.push(test);
          } else if (category.includes('kidney') || category.includes('renal') || testName.includes('kidney') || testName.includes('creatinine') || testName.includes('bun')) {
            console.log('✓ Added to kidney category:', test.name);
            categorized.kidney.push(test);
          } else if (category.includes('thyroid') || testName.includes('thyroid') || testName.includes('tsh') || testName.includes('t3') || testName.includes('t4')) {
            console.log('✓ Added to thyroid category:', test.name);
            categorized.thyroid.push(test);
            console.log('Added to thyroid:', test.name);
          } else if (category.includes('diabetes') || testName.includes('sugar') || testName.includes('glucose') || testName.includes('hba1c')) {
            console.log('✓ Added to diabetes category:', test.name);
            categorized.diabetes.push(test);
            console.log('Added to diabetes:', test.name);
          } else if (category.includes('fever') || testName.includes('fever') || testName.includes('dengue') || testName.includes('malaria') || testName.includes('typhoid')) {
            console.log('✓ Added to fever category:', test.name);
            categorized.fever.push(test);
          } else {
            // Default to liver if no specific category matches
            console.log('⚠️ Uncategorized test - defaulting to liver:', test.name, 'Category:', test.category);
            categorized.liver.push(test);
          }
        });
        console.log('Final categorized tests:', {
          thyroid: categorized.thyroid.length,
          diabetes: categorized.diabetes.length,
          liver: categorized.liver.length,
          lungs: categorized.lungs.length,
          kidney: categorized.kidney.length,
          fever: categorized.fever.length
        });
        setCategorizedTests(categorized);
      } else {
        console.error('Failed to fetch tests from API');
        setTests([]);
        setCategorizedTests({});
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
      setTests([]);
      setCategorizedTests({});
    } finally {
      setLoadingTests(false);
    }
  };
  const fetchUserReports = async () => {
    if (!user?.token) return;
    setLoadingReports(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/reports/patient/${user._id}`, {
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
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/reports/${reportId}/download`, {
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
      Swal.fire({
        icon: 'error',
        title: 'Download Failed',
        text: 'Failed to download report',
        confirmButtonColor: Theme.colors.primary
      });
    }
  };
  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/bookings`, {
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
      fetchTests(); // Fetch tests to synchronize with All Tests page
    }
  }, [user]);
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
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center" style={{ backgroundColor: Theme.colors.secondary }}>
              {React.createElement(IconConfig.FlaskConical, { className: "w-6 h-6 sm:w-8 sm:h-8 text-gray-800" })}
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              Browse By Health Concern
            </h1>
            <p className="text-base sm:text-lg text-gray-600 font-medium">
              Tailor Made Packages Under One Roof
            </p>
          </div>
        </div>
        {/* User Greeting */}
        <div className="mb-6 sm:mb-8">
          <div className="rounded-xl bg-secondary/10 border border-secondary/30 px-3 sm:px-4 py-2 sm:py-3">
            <p className="text-sm font-bold text-gray-700">
              {user?.name ? `Welcome, ${user.name}` : "Welcome"}
            </p>
            <p className="text-xs text-gray-600">
              Explore Services and About from the header navigation
            </p>
          </div>
        </div>
        {/* Health Concern Grid */}
        {loadingHealthConcerns || loadingTests ? (
          <section className="mb-6 sm:mb-8 max-w-6xl mx-auto">
            <div className="flex justify-center items-center py-8 sm:py-12">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary mx-auto"></div>
              <p className="ml-4 text-slate-600 text-sm sm:text-base">Loading health concerns...</p>
            </div>
          </section>
        ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 max-w-6xl mx-auto">
          {healthConcerns.map((concern) => (
            <button
              key={concern.id}
              onClick={() => handleHealthConcernClick(concern.id)}
              className="group relative bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-500 p-4 sm:p-6 flex flex-col items-center text-center border overflow-hidden"
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
                className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-3 sm:mb-4 transition-all duration-500"
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
                {(() => {
                  const IconComponent = IconConfig[concern.iconKey];
                  if (!IconComponent) {
                    console.error('Missing icon for concern:', concern.id, 'iconKey:', concern.iconKey);
                    console.error('Available icons:', Object.keys(IconConfig));
                    return React.createElement(IconConfig.FlaskConical, { 
                      className: "w-8 h-8 sm:w-10 sm:h-10 text-gray-800 transition-all duration-600",
                      style: { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }
                    });
                  }
                  return React.createElement(IconComponent, { 
                    className: "w-8 h-8 sm:w-10 sm:h-10 text-gray-800 transition-all duration-600",
                    style: { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }
                  });
                })()}
              </div>
              {/* Title */}
              <h3 className="relative text-base sm:text-lg font-semibold mb-1 transition-all duration-300" style={{ color: Theme.colors.textDark }}>
                {concern.title}
              </h3>
              {/* Description */}
              <p className="relative text-xs sm:text-sm text-gray-500 line-clamp-2 transition-all duration-300 group-hover:text-gray-600">
                {concern.description}
              </p>
              {/* Decorative Elements */}
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: Theme.colors.primary }} />
              <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ backgroundColor: Theme.colors.secondary }} />
            </button>
          ))}
    </section>
        )}
        </main>
      <Footer />
    </div>
  );
}
