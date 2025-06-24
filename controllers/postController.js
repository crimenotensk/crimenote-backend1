const Post = require('../models/Post');
const { createNotification } = require('./notificationController');

// Get all posts with filters
exports.getPosts = async (req, res) => {
  try {
    const { search, category, city, breaking } = req.query;
    const query = {
      // Only show published posts that are scheduled for now or past
      isPublished: true,
      scheduledAt: { $lte: new Date() }
    };

    // Build query based on filters
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (city && city !== 'all') {
      query.city = city;
    }

    if (breaking === 'true') {
      query.isBreaking = true;
    }

    // Execute query with filters
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .populate('author', 'name email')
      .lean();

    res.json({
      success: true,
      posts,
      filters: {
        search: search || '',
        category: category || 'all',
        city: city || 'all',
        breaking: breaking === 'true'
      }
    });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching posts',
      error: error.message
    });
  }
};

// Get post by slug
exports.getPostBySlug = async (req, res) => {
  try {
    const post = await Post.findOne({ 
      slug: req.params.slug,
      isPublished: true 
    }).populate('author', 'name');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.json({
      success: true,
      post
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching post',
      error: error.message
    });
  }
};

// Increment post views
exports.incrementViews = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    res.json({
      success: true,
      views: post.views
    });
  } catch (error) {
    console.error('Error incrementing views:', error);
    res.status(500).json({
      success: false,
      message: 'Error incrementing views',
      error: error.message
    });
  }
};

// Get popular posts
exports.getPopularPosts = async (req, res) => {
  try {
    const posts = await Post.find({ isPublished: true })
      .populate('author', 'name')
      .sort({ views: -1 })
      .limit(5);

    res.json({
      success: true,
      posts
    });
  } catch (error) {
    console.error('Error fetching popular posts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching popular posts',
      error: error.message
    });
  }
};

// Create a new post
exports.createPost = async (req, res) => {
  try {
    const {
      type,
      city,
      content,
      title,
      mediaUrl,
      isBreaking,
      summary,
      scheduledAt
    } = req.body;

    // Basic validation
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    if (!city) {
      return res.status(400).json({ error: 'City is required' });
    }
    if (!type) {
      return res.status(400).json({ error: 'Type is required' });
    }

    // Create and save new post
    const newPost = new Post({
      type,
      city,
      content,
      title: title || 'Untitled',
      mediaUrl,
      isBreaking: isBreaking || false,
      summary,
      createdBy: req.user._id,
      scheduledAt: scheduledAt || new Date(),
      isPublished: !scheduledAt || new Date(scheduledAt) <= new Date()
    });

    await newPost.save();

    // Create notification for scheduled posts
    if (scheduledAt && new Date(scheduledAt) > new Date()) {
      await createNotification(
        req.user._id,
        `Post "${title}" scheduled for ${new Date(scheduledAt).toLocaleString()}`,
        newPost._id
      );
    }

    res.status(201).json({
      message: 'Post saved successfully',
      post: newPost
    });
  } catch (error) {
    console.error('Error saving post:', error);
    res.status(500).json({ error: 'Failed to save post', details: error.message });
  }
};

// Get available cities (for filter dropdown)
exports.getCities = async (req, res) => {
  try {
    const cities = await Post.distinct('city');
    res.json({
      success: true,
      cities: cities.filter(city => city) // Remove null/empty values
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cities',
      error: error.message
    });
  }
};

// Get post categories (for filter dropdown)
exports.getCategories = async (req, res) => {
  try {
    const categories = await Post.distinct('category');
    res.json({
      success: true,
      categories: categories.filter(category => category)
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

// Update post
exports.updatePost = async (req, res) => {
  try {
    const {
      title,
      content,
      category,
      city,
      type,
      images,
      scheduledAt,
      isPublished,
      metaTitle,
      metaDescription,
      slug
    } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Update fields
    if (title) post.title = title;
    if (content) post.content = content;
    if (category) post.category = category;
    if (city) post.city = city;
    if (type) post.type = type;
    if (images) post.images = images;
    if (scheduledAt !== undefined) post.scheduledAt = scheduledAt;
    if (isPublished !== undefined) post.isPublished = isPublished;
    if (metaTitle) post.metaTitle = metaTitle;
    if (metaDescription) post.metaDescription = metaDescription;
    if (slug) post.slug = slug;

    await post.save();

    res.json({
      success: true,
      message: 'Post updated successfully',
      post
    });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating post',
      error: error.message
    });
  }
};

// Get a single post by ID
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email');
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    res.json({
      success: true,
      post
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching post',
      error: error.message
    });
  }
};

// Delete a post by ID
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting post',
      error: error.message
    });
  }
}; 