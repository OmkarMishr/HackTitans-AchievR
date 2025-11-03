const mongoose = require('mongoose');

const studentSkillsSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  
  technicalSkills: [{
    name: String,
    frequency: { type: Number, default: 1 },
    endorsements: { type: Number, default: 0 }
  }],
  
  softSkills: [{
    name: String,
    frequency: { type: Number, default: 1 },
    endorsements: { type: Number, default: 0 }
  }],
  
  tools: [{
    name: String,
    frequency: { type: Number, default: 1 }
  }],
  
  overallSkillScore: { type: Number, min: 0, max: 100, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('StudentSkills', studentSkillsSchema);