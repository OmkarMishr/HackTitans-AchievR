const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const app = express();

//  MIDDLEWARe
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Db
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('DB Connection Error:', err.message);
    process.exit(1);
  }
};
connectDB();

// ROUTES
const authMiddleware = require('./middleware/auth');

// Public
app.use('/api/auth', require('./routes/auth'));
app.use('/api/recruiter', require('./routes/recruiter'));

// Protected
app.use('/api/activities', authMiddleware, require('./routes/activities'));
app.use('/api/certificates', authMiddleware, require('./routes/certificates'));

// HEALTH CHECK
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.url,
    method: req.method
  });
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.error('Error:', err.message);

  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Uploads: ${path.join(__dirname, 'uploads')}`);
  console.log('='.repeat(60) + '\n');
});