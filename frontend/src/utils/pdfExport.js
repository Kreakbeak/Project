export const downloadReportPDF = (report, filename = 'report') => {
  // Load html2pdf library from CDN and generate PDF
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
  
  script.onload = () => {
    // Create a container with the report content
    const element = document.createElement('div');
    
    // Build HTML content with all details
    let htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 800px; margin: 0 auto;">
        <h1 style="color: #16a34a; border-bottom: 3px solid #16a34a; padding-bottom: 10px; text-align: center;">📋 Pest & Disease Report</h1>
        
        <div style="margin-bottom: 25px; border-bottom: 2px solid #e5e7eb; padding-bottom: 15px; page-break-inside: avoid;">
          <h2 style="color: #16a34a; margin-top: 10px; border-left: 4px solid #16a34a; padding-left: 10px;">Report Information</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background: #f9fafb;">
              <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Report ID:</strong></td>
              <td style="padding: 8px; border: 1px solid #e5e7eb;">${report._id}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Submitted Date:</strong></td>
              <td style="padding: 8px; border: 1px solid #e5e7eb;">${new Date(report.createdAt).toLocaleDateString()}</td>
            </tr>
            <tr style="background: #f9fafb;">
              <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Crop Type:</strong></td>
              <td style="padding: 8px; border: 1px solid #e5e7eb;">${report.cropType}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Location:</strong></td>
              <td style="padding: 8px; border: 1px solid #e5e7eb;">${report.location}</td>
            </tr>
            <tr style="background: #f9fafb;">
              <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Status:</strong></td>
              <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong style="color: ${getStatusColor(report.status)}">${report.status}</strong></td>
            </tr>
          </table>
        </div>

        ${report.farmerId ? `
          <div style="margin-bottom: 25px; border-bottom: 2px solid #e5e7eb; padding-bottom: 15px; page-break-inside: avoid;">
            <h2 style="color: #16a34a; margin-top: 10px; border-left: 4px solid #16a34a; padding-left: 10px;">Farmer Information</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="background: #f9fafb;">
                <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Name:</strong></td>
                <td style="padding: 8px; border: 1px solid #e5e7eb;">${report.farmerId.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Email:</strong></td>
                <td style="padding: 8px; border: 1px solid #e5e7eb;">${report.farmerId.email}</td>
              </tr>
              <tr style="background: #f9fafb;">
                <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Phone:</strong></td>
                <td style="padding: 8px; border: 1px solid #e5e7eb;">${report.farmerId.phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #e5e7eb;"><strong>Location:</strong></td>
                <td style="padding: 8px; border: 1px solid #e5e7eb;">${report.farmerId.location}</td>
              </tr>
            </table>
          </div>
        ` : ''}

        <div style="margin-bottom: 25px; border-bottom: 2px solid #e5e7eb; padding-bottom: 15px; page-break-inside: avoid;">
          <h2 style="color: #16a34a; margin-top: 10px; border-left: 4px solid #16a34a; padding-left: 10px;">Problem Description</h2>
          <div style="background: #f9fafb; padding: 12px; border-left: 4px solid #0ea5e9; border-radius: 4px; margin-bottom: 12px;">
            <p style="white-space: pre-wrap; margin: 0; line-height: 1.6;">${escapeHtml(report.description)}</p>
          </div>
          ${report.imagePath ? `
            <div style="margin-top: 15px; page-break-inside: avoid; page-break-after: avoid;">
              <p><strong>📸 Report Image:</strong></p>
              <img src="http://localhost:5000${report.imagePath}" alt="Report image" style="max-width: 100%; width: 100%; height: auto; border: 1px solid #e5e7eb; border-radius: 4px; margin-top: 8px; display: block;" />
            </div>
          ` : ''}
        </div>

        ${report.referredPestId ? `
          <div style="margin-bottom: 25px; border-bottom: 2px solid #e5e7eb; padding-bottom: 15px; background: #f0fdf4; padding: 15px; border-radius: 4px; page-break-inside: avoid;">
            <h2 style="color: #16a34a; margin-top: 0; border-left: 4px solid #16a34a; padding-left: 10px;">Identified Pest/Disease</h2>
            <h3 style="color: #16a34a; margin-top: 10px;">${report.referredPestId.name}</h3>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 12px; page-break-inside: avoid;">
              <tr style="background: #d1fae5;">
                <td style="padding: 8px; border: 1px solid #a7f3d0;"><strong>Type:</strong></td>
                <td style="padding: 8px; border: 1px solid #a7f3d0;">${report.referredPestId.type}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #a7f3d0;"><strong>Crop Type:</strong></td>
                <td style="padding: 8px; border: 1px solid #a7f3d0;">${report.referredPestId.cropType}</td>
              </tr>
            </table>

            ${report.referredPestId.description ? `
              <div style="margin-bottom: 12px;">
                <strong style="color: #16a34a;">Description:</strong>
                <p style="background: #fff; padding: 8px; border-left: 3px solid #16a34a; margin: 6px 0 0 0; line-height: 1.5;">${escapeHtml(report.referredPestId.description)}</p>
              </div>
            ` : ''}

            ${report.referredPestId.symptoms ? `
              <div style="margin-bottom: 12px;">
                <strong style="color: #16a34a;">Symptoms:</strong>
                <p style="background: #fff; padding: 8px; border-left: 3px solid #16a34a; margin: 6px 0 0 0; white-space: pre-wrap; line-height: 1.5;">${escapeHtml(report.referredPestId.symptoms)}</p>
              </div>
            ` : ''}

            ${report.referredPestId.treatment ? `
              <div style="margin-bottom: 12px;">
                <strong style="color: #16a34a;">Treatment:</strong>
                <p style="background: #fff; padding: 8px; border-left: 3px solid #16a34a; margin: 6px 0 0 0; white-space: pre-wrap; line-height: 1.5;">${escapeHtml(report.referredPestId.treatment)}</p>
              </div>
            ` : ''}

            ${report.referredPestId.prevention ? `
              <div style="margin-bottom: 12px;">
                <strong style="color: #16a34a;">Prevention:</strong>
                <p style="background: #fff; padding: 8px; border-left: 3px solid #16a34a; margin: 6px 0 0 0; white-space: pre-wrap; line-height: 1.5;">${escapeHtml(report.referredPestId.prevention)}</p>
              </div>
            ` : ''}

            ${report.referredPestId.imagePath ? `
              <div style="margin-top: 15px; padding: 12px; background: #fff; border-radius: 4px; page-break-inside: avoid; page-break-after: avoid;">
                <p><strong>📸 Pest/Disease Image:</strong></p>
                <img src="http://localhost:5000${report.referredPestId.imagePath}" alt="Pest/Disease image" style="max-width: 100%; width: 100%; height: auto; border: 1px solid #a7f3d0; border-radius: 4px; margin-top: 8px; display: block;" />
              </div>
            ` : ''}
          </div>
        ` : ''}

        ${report.treatment ? `
          <div style="margin-bottom: 25px; border-bottom: 2px solid #e5e7eb; padding-bottom: 15px; page-break-inside: avoid;">
            <h2 style="color: #16a34a; margin-top: 10px; border-left: 4px solid #16a34a; padding-left: 10px;">Treatment Recommendation</h2>
            <div style="background: #e3f2fd; padding: 15px; border-left: 4px solid #2196F3; border-radius: 4px;">
              <p style="white-space: pre-wrap; margin: 0; line-height: 1.6;">${escapeHtml(report.treatment)}</p>
            </div>
          </div>
        ` : ''}

        <div style="margin-top: 30px; text-align: center; border-top: 2px solid #e5e7eb; padding-top: 15px;">
          <p style="color: #94a3b8; font-size: 11px; margin: 0;">
            Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()} | Pest & Disease Reporting System
          </p>
        </div>
      </div>
    `;

    element.innerHTML = htmlContent;

    // Configure PDF options
    const opt = {
      margin: [12, 10, 12, 10],
      filename: `${filename}-${report._id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        allowTaint: true, 
        useCORS: true,
        logging: false,
        windowHeight: 1400
      },
      jsPDF: { 
        orientation: 'portrait', 
        unit: 'mm', 
        format: 'a4',
        compress: true
      }
    };

    // Generate PDF
    window.html2pdf().set(opt).from(element).save();
  };

  document.head.appendChild(script);
};

// Helper function to escape HTML special characters
const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
};

// Helper function to get status color
const getStatusColor = (status) => {
  switch (status) {
    case 'Pending':
      return '#f59e0b';
    case 'Identified':
      return '#8b5cf6';
    case 'Resolved':
      return '#16a34a';
    default:
      return '#6b7280';
  }
};
