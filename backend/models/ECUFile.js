import mongoose from 'mongoose';

const ecuFileSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    vehicleMake: {
      type: String,
      required: true,
    },
    vehicleModel: {
      type: String,
      required: true,
    },
    vehicleYear: {
      type: String,
      required: true,
    },
    engineCode: {
      type: String,
      required: true,
    },
    ecuBrand: {
      type: String,
      required: true,
    },
    ecuVersion: {
      type: String,
      required: true,
    },
    tuningStage: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['available', 'unavailable'],
      default: 'available',
    },
    compatibleVehicles: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

// ✅ Virtual field for reviews
ecuFileSchema.virtual('reviews', {
  ref: 'ECUFileReview',         // <-- Name of the review model
  foreignField: 'ecuFileId',    // <-- Field in review schema pointing to this model
  localField: '_id',
});

export default mongoose.model('ECUFile', ecuFileSchema);
