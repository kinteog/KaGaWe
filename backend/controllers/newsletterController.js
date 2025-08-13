import Newsletter from '../models/Newsletter.js';

export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email exists
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    // Check duplicates
    const existing = await Newsletter.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: "You are already subscribed" });
    }

    // Save new subscription
    const subscription = new Newsletter({ email: email.toLowerCase() });
    await subscription.save();

    res.status(201).json({ success: true, message: "Subscribed successfully!" });
  } catch (err) {
    console.error("Newsletter subscription error:", err);
    res.status(500).json({ success: false, message: "Failed to subscribe" });
  }
};

// Get all newsletter subscribers
export const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });
    res.status(200).json({
      success: true,
      data: subscribers
    });
  } catch (err) {
    console.error("Fetch subscribers error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch subscribers" });
  }
};

// Delete a subscriber by ID
export const deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Newsletter.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Subscriber not found" });
    }

    res.status(200).json({ success: true, message: "Subscriber deleted" });
  } catch (err) {
    console.error("Delete subscriber error:", err);
    res.status(500).json({ success: false, message: "Failed to delete subscriber" });
  }
};

