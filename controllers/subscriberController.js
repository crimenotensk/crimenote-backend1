const Subscriber = require('../models/Subscriber');
const nodemailer = require('nodemailer');

// Subscribe to newsletter
exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if already subscribed
    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
      if (existingSubscriber.active) {
        return res.status(400).json({
          success: false,
          message: 'Email already subscribed'
        });
      } else {
        // Reactivate subscription
        existingSubscriber.active = true;
        await existingSubscriber.save();
        return res.json({
          success: true,
          message: 'Subscription reactivated successfully'
        });
      }
    }

    // Create new subscriber
    const subscriber = new Subscriber({ email });
    await subscriber.save();

    res.status(201).json({
      success: true,
      message: 'Subscribed successfully'
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Error subscribing to newsletter',
      error: error.message
    });
  }
};

// Get all subscribers (admin only)
exports.getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find({ active: true })
      .sort({ subscriptionDate: -1 });

    res.json({
      success: true,
      subscribers
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subscribers',
      error: error.message
    });
  }
};

// Send newsletter to all subscribers
exports.sendNewsletter = async (req, res) => {
  try {
    const { subject, content } = req.body;

    // Get all active subscribers
    const subscribers = await Subscriber.find({ active: true });
    if (!subscribers.length) {
      return res.status(404).json({
        success: false,
        message: 'No active subscribers found'
      });
    }

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Send emails
    const emailPromises = subscribers.map(subscriber => {
      return transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: subscriber.email,
        subject: subject,
        html: content
      });
    });

    await Promise.all(emailPromises);

    res.json({
      success: true,
      message: `Newsletter sent to ${subscribers.length} subscribers`
    });
  } catch (error) {
    console.error('Error sending newsletter:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending newsletter',
      error: error.message
    });
  }
}; 