const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(20); // Limit to last 20

        const unreadCount = await Notification.countDocuments({ user: req.user._id, read: false });

        res.json({ notifications, unreadCount });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOne({ _id: req.params.id, user: req.user._id });
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        notification.read = true;
        await notification.save();

        res.json(notification);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead
};
