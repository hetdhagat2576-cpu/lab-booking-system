import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { reportService } from '../../services/reportService';
import Header from '../../components/header';
import Footer from '../../components/footer';
import CButton from '../../components/cButton';
import IconConfig from '../../components/icon/index.js';
import Swal from 'sweetalert2';
import Theme from '../../config/theam/index.js';

// SweetAlert helper functions with centralized theme configuration
const sweetAlertConfig = {
  baseConfig: {
    background: Theme.colors.white,
    color: Theme.colors.textDark,
    confirmButtonColor: Theme.colors.primary,
    cancelButtonColor: Theme.colors.secondary,
    customClass: {
      popup: 'rounded-lg shadow-xl',
      title: 'text-xl font-semibold',
      content: 'text-gray-700',
      confirmButton: 'px-6 py-2 text-white font-medium rounded-lg hover:opacity-90 transition-opacity',
      cancelButton: 'px-6 py-2 text-white font-medium rounded-lg hover:opacity-90 transition-opacity'
    },
    buttonsStyling: false
  },
  successConfig: {
    icon: 'success',
    iconColor: Theme.colors.primary,
    showConfirmButton: true,
    confirmButtonText: 'OK',
    timer: 4000,
    timerProgressBar: true
  },
  errorConfig: {
    icon: 'error',
    iconColor: '#dc3741',
    showConfirmButton: true,
    confirmButtonText: 'OK'
  },
  warningConfig: {
    icon: 'warning',
    iconColor: '#f59e0b',
    showConfirmButton: true,
    confirmButtonText: 'OK'
  },
  loadingConfig: {
    icon: 'info',
    iconColor: Theme.colors.primary,
    showConfirmButton: false,
    showCancelButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false
  }
};

const showSuccessAlert = (title, message, options = {}) => {
  return Swal.fire({
    ...sweetAlertConfig.baseConfig,
    ...sweetAlertConfig.successConfig,
    title,
    text: message,
    ...options
  });
};

const showErrorAlert = (title, message, options = {}) => {
  return Swal.fire({
    ...sweetAlertConfig.baseConfig,
    ...sweetAlertConfig.errorConfig,
    title,
    text: message,
    ...options
  });
};

const showLoadingAlert = (title = 'Loading...', message = 'Please wait') => {
  return Swal.fire({
    ...sweetAlertConfig.baseConfig,
    ...sweetAlertConfig.loadingConfig,
    title,
    text: message,
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

const closeAlert = () => {
  Swal.close();
};

const showDownloadSuccess = () => {
  return showSuccessAlert('Success', 'PDF downloaded successfully');
};

const showDownloadError = () => {
  return showErrorAlert('Error', 'Failed to download PDF');
};

const showNetworkError = () => {
  return showErrorAlert(
    'Network Error',
    'Unable to connect to server. Please check your internet connection and try again.'
  );
};

const ReportView = () => {
  const { reportId } = useParams();
  const { user } = useAuth();
  const { FileText, Download, ArrowLeft } = IconConfig;
  const navigate = useNavigate();
  
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await reportService.getReportById(reportId);
        if (response.success) {
          setReport(response.data);
        } else {
          setError(response.message || 'Failed to load report');
        }
      } catch (err) {
        setError('Error loading report. Please try again.');
        console.error('Error fetching report:', err);
      } finally {
        setLoading(false);
      }
    };

    if (reportId) {
      fetchReport();
    }
  }, [reportId]);

  const handleDownloadPDF = async () => {
    try {
      const blob = await reportService.downloadReportPDF(reportId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Lab_Report_${typeof report.patientId?.name === 'string' ? report.patientId.name : report.patientId?.name?.name || 'Patient'}_${reportId.slice(-8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      showDownloadError();
    }
  };

  const headerNav = {
    goToHome: () => navigate('/'),
    goToAbout: () => navigate('/about'),
    goToServices: () => navigate('/services'),
    goToLogin: () => navigate('/login-selection'),
    goToRegister: () => navigate('/register'),
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header {...headerNav} />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading report...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header {...headerNav} />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Report</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <CButton onClick={() => navigate(-1)} variant="outline">
              Go Back
            </CButton>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header {...headerNav} />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Report Not Found</h2>
            <p className="text-gray-600 mb-6">The requested report could not be found.</p>
            <CButton onClick={() => navigate(-1)} variant="outline">
              Go Back
            </CButton>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header {...headerNav} />
      
      <main className="flex-grow">
        {/* Action Bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center text-gray-600 hover:text-primary transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back
                </button>
                <h1 className="text-xl font-semibold text-gray-800">
                  Lab Report - {typeof report.patientId?.name === 'string' ? report.patientId.name : report.patientId?.name?.name || 'Patient'}
                </h1>
              </div>
              <div className="flex space-x-3">
                <CButton
                  onClick={handleDownloadPDF}
                  variant="primary"
                  className="flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </CButton>
              </div>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Report Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 text-center">
              <h1 className="text-3xl font-bold mb-2">LABORATORY TEST REPORT</h1>
              <p className="text-blue-100">Report ID: {report._id}</p>
              <p className="text-blue-100">Generated on: {new Date(report.createdAt).toLocaleDateString()}</p>
            </div>

            {/* Patient Information */}
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-1 h-6 bg-blue-600 mr-3"></div>
                Patient Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p><span className="font-medium text-gray-600">Name:</span> {typeof report.patientId?.name === 'string' ? report.patientId.name : report.patientId?.name?.name || 'N/A'}</p>
                  <p><span className="font-medium text-gray-600">Email:</span> {report.patientId?.email}</p>
                  <p><span className="font-medium text-gray-600">Phone:</span> {report.patientId?.phone || 'N/A'}</p>
                </div>
                <div className="space-y-2">
                  <p><span className="font-medium text-gray-600">Test Package:</span> {report.packageName}</p>
                  <p><span className="font-medium text-gray-600">Test Date:</span> {new Date(report.testDate).toLocaleDateString()}</p>
                  <p><span className="font-medium text-gray-600">Status:</span> 
                    <span className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${
                      report.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Test Results */}
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-1 h-6 bg-blue-600 mr-3"></div>
                Test Results
              </h2>
              {report.selectedTests && report.selectedTests.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">Test Name</th>
                        <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">Result</th>
                        <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">Unit</th>
                        <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">Reference Range</th>
                        <th className="border border-gray-200 px-4 py-3 text-left font-medium text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.selectedTests.map((test, index) => (
                        <tr key={index} className={test.status === 'High' || test.status === 'Low' ? 'bg-red-50' : ''}>
                          <td className="border border-gray-200 px-4 py-3 font-medium">
                            {typeof test.name === 'string' ? test.name : test.name?.name || test.name?.title || JSON.stringify(test.name)}
                          </td>
                          <td className={`border border-gray-200 px-4 py-3 font-medium ${
                            test.status === 'High' || test.status === 'Low' ? 'text-red-600' : 'text-gray-800'
                          }`}>
                            {test.result}
                          </td>
                          <td className="border border-gray-200 px-4 py-3">{test.unit || 'N/A'}</td>
                          <td className="border border-gray-200 px-4 py-3 text-sm">{test.referenceRange || 'N/A'}</td>
                          <td className="border border-gray-200 px-4 py-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              test.status === 'Normal' ? 'bg-green-100 text-green-800' :
                              test.status === 'High' ? 'bg-red-100 text-red-800' :
                              test.status === 'Low' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {test.status || 'Normal'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No test results available</p>
                </div>
              )}
            </div>

            {/* Summary */}
            <div className="p-8 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-1 h-6 bg-blue-600 mr-3"></div>
                Test Summary
              </h2>
              <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <p className="text-gray-700 leading-relaxed">{report.summary}</p>
              </div>
            </div>

            {/* Recommendations */}
            <div className="p-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <div className="w-1 h-6 bg-blue-600 mr-3"></div>
                Recommendations
              </h2>
              <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                <p className="text-gray-700 leading-relaxed">{report.recommendations}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-6 text-center text-sm text-gray-600 border-t border-gray-200">
              <p className="font-medium">Lab Booking System - Digital Report</p>
              <p>Generated on {new Date(report.createdAt).toLocaleString()} at {new Date(report.createdAt).toLocaleTimeString()}</p>
              <p className="mt-2 text-xs">For medical inquiries, please contact your healthcare provider</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReportView;
