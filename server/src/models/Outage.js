const mongoose = require('mongoose');

const outageSchema = new mongoose.Schema({
  outageId: {
    type: String,
    required: true,
    unique: true,
  },
  affectedLocation: {
    type: String,
    required: true,
    // e.g. "Campus-Wide", "Lab 1", "Lab 2", etc.
  },
  title: {
    type: String,
    required: [true, 'Please provide outage title'],
  },
  description: {
    type: String,
    default: '',
  },
  severity: {
    type: String,
    enum: ['Minor', 'Major', 'Critical'],
    default: 'Major',
  },
  status: {
    type: String,
    enum: ['In Progress', 'Scheduled', 'Resolved'],
    default: 'In Progress',
  },
  impactedServices: [{
    type: String,
  }],
  startTime: {
    type: Date,
    default: Date.now,
  },
  estimatedEndTime: {
    type: Date,
    required: [true, 'Please specify estimated resolution time'],
  },
  resolvedAt: {
    type: Date,
  },
  createdByName: {
    type: String,
    default: 'IT Operations Administrator',
  },
  resolutionNotes: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Outage', outageSchema);
