import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    priceRange: {
      type: String, // Storing as a string (e.g., "$40 - $80")
      required: true,
    },
    estimatedDuration: {
      type: String, // Example: "30-60 minutes"
      required: true,
    },
    category: {
      type: String, // Example: "Engine Service", "Oil Change"
      required: true,
    },
    bookingOptions: {
      onlinePayment: { type: Boolean, default: false },
      depositRequired: { type: Boolean, default: false },
      payOnArrival: { type: Boolean, default: true },
    },
    photo: {
      type: String,
      required: true, // or false if optional
    },
  
    featured: {
        type: Boolean,
        default: false,
    },
  },
  { timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
   }
);

serviceSchema.virtual('reviews', {
  ref: 'ServiceReview',
  foreignField: 'serviceId',
  localField: '_id',
});

export default mongoose.model("Service", serviceSchema);
