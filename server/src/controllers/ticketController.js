const Ticket = require('../models/Ticket');
const Outage = require('../models/Outage');
const Lab = require('../models/Lab');
const { analyzeImageWithVisionAI } = require('../services/visionAiService');

// @desc Analyze student report - Dual-Tiered Diagnostic Flow
// @route POST /api/v1/tickets/analyze
exports.analyzeIssue = async (req, res, next) => {
  try {
    const { labNumber, pcNumber, description, studentId, studentName, studentRollNo } = req.body;

    if (!labNumber) {
      return res.status(400).json({ success: false, message: 'Please specify the laboratory number' });
    }

    // STEP 1: Query active outage database for student's location or campus-wide
    const activeOutage = await Outage.findOne({
      $and: [
        { status: 'In Progress' },
        {
          $or: [
            { affectedLocation: labNumber },
            { affectedLocation: new RegExp(labNumber, 'i') },
            { affectedLocation: 'Campus-Wide' },
            { affectedLocation: 'All' },
            { affectedLocation: 'All Labs' },
          ],
        },
      ],
    }).sort({ createdAt: -1 });

    // If an applicable outage exists, return the outage alert immediately to avoid unnecessary AI calls!
    if (activeOutage) {
      console.log(`[Diagnostic] Active outage detected for ${labNumber}: ${activeOutage.title}`);
      return res.json({
        success: true,
        type: 'OUTAGE_ALERT',
        message: `Active Maintenance: ${activeOutage.title}`,
        title: activeOutage.title,
        description: activeOutage.description,
        affectedLocation: activeOutage.affectedLocation,
        severity: activeOutage.severity,
        status: activeOutage.status,
        startTime: activeOutage.startTime,
        estimatedEndTime: activeOutage.estimatedEndTime,
        impactedServices: activeOutage.impactedServices,
        outageId: activeOutage.outageId,
      });
    }

    // STEP 2: Auto-fallback to Vision AI / Knowledge Base Engine if no widespread outage exists
    const imagePath = req.file ? req.file.path : null;
    const originalname = req.file ? req.file.originalname : '';

    console.log(`[Diagnostic] No active outage for ${labNumber}. Proceeding to Vision AI / OCR Error Scanner...`);

    const aiSolution = await analyzeImageWithVisionAI({
      imagePath,
      originalname,
      description,
      labNumber,
      pcNumber,
    });

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

    return res.json({
      success: true,
      type: 'AI_SOLUTION',
      solution: aiSolution,
      imageUrl,
      labNumber,
      pcNumber,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Create / Escalate support ticket
// @route POST /api/v1/tickets
exports.createTicket = async (req, res, next) => {
  try {
    const {
      labNumber,
      pcNumber,
      title,
      description,
      category,
      severity,
      aiResult,
      imageUrl,
      studentName,
      studentRollNo,
      department,
    } = req.body;

    const count = await Ticket.countDocuments();
    const ticketNumber = `TICK-${new Date().getFullYear()}-${String(count + 101).padStart(4, '0')}`;

    let parsedAiResult = aiResult;
    if (typeof aiResult === 'string') {
      try {
        parsedAiResult = JSON.parse(aiResult);
      } catch (e) {
        parsedAiResult = {};
      }
    }

    const ticket = await Ticket.create({
      ticketNumber,
      studentId: req.user ? req.user._id : undefined,
      studentName: studentName || (req.user ? req.user.name : 'Student'),
      studentRollNo: studentRollNo || (req.user ? req.user.rollNo : 'N/A'),
      department: department || (req.user ? req.user.department : 'Computer Engineering'),
      labNumber,
      pcNumber,
      title: title || `Issue on ${labNumber} - ${pcNumber}`,
      description: description || '',
      category: category || 'Network',
      severity: severity || 'Medium',
      imageUrl: req.file ? `/uploads/${req.file.filename}` : (imageUrl || ''),
      aiResult: parsedAiResult || {},
      status: 'Open',
    });

    res.status(201).json({
      success: true,
      message: 'Support ticket successfully raised and routed to IT Technician Queue.',
      ticket,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get tickets with filtering and search
// @route GET /api/v1/tickets
exports.getTickets = async (req, res, next) => {
  try {
    const { status, labNumber, category, severity, search, studentId } = req.query;

    const query = {};

    if (status && status !== 'All') query.status = status;
    if (labNumber && labNumber !== 'All') query.labNumber = labNumber;
    if (category && category !== 'All') query.category = category;
    if (severity && severity !== 'All') query.severity = severity;
    if (studentId) query.studentId = studentId;

    if (search) {
      query.$or = [
        { ticketNumber: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { studentName: { $regex: search, $options: 'i' } },
        { studentRollNo: { $regex: search, $options: 'i' } },
        { pcNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const tickets = await Ticket.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get single ticket
// @route GET /api/v1/tickets/:id
exports.getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    res.json({ success: true, ticket });
  } catch (error) {
    next(error);
  }
};

// @desc Update ticket status & technician notes
// @route PATCH /api/v1/tickets/:id/status
exports.updateTicketStatus = async (req, res, next) => {
  try {
    const { status, technicianNotes, assignedTo, resolutionCategory } = req.body;

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    if (status) ticket.status = status;
    if (technicianNotes !== undefined) ticket.technicianNotes = technicianNotes;
    if (assignedTo !== undefined) ticket.assignedTo = assignedTo;
    if (resolutionCategory !== undefined) ticket.resolutionCategory = resolutionCategory;

    if (status === 'Resolved' || status === 'Closed') {
      ticket.resolvedAt = new Date();
    }

    ticket.updatedAt = new Date();
    await ticket.save();

    res.json({
      success: true,
      message: 'Ticket updated successfully',
      ticket,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete ticket
// @route DELETE /api/v1/tickets/:id
exports.deleteTicket = async (req, res, next) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    res.json({ success: true, message: 'Ticket removed' });
  } catch (error) {
    next(error);
  }
};
