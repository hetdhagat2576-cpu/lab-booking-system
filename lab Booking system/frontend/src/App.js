import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Loader from "./components/loader";
import { useAuth, AuthProvider } from './context/authContext';

import Home from "./pages/home";
import LoginSelection from "./pages/loginSelection";
import AdminLogin from "./pages/adminLogin";
import LabTechnicianLogin from "./pages/labTechnicianLogin";
import UserLogin from "./pages/userLogin";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import AdminDashboard from "./pages/adminDashboard";
import LabTechnicianDashboard from "./pages/technicianDashboard";
import FullBodyCheckups from "./pages/healthPackages/fullBodyCheckups";
import Liver from "./pages/healthPackages/liver";
import Lungs from "./pages/healthPackages/lungs";
import Kidney from "./pages/healthPackages/kidney";
import Fever from "./pages/healthPackages/fever";
import Thyroid from "./pages/healthPackages/thyroid";
import Diabetes from "./pages/healthPackages/diabetes";
import AllTests from "./pages/tests";
import AllHealthPackages from "./pages/all/index";
import About from "./pages/about";
import Service from "./pages/service";
import NewBooking from "./pages/newBooking";
import ContactUs from "./pages/contact-Us";
import PrivacyPolicy from "./pages/privacy Policy";
import UserProfile from "./pages/userprofile";
import UserHistory from "./pages/userHistory";
import TermsCondition from "./pages/termsCondition";
import Feedback from "./pages/feedBack";
import FAQ from "./pages/faq";
import RazorpayPaymentPage from "./pages/razorepay";
import PackageDetails from "./pages/packageDetails";
import RecommendedDetail from "./pages/recommendedDetail";
import TestDetails from "./pages/testDetails";
import OtpVerification from "./pages/OtpVerification";

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login-selection" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Debug logging
    console.log('ProtectedRoute - Role mismatch:', {
      requiredRole,
      userRole: user.role,
      userType: typeof user.role,
      user
    });
    // Redirect to appropriate login page based on required role
    const loginRoutes = {
      'admin': '/admin-login',
      'labtechnician': '/lab-technician-login',
      'user': '/user-login'
    };
    return <Navigate to={loginRoutes[requiredRole] || '/login-selection'} replace />;
  }

  return children;
};

export default function App() {
  function ScrollToTop() {
    const location = useLocation();
    useEffect(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }, [location.pathname]);
    return null;
  }
  return (
    <AuthProvider>
      <Router>
        <Loader />
        <ScrollToTop />
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login-selection" element={<LoginSelection />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/lab-technician-login" element={<LabTechnicianLogin />} />
        <Route path="/user-login" element={<UserLogin />} />
        {/* Redirect old /login route to login selection for backward compatibility */}
        <Route path="/login" element={<Navigate to="/login-selection" replace />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/dashboard" element={
          <ProtectedRoute requiredRole="user">
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin-dashboard" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/health-packages/full-body-checkups" element={<FullBodyCheckups />} />
        <Route path="/health-packages/liver" element={<Liver />} />
        <Route path="/health-packages/lungs" element={<Lungs />} />
        <Route path="/health-packages/kidney" element={<Kidney />} />
        <Route path="/health-packages/fever" element={<Fever />} />
        <Route path="/health-packages/thyroid" element={<Thyroid />} />
        <Route path="/health-packages/diabetes" element={<Diabetes />} />
        <Route path="/package-details" element={<PackageDetails />} />
        <Route path="/recommended-detail" element={<RecommendedDetail />} />
        <Route path="/test-details" element={<TestDetails />} />
        <Route path="/tests" element={<AllTests />} />
        <Route path="/health-packages/all" element={<AllHealthPackages />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Service />} /> 
        <Route path="/new-booking" element={<NewBooking />} />
        <Route path="/razorpay" element={<RazorpayPaymentPage />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/user-profile" element={
          <ProtectedRoute requiredRole="user">
            <UserProfile />
          </ProtectedRoute>
        } />
        <Route path="/user-history" element={
          <ProtectedRoute requiredRole="user">
            <UserHistory />
          </ProtectedRoute>
        } />
        <Route path="/terms-condition" element={<TermsCondition />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/feedback" element={<Feedback />} />
      </Routes>
    </Router>
  </AuthProvider>
);
}
