const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role: {
    type: String,
    enum: ['student', 'faculty', 'admin', 'verifier'],
    default: 'student'
  },

  // Student Fields
  rollNumber: { type: String, unique: true, sparse: true },
  department: String,
  year: Number,
  mobile: String,
  dateOfBirth: Date,

  // Faculty/Admin Fields
  employeeId: { type: String, unique: true, sparse: true },
  designation: String,

  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);