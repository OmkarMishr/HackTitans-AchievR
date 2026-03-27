const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

class CertificateService {
  async generateCertificate(data) {
    try {
      const {
        studentName, achievement, organizingBody,
        eventDate, achievementLevel, certificateId,
        rollNo, department
      } = data;

      if (!studentName || !achievement || !certificateId) {
        throw new Error('Missing required fields');
      }

      const doc = new PDFDocument({ size: 'A4', margin: 40 });
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));

      return new Promise(async (resolve, reject) => {
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

        // ===== Background =====
        doc.rect(0, 0, pageWidth, pageHeight).fill('#FFFDF6');

        // ===== Premium Gold Border =====
        doc.strokeColor('#C9A227').lineWidth(4);
        doc.rect(25, 25, pageWidth - 50, pageHeight - 50).stroke();

        doc.strokeColor('#E6C767').lineWidth(1);
        doc.rect(35, 35, pageWidth - 70, pageHeight - 70).stroke();

        doc.moveDown(2);

        // ===== Title =====
        doc.fontSize(32)
          .font('Helvetica-Bold')
          .fillColor('#7A5C00')
          .text('CERTIFICATE OF ACHIEVEMENT', { align: 'center' });

        doc.moveDown(0.6);

        // Gold underline
        doc.moveTo(pageWidth / 2 - 120, doc.y)
          .lineTo(pageWidth / 2 + 120, doc.y)
          .strokeColor('#C9A227')
          .lineWidth(2)
          .stroke();

        doc.moveDown(1.2);

        // ===== Presented To =====
        doc.fontSize(14)
          .fillColor('#333')
          .text('Proudly Presented To', { align: 'center' });

        doc.moveDown(0.7);

        // ===== Student Name =====
        doc.fontSize(28)
          .font('Helvetica-Bold')
          .fillColor('#000')
          .text(studentName.toUpperCase(), { align: 'center' });

        doc.moveDown(0.4);

        // ===== Roll No & Department =====
        doc.fontSize(11)
          .font('Helvetica')
          .fillColor('#444')
          .text(`Roll No: ${rollNo || 'N/A'}`, { align: 'center' });

        doc.text(`Department: ${department || 'N/A'}`, { align: 'center' });

        doc.moveDown(1);

        // ===== Achievement =====
        doc.fontSize(13)
          .fillColor('#333')
          .text('For outstanding performance and successful completion of', { align: 'center' });

        doc.moveDown(0.6);

        doc.fontSize(20)
          .font('Helvetica-Bold')
          .fillColor('#7A5C00')
          .text(achievement, { align: 'center' });

        doc.moveDown(1.2);

        // ===== Details =====
        const formattedDate = eventDate && !isNaN(new Date(eventDate))
          ? new Date(eventDate).toLocaleDateString()
          : 'Not Specified';

        doc.fontSize(11).fillColor('#444');

        doc.text(`Achievement Level: ${achievementLevel || 'College'}`, { align: 'center' });
        doc.text(`Organized by: ${organizingBody || 'AchievR Platform'}`, { align: 'center' });
        doc.text(`Event Date: ${formattedDate}`, { align: 'center' });
        doc.text(`Issued On: ${new Date().toLocaleDateString()}`, { align: 'center' });

        doc.moveDown(2);

        // ===== Signature Section =====
        const signatureY = doc.y + 20;

        // Left signature line
        doc.moveTo(pageWidth / 2 - 180, signatureY)
          .lineTo(pageWidth / 2 - 60, signatureY)
          .strokeColor('#000')
          .stroke();

        // Right signature line (for QR)
        doc.moveTo(pageWidth / 2 + 60, signatureY)
          .lineTo(pageWidth / 2 + 180, signatureY)
          .stroke();

        doc.fontSize(10).fillColor('#000');

        doc.text('Authorized Signatory', pageWidth / 2 - 180, signatureY + 5, {
          width: 120,
          align: 'center'
        });

        // QR Code (Bottom Right - under right signature line)
        try {
          const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify/${certificateId}`;
          const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
            width: 100,
            margin: 1,
            color: { dark: '#000000', light: '#FFFFFF' }
          });

          const qrBuffer = Buffer.from(qrDataUrl.split(',')[1], 'base64');
          doc.image(qrBuffer, pageWidth / 2 + 65, signatureY + 15, {
            width: 100,
            height: 100
          });
        } catch (qrError) {
          console.error('QR generation failed:', qrError.message);
        }

        doc.text('Certificate ID', pageWidth / 2 + 60, signatureY + 5, {
          width: 120,
          align: 'center'
        });

        doc.fontSize(9).fillColor('#7A5C00');
        doc.text(certificateId, pageWidth / 2 + 60, signatureY + 20, {
          width: 120,
          align: 'center'
        });

        // ===== Footer =====
        doc.fontSize(9)
          .fillColor('#777')
          .text('AchievR • Official Credential • Recognizing Excellence and Achievement', 0, pageHeight - 60, {
            align: 'center'
          });

        doc.end();
      });
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

module.exports = new CertificateService();