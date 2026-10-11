const express = require('express');
const router = express.Router();
const {
  getOutages,
  getActiveOutages,
  createOutage,
  updateOutage,
  deleteOutage,
} = require('../controllers/outageController');

router.get('/', getOutages);
router.get('/active', getActiveOutages);
router.post('/', createOutage);
router.patch('/:id', updateOutage);
router.delete('/:id', deleteOutage);

module.exports = router;
