const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  frequency: { type: Number, default: 1, min: 0 },
  endorsements: { type: Number, default: 0, min: 0 }
}, { _id: false });

const toolSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  frequency: { type: Number, default: 1, min: 0 }
}, { _id: false });

const studentSkillsSchema = new mongoose.Schema({
  
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },

  technicalSkills: { type: [skillSchema], default: [] },
  softSkills: { type: [skillSchema], default: [] },
  tools: { type: [toolSchema], default: [] },

  overallSkillScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
    index: true
  },

  lastUpdated: { type: Date, default: Date.now }

}, { timestamps: true, collection: 'studentskills' });

module.exports = mongoose.model('StudentSkills', studentSkillsSchema);