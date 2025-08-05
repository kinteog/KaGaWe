import mongoose from 'mongoose';

const sparePartOrderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },

  sparePartId: {
    type: String,
    required: true,
  },

  partName: {
    type: String,
    required: true,
  },

  partNumber: {
    type: String,
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
    min: 1,
  },

  pricePerUnit: {
    type: Number,
    required: true,
  },

  totalPrice: {
    type: Number,
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

  deliveryAddress: {
    type: String,
    required: true,
  },

  shippingOption: {
    type: String,
    enum: ['Pickup', 'Courier'],
    required: true,
  },

  paymentMethod: {
    type: String,
    enum: ['Online', 'Pay-on-Delivery'],
    required: true,
  },

  status: {
    type: String,
    enum: ['new', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'new',
  },

  specialInstructions: {
    type: String,
    default: '',
  },
}, { timestamps: true });

export default mongoose.model('SparePartOrder', sparePartOrderSchema);
