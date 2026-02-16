const express = require('express');
const router = express.Router();
const {
  getReportMessages,
  sendMessage,
  getUnreadCount,
  getMyMessages,
  deleteMessage
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Get messages for a specific report
router.get('/report/:reportId', getReportMessages);

// Send a message
router.post('/', sendMessage);

// Get unread count
router.get('/unread/count', getUnreadCount);

// Get all messages for current user
router.get('/', getMyMessages);

// Delete a message
router.delete('/:messageId', deleteMessage);

module.exports = router;
