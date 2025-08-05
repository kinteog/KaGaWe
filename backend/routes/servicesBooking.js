import express from 'express';
import {
  verifyAdmin,
  verifyUser,
} from '../utils/verifyToken.js';

import {
  createServiceBooking,
  getAllServiceBookings,
  getServiceBooking,
  updateServiceBooking,
  deleteServiceBooking,
  getUserServiceBookings,
} from '../controllers/serviceBookingController.js';

const router = express.Router();

/* ========== USER ROUTES ========== */

// ✅ Place this route FIRST to prevent collision with /:id
router.get('/user/:userId', verifyUser, getUserServiceBookings);

// ✅ Create a booking
router.post('/', verifyUser, createServiceBooking);

/* ========== ADMIN ROUTES ========== */

// ✅ Get all bookings (admin only)
router.get('/', verifyAdmin, getAllServiceBookings);

// ✅ Update booking (admin only)
router.put('/:id', verifyAdmin, updateServiceBooking);

// ✅ Delete booking (admin only)
router.delete('/:id', verifyAdmin, deleteServiceBooking);

/* ========== DYNAMIC LAST ========== */

// ✅ Must be LAST: get a specific booking by ID
router.get('/:id', verifyUser, getServiceBooking);

export default router;
