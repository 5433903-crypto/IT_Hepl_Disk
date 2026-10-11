const express = require('express');
const router = express.Router();
const { getAllLabs, updateLabStatus } = require('../controllers/labController');

router.get('/', getAllLabs);
router.patch('/:id', updateLabStatus);

module.exports = router;
