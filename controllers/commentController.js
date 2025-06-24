const Comment = require('../models/Comment');
const Post = require('../models/Post');

// Add a new comment
exports.addComment = async (req, res) => {
  try {
    const { postId, userName, userEmail, commentText } = req.body;

    // Validate post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Create comment
    const comment = new Comment({
      postId,
      userName,
      userEmail,
      commentText
    });

    await comment.save();

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      comment
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message
    });
  }
};

// Get all comments for a post
exports.getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ 
      postId,
      isApproved: true 
    })
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      comments
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching comments',
      error: error.message
    });
  }
};

// Get all comments (admin only)
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find()
      .populate('postId', 'title')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      comments
    });
  } catch (error) {
    console.error('Error fetching all comments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching comments',
      error: error.message
    });
  }
};

// Delete a comment (admin only)
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    
    const comment = await Comment.findByIdAndDelete(id);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting comment',
      error: error.message
    });
  }
}; 