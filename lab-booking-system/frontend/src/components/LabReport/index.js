import React from 'react';

const LabReport = ({ patientInfo, testResults, reportInfo }) => {
  const currentDate = new Date().toLocaleDateString();
  
  return (
    <div id="lab-report" className="lab-report-container" style={{ 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '30px',
      backgroundColor: 'white',
      border: '2px solid #2a7a8e',
      borderRadius: '12px',
      boxShadow: '0 8px 32px rgba(42, 122, 142, 0.15)'
    }}>
      {/* Header */}
      <div style={{ 
        textAlign: 'center', 
        borderBottom: '3px solid #2a7a8e', 
        paddingBottom: '25px', 
        marginBottom: '30px',
        background: 'linear-gradient(135deg, #2a7a8e 0%, #98d2e0 100%)',
        margin: '-30px -30px 30px -30px',
        padding: '30px',
        borderRadius: '12px 12px 0 0'
      }}>
        <h1 style={{ 
          color: 'white', 
          margin: '0', 
          fontSize: '32px', 
          fontWeight: 'bold',
          textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          letterSpacing: '1px'
        }}>
          LABORATORY TEST REPORT
        </h1>
        <p style={{ 
          color: 'rgba(255, 255, 255, 0.9)', 
          margin: '8px 0 0 0', 
          fontSize: '16px',
          fontWeight: '500'
        }}>
          Report ID: {patientInfo?.appointmentId || 'N/A'}
        </p>
      </div>

      {/* Patient Information */}
      <div style={{ marginBottom: '35px' }}>
        <h2 style={{ 
          background: 'linear-gradient(135deg, #2a7a8e 0%, #98d2e0 100%)', 
          padding: '12px 20px', 
          margin: '0 0 20px 0', 
          borderRadius: '8px',
          fontSize: '20px',
          color: 'white',
          fontWeight: '600',
          boxShadow: '0 4px 12px rgba(42, 122, 142, 0.2)'
        }}>
          Patient Information
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '25px',
          padding: '20px',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <div>
            <p style={{ margin: '8px 0', fontSize: '15px' }}>
              <strong style={{ color: '#2a7a8e' }}>Name:</strong> 
              <span style={{ color: '#334155', marginLeft: '8px' }}>{patientInfo?.name || 'N/A'}</span>
            </p>
            <p style={{ margin: '8px 0', fontSize: '15px' }}>
              <strong style={{ color: '#2a7a8e' }}>Patient ID:</strong> 
              <span style={{ color: '#334155', marginLeft: '8px' }}>{patientInfo?.patientId || 'N/A'}</span>
            </p>
            <p style={{ margin: '8px 0', fontSize: '15px' }}>
              <strong style={{ color: '#2a7a8e' }}>Age:</strong> 
              <span style={{ color: '#334155', marginLeft: '8px' }}>{patientInfo?.age || 'N/A'}</span>
            </p>
          </div>
          <div>
            <p style={{ margin: '8px 0', fontSize: '15px' }}>
              <strong style={{ color: '#2a7a8e' }}>Gender:</strong> 
              <span style={{ color: '#334155', marginLeft: '8px' }}>{patientInfo?.gender || 'N/A'}</span>
            </p>
            <p style={{ margin: '8px 0', fontSize: '15px' }}>
              <strong style={{ color: '#2a7a8e' }}>Collection Date:</strong> 
              <span style={{ color: '#334155', marginLeft: '8px' }}>{reportInfo?.collectionDate || 'N/A'}</span>
            </p>
            <p style={{ margin: '8px 0', fontSize: '15px' }}>
              <strong style={{ color: '#2a7a8e' }}>Referred By:</strong> 
              <span style={{ color: '#334155', marginLeft: '8px' }}>{reportInfo?.referredBy || 'N/A'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div style={{ marginBottom: '35px' }}>
        <h2 style={{ 
          background: 'linear-gradient(135deg, #2a7a8e 0%, #98d2e0 100%)', 
          padding: '12px 20px', 
          margin: '0 0 20px 0', 
          borderRadius: '8px',
          fontSize: '20px',
          color: 'white',
          fontWeight: '600',
          boxShadow: '0 4px 12px rgba(42, 122, 142, 0.2)'
        }}>
          Test Results
        </h2>
        {testResults && testResults.length > 0 ? (
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)'
          }}>
            <thead>
              <tr style={{ 
                background: 'linear-gradient(135deg, #2a7a8e 0%, #98d2e0 100%)', 
                color: 'white',
                textAlign: 'left'
              }}>
                <th style={{ padding: '12px 15px', border: '1px solid #2a7a8e' }}>Test Name</th>
                <th style={{ padding: '12px 15px', border: '1px solid #2a7a8e' }}>Result</th>
                <th style={{ padding: '12px 15px', border: '1px solid #2a7a8e' }}>Unit</th>
                <th style={{ padding: '12px 15px', border: '1px solid #2a7a8e' }}>Reference Range</th>
                <th style={{ padding: '12px 15px', border: '1px solid #2a7a8e' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {testResults.map((test, index) => (
                <tr key={index} style={{
                  backgroundColor: index % 2 === 0 ? '#f8fafc' : '#ffffff',
                  transition: 'all 0.3s ease'
                }}>
                  <td style={{ padding: '12px 15px', border: '1px solid #e2e8f0', fontWeight: 'bold', color: '#334155' }}>
                    {test.testName}
                  </td>
                  <td style={{ 
                    padding: '12px 15px', 
                    border: '1px solid #e2e8f0',
                    color: test.status === 'High' || test.status === 'Low' ? '#dc2626' : '#059669',
                    fontWeight: '600'
                  }}>
                    {test.result}
                  </td>
                  <td style={{ padding: '12px 15px', border: '1px solid #e2e8f0', color: '#334155' }}>
                    {test.unit || 'N/A'}
                  </td>
                  <td style={{ padding: '12px 15px', border: '1px solid #e2e8f0', fontSize: '13px', color: '#64748b' }}>
                    {test.referenceRange || 'N/A'}
                  </td>
                  <td style={{ padding: '12px 15px', border: '1px solid #e2e8f0' }}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: test.status === 'Normal' ? '#dcfce7' : 
                                     test.status === 'High' ? '#fee2e2' : 
                                     test.status === 'Low' ? '#fef3c7' : '#f1f5f9',
                      color: test.status === 'Normal' ? '#166534' : 
                             test.status === 'High' ? '#dc2626' : 
                             test.status === 'Low' ? '#d97706' : '#64748b',
                      border: `1px solid ${test.status === 'Normal' ? '#bbf7d0' : 
                                          test.status === 'High' ? '#fecaca' : 
                                          test.status === 'Low' ? '#fed7aa' : '#e2e8f0'}`
                    }}>
                      {test.status || 'Normal'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: '#64748b',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <p style={{ fontSize: '16px' }}>No test results available</p>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div style={{ marginBottom: '35px' }}>
        <h2 style={{ 
          background: 'linear-gradient(135deg, #2a7a8e 0%, #98d2e0 100%)', 
          padding: '12px 20px', 
          margin: '0 0 20px 0', 
          borderRadius: '8px',
          fontSize: '20px',
          color: 'white',
          fontWeight: '600',
          boxShadow: '0 4px 12px rgba(42, 122, 142, 0.2)'
        }}>
          Recommendations
        </h2>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f0f9ff', 
          borderRadius: '8px',
          border: '1px solid #bae6fd',
          lineHeight: '1.6',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
        }}>
          <p style={{ margin: '0', color: '#1e40af', fontSize: '15px' }}>
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
