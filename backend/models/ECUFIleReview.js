import mongoose from 'mongoose';

const ecuFileReviewSchema = new mongoose.Schema(
  {
    ecuFileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ECUFile',
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
      min: 1,
      max: 5,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('ECUFileReview', ecuFileReviewSchema);
