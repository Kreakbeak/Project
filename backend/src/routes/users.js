const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getAllUsers,
  getPendingUsers,
  approveUser,
  rejectUser,
  removeUser,
  updateUserRole,
  getUserById
} = require('../controllers/userController');

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Specific routes BEFORE generic :id routes
router.get('/pending', getPendingUsers);

// Generic routes AFTER specific routes
router.get('/', getAllUsers);
router.get('/:userId', getUserById);

// Approve user
router.put('/:userId/approve', approveUser);

// Reject user
router.delete('/:userId/reject', rejectUser);

// Remove user
router.delete('/:userId/remove', removeUser);

// Update user role
router.put('/:userId/role', updateUserRole);

module.exports = router;
