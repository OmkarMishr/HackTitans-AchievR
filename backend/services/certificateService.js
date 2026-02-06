const PDFDocument = require('pdfkit');

class CertificateService {
  async generateCertificate(data) {
    try {
      const {
        studentName,
        achievement,
        organizingBody,
        eventDate,
        achievementLevel,
        certificateId
      } = data;

      if (!studentName || !achievement || !certificateId) {
        throw new Error('Missing required fields');
      }

      const doc = new PDFDocument({
        size: 'A4',
        margin: 40
      });

      const chunks = [];

      doc.on('data', chunk => chunks.push(chunk));

      return new Promise((resolve, reject) => {
        doc.on('end', () => {
          const pdfBuffer = Buffer.concat(chunks);

          resolve({
            success: true,
            pdfBuffer,
            certificateId,
            fileSize: pdfBuffer.length
          });
        });

        doc.on('error', reject);

        const pageWidth = doc.page.width;
        const pageHeight = doc.page.height;

        // Background
        doc.rect(0, 0, pageWidth, pageHeight).fill('#FFFFFF');

        // Border
        doc.strokeColor('#000000').lineWidth(3);
        doc.rect(20, 20, pageWidth - 40, pageHeight - 40).stroke();
        doc.lineWidth(1);
        doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();

        // Title
        doc.fontSize(30).font('Helvetica-Bold').fillColor('#000000');
        doc.text('CERTIFICATE OF ACHIEVEMENT', { align: 'center' });

        doc.moveDown(1);
        doc.fontSize(12).font('Helvetica').fillColor('#333');
        doc.text('This is to certify that', { align: 'center' });

        // Student Name
        doc.moveDown(0.5);
        doc.fontSize(24).font('Helvetica-Bold');
        doc.text(studentName.toUpperCase(), { align: 'center' });

        doc.moveDown(0.5);
        doc.fontSize(12).font('Helvetica');
        doc.text('has successfully completed', { align: 'center' });

        // Achievement
        doc.moveDown(0.3);
        doc.fontSize(18).font('Helvetica-Bold');
        doc.text(achievement.toUpperCase(), { align: 'center' });

        doc.moveDown(1);
        doc.fontSize(10).font('Helvetica');

        doc.text(`Achievement Level: ${achievementLevel || 'College'}`);
        doc.text(`Organized by: ${organizingBody || 'Unknown'}`);

        const formattedDate = eventDate
          ? new Date(eventDate).toLocaleDateString()
          : new Date().toLocaleDateString();

        doc.text(`Event Date: ${formattedDate}`);
        doc.text(`Issued on: ${new Date().toLocaleDateString()}`);
        doc.text(`Certificate ID: ${certificateId}`);

        // Footer
        doc.moveDown(2);
        doc.fontSize(8).fillColor('#666');
        doc.text('AchievR - Credential System', { align: 'center' });

        doc.end();
      });

    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new CertificateService();