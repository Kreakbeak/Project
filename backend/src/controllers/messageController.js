const Message = require('../models/Message');
const Report = require('../models/Report');

// Get all messages for a report
exports.getReportMessages = async (req, res) => {
  try {
    const { reportId } = req.params;

    // Verify report exists
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Verify authorization
    if (req.user.role === 'farmer' && report.farmerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these messages'
      });
    }

    const messages = await Message.find({ reportId })
      .populate('senderId', 'name role')
      .sort({ createdAt: 1 });

    // Mark messages as read if viewing as recipient
    await Message.updateMany(
      { reportId, receiverId: req.user.id, isRead: false },
      { isRead: true }
    );

    res.status(200).json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Send a message on a report
exports.sendMessage = async (req, res) => {
  try {
    const { reportId, message } = req.body;

    if (!reportId || !message) {
      return res.status(400).json({
        success: false,
        message: 'Report ID and message are required'
      });
    }

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Determine receiver based on sender role
    let receiverId;
    if (req.user.role === 'admin') {
      receiverId = report.farmerId;
    } else {
      // For farmer, message needs admin ID - this would be admin of system
      // For now, we'll send it and admin can retrieve it
      receiverId = null;
    }

    const newMessage = new Message({
      reportId,
      senderId: req.user.id,
      senderRole: req.user.role,
      receiverId: receiverId || report.farmerId,
      message
    });

    await newMessage.save();
    await newMessage.populate('senderId', 'name role');

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: newMessage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get unread message count for a user
exports.getUnreadCount = async (req, res) => {
  try {
    const unreadCount = await Message.countDocuments({
      receiverId: req.user.id,
      isRead: false
    });

    res.status(200).json({
      success: true,
      unreadCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all messages for current user
exports.getMyMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { receiverId: req.user.id },
        { senderId: req.user.id }
      ]
    })
      .populate('senderId', 'name role')
      .populate('receiverId', 'name role')
      .populate('reportId', 'cropType location status')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Only sender or receiver can delete
    if (message.senderId.toString() !== req.user.id && message.receiverId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this message'
      });
    }

    await Message.findByIdAndDelete(req.params.messageId);

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
