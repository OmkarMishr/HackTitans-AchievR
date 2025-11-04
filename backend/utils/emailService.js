const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class EmailService {
  async sendCertificateEmail(studentEmail, studentName, certificateData) {
    try {
      console.log('📧 EMAIL SERVICE CALLED');

      const { certificateId, pdfBuffer, achievement, organizingBody, eventDate, achievementLevel } = certificateData;

      // ✅ FIX: CHECK IF PDFBUFFER EXISTS
      if (!pdfBuffer) {
        throw new Error('pdfBuffer is missing or undefined');
      }

      console.log('   PDF Buffer type:', typeof pdfBuffer);
      console.log('   PDF Buffer length:', pdfBuffer.length);

      // ✅ IF ALREADY BASE64 STRING, USE DIRECTLY
      let base64PDF = pdfBuffer;
      if (Buffer.isBuffer(pdfBuffer)) {
        base64PDF = pdfBuffer.toString('base64');
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"><style>
          body { font-family: Arial; background: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
          .header { background: linear-gradient(135deg, #1f40af 0%, #152d7a 100%); color: white; padding: 20px; text-align: center; }
          .box { background: #f0f4ff; padding: 15px; margin: 15px 0; border-left: 4px solid #1f40af; }
          .button { display: inline-block; background: #1f40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 15px 0; }
        </style></head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Certificate Issued!</h1>
            </div>
            <div>
              <p>Dear <strong>${studentName}</strong>,</p>
              <p>Your certificate is attached:</p>
              <div class="box">
                <h3>🏆 ${achievement}</h3>
                <p><strong>Organization:</strong> ${organizingBody}</p>
              </div>
              <center>
                <a href="${process.env.APP_URL}/api/certificates/verify/${certificateId}" class="button">Verify</a>
              </center>
            </div>
          </div>
        </body></html>
      `;

      const msg = {
        to: studentEmail,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: `Certificate - ${achievement}`,
        html: htmlContent,
        attachments: [{
          content: base64PDF,
          filename: `${certificateId}.pdf`,
          type: 'application/pdf',
          disposition: 'attachment'
        }]
      };

      console.log('   ✅ Sending email...');
      const result = await sgMail.send(msg);
      
      console.log('✅ Email sent successfully');
      return { success: true, messageId: result[0].headers['x-message-id'] };

    } catch (error) {
      console.error('❌ Email service error:', error.message);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
