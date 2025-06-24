const cron = require('node-cron');
const Post = require('../models/Post');
const { createNotification } = require('../controllers/notificationController');

// Run every minute to check for posts that need to be published
const startPublishingScheduledPosts = () => {
  cron.schedule('* * * * *', async () => {
    try {
      // Find posts that are scheduled for now or earlier but not yet published
      const posts = await Post.find({
        isPublished: false,
        scheduledAt: { $lte: new Date() }
      });

      for (const post of posts) {
        // Update post to published
        await Post.findByIdAndUpdate(post._id, { isPublished: true });

        // Create notification for the editor
        await createNotification(
          post.createdBy,
          `Your scheduled post "${post.title}" has been published`,
          post._id
        );
      }

      if (posts.length > 0) {
        console.log(`Published ${posts.length} scheduled posts`);
      }
    } catch (error) {
      console.error('Error publishing scheduled posts:', error);
    }
  });
};

module.exports = startPublishingScheduledPosts; 