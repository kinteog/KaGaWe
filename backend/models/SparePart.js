import mongoose from 'mongoose';

const sparePartSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  description: { type: String },
  compatibleModels: { type: [String], default: [] },
  manufacturer: { type: String },
  partNumber: { type: String, required: true, unique: true },
  price: { type: Number, required: true, min: 0 },
  stockQuantity: { type: Number, default: 0 },
  condition: {
    type: String,
    enum: ['New', 'Used', 'Refurbished'],
    default: 'New',
  },
  imageUrl: { type: String, required: true },
  location: { type: String },
  isFeatured: { type: Boolean, default: false },
  shippingOptions: {
    type: [String],
    enum: ['Pickup', 'Courier'],
    default: ['Pickup'],
  },
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

// 🔁 Virtual population for reviews
sparePartSchema.virtual('reviews', {
  ref: 'SparePartReview',
  foreignField: 'sparePartId',
  localField: '_id',
});

export default mongoose.model('SparePart', sparePartSchema);
