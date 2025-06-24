const Notification = require('../models/Notification');

// Create a new notification
exports.createNotification = async (editorId, message, postId = null) => {
  try {
    const notification = new Notification({
      editorId,
      message,
      postId
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Get notifications for an editor
exports.getEditorNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ editorId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('postId', 'title');

    res.json({
      success: true,
      notifications
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications',
      error: error.message
    });
  }
};

// Mark notifications as read
exports.markAsRead = async (req, res) => {
  try {
    const { notificationIds } = req.body;
    
    await Notification.updateMany(
      { 
        _id: { $in: notificationIds },
        editorId: req.user._id // Ensure editor can only mark their own notifications
      },
      { $set: { read: true } }
    );

    res.json({
      success: true,
      message: 'Notifications marked as read'
    });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking notifications as read',
      error: error.message
    });
  }
};

// Get unread notification count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      editorId: req.user._id,
      read: false
    });

    res.json({
      success: true,
      count
    });
  } catch (error) {
    console.error('Error getting unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting unread count',
      error: error.message
    });
  }
}; 