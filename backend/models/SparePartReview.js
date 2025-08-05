import mongoose from 'mongoose';

const sparePartReviewSchema = new mongoose.Schema({
  sparePartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SparePart',
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  reviewText: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
}, {
  timestamps: true,
});

export default mongoose.model('SparePartReview', sparePartReviewSchema);
