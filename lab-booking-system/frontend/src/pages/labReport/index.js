import React from 'react';

const LabReport = ({ patientInfo, testResults, reportInfo }) => {
  return (
    <div className="lab-report" id="lab-report">
      {/* Header */}
      <div className="report-header">
        <div className="hospital-info">
          <h1>City General Hospital</h1>
          <p>123 Medical Center Drive, New York, NY 10001</p>
          <p>Phone: (212) 555-1234 | Email: lab@citygeneral.com</p>
        </div>
        <div className="report-title">
          <h2>Medical Laboratory Report</h2>
        </div>
      </div>

      {/* Patient Information */}
      <div className="patient-info">
        <h3>Patient Information</h3>
        <div className="info-grid">
          <div className="info-item">
            <strong>Name:</strong> {patientInfo.name}
          </div>
          <div className="info-item">
            <strong>Age:</strong> {patientInfo.age}
          </div>
          <div className="info-item">
            <strong>Gender:</strong> {patientInfo.gender}
          </div>
          <div className="info-item">
            <strong>Patient ID:</strong> {patientInfo.patientId}
          </div>
          <div className="info-item">
            <strong>Appointment ID:</strong> {patientInfo.appointmentId}
          </div>
        </div>
      </div>

      {/* Test Details */}
      <div className="test-details">
        <h3>Test Details</h3>
        <div className="info-grid">
          <div className="info-item">
            <strong>Date of Collection:</strong> {reportInfo.collectionDate}
          </div>
          <div className="info-item">
            <strong>Date of Report:</strong> {reportInfo.reportDate}
          </div>
          <div className="info-item">
            <strong>Referred by:</strong> Dr. {reportInfo.referredBy}
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="results-section">
        <h3>Test Results</h3>
        <table className="results-table">
          <thead>
            <tr>
              <th>Test Name</th>
              <th>Result</th>
              <th>Unit</th>
              <th>Reference Range</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {testResults.map((test, index) => (
              <tr key={index}>
                <td>{test.testName}</td>
                <td>{test.result}</td>
                <td>{test.unit}</td>
                <td>{test.referenceRange}</td>
                <td>
                  <span className={`status ${test.status.toLowerCase()}`}>
                    {test.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="report-footer">
        <div className="signature-section">
          <div className="signature">
            <p>_________________________</p>
            <p><strong>Laboratory Technician</strong></p>
            <p>Signature & Date</p>
          </div>
          <div className="disclaimer">
            <p><strong>Report End</strong></p>
            <p>This report is electronically generated and does not require a physical signature.</p>
            <p>For questions about this report, please contact the laboratory.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabReport;
