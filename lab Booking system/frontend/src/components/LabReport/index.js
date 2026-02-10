import React from 'react';

const LabReport = ({ patientInfo, testResults, reportInfo }) => {
  const currentDate = new Date().toLocaleDateString();
  
  return (
    <div id="lab-report" className="lab-report-container" style={{ 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      backgroundColor: 'white',
      border: '1px solid #ddd'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', borderBottom: '3px solid #007bff', paddingBottom: '20px', marginBottom: '30px' }}>
        <h1 style={{ color: '#2c3e50', margin: '0', fontSize: '28px', fontWeight: 'bold' }}>
          LABORATORY TEST REPORT
        </h1>
        <p style={{ color: '#666', margin: '5px 0', fontSize: '14px' }}>
          Report ID: {patientInfo?.appointmentId || 'N/A'}
        </p>
        <p style={{ color: '#666', margin: '5px 0', fontSize: '14px' }}>
          Generated on: {currentDate}
        </p>
      </div>

      {/* Patient Information */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '10px 15px', 
          margin: '0 0 15px 0', 
          borderLeft: '4px solid #007bff',
          fontSize: '18px',
          color: '#2c3e50'
        }}>
          Patient Information
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <p style={{ margin: '5px 0' }}><strong>Name:</strong> {patientInfo?.name || 'N/A'}</p>
            <p style={{ margin: '5px 0' }}><strong>Patient ID:</strong> {patientInfo?.patientId || 'N/A'}</p>
            <p style={{ margin: '5px 0' }}><strong>Age:</strong> {patientInfo?.age || 'N/A'}</p>
          </div>
          <div>
            <p style={{ margin: '5px 0' }}><strong>Gender:</strong> {patientInfo?.gender || 'N/A'}</p>
            <p style={{ margin: '5px 0' }}><strong>Collection Date:</strong> {reportInfo?.collectionDate || 'N/A'}</p>
            <p style={{ margin: '5px 0' }}><strong>Referred By:</strong> {reportInfo?.referredBy || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '10px 15px', 
          margin: '0 0 15px 0', 
          borderLeft: '4px solid #007bff',
          fontSize: '18px',
          color: '#2c3e50'
        }}>
          Test Results
        </h2>
        {testResults && testResults.length > 0 ? (
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            border: '1px solid #ddd',
            fontSize: '14px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Test Name</th>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Result</th>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Unit</th>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Reference Range</th>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #ddd' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {testResults.map((test, index) => (
                <tr key={index} style={{
                  backgroundColor: test.status === 'High' || test.status === 'Low' ? '#fff5f5' : 'white'
                }}>
                  <td style={{ padding: '10px', border: '1px solid #ddd', fontWeight: 'bold' }}>
                    {test.testName}
                  </td>
                  <td style={{ 
                    padding: '10px', 
                    border: '1px solid #ddd',
                    color: test.status === 'High' || test.status === 'Low' ? '#d9534f' : '#333',
                    fontWeight: test.status === 'High' || test.status === 'Low' ? 'bold' : 'normal'
                  }}>
                    {test.result}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    {test.unit || 'N/A'}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd', fontSize: '12px' }}>
                    {test.referenceRange || 'N/A'}
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      backgroundColor: test.status === 'Normal' ? '#d4edda' : 
                                     test.status === 'High' ? '#f8d7da' : 
                                     test.status === 'Low' ? '#fff3cd' : '#e2e3e5',
                      color: test.status === 'Normal' ? '#155724' : 
                             test.status === 'High' ? '#721c24' : 
                             test.status === 'Low' ? '#856404' : '#6c757d'
                    }}>
                      {test.status || 'Normal'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <p>No test results available</p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '10px 15px', 
          margin: '0 0 15px 0', 
          borderLeft: '4px solid #007bff',
          fontSize: '18px',
          color: '#2c3e50'
        }}>
          Test Summary
        </h2>
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '5px',
          lineHeight: '1.6'
        }}>
          <p style={{ margin: '0', color: '#555' }}>
            This report includes {testResults?.length || 0} laboratory tests performed on the specified collection date.
            {testResults?.some(test => test.status === 'High' || test.status === 'Low') && 
              ` Some results fall outside the normal reference range and may require further medical attention.`
            }
            {testResults?.every(test => test.status === 'Normal' || !test.status) && 
              ` All results are within normal limits.`
            }
          </p>
        </div>
      </div>

      {/* Recommendations */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '10px 15px', 
          margin: '0 0 15px 0', 
          borderLeft: '4px solid #007bff',
          fontSize: '18px',
          color: '#2c3e50'
        }}>
          Recommendations
        </h2>
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#fff3cd', 
          borderRadius: '5px',
          border: '1px solid #ffeaa7',
          lineHeight: '1.6'
        }}>
          <p style={{ margin: '0', color: '#856404' }}>
            Please consult with your healthcare provider for detailed interpretation of these results.
            {testResults?.some(test => test.status === 'High' || test.status === 'Low') && 
              ` Some abnormal values were detected. Follow-up consultation is recommended.`
            }
            This report should be interpreted in conjunction with your clinical history and other diagnostic information.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        textAlign: 'center', 
        padding: '20px', 
        borderTop: '1px solid #ddd',
        fontSize: '12px',
        color: '#666'
      }}>
        <p style={{ margin: '5px 0' }}>
          <strong>This is a digitally generated report by Lab Booking System</strong>
        </p>
        <p style={{ margin: '5px 0' }}>
          Generated on: {currentDate} at {new Date().toLocaleTimeString()}
        </p>
        <p style={{ margin: '5px 0', fontSize: '10px' }}>
          For medical inquiries, please contact the laboratory or your healthcare provider
        </p>
      </div>
    </div>
  );
};

export default LabReport;
