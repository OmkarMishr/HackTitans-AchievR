const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({

  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },

  password: {
    type: String,
    required: true,
    select: false
  },

  role: {
    type: String,
    enum: ['student', 'faculty', 'admin', 'verifier'],
    default: 'student',
    index: true
  },

  // STUDENT 
  rollNumber: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    index: true
  },

  department: { type: String, trim: true },
  year: { type: Number, min: 1, max: 10 },
  mobile: { type: String, trim: true },
  dateOfBirth: Date,

  slug: {
  type: String,
  unique: true
},

  //FACULTY / ADMIN 
  employeeId: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    index: true
  },
  designation: { type: String, trim: true }

}, {
  timestamps: true,
  collection: 'users'
});

//  PASSWORD HASH
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//PASSWORD COMPARE
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

//  STATIC HELPERS 
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email }).select('+password');
};

module.exports = mongoose.model('User', userSchema);