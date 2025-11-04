const sgMail = require('@sendgrid/mail');
const fs = require('fs');
const path = require('path');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class EmailService {
  
  // ========== SEND ACTIVITY APPROVED EMAIL ==========
  async sendActivityApprovedEmail(student, activity) {
    try {
      console.log(`\n📧 SENDING ACTIVITY APPROVAL EMAIL`);
      console.log(`   To: ${student.email}`);
      console.log(`   Student: ${student.name}`);
      console.log(`   Activity: ${activity.title}`);

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #5cb85c 0%, #449d44 100%); color: white; padding: 40px 20px; text-align: center; }
            .header h1 { font-size: 32px; margin-bottom: 10px; }
            .header p { font-size: 16px; opacity: 0.9; }
            .content { padding: 30px 20px; }
            .success-box { background: #d4edda; border-left: 4px solid #28a745; padding: 20px; margin: 20px 0; border-radius: 5px; color: #155724; }
            .success-box h3 { margin-bottom: 10px; }
            .activity-details { background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .detail-row:last-child { border-bottom: none; }
            .detail-label { font-weight: bold; color: #666; }
            .detail-value { color: #333; }
            .button { display: inline-block; background: #5cb85c; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 15px; font-weight: bold; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            
            <div class="header">
              <h1>✅ Activity Approved!</h1>
              <p>Your submission has been verified</p>
            </div>

            <div class="content">
              <p>Dear <strong>${student.name}</strong>,</p>
              
              <div class="success-box">
                <h3>🎉 Great News!</h3>
                <p>Your activity submission has been <strong>approved</strong> by the faculty!</p>
              </div>

              <h3 style="color: #333; margin-top: 20px;">📋 Activity Details</h3>
              <div class="activity-details">
                <div class="detail-row">
                  <span class="detail-label">Activity Title:</span>
                  <span class="detail-value">${activity.title}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Category:</span>
                  <span class="detail-value">${activity.category}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Achievement Level:</span>
                  <span class="detail-value">${activity.achievementLevel}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Organization:</span>
                  <span class="detail-value">${activity.organizingBody || 'N/A'}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Status:</span>
                  <span class="detail-value" style="color: green; font-weight: bold;">✅ Approved</span>
                </div>
              </div>

              <p style="margin-top: 20px; color: #666;">
                Your certificate will be generated shortly and sent to you via email. 
                You'll be able to download and share it on your resume and LinkedIn profile.
              </p>

              <a href="${process.env.APP_URL}/dashboard/student" class="button">View Dashboard</a>
            </div>

            <div class="footer">
              <p><strong>AchievR</strong> - Credential Verification System</p>
              <p style="margin-top: 10px;">© 2025 AchievR. All rights reserved.</p>
            </div>

          </div>
        </body>
        </html>
      `;

      const msg = {
        to: student.email,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: `✅ Activity Approved - ${activity.title}`,
        html: htmlContent
      };

      console.log(`   Sending via SendGrid...`);
      const result = await sgMail.send(msg);
      const messageId = result[0].headers['x-message-id'];
      
      console.log(`✅ Email sent successfully`);
      console.log(`   Message ID: ${messageId}\n`);

      return { success: true, messageId };

    } catch (error) {
      console.error('❌ SendGrid Error:', error.message);
      if (error.response) {
        console.error('   Status:', error.response.status);
        console.error('   Body:', error.response.body);
      }
      return { success: false, error: error.message };
    }
  }

  // ========== SEND ACTIVITY REJECTED EMAIL ==========
  async sendActivityRejectedEmail(student, activity, reason) {
    try {
      console.log(`\n📧 SENDING ACTIVITY REJECTION EMAIL`);
      console.log(`   To: ${student.email}`);
      console.log(`   Student: ${student.name}`);
      console.log(`   Activity: ${activity.title}`);

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #f0ad4e 0%, #ec971f 100%); color: white; padding: 40px 20px; text-align: center; }
            .header h1 { font-size: 32px; margin-bottom: 10px; }
            .header p { font-size: 16px; opacity: 0.9; }
            .content { padding: 30px 20px; }
            .alert-box { background: #fcf8e3; border-left: 4px solid #f0ad4e; padding: 20px; margin: 20px 0; border-radius: 5px; color: #8a6d3b; }
            .alert-box h3 { margin-bottom: 10px; }
            .reason-box { background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 3px solid #f0ad4e; }
            .reason-box strong { display: block; color: #f0ad4e; margin-bottom: 10px; }
            .button { display: inline-block; background: #f0ad4e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 15px; font-weight: bold; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            
            <div class="header">
              <h1>📋 Activity Needs Revision</h1>
              <p>Your submission requires some changes</p>
            </div>

            <div class="content">
              <p>Dear <strong>${student.name}</strong>,</p>
              
              <div class="alert-box">
                <h3>⚠️ Feedback Required</h3>
                <p>Your activity submission has been reviewed and requires some revisions before approval.</p>
              </div>

              <div class="reason-box">
                <strong>Reason for Rejection:</strong>
                <p>${reason}</p>
              </div>

              <p style="margin-top: 20px; color: #666;">
                Please review the feedback above and submit a revised version of your activity. 
                Make sure to address all the points mentioned in the rejection reason.
              </p>

              <a href="${process.env.APP_URL}/submit-activity" class="button">Resubmit Activity</a>

              <p style="margin-top: 20px; font-size: 13px; color: #999;">
                If you have any questions, please contact the faculty or administrator.
              </p>
            </div>

            <div class="footer">
              <p><strong>AchievR</strong> - Credential Verification System</p>
              <p style="margin-top: 10px;">© 2025 AchievR. All rights reserved.</p>
            </div>

          </div>
        </body>
        </html>
      `;

      const msg = {
        to: student.email,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: `📋 Activity Rejected - ${activity.title}`,
        html: htmlContent
      };

      console.log(`   Sending via SendGrid...`);
      const result = await sgMail.send(msg);
      const messageId = result[0].headers['x-message-id'];
      
      console.log(`✅ Email sent successfully`);
      console.log(`   Message ID: ${messageId}\n`);

      return { success: true, messageId };

    } catch (error) {
      console.error('❌ SendGrid Error:', error.message);
      if (error.response) {
        console.error('   Status:', error.response.status);
        console.error('   Body:', error.response.body);
      }
      return { success: false, error: error.message };
    }
  }

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

      if (!fs.existsSync(certificatePath)) {
        throw new Error(`Certificate file not found: ${certificatePath}`);
      }

      const pdfBuffer = fs.readFileSync(certificatePath);
      const base64PDF = pdfBuffer.toString('base64');

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #1f40af 0%, #152d7a 100%); color: white; padding: 40px 20px; text-align: center; }
            .header h1 { font-size: 32px; margin-bottom: 10px; }
            .header p { font-size: 16px; opacity: 0.9; }
            .content { padding: 30px 20px; }
            .achievement-box { background: linear-gradient(135deg, #f0f4ff 0%, #e8ecff 100%); border-left: 5px solid #1f40af; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .achievement-box h3 { color: #1f40af; margin-bottom: 10px; }
            .achievement-box p { color: #333; margin: 8px 0; }
            .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
            .detail-item { background: #f9f9f9; padding: 12px; border-radius: 5px; border-left: 3px solid #1f40af; }
            .detail-item strong { color: #1f40af; display: block; font-size: 11px; text-transform: uppercase; margin-bottom: 5px; }
            .detail-item span { color: #333; font-size: 14px; }
            .cert-id { background: #f0f0f0; padding: 12px; border-radius: 5px; font-family: 'Courier New', monospace; font-size: 12px; word-break: break-all; border: 1px solid #ddd; margin: 10px 0; color: #1f40af; font-weight: bold; }
            .features { background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0; }
            .features h4 { color: #1f40af; margin-bottom: 10px; }
            .features ul { list-style: none; }
            .features li { padding: 8px 0; padding-left: 25px; position: relative; color: #333; }
            .features li:before { content: '✓'; position: absolute; left: 0; color: #1f40af; font-weight: bold; }
            .button-container { text-align: center; margin: 30px 0; }
            .button { display: inline-block; background: linear-gradient(135deg, #1f40af 0%, #152d7a 100%); color: white; padding: 14px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 0 10px; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            
            <div class="header">
              <h1>🎓 Congratulations!</h1>
              <p>Your Certificate Has Been Generated</p>
            </div>

            <div class="content">
              <p>Dear <strong>${studentName}</strong>,</p>
              
              <p style="margin: 15px 0; color: #333;">
                We are pleased to inform you that your achievement has been officially verified and certified. 
                Your certificate is now ready for download and sharing!
              </p>

              <div class="achievement-box">
                <h3>🏆 Your Achievement</h3>
                <p><strong>${achievement}</strong></p>
                ${organizingBody ? `<p><strong>Organized by:</strong> ${organizingBody}</p>` : ''}
                ${achievementLevel ? `<p><strong>Level:</strong> ${achievementLevel}</p>` : ''}
                ${eventDate ? `<p><strong>Date:</strong> ${new Date(eventDate).toLocaleDateString()}</p>` : ''}
              </div>

              <h3 style="color: #1f40af; margin-top: 25px;">📋 Certificate Information</h3>
              <div class="cert-id">${certificateId}</div>
              <p style="font-size: 12px; color: #666; margin-top: 8px;">💾 Save this Certificate ID for future reference</p>

              <div class="details-grid">
                <div class="detail-item">
                  <strong>Status</strong>
                  <span>✅ Verified & Active</span>
                </div>
                <div class="detail-item">
                  <strong>Issued Date</strong>
                  <span>${new Date().toLocaleDateString()}</span>
                </div>
              </div>

              <div class="features">
                <h4>✨ What You Can Do Now</h4>
                <ul>
                  <li><strong>Download:</strong> Get the attached PDF certificate</li>
                  <li><strong>Share:</strong> Post on LinkedIn, add to resume</li>
                  <li><strong>Verify:</strong> Scan the QR code in the certificate</li>
                  <li><strong>Prove:</strong> Show recruiters your achievement</li>
                </ul>
              </div>

              <div class="button-container">
                <a href="${process.env.APP_URL}/certificates/verify/${certificateId}" class="button">🔗 Verify</a>
                <a href="${process.env.APP_URL}/dashboard/student" class="button">📊 Dashboard</a>
              </div>
            </div>

            <div class="footer">
              <p><strong>AchievR</strong> - Credential Verification System</p>
              <p style="margin-top: 10px;">© 2025 AchievR. All rights reserved.</p>
            </div>

          </div>
        </body>
        </html>
      `;

      const msg = {
        to: studentEmail,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: `🎓 Official Certificate - ${achievement}`,
        html: htmlContent,
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
      console.log(`   Message ID: ${messageId}\n`);

      return { success: true, messageId };

    } catch (error) {
      console.error('❌ SendGrid Error:', error.message);
      if (error.response) {
        console.error('   Status:', error.response.status);
        console.error('   Body:', error.response.body);
      }
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
