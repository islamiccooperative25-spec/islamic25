const express = require('express');
const router = express.Router();
const { getAllMembers, getMemberById } = require('../controllers/memberController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, adminMiddleware, getAllMembers);
router.get('/:id', authMiddleware, adminMiddleware, getMemberById);

module.exports = router;
