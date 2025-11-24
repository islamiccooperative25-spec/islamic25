const express = require('express');
const router = express.Router();
const { requestWithdrawal, getAllWithdrawals, getMyWithdrawals, updateWithdrawalStatus } = require('../controllers/withdrawalController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.post('/', authMiddleware, requestWithdrawal);
router.get('/', authMiddleware, adminMiddleware, getAllWithdrawals);
router.get('/my', authMiddleware, getMyWithdrawals);
router.put('/:id/status', authMiddleware, adminMiddleware, updateWithdrawalStatus);

module.exports = router;
