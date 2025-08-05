import mongoose from "mongoose";

const serviceBookingSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    serviceId: {
      type: String,
      required: true,
    },
    priceRange: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
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
      type: Number,
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
    },
    bookedDate: {
      type: Date,
      required: true,
    },
    specialRequests: {
      type: String,
      default: "",
    },
    paymentMethod: {
      type: String,
      enum: ['Online', 'Deposit', 'Pay-on-Arrival'],
      required: true,
    },
    status: {
      type: String,
      enum: ['new', 'confirmed', 'serviced', 'not serviced', 'cancelled', 'other'],
      default: 'new',
    },
  },
  { timestamps: true }
);

export default mongoose.model("ServiceBooking", serviceBookingSchema);
