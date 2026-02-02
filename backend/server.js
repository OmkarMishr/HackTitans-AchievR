const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// SERVE UPLOADS - BEFORE ALL ROUTES
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const authMiddleware = require('./middleware/auth');

// Db CONNECTION =====
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('DB Connection Error:', err);
    process.exit(1);
  });

// PUBLIC ROUTES (NO AUTH)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/verify', require('./routes/verify'));
app.use('/api/recruiter', require('./routes/recruiter'));

// PROTECTED ROUTES (WITH AUTH)
app.use('/api/activities', authMiddleware, require('./routes/activities'));
app.use('/api/certificates', authMiddleware, require('./routes/certificates'));

// healtthh
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// test upload
app.get('/test-uploads', (req, res) => {
  const uploadsPath = path.join(__dirname, 'uploads');
  res.json({
    message: 'Uploads folder path',
    path: uploadsPath,
    exists: require('fs').existsSync(uploadsPath)
  });
});

app.use((req, res) => {
  console.log(`404 Not Found: ${req.method} ${req.url}`);
  res.status(404).json({
    error: 'Route not found',
    path: req.url,
    method: req.method
  });
});
// erroe handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.url,
    method: req.method
  });

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(70));
  console.log(`Server running on port ${PORT}`);
  console.log(`Base URL: http://localhost:${PORT}`);
  console.log(`Uploads folder: ${path.join(__dirname, 'uploads')}`);
  console.log('='.repeat(70) + '\n');
});