const express = require('express');
const router = express.Router();
const { applyLoan, getAllLoans, getMyLoans, updateLoanStatus } = require('../controllers/loanController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, applyLoan);
router.get('/', authMiddleware, adminMiddleware, getAllLoans);
router.get('/my', authMiddleware, getMyLoans);
router.put('/:id/status', authMiddleware, adminMiddleware, updateLoanStatus);

module.exports = router;
