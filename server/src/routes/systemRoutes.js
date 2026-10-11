const express = require('express');
const router = express.Router();
const { seedDatabase, getHealth } = require('../controllers/systemController');

router.post('/seed', seedDatabase);
router.get('/health', getHealth);

module.exports = router;
