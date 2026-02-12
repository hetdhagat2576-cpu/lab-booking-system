import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { createApiUrl } from "../../config/api";
import LabReport from '../../components/LabReport';
import html2pdf from 'html2pdf.js';
import { useAuth } from '../../context/authContext';
import Header from '../../components/header';
import Footer from '../../components/footer';
import CButton from '../../components/cButton';
import IconConfig from '../../components/icon/index.js';
import Theme from '../../config/theam/index.js';
import Swal from 'sweetalert2';

const alertConfig = {
  base: { background: Theme.colors.white, color: Theme.colors.textDark, confirmButtonColor: Theme.colors.primary, cancelButtonColor: Theme.colors.secondary, customClass: { popup: 'rounded-lg shadow-xl', title: 'text-xl font-semibold', content: 'text-gray-700', confirmButton: 'px-6 py-2 text-white font-medium rounded-lg hover:opacity-90 transition-opacity', cancelButton: 'px-6 py-2 text-white font-medium rounded-lg hover:opacity-90 transition-opacity' }, buttonsStyling: false },
  success: { icon: 'success', iconColor: Theme.colors.primary, timer: 4000, timerProgressBar: true },
  error: { icon: 'error', iconColor: '#dc3741' },
  warning: { icon: 'warning', iconColor: '#f59e0b' },
  loading: { icon: 'info', iconColor: Theme.colors.primary, showConfirmButton: false, showCancelButton: false, allowOutsideClick: false, allowEscapeKey: false }
};

const showAlert = (type, title, message, options = {}) => {
  const config = type === 'loading' ? { ...alertConfig.base, ...alertConfig.loading, title, text: message, didOpen: () => Swal.showLoading() } : { ...alertConfig.base, ...alertConfig[type], title, text: message, ...options };
  return Swal.fire(config);
};

const alerts = {
  validation: (msg) => showAlert('warning', 'Validation Error', msg),
  reportSuccess: () => showAlert('success', 'Success', 'Report submitted successfully!'),
  reportError: (msg) => showAlert('error', 'Error', msg),
  networkError: () => showAlert('error', 'Network Error', 'Unable to connect to server. Please check your internet connection and try again.'),
  pdfSuccess: () => showAlert('success', 'Success', 'Report generated successfully!'),
  pdfError: () => showAlert('error', 'Error', 'Error generating report. Please try again.')
};

const styles = `.technician-dashboard{min-height:100vh;background:#f5f6fa;padding:20px}.dashboard-header{text-align:center;margin-bottom:30px}.dashboard-header h1{color:#2c3e50;margin:0;font-size:32px}.dashboard-header p{color:#7f8c8d;margin:5px 0 0 0}.dashboard-content{display:grid;grid-template-columns:400px 1fr;gap:30px;max-width:1400px;margin:0 auto}.appointments-section{background:white;border-radius:10px;padding:20px;box-shadow:0 2px 10px rgba(0,0,0,0.1);height:fit-content}.appointments-section h2{color:#2c3e50;margin:0 0 20px;font-size:20px}.appointments-list{display:flex;flex-direction:column;gap:15px}.appointment-card{border:2px solid #e9ecef;border-radius:8px;padding:15px;cursor:pointer;transition:all 0.3s ease}.appointment-card:hover{border-color:#3498db;transform:translateY(-2px);box-shadow:0 4px 12px rgba(0,0,0,0.15)}.appointment-card.selected{border-color:#27ae60;background:#f8fff9}.appointment-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}.appointment-header h3{margin:0;color:#2c3e50;font-size:16px}.appointment-id{background:#3498db;color:white;padding:4px 8px;border-radius:4px;font-size:12px;font-weight:bold}.appointment-details p{margin:5px 0;font-size:14px;color:#555}.appointment-details strong{color:#2c3e50}.report-generation{background:white;border-radius:10px;padding:20px;box-shadow:0 2px 10px rgba(0,0,0,0.1)}.report-generation h2{color:#2c3e50;margin:0 0 20px;font-size:20px}.test-inputs{margin-bottom:30px}.test-inputs h3{color:#34495e;margin:0 0 15px;font-size:18px}.test-grid{display:grid;gap:15px}.test-input-row{display:grid;grid-template-columns:200px 100px 60px 150px 120px 80px;align-items:center;gap:15px;padding:10px;background:#f8f9fa;border-radius:6px;position:relative}.test-name{font-weight:600;color:#2c3e50}.result-input{padding:8px 12px;border:2px solid #ddd;border-radius:4px;font-size:14px;transition:border-color 0.3s ease}.result-input:focus{outline:none;border-color:#3498db}.unit{font-weight:500;color:#666}.reference-range{font-size:12px;color:#7f8c8d}.status-badge{padding:4px 8px;border-radius:4px;font-size:11px;font-weight:bold;text-transform:uppercase;text-align:center}.status-badge.normal{background:#d4edda;color:#155724}.status-badge.high{background:#f8d7da;color:#721c24}.status-badge.medium{background:#fff3cd;color:#856404}.status-badge.low{background:#e2f0fb;color:#0c5460}.report-preview{margin-bottom:30px}.report-preview h3{color:#34495e;margin:0 0 15px;font-size:18px}.preview-container{border:2px solid #e9ecef;border-radius:8px;padding:20px;background:white;max-height:600px;overflow-y:auto}.generate-section{text-align:center}.generate-btn{background:#27ae60;color:white;border:none;padding:12px 30px;border-radius:6px;font-size:16px;font-weight:600;cursor:pointer;transition:all 0.3s ease}.generate-btn:hover:not(:disabled){background:#219a52;transform:translateY(-2px);box-shadow:0 4px 12px rgba(39,174,96,0.3)}.generate-btn:disabled{background:#95a5a6;cursor:not-allowed;transform:none;box-shadow:none}@media(max-width:1200px){.dashboard-content{grid-template-columns:350px 1fr}.test-input-row{grid-template-columns:180px 90px 50px 120px 100px 70px;gap:10px}}@media(max-width:768px){.dashboard-content{grid-template-columns:1fr}.test-input-row{grid-template-columns:1fr;gap:8px}.test-input-row>*{justify-self:start}}`;

const TechnicianDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { Clock, Users, TestTube, Eye, FileText } = IconConfig;
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [imageTestResults, setImageTestResults] = useState([]);
  const [healthyLungResults, setHealthyLungResults] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [pendingReports, setPendingReports] = useState([]);
  const [stats, setStats] = useState({ todayTests: 0, inProgress: 0, completed: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [showAllToday, setShowAllToday] = useState(false);
  const [activeView, setActiveView] = useState('overview');
  
  // WebSocket connection for real-time notifications
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);
    return () => document.head.removeChild(styleElement);
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(createApiUrl('/api/reports/today/bookings'), {
        headers: { Authorization: `Bearer ${user?.token || ""}` },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        const todayBookings = data.data || [];
        // Filter to only show approved bookings
        const approvedBookings = todayBookings.filter(b => b.adminStatus === 'approved');
        setBookings(approvedBookings);
        setStats({
          todayTests: approvedBookings.length,
          inProgress: approvedBookings.filter(b => b.status === 'in_progress').length,
          completed: approvedBookings.filter(b => b.status === 'completed').length,
          pending: approvedBookings.filter(b => (!b.status || b.status === 'pending' || b.status === 'confirmed')).length,
        });
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initialize WebSocket connection
  useEffect(() => {
    if (user?.token) {
      const websocketUrl = `${process.env.REACT_APP_WS_URL || 'ws://localhost:5001'}`;
      const websocket = new WebSocket(websocketUrl);
      
      websocket.onopen = () => {
        console.log('Technician WebSocket connected');
        setWs(websocket);
      };
      
      websocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('Technician WebSocket message received:', message);
          
          if (message.type === 'booking_approved') {
            console.log('New booking approved by admin:', message.data);
            // Refresh bookings immediately when a new booking is approved
            fetchBookings();
            
            // Show notification to technician
            if (message.data.booking) {
              const booking = message.data.booking;
              alerts.reportSuccess();
              console.log(`New approved booking: ${booking.patientName || booking.user?.name} - ${booking.labName || booking.labAppointment}`);
            }
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      websocket.onerror = (error) => {
        console.error('Technician WebSocket error:', error);
      };
      
      websocket.onclose = () => {
        console.log('Technician WebSocket disconnected');
        setWs(null);
      };
      
      return () => {
        if (websocket.readyState === WebSocket.OPEN) {
          websocket.close();
        }
      };
    }
  }, [user, fetchBookings]);

  const fetchPendingReports = useCallback(async () => {
    try {
      const response = await fetch(createApiUrl('/api/reports/pending/reports'), {
        headers: { Authorization: `Bearer ${user?.token || ""}` },
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setPendingReports(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching pending reports:", error);
    }
  }, [user]);

  useEffect(() => {
    fetchBookings();
    if (activeView === 'reports') {
      fetchPendingReports();
    }
    
    // Set up real-time polling for new approved bookings
    const interval = setInterval(() => {
      fetchBookings();
      if (activeView === 'reports') {
        fetchPendingReports();
      }
    }, 10000); // Poll every 10 seconds
    
    return () => clearInterval(interval);
  }, [fetchBookings, fetchPendingReports, activeView]);

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      const response = await fetch(createApiUrl(`/api/bookings/${bookingId}/status`), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token || ""}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchBookings();
        
        // If starting test, switch to reports view and select the booking
        if (status === 'in_progress') {
          const booking = bookings.find(b => (b._id || b.id) === bookingId);
          if (booking) {
            setActiveView('reports');
            handleSelectAppointment(booking);
          }
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const headerNav = {
    goToHome: () => navigate('/'),
    goToAbout: () => navigate('/about'),
    goToServices: () => navigate('/services'),
    goToLogin: () => navigate('/login-selection'),
    goToRegister: () => navigate('/register'),
  };

  const appointments = [
    { id: 'APT001', patientName: 'John Smith', patientId: 'P1001', age: 45, gender: 'Male', doctor: 'Sarah Johnson', collectionDate: '2024-01-28', status: 'pending' },
    { id: 'APT002', patientName: 'Emily Davis', patientId: 'P1002', age: 32, gender: 'Female', doctor: 'Michael Brown', collectionDate: '2024-01-28', status: 'pending' },
    { id: 'APT003', patientName: 'Robert Wilson', patientId: 'P1003', age: 58, gender: 'Male', doctor: 'Lisa Anderson', collectionDate: '2024-01-27', status: 'completed' }
  ];

  const defaultTests = [
    { testName: 'Hemoglobin', result: '', unit: 'g/dL', referenceRange: '12.0 - 18.0', status: '' },
    { testName: 'WBC Count', result: '', unit: 'K/uL', referenceRange: '4.0 - 12.0', status: '' },
    { testName: 'Vitamin B12', result: '', unit: 'pg/mL', referenceRange: '200 - 900', status: '' },
    { testName: 'RBC Count', result: '', unit: 'M/uL', referenceRange: '4.0 - 5.5', status: '' },
    { testName: 'Platelet Count', result: '', unit: 'K/uL', referenceRange: '100 - 500', status: '' },
    { testName: 'MCV', result: '', unit: 'fL', referenceRange: '80 - 100', status: '' },
    { testName: 'MCH', result: '', unit: 'pg', referenceRange: '27 - 33', status: '' },
    { testName: 'MCHC', result: '', unit: 'g/dL', referenceRange: '32 - 36', status: '' },
    { testName: 'Neutrophils', result: '', unit: '%', referenceRange: '40 - 74', status: '' },
    { testName: 'Lymphocytes', result: '', unit: '%', referenceRange: '20 - 45', status: '' },
    { testName: 'Monocytes', result: '', unit: '%', referenceRange: '2 - 8', status: '' },
    { testName: 'Eosinophils', result: '', unit: '%', referenceRange: '0 - 5', status: '' },
    { testName: 'Basophils', result: '', unit: '%', referenceRange: '0 - 2', status: '' }
  ];

  const healthyLungTest = [
    { testName: 'Healthy Lung & Body Checkup', result: '', unit: 'mg/dL', referenceRange: 'Normal Range', status: '' }
  ];

  const handleSelectAppointment = (booking) => {
    setSelectedAppointment(booking);
    
    // Initialize Image section with the 13 parameters
    setImageTestResults(defaultTests.map(test => ({ ...test })));
    
    // Initialize Healthy Lung & Body Checkup section
    setHealthyLungResults(healthyLungTest.map(test => ({ ...test })));
    
    // Keep existing logic for other tests
    if (booking.selectedTests && booking.selectedTests.length > 0) {
      const initialTests = booking.selectedTests.map(test => ({
        testName: test.name,
        result: '',
        unit: test.unit || 'mg/dL',
        referenceRange: test.referenceRange || 'Normal Range',
        status: ''
      }));
      setTestResults(initialTests);
    } else {
      setTestResults([]);
    }
  };

  const handleSubmitReport = async () => {
    if (!selectedAppointment) {
      alerts.validation('Please select an appointment first.');
      return;
    }
    if (isGenerating) return;
    
    // Combine all test results
    const allTestResults = [
      ...imageTestResults,
      ...healthyLungResults,
      ...testResults
    ];
    
    const testsWithResults = allTestResults.filter(test => test.result && test.result.trim() !== '');
    if (testsWithResults.length === 0) {
      alerts.validation('Please enter results for at least one test before submitting.');
      return;
    }
    
    const invalidTests = allTestResults.filter(test => test.result && test.result.trim() !== '' && !test.status);
    if (invalidTests.length > 0) {
      alerts.validation('Please ensure all entered test results have valid status values.');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const reportData = {
        bookingId: selectedAppointment._id,
        selectedTests: testsWithResults.map(test => ({
          name: test.testName,
          result: test.result.trim(),
          unit: test.unit || '',
          referenceRange: test.referenceRange || '',
          status: test.status || 'Normal'
        })),
        summary: `Lab report for ${selectedAppointment.packageName || 'Lab Test'} with ${testsWithResults.length} tests. ${testsWithResults.filter(t => t.status === 'High' || t.status === 'Low').length} abnormal results detected.`,
        recommendations: testsWithResults.some(test => test.status === 'High' || test.status === 'Low') 
          ? 'Follow up with your doctor for detailed consultation regarding abnormal values.'
          : 'All results are within normal limits. Routine follow-up recommended.'
      };

      const response = await fetch(createApiUrl('/api/reports'), {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user?.token || ""}` },
        body: JSON.stringify(reportData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const statusResponse = await fetch(createApiUrl(`/api/bookings/${selectedAppointment._id}/status`), {
          method: "PATCH",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${user?.token || ""}` },
          body: JSON.stringify({ status: "completed" }),
        });

        if (statusResponse.ok) {
          alerts.reportSuccess();
          setSelectedAppointment(null);
          setTestResults([]);
          setImageTestResults([]);
          setHealthyLungResults([]);
          fetchPendingReports();
          fetchBookings();
          setActiveView('overview');
        } else {
          alerts.reportError('Report submitted but failed to update booking status. Please refresh the page.');
        }
      } else {
        alerts.reportError(data.message || 'Please try again.');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alerts.networkError();
    } finally {
      setIsGenerating(false);
    }
  };

  const TEST_REFERENCE_RANGES = {
    'Hemoglobin': { low: 12.0, high: 18.0, unit: 'g/dL' },
    'WBC Count': { low: 4.0, high: 12.0, unit: 'K/uL' },
    'Vitamin B12': { low: 200, high: 900, unit: 'pg/mL' },
    'RBC Count': { low: 4.0, high: 5.5, unit: 'M/uL' },
    'Platelet Count': { low: 100, high: 500, unit: 'K/uL' },
    'MCV': { low: 80, high: 100, unit: 'fL' },
    'MCH': { low: 27, high: 33, unit: 'pg' },
    'MCHC': { low: 32, high: 36, unit: 'g/dL' },
    'Neutrophils': { low: 40, high: 74, unit: '%' },
    'Lymphocytes': { low: 20, high: 45, unit: '%' },
    'Monocytes': { low: 2, high: 8, unit: '%' },
    'Eosinophils': { low: 0, high: 5, unit: '%' },
    'Basophils': { low: 0, high: 2, unit: '%' }
  };

  const determineTestStatus = (testName, result) => {
    const numResult = parseFloat(result);
    if (isNaN(numResult)) return '';
    
    if (TEST_REFERENCE_RANGES[testName]) {
      const { low, high } = TEST_REFERENCE_RANGES[testName];
      if (numResult < low) return 'Low';
      if (numResult > high) return 'High';
      return 'Normal';
    }
    
    const test = testResults.find(t => t.testName === testName);
    if (!test || !test.referenceRange) return '';
    
    const range = test.referenceRange.trim();
    
    if (range.includes('-')) {
      const [min, max] = range.split('-').map(v => parseFloat(v.trim()));
      if (!isNaN(min) && !isNaN(max)) {
        if (numResult < min) return 'Low';
        if (numResult > max) return 'High';
        return 'Normal';
      }
    }
    
    if (range.startsWith('<')) {
      const max = parseFloat(range.replace('<', '').trim());
      if (!isNaN(max)) {
        return numResult > max ? 'High' : 'Normal';
      }
    }
    
    return '';
  };

  const handleTestResultChange = (index, field, value, section = 'general') => {
    if (section === 'image') {
      const updatedResults = [...imageTestResults];
      updatedResults[index][field] = value;
      
      if (field === 'result' && value) {
        const test = updatedResults[index];
        test.status = determineTestStatus(test.testName, value);
      }
      
      setImageTestResults(updatedResults);
    } else if (section === 'healthyLung') {
      const updatedResults = [...healthyLungResults];
      updatedResults[index][field] = value;
      
      if (field === 'result' && value) {
        const test = updatedResults[index];
        test.status = determineTestStatus(test.testName, value);
      }
      
      setHealthyLungResults(updatedResults);
    } else {
      const updatedResults = [...testResults];
      updatedResults[index][field] = value;
      
      if (field === 'result' && value) {
        const test = updatedResults[index];
        test.status = determineTestStatus(test.testName, value);
      }
      
      setTestResults(updatedResults);
    }
  };

  const generatePDF = async () => {
    if (!selectedAppointment) return;
    
    setIsGenerating(true);
    
    try {
      const element = document.getElementById('lab-report');
      const opt = {
        margin: 10,
        filename: `Lab_Report_${selectedAppointment.patientId}_${selectedAppointment.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      await html2pdf().set(opt).from(element).save();
      
      const updatedAppointments = appointments.map(apt => 
        apt.id === selectedAppointment.id ? { ...apt, status: 'completed' } : apt
      );
      
      alerts.pdfSuccess();
      setSelectedAppointment(null);
      setTestResults([]);
      setImageTestResults([]);
      setHealthyLungResults([]);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alerts.pdfError();
    } finally {
      setIsGenerating(false);
    }
  };

  const patientInfo = selectedAppointment ? {
    name: selectedAppointment.patientName,
    age: selectedAppointment.age,
    gender: selectedAppointment.gender,
    patientId: selectedAppointment.patientId,
    appointmentId: selectedAppointment.id
  } : {};

  const reportInfo = selectedAppointment ? {
    collectionDate: selectedAppointment.collectionDate,
    reportDate: new Date().toLocaleDateString(),
    referredBy: selectedAppointment.doctor
  } : {};

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header {...headerNav} hideNavItems={true} />
      
      <main className="flex-grow">
        {/* View Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
            <button
              onClick={() => setActiveView('overview')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                activeView === 'overview'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveView('reports')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                activeView === 'reports'
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Generate Reports
            </button>
          </div>
        </div>

        {/* Overview View */}
        {activeView === 'overview' ? (
          <>
            {/* Stats Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: TestTube, label: "Test Name", value: stats.todayTests, color: "bg-blue-500" },
                  { icon: Eye, label: "Completed", value: stats.completed, color: "bg-green-500" },
                  { icon: Users, label: "Pending", value: stats.pending, color: "bg-red-500" }
                ].map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`${stat.color} p-3 rounded-lg`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-600">{stat.label}</h3>
                  </div>
                ))}
              </div>
            </section>

            {/* Today's Bookings */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Appointments</h2>
                  {!showAllToday && bookings.length > 3 && (
                    <CButton
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAllToday(true)}
                    >
                      View All
                    </CButton>
                  )}
                </div>
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading appointments...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookings
                      .slice(0, showAllToday ? undefined : 3)
                      .map((appointment, index) => (
                        <div
                          key={appointment._id || appointment.id || index}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                              <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-800 text-sm sm:text-base">
                                {appointment.patientName || appointment.user?.name || "N/A"}
                              </p>
                              <p className="text-xs sm:text-sm text-gray-600">
                                {appointment.packageName || "Lab Test"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 ml-13">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="font-medium">{appointment.time || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                              appointment.status === "completed" ? "bg-green-100 text-green-800" :
                              appointment.status === "in_progress" || appointment.status === "testing" ? "bg-secondary/20 text-primary" :
                              appointment.adminStatus === "approved" && !appointment.status || appointment.status === "pending" ? "bg-blue-100 text-blue-800" :
                              "bg-yellow-100 text-yellow-800"
                            }`}>
                              {appointment.adminStatus === "approved" && (!appointment.status || appointment.status === "pending") ? "Accepted" :
                               appointment.status === "in_progress" || appointment.status === "testing" ? "Testing" :
                               appointment.status || "Pending"}
                            </span>
                            {appointment.adminStatus === "approved" && (!appointment.status || appointment.status === "pending") ? (
                              <CButton 
                                variant="primary" 
                                size="sm" 
                                onClick={() => handleStatusUpdate(appointment._id || appointment.id, "in_progress")}
                                fullWidth={false}
                                className="text-xs px-4 py-1"
                              >
                                Start Test
                              </CButton>
                            ) : appointment.status === "in_progress" || appointment.status === "testing" ? (
                              <CButton 
                                variant="secondary" 
                                size="sm" 
                                onClick={() => handleStatusUpdate(appointment._id || appointment.id, "completed")}
                                fullWidth={false}
                                className="text-xs px-4 py-1"
                              >
                                Complete
                              </CButton>
                            ) : null}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </section>
          </>
        ) : (
          /* Reports Generation View */
          <div className="technician-dashboard">
            <div className="dashboard-header">
              <h1>Generate Lab Reports</h1>
              <p>Create and manage laboratory test reports</p>
            </div>

            <div className="dashboard-content">
              {/* Appointments List */}
              <div className="appointments-section">
                <h2>Pending Reports</h2>
                <div className="appointments-list">
                  {pendingReports.length > 0 ? (
                    pendingReports.map(booking => (
                      <div
                        key={booking._id}
                        className={`appointment-card ${selectedAppointment?._id === booking._id ? 'selected' : ''}`}
                        onClick={() => handleSelectAppointment(booking)}
                      >
                        <div className="appointment-header">
                          <h3>{booking.patientName || booking.user?.name}</h3>
                        </div>
                        <div className="appointment-details">
                          <p><strong>Email:</strong> {booking.user?.email || 'N/A'}</p>
                          <p><strong>Patient ID:</strong> {booking.user?._id?.toString().slice(-8) || 'N/A'}</p>
                          <p><strong>Package:</strong> {booking.packageName}</p>
                          <p><strong>Lab:</strong> {booking.labName}</p>
                          <p><strong>Appointment:</strong> {booking.date} at {booking.time}</p>
                          {booking.selectedTests && (
                            <p><strong>Tests:</strong> {booking.selectedTests.length} test{booking.selectedTests.length > 1 ? 's' : ''}</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No pending reports found.</p>
                      <p className="text-sm mt-2">Approved bookings will appear here once reports are generated.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Report Generation Section */}
              {selectedAppointment && (
                <div className="report-generation">
                  <h2>Generate Report for {selectedAppointment.patientName || selectedAppointment.user?.name}</h2>
                  
                  <div className="test-inputs">
                    {/* Image Section */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Image</h3>
                      <div className="test-grid">
                        {imageTestResults.map((test, index) => (
                          <div key={index} className="test-input-row">
                            <label className="test-name">{test.testName}</label>
                            <input
                              type="text"
                              placeholder="Result"
                              value={test.result}
                              onChange={(e) => handleTestResultChange(index, 'result', e.target.value, 'image')}
                              className="result-input"
                            />
                            <span className="unit">{test.unit}</span>
                            <span className="reference-range">({test.referenceRange})</span>
                            {test.status && (
                              <span className={`status-badge ${test.status.toLowerCase()}`}>
                                {test.status}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Healthy Lung & Body Checkup Section */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Enter Test Results</h3>
                      <div className="test-grid">
                        {healthyLungResults.map((test, index) => (
                          <div key={index} className="test-input-row">
                            <label className="test-name">{test.testName}</label>
                            <input
                              type="text"
                              placeholder="Result"
                              value={test.result}
                              onChange={(e) => handleTestResultChange(index, 'result', e.target.value, 'healthyLung')}
                              className="result-input"
                            />
                            <span className="unit">{test.unit}</span>
                            <span className="reference-range">({test.referenceRange})</span>
                            {test.status && (
                              <span className={`status-badge ${test.status.toLowerCase()}`}>
                                {test.status}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Additional Tests Section (if any) */}
                    {testResults.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Additional Tests</h3>
                        <div className="test-grid">
                          {testResults.map((test, index) => (
                            <div key={index} className="test-input-row">
                              <label className="test-name">{test.testName}</label>
                              <input
                                type="text"
                                placeholder="Result"
                                value={test.result}
                                onChange={(e) => handleTestResultChange(index, 'result', e.target.value, 'general')}
                                className="result-input"
                              />
                              <span className="unit">{test.unit}</span>
                              <span className="reference-range">({test.referenceRange})</span>
                              {test.status && (
                                <span className={`status-badge ${test.status.toLowerCase()}`}>
                                  {test.status}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="report-preview">
                    <h3>Report Preview</h3>
                    <div className="preview-container">
                      <LabReport 
                        patientInfo={{
                          name: selectedAppointment.patientName || selectedAppointment.user?.name,
                          age: 'N/A',
                          gender: 'N/A',
                          patientId: selectedAppointment.user?._id?.toString().slice(-8) || 'N/A',
                          appointmentId: selectedAppointment._id.toString().slice(-8)
                        }}
                        testResults={[
                          ...imageTestResults,
                          ...healthyLungResults,
                          ...testResults
                        ].filter(test => test.result)}
                        reportInfo={{
                          collectionDate: selectedAppointment.date,
                          reportDate: new Date().toLocaleDateString(),
                          referredBy: 'Lab Technician'
                        }}
                      />
                    </div>
                  </div>

                  <div className="generate-section">
                    <button
                      onClick={handleSubmitReport}
                      disabled={isGenerating || [
                        ...imageTestResults,
                        ...healthyLungResults,
                        ...testResults
                      ].filter(test => test.result && test.result.trim() !== '').length === 0}
                      className="generate-btn"
                      title={[
                        ...imageTestResults,
                        ...healthyLungResults,
                        ...testResults
                      ].filter(test => test.result && test.result.trim() !== '').length === 0 ? 'Please enter at least one test result' : ''}
                    >
                      {isGenerating ? 'Submitting...' : 'Accept & Submit Report'}
                    </button>
                    {[
                      ...imageTestResults,
                      ...healthyLungResults,
                      ...testResults
                    ].filter(test => test.result && test.result.trim() !== '').length === 0 && (
                      <p className="text-sm text-gray-500 mt-2 text-center">
                        Please enter results for at least one test to submit the report
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default TechnicianDashboard;
