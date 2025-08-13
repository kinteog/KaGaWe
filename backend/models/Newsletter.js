import mongoose from 'mongoose';

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"]
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Newsletter', newsletterSchema);
