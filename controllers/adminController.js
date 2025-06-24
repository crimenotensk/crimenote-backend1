const Post = require('../models/Post');
const Editor = require('../models/Editor');
const Subscriber = require('../models/Subscriber');

// Get admin dashboard statistics
exports.getStats = async (req, res) => {
  try {
    // Get total posts count
    const totalPosts = await Post.countDocuments();

    // Get total editors count
    const totalEditors = await Editor.countDocuments();

    // Get posts by status
    const publishedPosts = await Post.countDocuments({ 
      isPublished: true,
      scheduledAt: { $lte: new Date() }
    });
    const draftPosts = await Post.countDocuments({ isPublished: false });
    const scheduledPosts = await Post.countDocuments({
      isPublished: false,
      scheduledAt: { $gt: new Date() }
    });

    // Get breaking news count
    const breakingNews = await Post.countDocuments({ isBreaking: true });

    // Get posts per city
    const postsPerCity = await Post.aggregate([
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get posts by type
    const postsByType = await Post.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get posts created in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const postsLastWeek = await Post.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      stats: {
        overview: {
          totalPosts,
          totalEditors,
          publishedPosts,
          draftPosts,
          scheduledPosts,
          breakingNews
        },
        postsPerCity,
        postsByType,
        postsLastWeek
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin statistics',
      error: error.message
    });
  }
};

// Get all users/editors
exports.getUsers = async (req, res) => {
  try {
    const users = await Editor.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// Update user status or role
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { approved, role } = req.body;

    const user = await Editor.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields if provided
    if (typeof approved === 'boolean') {
      user.approved = approved;
    }
    if (role && ['editor', 'admin'].includes(role)) {
      user.role = role;
    }

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        approved: user.approved
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

// GET /api/admin/analytics/overview
exports.getAnalyticsOverview = async (req, res) => {
  try {
    const [totalPosts, totalEditors, totalSubscribers, totalBreakingNews, cityAgg] = await Promise.all([
      Post.countDocuments(),
      Editor.countDocuments(),
      Subscriber ? Subscriber.countDocuments() : 0,
      Post.countDocuments({ isBreaking: true }),
      Post.aggregate([
        { $group: { _id: '$city', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);
    const cityDistribution = cityAgg.map(c => ({ city: c._id, count: c.count }));
    res.json({
      totalPosts,
      totalEditors,
      totalSubscribers,
      totalBreakingNews,
      cityDistribution
    });
  } catch (error) {
    console.error('Error fetching analytics overview:', error);
    res.status(500).json({ error: 'Failed to fetch analytics overview', details: error.message });
  }
};

// GET /api/admin/analytics/posts-trend?days=7
exports.getPostsTrend = async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days + 1);
    const trend = await Post.aggregate([
      { $match: { createdAt: { $gte: fromDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    // Fill missing days with 0
    const result = [];
    for (let i = 0; i < days; i++) {
      const d = new Date(fromDate);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      const found = trend.find(t => t._id === dateStr);
      result.push({ date: dateStr, count: found ? found.count : 0 });
    }
    res.json({ trend: result });
  } catch (error) {
    console.error('Error fetching posts trend:', error);
    res.status(500).json({ error: 'Failed to fetch posts trend', details: error.message });
  }
}; 