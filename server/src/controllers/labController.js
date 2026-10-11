const Lab = require('../models/Lab');
const Ticket = require('../models/Ticket');
const Outage = require('../models/Outage');

// @desc Get all labs with active ticket and outage count
// @route GET /api/v1/labs
exports.getAllLabs = async (req, res, next) => {
  try {
    const labs = await Lab.find().sort({ labNumber: 1 });

    // Enrich with active ticket count for each lab
    const enrichedLabs = await Promise.all(
      labs.map(async (lab) => {
        const activeTicketsCount = await Ticket.countDocuments({
          labNumber: lab.labNumber,
          status: { $in: ['Open', 'In Progress'] },
        });

        const activeOutage = await Outage.findOne({
          status: 'In Progress',
          $or: [{ affectedLocation: lab.labNumber }, { affectedLocation: 'Campus-Wide' }],
        });

        return {
          ...lab.toObject(),
          activeTicketsCount,
          hasActiveOutage: !!activeOutage,
          activeOutageTitle: activeOutage ? activeOutage.title : null,
        };
      })
    );

    res.json({ success: true, count: enrichedLabs.length, labs: enrichedLabs });
  } catch (error) {
    next(error);
  }
};

// @desc Update lab status (Online / Degraded / Offline)
// @route PATCH /api/v1/labs/:id
exports.updateLabStatus = async (req, res, next) => {
  try {
    const { status, currentNotice, activePCs, totalPCs } = req.body;

    const lab = await Lab.findById(req.params.id);
    if (!lab) {
      return res.status(404).json({ success: false, message: 'Lab not found' });
    }

    if (status) lab.status = status;
    if (currentNotice !== undefined) lab.currentNotice = currentNotice;
    if (activePCs !== undefined) lab.activePCs = activePCs;
    if (totalPCs !== undefined) lab.totalPCs = totalPCs;
    lab.lastMaintained = new Date();

    await lab.save();

    res.json({ success: true, message: `Lab ${lab.labNumber} status updated to ${lab.status}`, lab });
  } catch (error) {
    next(error);
  }
};
