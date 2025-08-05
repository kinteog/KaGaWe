import mongoose from "mongoose";

const ecuOrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    ecuFileId: {
      type: String,
      required: true,
    },
    ecuFileTitle: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    fullName: {
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
      type: String, // e.g. "2014–2018" or "2015"
      required: true,
    },
    engineCode: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['Online'],
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'emailed', 'cancelled'],
      default: 'pending',
    },
    deliveryEmailSent: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("EcuOrder", ecuOrderSchema);
