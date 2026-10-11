const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
  analyzeIssue,
  createTicket,
  getTickets,
  getTicketById,
  updateTicketStatus,
  deleteTicket,
} = require('../controllers/ticketController');

// Diagnostic check-first & Vision AI analysis
router.post('/analyze', upload.single('errorImage'), analyzeIssue);

// Ticket CRUD
router.post('/', upload.single('errorImage'), createTicket);
router.get('/', getTickets);
router.get('/:id', getTicketById);
router.patch('/:id/status', updateTicketStatus);
router.delete('/:id', deleteTicket);

module.exports = router;
