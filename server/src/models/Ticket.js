const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketNumber: {
    type: String,
    required: true,
    unique: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  studentName: {
    type: String,
    required: true,
  },
  studentRollNo: {
    type: String,
    default: 'N/A',
  },
  department: {
    type: String,
    default: 'Computer Engineering',
  },
  labNumber: {
    type: String,
    required: [true, 'Please specify lab number'],
  },
  pcNumber: {
    type: String,
    required: [true, 'Please specify PC number'],
  },
  category: {
    type: String,
    enum: ['Network', 'Hardware', 'Software', 'OS / Driver', 'Server / Login', 'Other'],
    default: 'Network',
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
  },
  title: {
    type: String,
    required: [true, 'Please provide issue title'],
  },
  description: {
    type: String,
    default: '',
  },
  imageUrl: {
    type: String,
    default: '',
  },
  aiResult: {
    extractedText: { type: String, default: '' },
    errorCode: { type: String, default: '' },
    matchedKbTitle: { type: String, default: '' },
    kbId: { type: String, default: '' },
    recommendedFix: [{ type: String }],
    confidence: { type: Number, default: 0 },
    provider: { type: String, default: 'Knowledge Base Fallback Engine' },
    analyzedAt: { type: Date, default: Date.now },
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open',
  },
  assignedTo: {
    type: String,
    default: 'Unassigned',
  },
  technicianNotes: {
    type: String,
    default: '',
  },
  resolvedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

ticketSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Ticket', ticketSchema);
