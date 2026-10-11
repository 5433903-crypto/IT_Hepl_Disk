const mongoose = require('mongoose');

const labSchema = new mongoose.Schema({
  labNumber: {
    type: String,
    required: true,
    unique: true,
  },
  labName: {
    type: String,
    required: true,
  },
  building: {
    type: String,
    default: 'Computer Science & Engineering Block',
  },
  status: {
    type: String,
    enum: ['Online', 'Degraded', 'Offline'],
    default: 'Online',
  },
  totalPCs: {
    type: Number,
    default: 40,
  },
  activePCs: {
    type: Number,
    default: 40,
  },
  primarySwitch: {
    type: String,
    default: 'Cisco Catalyst 3850',
  },
  subnet: {
    type: String,
    default: '192.168.1.0/24',
  },
  defaultGateway: {
    type: String,
    default: '192.168.1.1',
  },
  currentNotice: {
    type: String,
    default: 'All systems operating nominally.',
  },
  lastMaintained: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Lab', labSchema);
