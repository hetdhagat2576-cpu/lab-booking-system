const { generatePdf } = require('html-pdf-node');

/**
 * Generates a Lab Report PDF buffer using html-pdf-node
 * @param {Object} report - The report data object
 */
const generateReportPDF = async (report) => {
  try {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Lab Report - ${report.packageName || 'Lab Test'}</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; color: #333; line-height: 1.5; }
          .header { text-align: center; border-bottom: 2px solid #444; padding-bottom: 10px; margin-bottom: 30px; }
          .section-title { background: #f4f4f4; padding: 5px 10px; font-size: 1.1em; border-left: 4px solid #007bff; margin-top: 20px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 0.9em; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          th { background-color: #007bff; color: white; }
          .abnormal { color: #d9534f; font-weight: bold; }
          .footer { margin-top: 50px; text-align: center; font-size: 0.8em; color: #777; border-top: 1px solid #eee; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>LABORATORY REPORT</h1>
          <p>Report ID: ${report._id || 'N/A'}</p>
        </div>
        
        <div class="info-grid">
          <div>
            <div class="section-title">Patient Information</div>
            <p><strong>Name:</strong> ${report.patientId?.name || 'N/A'}<br>
            <strong>Email:</strong> ${report.patientId?.email || 'N/A'}<br>
            <strong>Phone:</strong> ${report.patientId?.phone || 'N/A'}</p>
          </div>
          <div>
            <div class="section-title">Test Details</div>
            <p><strong>Package:</strong> ${report.packageName || 'Lab Test'}<br>
            <strong>Date:</strong> ${new Date(report.testDate || report.createdAt).toLocaleDateString()}<br>
            <strong>Status:</strong> ${report.status}</p>
          </div>
        </div>

        <div class="test-results">
          <div class="section-title">Test Results</div>
          <table>
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
              ${report.selectedTests?.map(test => `
                <tr class="${test.status === 'High' || test.status === 'Low' ? 'abnormal' : ''}">
                  <td>${test.name}</td>
                  <td>${test.result}</td>
                  <td>${test.unit || 'N/A'}</td>
                  <td>${test.referenceRange || 'N/A'}</td>
                  <td>${test.status || 'Normal'}</td>
                </tr>
              `).join('') || '<tr><td colspan="5">No test results available</td></tr>'}
            </tbody>
          </table>
        </div>
        
        <div class="summary">
          <div class="section-title">Summary</div>
          <p>${report.summary || 'No summary provided.'}</p>
        </div>
        
        <div class="recommendations">
          <div class="section-title">Recommendations</div>
          <p>${report.recommendations || 'No specific recommendations.'}</p>
        </div>
        
        <div class="footer">
          <p>This is a digitally generated report by the Lab Booking System.</p>
          <p>Generated on: ${new Date().toLocaleString()} | Page 1 of 1</p>
        </div>
      </body>
      </html>
    `;

    const options = {
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    };

    // Generate PDF using html-pdf-node
    const pdfBuffer = await generatePdf({ content: htmlContent }, options);
    return pdfBuffer;
    
  } catch (error) {
    console.error('CRITICAL: PDF Generation Failed:', error);
    // Return a fallback buffer so the server doesn't crash
    throw new Error('Failed to generate PDF report. Please try again later.');
  }
};

module.exports = {
  generateReportPDF
};