const mongoose = require('mongoose');

const knowledgeBaseSchema = new mongoose.Schema({
  kbId: {
    type: String,
    required: true,
    unique: true,
  },
  errorCode: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Network', 'Hardware', 'Software', 'OS / Driver', 'Server / Login', 'Other'],
  },
  symptoms: [{
    type: String,
  }],
  detectionKeywords: [{
    type: String,
  }],
  resolutionSteps: [{
    type: String,
    required: true,
  }],
  suggestedCommands: [{
    type: String,
  }],
  escalateIf: {
    type: String,
    default: 'If problem persists after executing resolution steps, escalate to lab technician.',
  },
  successRate: {
    type: Number,
    default: 92,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('KnowledgeBase', knowledgeBaseSchema);
