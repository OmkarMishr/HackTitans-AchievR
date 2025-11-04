const sgMail = require('@sendgrid/mail');
const fs = require('fs');
const path = require('path');

// Initialize SendGrid
const apiKey = process.env.SENDGRID_API_KEY;
const fromEmail = process.env.SENDGRID_FROM_EMAIL;

if (!apiKey || !fromEmail) {
  console.error('❌ Missing SendGrid configuration!');
  console.error('Required: SENDGRID_API_KEY and SENDGRID_FROM_EMAIL in .env');
}

sgMail.setApiKey(apiKey);

class EmailService {
  
  // ========== SEND CERTIFICATE EMAIL ==========
  async sendCertificateEmail(studentEmail, studentName, certificateData) {
    try {
      console.log(`\n📧 SENDING CERTIFICATE EMAIL`);
      console.log(`   To: ${studentEmail}`);
      console.log(`   Student: ${studentName}`);

      const {
        certificateId,
        certificatePath,
        achievement,
        organizingBody,
        eventDate,
        achievementLevel,
        verificationCode
      } = certificateData;

      // Read PDF file
      if (!fs.existsSync(certificatePath)) {
        throw new Error(`Certificate file not found: ${certificatePath}`);
      }

      console.log(`   File: ${certificatePath}`);

      const pdfBuffer = fs.readFileSync(certificatePath);
      const base64PDF = pdfBuffer.toString('base64');
      const fileSize = (pdfBuffer.length / 1024).toFixed(2);

      console.log(`   PDF Size: ${fileSize} KB`);

      const emailContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #1f40af 0%, #152d7a 100%); color: white; padding: 40px 20px; text-align: center; }
            .header h1 { font-size: 32px; margin-bottom: 10px; font-weight: 600; }
            .header p { font-size: 16px; opacity: 0.9; }
            .content { padding: 30px 20px; }
            .greeting { font-size: 16px; color: #333; margin-bottom: 20px; }
            .achievement-box { 
              background: linear-gradient(135deg, #f0f4ff 0%, #e8ecff 100%); 
              border-left: 5px solid #1f40af; 
              padding: 20px; 
              margin: 20px 0; 
              border-radius: 5px; 
            }
            .achievement-box h3 { color: #1f40af; margin-bottom: 10px; font-size: 18px; }
            .achievement-box p { color: #333; margin: 8px 0; font-size: 15px; }
            .achievement-box strong { color: #1f40af; }
            .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
            .detail-item { background: #f9f9f9; padding: 12px; border-radius: 5px; border-left: 3px solid #1f40af; }
            .detail-item strong { color: #1f40af; display: block; font-size: 11px; text-transform: uppercase; margin-bottom: 5px; letter-spacing: 0.5px; }
            .detail-item span { color: #333; font-size: 14px; font-weight: 500; }
            .cert-id { 
              background: #f0f0f0; 
              padding: 12px; 
              border-radius: 5px; 
              font-family: 'Courier New', monospace; 
              font-size: 12px; 
              word-break: break-all; 
              border: 1px solid #ddd; 
              margin: 10px 0; 
              color: #1f40af;
              font-weight: bold;
            }
            .button-container { text-align: center; margin: 30px 0; }
            .button { 
              display: inline-block; 
              background: linear-gradient(135deg, #1f40af 0%, #152d7a 100%); 
              color: white; 
              padding: 14px 40px; 
              text-decoration: none; 
              border-radius: 5px; 
              font-weight: 600; 
              margin: 0 10px;
              font-size: 14px;
              transition: opacity 0.3s;
            }
            .button:hover { opacity: 0.9; }
            .features { background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .features h4 { color: #1f40af; margin-bottom: 12px; font-size: 16px; }
            .features ul { list-style: none; }
            .features li { padding: 8px 0; padding-left: 25px; position: relative; color: #333; font-size: 14px; }
            .features li:before { content: '✓'; position: absolute; left: 0; color: #1f40af; font-weight: bold; font-size: 16px; }
            .info-box { 
              background: #f9f9f9; 
              padding: 15px; 
              border-radius: 5px; 
              margin: 20px 0; 
              border-left: 4px solid #1f40af;
            }
            .info-box p { font-size: 13px; color: #333; margin: 0; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd; }
            .footer p { font-size: 12px; color: #666; margin: 5px 0; }
            .footer .copyright { font-size: 11px; color: #bbb; margin-top: 10px; }
            @media (max-width: 600px) {
              .details-grid { grid-template-columns: 1fr; }
              .header h1 { font-size: 24px; }
              .button { padding: 12px 30px; font-size: 13px; display: block; margin: 10px 0; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            
            <!-- HEADER -->
            <div class="header">
              <h1>🎓 Congratulations!</h1>
              <p>Your Certificate Has Been Generated</p>
            </div>

            <!-- CONTENT -->
            <div class="content">
              <p class="greeting">Dear <strong>${studentName}</strong>,</p>
              
              <p style="margin: 15px 0; color: #333;">We are pleased to inform you that your achievement has been officially verified and certified. Your certificate is now ready for download and sharing with employers and educational institutions!</p>

              <!-- ACHIEVEMENT BOX -->
              <div class="achievement-box">
                <h3>🏆 Your Achievement</h3>
                <p><strong>${achievement}</strong></p>
                ${organizingBody ? `<p><strong>Organized by:</strong> ${organizingBody}</p>` : ''}
                ${achievementLevel ? `<p><strong>Level:</strong> ${achievementLevel}</p>` : ''}
                ${eventDate ? `<p><strong>Event Date:</strong> ${new Date(eventDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>` : ''}
              </div>

              <!-- CERTIFICATE DETAILS -->
              <h3 style="color: #1f40af; margin-top: 25px; margin-bottom: 10px; font-size: 16px;">📋 Certificate Information</h3>
              <div class="cert-id">${certificateId}</div>
              <p style="font-size: 12px; color: #666; margin-top: 8px;">💾 Save this Certificate ID for future reference and verification</p>

              <!-- DETAILS GRID -->
              <div class="details-grid">
                <div class="detail-item">
                  <strong>Status</strong>
                  <span>✅ Verified & Active</span>
                </div>
                <div class="detail-item">
                  <strong>Issued Date</strong>
                  <span>${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
              </div>

              <!-- FEATURES -->
              <div class="features">
                <h4>✨ What You Can Do Now</h4>
                <ul>
                  <li><strong>Download:</strong> Get the attached PDF certificate</li>
                  <li><strong>Share:</strong> Post on LinkedIn, add to resume</li>
                  <li><strong>Verify:</strong> Scan the QR code in the certificate</li>
                  <li><strong>Prove:</strong> Show recruiters your achievement</li>
                  <li><strong>Keep:</strong> Permanent digital proof</li>
                </ul>
              </div>

              <!-- BUTTONS -->
              <div class="button-container">
                <a href="${process.env.APP_URL}/certificates/verify/${certificateId}" class="button">🔗 Verify Certificate</a>
                <a href="${process.env.APP_URL}/dashboard/student" class="button">📊 View Dashboard</a>
              </div>

              <!-- INFO BOX -->
              <div class="info-box">
                <p>
                  <strong>💡 Tip:</strong> Anyone can verify this certificate online using the Certificate ID or by scanning the QR code embedded in your PDF. Your achievement is now permanently recorded in our secure system.
                </p>
              </div>
            </div>

            <!-- FOOTER -->
            <div class="footer">
              <p><strong>AchievR</strong></p>
              <p>Centralized Digital Platform for Student Activity Records</p>
              <p style="margin-top: 15px; font-size: 11px; color: #bbb;">This is an automated email. Please do not reply.</p>
              <p class="copyright">© 2025 AchievR. All rights reserved.</p>
            </div>

          </div>
        </body>
        </html>
      `;

      // Send email with attachment via SendGrid
      const msg = {
        to: studentEmail,
        from: fromEmail,
        subject: `🎓 Official Certificate - ${achievement}`,
        html: emailContent,
        attachments: [
          {
            content: base64PDF,
            filename: `${certificateId}.pdf`,
            type: 'application/pdf',
            disposition: 'attachment'
          }
        ]
      };

      console.log(`   Sending via SendGrid...`);
      const result = await sgMail.send(msg);
      
      const messageId = result[0].headers['x-message-id'];
      console.log(`✅ Email sent successfully`);
      console.log(`   Message ID: ${messageId}`);

      return { 
        success: true, 
        messageId: messageId,
        message: 'Certificate emailed successfully'
      };

    } catch (error) {
      console.error('❌ SendGrid Error:', error.message);
      if (error.response) {
        console.error('   Response Status:', error.response.status);
        console.error('   Response Body:', error.response.body);
      }
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  // ========== SEND CONSOLIDATED CERTIFICATES EMAIL ==========
  async sendConsolidatedCertificatesEmail(studentEmail, studentName, certificates, certificatesList) {
    try {
      console.log(`\n📧 SENDING CONSOLIDATED EMAIL`);
      console.log(`   To: ${studentEmail}`);
      console.log(`   Certificates: ${certificates.length}`);

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }
            .container { max-width: 800px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #1f40af 0%, #152d7a 100%); color: white; padding: 40px 20px; text-align: center; }
            .header h1 { font-size: 32px; margin-bottom: 10px; }
            .header p { font-size: 16px; opacity: 0.9; }
            .content { padding: 30px 20px; }
            .cert-list { margin: 20px 0; }
            .cert-item { 
              background: linear-gradient(135deg, #f0f4ff 0%, #e8ecff 100%); 
              border-left: 5px solid #1f40af; 
              padding: 15px; 
              margin: 10px 0; 
              border-radius: 5px;
            }
            .cert-item h4 { color: #1f40af; margin-bottom: 5px; font-size: 15px; }
            .cert-item p { color: #333; font-size: 13px; margin: 3px 0; }
            .cert-id { background: #f0f0f0; padding: 8px; border-radius: 3px; font-family: monospace; font-size: 11px; margin-top: 5px; color: #1f40af; font-weight: bold; }
            .stats { background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .stats h3 { color: #1f40af; margin-bottom: 10px; }
            .stats p { font-size: 18px; font-weight: bold; color: #1f40af; }
            .features { background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .features h4 { color: #1f40af; margin-bottom: 10px; }
            .features ul { list-style: none; }
            .features li { padding: 6px 0; padding-left: 20px; position: relative; color: #333; font-size: 13px; }
            .features li:before { content: '✓'; position: absolute; left: 0; color: #1f40af; font-weight: bold; }
            .button { display: inline-block; background: #1f40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 10px 0; font-weight: bold; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            
            <div class="header">
              <h1>🎓 Your Certificates Are Ready!</h1>
              <p>Multiple achievements, one email</p>
            </div>

            <div class="content">
              <p>Dear <strong>${studentName}</strong>,</p>
              
              <p style="margin: 15px 0; color: #333;">
                We are pleased to send you <strong>${certificates.length} certificate(s)</strong> for your verified achievements. 
                Each certificate is secured with a QR code for instant verification.
              </p>

              <div class="stats">
                <h3>📊 Your Certificates</h3>
                <p>${certificates.length} Achievements Certified</p>
              </div>

              <div class="cert-list">
                <h3 style="color: #1f40af; margin-bottom: 15px;">📜 Certificate List</h3>
                ${certificatesList}
              </div>

              <div class="features">
                <h4>✨ What's Next?</h4>
                <ul>
                  <li>Download the attached certificates</li>
                  <li>Share on LinkedIn and your resume</li>
                  <li>Each PDF contains a QR code for verification</li>
                  <li>All certificates are permanently recorded</li>
                </ul>
              </div>

              <div style="text-align: center;">
                <a href="${process.env.APP_URL}/dashboard/student" class="button">View My Dashboard</a>
              </div>
            </div>

            <div class="footer">
              <p><strong>AchievR</strong> - Credential Verification System</p>
              <p>© 2025 AchievR. All rights reserved.</p>
            </div>

          </div>
        </body>
        </html>
      `;

      const msg = {
        to: studentEmail,
        from: fromEmail,
        subject: `🎓 ${certificates.length} Certificate(s) - Your Achievements!`,
        html: htmlContent,
        attachments: certificates.map(cert => ({
          content: fs.readFileSync(cert.pdfPath).toString('base64'),
          filename: `${cert.certificateId}.pdf`,
          type: 'application/pdf',
          disposition: 'attachment'
        }))
      };

      console.log(`   Attaching ${certificates.length} PDFs...`);
      console.log(`   Sending via SendGrid...`);
      
      const result = await sgMail.send(msg);
      
      const messageId = result[0].headers['x-message-id'];
      console.log(`✅ Consolidated email sent successfully`);
      console.log(`   Message ID: ${messageId}`);
      
      return { 
        success: true, 
        messageId: messageId
      };

    } catch (error) {
      console.error('❌ Error sending consolidated email:', error.message);
      if (error.response) {
        console.error('   Response Body:', error.response.body);
      }
      return { 
        success: false, 
        error: error.message 
      };
    }
  }

  // ========== SEND APPROVAL NOTIFICATION ==========
  async sendApprovalEmail(studentEmail, studentName, achievement) {
    try {
      console.log(`\n📧 SENDING APPROVAL EMAIL`);
      console.log(`   To: ${studentEmail}`);

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: linear-gradient(135deg, #5cb85c 0%, #449d44 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { font-size: 28px; margin: 0; }
            .content { padding: 30px; }
            .success-box { background: #d4edda; border-left: 4px solid #28a745; padding: 15px; margin: 15px 0; border-radius: 5px; color: #155724; }
            .success-box strong { display: block; margin-bottom: 5px; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ Application Approved!</h1>
            </div>
            <div class="content">
              <p>Dear ${studentName},</p>
              <div class="success-box">
                <strong>🎉 Great News!</strong>
                "${achievement}" has been approved and verified!
              </div>
              <p>Your certificate will be generated and sent to your email within the next 24 hours. Keep an eye on your inbox!</p>
            </div>
            <div class="footer">
              <p><strong>AchievR</strong> - Credential Verification System</p>
              <p>© 2025 AchievR. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const msg = {
        to: studentEmail,
        from: fromEmail,
        subject: '✅ Application Approved! Certificate Coming Soon',
        html: html
      };

      console.log(`   Sending via SendGrid...`);
      await sgMail.send(msg);
      console.log(`✅ Approval email sent`);
      return { success: true };

    } catch (error) {
      console.error('❌ Error:', error.message);
      return { success: false, error: error.message };
    }
  }

  // ========== SEND REJECTION EMAIL ==========
  async sendRejectionEmail(studentEmail, studentName, reason) {
    try {
      console.log(`\n📧 SENDING REJECTION EMAIL`);
      console.log(`   To: ${studentEmail}`);

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: linear-gradient(135deg, #d9534f 0%, #ac2925 100%); color: white; padding: 30px; text-align: center; }
            .header h1 { font-size: 28px; margin: 0; }
            .content { padding: 30px; }
            .alert-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; border-radius: 5px; color: #856404; }
            .alert-box strong { display: block; margin-bottom: 5px; }
            .button { display: inline-block; background: #1f40af; color: white; padding: 10px 25px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>❌ Application Status</h1>
            </div>
            <div class="content">
              <p>Dear ${studentName},</p>
              <div class="alert-box">
                <strong>Application Rejected</strong>
                <p style="margin: 10px 0 0 0;">${reason}</p>
              </div>
              <p>You can resubmit your application with the necessary corrections and improvements.</p>
              <a href="${process.env.APP_URL}/submit-activity" class="button">Resubmit Application</a>
            </div>
            <div class="footer">
              <p><strong>AchievR</strong> - Credential Verification System</p>
              <p>© 2025 AchievR. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const msg = {
        to: studentEmail,
        from: fromEmail,
        subject: '❌ Application Rejected - Please Review',
        html: html
      };

      console.log(`   Sending via SendGrid...`);
      await sgMail.send(msg);
      console.log(`✅ Rejection email sent`);
      return { success: true };

    } catch (error) {
      console.error('❌ Error:', error.message);
      return { success: false, error: error.message };
    }
  }

  // ========== SEND FACULTY NOTIFICATION ==========
  async sendFacultyNotificationEmail(facultyEmail, facultyName, studentName, activityTitle) {
    try {
      console.log(`\n📧 SENDING FACULTY NOTIFICATION`);
      console.log(`   To: ${facultyEmail}`);

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; }
            .header { background: linear-gradient(135deg, #1f40af 0%, #152d7a 100%); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .info-box { background: #f9f9f9; border-left: 4px solid #1f40af; padding: 15px; margin: 15px 0; border-radius: 5px; }
            .button { display: inline-block; background: #1f40af; color: white; padding: 10px 25px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📋 New Activity for Review</h1>
            </div>
            <div class="content">
              <p>Dear ${facultyName},</p>
              <div class="info-box">
                <strong>Student:</strong> ${studentName}<br>
                <strong>Activity:</strong> ${activityTitle}<br>
                <strong>Status:</strong> Pending Review
              </div>
              <p>A new student activity has been submitted and is awaiting your review and approval.</p>
              <a href="${process.env.APP_URL}/dashboard/faculty" class="button">Review Activity</a>
            </div>
            <div class="footer">
              <p><strong>AchievR</strong> - Credential Verification System</p>
            </div>
          </div>
        </body>
        </html>
      `;

      const msg = {
        to: facultyEmail,
        from: fromEmail,
        subject: `📋 New Activity Pending Review - ${studentName}`,
        html: html
      };

      console.log(`   Sending via SendGrid...`);
      await sgMail.send(msg);
      console.log(`✅ Faculty notification sent`);
      return { success: true };

    } catch (error) {
      console.error('❌ Error:', error.message);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
