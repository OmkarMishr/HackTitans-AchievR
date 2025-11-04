const sgMail = require('@sendgrid/mail');
const fs = require('fs');
const path = require('path');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class EmailService {
  
  async sendCertificateEmail(studentEmail, studentName, certificateData) {
    try {
      console.log(`\n📧 SENDING CERTIFICATE EMAIL`);
      console.log(`=`.repeat(70));
      console.log(`   To: ${studentEmail}`);
      console.log(`   Student: ${studentName}`);

      const {
        certificateId,
        certificatePath,
        achievement,
        description,
        organizingBody,
        eventDate,
        achievementLevel,
        verificationCode
      } = certificateData;

      // ✅ VALIDATE
      if (!studentEmail || !certificateId || !certificatePath) {
        throw new Error('Missing certificate email data');
      }

      console.log(`   Certificate ID: ${certificateId}`);
      console.log(`   File Path: ${certificatePath}`);

      // ✅ CHECK FILE EXISTS
      if (!fs.existsSync(certificatePath)) {
        console.error(`❌ PDF file does not exist: ${certificatePath}`);
        throw new Error(`Certificate file not found: ${certificatePath}`);
      }

      const fileSize = fs.statSync(certificatePath).size;
      console.log(`   File Size: ${(fileSize / 1024).toFixed(2)} KB`);

      // ✅ READ FILE AS BUFFER
      console.log('📖 Reading PDF file...');
      const pdfBuffer = fs.readFileSync(certificatePath);
      console.log(`✅ PDF buffer created (${(pdfBuffer.length / 1024).toFixed(2)} KB)`);

      // ✅ CONVERT TO BASE64
      const base64PDF = pdfBuffer.toString('base64');
      console.log(`✅ PDF converted to base64`);

      // ========== EMAIL CONTENT ==========
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #1f40af 0%, #152d7a 100%); color: white; padding: 40px 20px; text-align: center; }
            .header h1 { font-size: 28px; margin-bottom: 5px; }
            .header p { font-size: 14px; opacity: 0.9; }
            .content { padding: 30px 20px; }
            .achievement-box { background: linear-gradient(135deg, #f0f4ff 0%, #e8ecff 100%); border-left: 5px solid #1f40af; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .achievement-box h3 { color: #1f40af; margin-bottom: 10px; }
            .achievement-box p { color: #333; margin: 8px 0; }
            .cert-id { background: #f0f0f0; padding: 12px; border-radius: 5px; font-family: 'Courier New', monospace; font-size: 11px; word-break: break-all; border: 1px solid #ddd; margin: 10px 0; color: #1f40af; font-weight: bold; }
            .features { background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #1f40af; }
            .features h4 { color: #1f40af; margin-bottom: 10px; }
            .features ul { list-style: none; }
            .features li { padding: 8px 0; color: #333; }
            .features li:before { content: 'V'; margin-right: 10px; color: #1f40af; font-weight: bold; }
            .button { display: inline-block; background: linear-gradient(135deg, #1f40af 0%, #152d7a 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 10px 5px; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; border-top: 1px solid #ddd; font-size: 11px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Congratulations!</h1>
              <p>Your Certificate Has Been Generated</p>
            </div>

            <div class="content">
              <p>Dear <strong>${studentName}</strong>,</p>
              
              <p style="margin: 15px 0; color: #333; line-height: 1.6;">
                We are pleased to inform you that your achievement has been officially verified and certified. Your professional certificate is <strong>attached to this email</strong>.
              </p>

              <div class="achievement-box">
                <h3>Your Achievement</h3>
                <p><strong>${achievement || 'N/A'}</strong></p>
                ${organizingBody ? `<p><strong>Organized by:</strong> ${organizingBody}</p>` : ''}
                ${achievementLevel ? `<p><strong>Level:</strong> ${achievementLevel}</p>` : ''}
                ${eventDate ? `<p><strong>Date:</strong> ${new Date(eventDate).toLocaleDateString()}</p>` : ''}
              </div>

              <h3 style="color: #1f40af; margin-top: 20px;">Certificate Information</h3>
              <div class="cert-id">${certificateId}</div>

              <div class="features">
                <h4>What You Can Do</h4>
                <ul>
                  <li><strong>Download:</strong> Save the attached PDF certificate</li>
                  <li><strong>Share:</strong> Post on LinkedIn and social media</li>
                  <li><strong>Scan:</strong> Use QR code in the certificate to verify</li>
                  <li><strong>Prove:</strong> Show to recruiters and employers</li>
                </ul>
              </div>

              <center style="margin: 20px 0;">
                <a href="${process.env.APP_URL || 'http://localhost:3000'}/certificates/verify/${certificateId}" class="button">Verify Certificate</a>
                <a href="${process.env.APP_URL || 'http://localhost:3000'}/dashboard/student" class="button">Go to Dashboard</a>
              </center>
            </div>

            <div class="footer">
              <p><strong>AchievR</strong> - Credential Verification System</p>
              <p style="margin-top: 10px;">© 2025 All Rights Reserved</p>
            </div>
          </div>
        </body>
        </html>
      `;

      // ========== SEND EMAIL ==========
      console.log('📧 Preparing email message...');

      const msg = {
        to: studentEmail,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: `Official Certificate - ${achievement}`,
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

      console.log('📤 Sending via SendGrid...');
      const result = await sgMail.send(msg);

      const messageId = result[0].headers['x-message-id'];
      
      console.log('✅ Email sent successfully');
      console.log(`   Message ID: ${messageId}`);
      console.log(`   To: ${studentEmail}`);
      console.log('='.repeat(70) + '\n');

      return { success: true, messageId };

    } catch (error) {
      console.error('❌ SendGrid Error:', error.message);
      if (error.response) {
        console.error('   Status:', error.response.status);
        console.error('   Body:', error.response.body);
      }
      console.log('='.repeat(70) + '\n');
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
