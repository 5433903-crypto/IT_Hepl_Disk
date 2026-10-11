const Outage = require('../models/Outage');
const Lab = require('../models/Lab');

// @desc Get all outages
// @route GET /api/v1/outages
exports.getOutages = async (req, res, next) => {
  try {
    const { status, location } = req.query;
    const filter = {};
    if (status && status !== 'All') filter.status = status;
    if (location && location !== 'All') filter.affectedLocation = location;

    const outages = await Outage.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: outages.length, outages });
  } catch (error) {
    next(error);
  }
};

// @desc Get active outages for student banner
// @route GET /api/v1/outages/active
exports.getActiveOutages = async (req, res, next) => {
  try {
    const activeOutages = await Outage.find({ status: 'In Progress' }).sort({ createdAt: -1 });
    res.json({ success: true, count: activeOutages.length, outages: activeOutages });
  } catch (error) {
    next(error);
  }
};

// @desc Create new outage announcement / broadcast
// @route POST /api/v1/outages
exports.createOutage = async (req, res, next) => {
  try {
    const { affectedLocation, title, description, severity, estimatedEndTime, impactedServices, status } = req.body;

    const count = await Outage.countDocuments();
    const outageId = `OUT-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

    const outage = await Outage.create({
      outageId,
      affectedLocation: affectedLocation || 'Campus-Wide',
      title,
      description: description || '',
      severity: severity || 'Major',
      status: status || 'In Progress',
      impactedServices: impactedServices || ['LAN / Internet'],
      startTime: new Date(),
      estimatedEndTime: estimatedEndTime || new Date(Date.now() + 2 * 60 * 60 * 1000), // Default 2 hours from now
      createdByName: req.user ? req.user.name : 'IT Operations Administrator',
    });

    // If affectedLocation is a specific lab, also update that lab's status
    if (affectedLocation && affectedLocation.startsWith('Lab')) {
      await Lab.findOneAndUpdate(
        { labNumber: affectedLocation },
        { status: severity === 'Critical' ? 'Offline' : 'Degraded', currentNotice: title }
      );
    }

    res.status(201).json({ success: true, message: 'Outage broadcast published', outage });
  } catch (error) {
    next(error);
  }
};

// @desc Update outage (e.g. resolve or extend time)
// @route PATCH /api/v1/outages/:id
exports.updateOutage = async (req, res, next) => {
  try {
    const { status, title, description, severity, estimatedEndTime, resolutionNotes } = req.body;

    const outage = await Outage.findById(req.params.id);
    if (!outage) {
      return res.status(404).json({ success: false, message: 'Outage not found' });
    }

    if (status) outage.status = status;
    if (title) outage.title = title;
    if (description !== undefined) outage.description = description;
    if (severity) outage.severity = severity;
    if (estimatedEndTime) outage.estimatedEndTime = new Date(estimatedEndTime);
    if (resolutionNotes !== undefined) outage.resolutionNotes = resolutionNotes;

    if (status === 'Resolved') {
      outage.resolvedAt = new Date();
      // If was attached to a specific lab, reset that lab to Online
      if (outage.affectedLocation && outage.affectedLocation.startsWith('Lab')) {
        await Lab.findOneAndUpdate(
          { labNumber: outage.affectedLocation },
          { status: 'Online', currentNotice: 'Outage resolved. System operational.' }
        );
      }
    }

    await outage.save();
    res.json({ success: true, message: 'Outage updated successfully', outage });
  } catch (error) {
    next(error);
  }
};

// @desc Delete outage
// @route DELETE /api/v1/outages/:id
exports.deleteOutage = async (req, res, next) => {
  try {
    const outage = await Outage.findByIdAndDelete(req.params.id);
    if (!outage) {
      return res.status(404).json({ success: false, message: 'Outage not found' });
    }
    res.json({ success: true, message: 'Outage deleted' });
  } catch (error) {
    next(error);
  }
};
