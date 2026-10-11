const express = require('express');
const router = express.Router();
const {
  getAllKB,
  getKBById,
  createKB,
  deleteKB,
} = require('../controllers/kbController');

router.get('/', getAllKB);
router.get('/:id', getKBById);
router.post('/', createKB);
router.delete('/:id', deleteKB);

module.exports = router;
