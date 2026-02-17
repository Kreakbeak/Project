const express = require('express');
const router = express.Router();
const { register, login, createUserByAdmin } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/create-user', protect, authorize('admin'), createUserByAdmin);

module.exports = router;
