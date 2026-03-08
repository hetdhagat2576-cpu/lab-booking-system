import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth, AuthProvider } from './context/authContext';
import { AnimatePresence, motion } from 'framer-motion';
import { pageTransition } from './config/animations';
import Loader from './components/loader';
import Home from "./pages/home";
import LoginSelection from "./pages/loginSelection";
import AdminLogin from "./pages/adminLogin";
import LabTechnicianLogin from "./pages/labTechnicianLogin";
import UserLogin from "./pages/userLogin";
import Register from "./pages/register";
import ForgotPassword from "./pages/forgotPassword";
import ResetPassword from "./pages/resetPassword";
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
import Reports from "./pages/reports";
import ReportView from "./pages/reportView";
import PackageDetails from "./pages/packageDetails";
import RecommendedDetail from "./pages/recommendedDetail";
import TestDetails from "./pages/testDetails";
import OtpVerification from "./pages/OtpVerification";

// Animated Route Wrapper Component
const AnimatedRoute = ({ children }) => (
  <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={pageTransition}
    transition={{ duration: 0.4, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

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

  function PageTransition() {
    const location = useLocation();
    
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<AnimatedRoute><Home /></AnimatedRoute>} />
          <Route path="/login-selection" element={<AnimatedRoute><LoginSelection /></AnimatedRoute>} />
          <Route path="/admin-login" element={<AnimatedRoute><AdminLogin /></AnimatedRoute>} />
          <Route path="/lab-technician-login" element={<AnimatedRoute><LabTechnicianLogin /></AnimatedRoute>} />
          <Route path="/user-login" element={<AnimatedRoute><UserLogin /></AnimatedRoute>} />
          {/* Redirect old /login route to login selection for backward compatibility */}
          <Route path="/login" element={<Navigate to="/login-selection" replace />} />
          <Route path="/register" element={<AnimatedRoute><Register /></AnimatedRoute>} />
          <Route path="/forgot-password" element={<AnimatedRoute><ForgotPassword /></AnimatedRoute>} />
          <Route path="/reset-password" element={<AnimatedRoute><ResetPassword /></AnimatedRoute>} />
          <Route path="/otp-verification" element={<AnimatedRoute><OtpVerification /></AnimatedRoute>} />
          <Route path="/dashboard" element={
            <ProtectedRoute requiredRole="user">
              <AnimatedRoute><Dashboard /></AnimatedRoute>
            </ProtectedRoute>
          } />
          <Route path="/admin-dashboard" element={
            <ProtectedRoute requiredRole="admin">
              <AnimatedRoute><AdminDashboard /></AnimatedRoute>
            </ProtectedRoute>
          } />
          <Route path="/lab-technician-dashboard" element={
            <ProtectedRoute requiredRole="labtechnician">
              <AnimatedRoute><LabTechnicianDashboard /></AnimatedRoute>
            </ProtectedRoute>
          } />
          <Route path="/health-packages/full-body-checkups" element={<AnimatedRoute><FullBodyCheckups /></AnimatedRoute>} />
          <Route path="/health-packages/liver" element={<AnimatedRoute><Liver /></AnimatedRoute>} />
          <Route path="/health-packages/lungs" element={<AnimatedRoute><Lungs /></AnimatedRoute>} />
          <Route path="/health-packages/kidney" element={<AnimatedRoute><Kidney /></AnimatedRoute>} />
          <Route path="/health-packages/fever" element={<AnimatedRoute><Fever /></AnimatedRoute>} />
          <Route path="/health-packages/thyroid" element={<AnimatedRoute><Thyroid /></AnimatedRoute>} />
          <Route path="/health-packages/diabetes" element={<AnimatedRoute><Diabetes /></AnimatedRoute>} />
          <Route path="/package-details/:id" element={<AnimatedRoute><PackageDetails /></AnimatedRoute>} />
          <Route path="/recommended-detail" element={<AnimatedRoute><RecommendedDetail /></AnimatedRoute>} />
          <Route path="/test-details" element={<AnimatedRoute><TestDetails /></AnimatedRoute>} />
          <Route path="/tests" element={<AnimatedRoute><AllTests /></AnimatedRoute>} />
          <Route path="/health-packages/all" element={<AnimatedRoute><AllHealthPackages /></AnimatedRoute>} />
          <Route path="/about" element={<AnimatedRoute><About /></AnimatedRoute>} />
          <Route path="/services" element={<AnimatedRoute><Service /></AnimatedRoute>} />
          <Route path="/new-booking" element={<AnimatedRoute><NewBooking /></AnimatedRoute>} />
          <Route path="/razorpay" element={<AnimatedRoute><RazorpayPaymentPage /></AnimatedRoute>} />
          <Route path="/contact" element={<AnimatedRoute><ContactUs /></AnimatedRoute>} />
          <Route path="/privacy-policy" element={<AnimatedRoute><PrivacyPolicy /></AnimatedRoute>} />
          <Route path="/user-profile" element={
            <ProtectedRoute requiredRole="user">
              <AnimatedRoute><UserProfile /></AnimatedRoute>
            </ProtectedRoute>
          } />
          <Route path="/user-history" element={
            <ProtectedRoute requiredRole="user">
              <AnimatedRoute><UserHistory /></AnimatedRoute>
            </ProtectedRoute>
          } />
          <Route path="/terms-condition" element={<AnimatedRoute><TermsCondition /></AnimatedRoute>} />
          <Route path="/faq" element={<AnimatedRoute><FAQ /></AnimatedRoute>} />
          <Route path="/feedback" element={<AnimatedRoute><Feedback /></AnimatedRoute>} />
          <Route path="/reports" element={
            <ProtectedRoute requiredRole="user">
              <AnimatedRoute><Reports /></AnimatedRoute>
            </ProtectedRoute>
          } />
          <Route path="/reportView/:reportId" element={
            <ProtectedRoute requiredRole="user">
              <AnimatedRoute><ReportView /></AnimatedRoute>
            </ProtectedRoute>
          } />
          <Route path="/test-booking" element={
            <ProtectedRoute requiredRole="user">
              <AnimatedRoute><NewBooking /></AnimatedRoute>
            </ProtectedRoute>
          } />
          <Route path="/booking/:packageId" element={
            <ProtectedRoute requiredRole="user">
              <AnimatedRoute><NewBooking /></AnimatedRoute>
            </ProtectedRoute>
          } />
        </Routes>
      </AnimatePresence>
    );
  }

  return (
    <AuthProvider>
      <Router>
        <Loader />
        <ScrollToTop />
        <PageTransition />
      </Router>
    </AuthProvider>
  );
}
