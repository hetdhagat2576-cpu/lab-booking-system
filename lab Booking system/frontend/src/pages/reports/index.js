import React, { useState, useEffect } from 'react';
import { reportService } from '../../services/reportService';
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

const showConfirmDialog = (title, message, options = {}) => {
  return Swal.fire({
    ...sweetAlertConfig.baseConfig,
    ...sweetAlertConfig.warningConfig,
    title,
    text: message,
    showCancelButton: true,
    cancelButtonText: 'No',
    confirmButtonText: 'Yes',
    reverseButtons: true,
    ...options
  });
};

const showDeleteConfirm = (reportName) => {
  return showConfirmDialog(
    'Delete Report',
    `Are you sure you want to delete the report "${reportName}"? This action cannot be undone.`
  );
};

const showDownloadSuccess = () => {
  return showSuccessAlert('Success', 'PDF downloaded successfully');
};

const showDeleteSuccess = () => {
  return showSuccessAlert('Success', 'Report deleted successfully');
};

const showFetchError = () => {
  return showErrorAlert('Error', 'Failed to fetch reports');
};

const showDownloadError = () => {
  return showErrorAlert('Error', 'Failed to download PDF');
};

const showDeleteError = () => {
  return showErrorAlert('Error', 'Failed to delete report');
};

// LabReport CSS styles
const labReportStyles = `
  .lab-report {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Arial', sans-serif;
    background: white;
    color: #333;
  }

  .report-header {
    text-align: center;
    margin-bottom: 30px;
    border-bottom: 2px solid #2c3e50;
    padding-bottom: 20px;
  }

  .hospital-info h1 {
    color: #2c3e50;
    margin: 0;
    font-size: 28px;
  }

  .hospital-info p {
    margin: 5px 0;
    color: #666;
    font-size: 14px;
  }

  .report-title h2 {
    color: #34495e;
    margin: 15px 0 0 0;
    font-size: 22px;
  }

  .patient-info, .test-details {
    margin-bottom: 25px;
  }

  .patient-info h3, .test-details h3, .results-section h3 {
    color: #2c3e50;
    border-bottom: 1px solid #bdc3c7;
    padding-bottom: 5px;
    margin-bottom: 15px;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 10px;
  }

  .info-item {
    padding: 8px;
    background: #f8f9fa;
    border-radius: 4px;
  }

  .info-item strong {
    color: #2c3e50;
  }

  .results-section {
    margin: 30px 0;
  }

  .results-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 15px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .results-table th,
  .results-table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }

  .results-table th {
    background-color: #34495e;
    color: white;
    font-weight: bold;
  }

  .results-table tr:nth-child(even) {
    background-color: #f8f9fa;
  }

  .results-table tr:hover {
    background-color: #e9ecef;
  }

  .status {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
    text-transform: uppercase;
  }

  .status.normal {
    background-color: #d4edda;
    color: #155724;
  }

  .status.high {
    background-color: #f8d7da;
    color: #721c24;
  }

  .status.low {
    background-color: #fff3cd;
    color: #856404;
  }

  .report-footer {
    margin-top: 40px;
    border-top: 2px solid #2c3e50;
    padding-top: 20px;
  }

  .signature-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .signature {
    text-align: center;
  }

  .signature p {
    margin: 5px 0;
  }

  .disclaimer {
    text-align: right;
    font-size: 12px;
    color: #666;
    max-width: 400px;
  }

  .disclaimer strong {
    color: #2c3e50;
  }

  @media print {
    .lab-report {
      margin: 0;
      padding: 15px;
      box-shadow: none;
    }
    
    .report-footer {
      page-break-inside: avoid;
    }
  }
`;

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      let data;
      
      if (userRole === 'patient') {
        const userId = localStorage.getItem('userId');
        data = await reportService.getPatientReports(userId);
      } else {
        data = await reportService.getAllReports();
      }
      
      setReports(data.reports || data);
    } catch (error) {
      showFetchError();
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (reportId) => {
    try {
      showLoadingAlert('Downloading PDF...');
      const pdfBlob = await reportService.downloadReportPDF(reportId);
      
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report_${reportId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      closeAlert();
      showDownloadSuccess();
    } catch (error) {
      closeAlert();
      showDownloadError();
      console.error('Error downloading PDF:', error);
    }
  };

  const handleDeleteReport = async (reportId) => {
    const confirmed = await showDeleteConfirm(report.testName);
    if (confirmed.isConfirmed) {
      try {
        await reportService.deleteReport(reportId);
        setReports(reports.filter(report => report._id !== reportId));
        showDeleteSuccess();
      } catch (error) {
        showDeleteError();
        console.error('Error deleting report:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <style>{labReportStyles}</style>
      <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Lab Reports</h1>
      
      {reports.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No reports found</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {reports.map((report) => (
            <div key={report._id} className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {report.testName}
                  </h3>
                  <p className="text-gray-600">
                    <span className="font-medium">Type:</span> {report.testType}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Test Date:</span> {formatDate(report.testDate)}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                      report.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {report.status}
                    </span>
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDownloadPDF(report._id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Download PDF
                  </button>
                  
                  {(userRole === 'lab_technician' || userRole === 'admin') && (
                    <button
                      onClick={() => handleDeleteReport(report._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
              
              {report.summary && (
                <div className="mt-4 p-4 bg-gray-50 rounded">
                  <h4 className="font-medium text-gray-700 mb-2">Summary:</h4>
                  <p className="text-gray-600">{report.summary}</p>
                </div>
              )}
              
              {report.recommendations && (
                <div className="mt-4 p-4 bg-blue-50 rounded">
                  <h4 className="font-medium text-blue-700 mb-2">Recommendations:</h4>
                  <p className="text-blue-600">{report.recommendations}</p>
                </div>
              )}
              
              <div className="mt-4 text-sm text-gray-500">
                <p>
                  <span className="font-medium">Patient:</span> {report.patientId?.name}
                </p>
                <p>
                  <span className="font-medium">Lab:</span> {report.labId?.name}
                </p>
                <p>
                  <span className="font-medium">Technician:</span> {report.technicianId?.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default ReportsPage;
