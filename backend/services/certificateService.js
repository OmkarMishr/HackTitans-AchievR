const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

class CertificateService {
  
  async generateCertificateWithQR(certificateData) {
    try {
      console.log('\n📜 GENERATING PROFESSIONAL CERTIFICATE (PDF)');
      console.log('='.repeat(70));

      const {
        studentName,
        achievement,
        description,
        organizingBody,
        eventDate,
        achievementLevel,
        certificateId
      } = certificateData;

      if (!studentName || !achievement || !certificateId) {
        throw new Error('Missing required fields');
      }

      console.log(`✅ Student: ${studentName}`);
      console.log(`✅ Achievement: ${achievement}`);
      console.log(`✅ Certificate ID: ${certificateId}`);

      const certificateDir = path.join(__dirname, '../uploads/certificates');
      if (!fs.existsSync(certificateDir)) {
        fs.mkdirSync(certificateDir, { recursive: true });
        console.log(`✅ Directory created`);
      }

      const certificatePath = path.join(certificateDir, `${certificateId}.pdf`);

      console.log('📝 Creating PDF document...');
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        bufferPages: true
      });

      const stream = fs.createWriteStream(certificatePath);

      stream.on('error', (err) => {
        console.error('❌ Stream error:', err);
      });

      doc.on('error', (err) => {
        console.error('❌ Document error:', err);
      });

      doc.pipe(stream);

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;

      // Background
      doc.fillColor('#FFFFFF').rect(0, 0, pageWidth, pageHeight).fill();

      // Outer Border
      doc.strokeColor('#000000').lineWidth(3);
      doc.rect(30, 30, pageWidth - 60, pageHeight - 60).stroke();

      // Inner Border
      doc.lineWidth(1);
      doc.rect(40, 40, pageWidth - 80, pageHeight - 80).stroke();

      // Top Line
      doc.moveTo(50, 100).lineTo(pageWidth - 50, 100).stroke();

      // Title
      doc.fontSize(36).font('Helvetica-Bold').fillColor('#000000');
      doc.text('CERTIFICATE OF ACHIEVEMENT', { align: 'center' });

      // Subheading
      doc.fontSize(12).font('Helvetica').fillColor('#333333');
      doc.moveDown(0.5);
      doc.text('This is to certify that', { align: 'center' });

      // Student Name
      doc.moveDown(0.5);
      doc.fontSize(28).font('Helvetica-Bold').fillColor('#000000');
      doc.text(studentName.toUpperCase(), { align: 'center' });

      // Achievement Text
      doc.moveDown(0.5);
      doc.fontSize(12).font('Helvetica').fillColor('#333333');
      doc.text('has successfully completed', { align: 'center' });

      // Achievement Title
      doc.moveDown(0.5);
      doc.fontSize(22).font('Helvetica-Bold').fillColor('#000000');
      doc.text(achievement.toUpperCase(), { align: 'center' });

      // Divider
      doc.moveDown(0.8);
      doc.moveTo(100, doc.y).lineTo(pageWidth - 100, doc.y).stroke();

      // Details
      doc.moveDown(0.5);
      doc.fontSize(11).font('Helvetica').fillColor('#333333');

      doc.text(`Achievement Level: ${achievementLevel || 'College'}`);
      doc.text(`Organized by: ${organizingBody || 'Unknown'}`);

      const formattedDate = eventDate 
        ? new Date(eventDate).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })
        : new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });

      doc.text(`Event Date: ${formattedDate}`);
      doc.text(`Issued on: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`);
      doc.text(`Certificate ID: ${certificateId}`);

      // Description
      if (description && description.trim()) {
        doc.moveDown(0.5);
        doc.fontSize(10).font('Helvetica-Bold').fillColor('#000000');
        doc.text('Description:');
        doc.fontSize(10).font('Helvetica').fillColor('#555555');
        doc.text(description, { align: 'left', lineGap: 5 });
      }

      // Signature Line
      doc.moveDown(1);
      doc.moveTo(100, doc.y).lineTo(300, doc.y).stroke();
      doc.fontSize(10).font('Helvetica').fillColor('#000000');
      doc.text('Authorized Signature', { align: 'center', x: 100, width: 200 });

      // QR CODE
      console.log('📱 Generating QR code...');
      try {
        const verificationUrl = `${process.env.APP_URL || 'http://localhost:3000'}/api/certificates/verify/${certificateId}`;
        
        console.log(`📱 QR URL: ${verificationUrl}`);

        const qrCodeBuffer = await QRCode.toBuffer(verificationUrl, {
          errorCorrectionLevel: 'H',
          type: 'image/png',
          width: 150,
          margin: 1,
          color: { dark: '#000000', light: '#FFFFFF' }
        });

        const qrImagePath = path.join(certificateDir, `qr_${certificateId}.png`);
        fs.writeFileSync(qrImagePath, qrCodeBuffer);
        console.log(`✅ QR code created`);

        // Add QR to PDF
        doc.image(qrImagePath, pageWidth - 220, 120, { 
          width: 150, 
          height: 150 
        });

        doc.fontSize(10).font('Helvetica-Bold').fillColor('#000000');
        doc.text('SCAN TO VERIFY', pageWidth - 220, 280, { 
          width: 150, 
          align: 'center' 
        });

        doc.fontSize(8).font('Helvetica').fillColor('#666666');
        doc.text('Verify Authenticity', pageWidth - 220, 300, { 
          width: 150, 
          align: 'center' 
        });

        console.log('✅ QR code embedded');
      } catch (qrError) {
        console.warn('⚠️ QR code warning:', qrError.message);
      }

      // Security Badge
      doc.fontSize(8).font('Helvetica').fillColor('#888888');
      doc.text('VERIFIED & SECURED', 50, pageHeight - 50, { align: 'left' });
      doc.text('Issued by AchievR', pageWidth - 150, pageHeight - 50, { align: 'right', width: 100 });

      // Footer
      doc.fontSize(8).font('Helvetica').fillColor('#666666');
      doc.text('AchievR - Credential Verification System', { align: 'center' });
      doc.text('All Rights Reserved © 2025', { align: 'center' });

      console.log('📄 Finalizing PDF...');
      doc.end();

      return new Promise((resolve, reject) => {
        stream.on('finish', () => {
          console.log('✅ PDF stream finished');

          if (!fs.existsSync(certificatePath)) {
            console.error('❌ File was not created!');
            return reject(new Error('PDF file was not created'));
          }

          const fileSize = fs.statSync(certificatePath).size;
          console.log(`✅ Certificate created successfully`);
          console.log(`   Path: ${certificatePath}`);
          console.log(`   Size: ${(fileSize / 1024).toFixed(2)} KB`);
          console.log('='.repeat(70) + '\n');

          resolve({
            success: true,
            certificatePath,
            certificateId,
            fileSize,
            qrEmbedded: true,
            message: 'Certificate generated with QR code'
          });
        });

        stream.on('error', (err) => {
          console.error('❌ Stream error:', err);
          reject(err);
        });
      });

    } catch (error) {
      console.error('❌ Certificate Generation Error:', error.message);
      console.log('='.repeat(70) + '\n');
      return { 
        success: false, 
        error: error.message
      };
    }
  }

  getCertificate(certificateId) {
    try {
      const certificatePath = path.join(__dirname, '../uploads/certificates', `${certificateId}.pdf`);

      if (fs.existsSync(certificatePath)) {
        const stats = fs.statSync(certificatePath);
        return {
          exists: true,
          path: certificatePath,
          fileName: `${certificateId}.pdf`,
          size: stats.size
        };
      }

      return { exists: false, error: 'Certificate not found' };
    } catch (error) {
      console.error('❌ Error:', error);
      return { error: error.message };
    }
  }
}

// ✅ IMPORTANT: EXPORT CORRECTLY
module.exports = new CertificateService();
