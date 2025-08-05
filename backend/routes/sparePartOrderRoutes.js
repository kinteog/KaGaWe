import express from 'express';
import {
  verifyAdmin,
  verifyUser,
} from '../utils/verifyToken.js';

import {
  createSparePartOrder,
  getAllSparePartOrders,
  getSparePartOrder,
  updateSparePartOrder,
  deleteSparePartOrder,
  getUserSparePartOrders,
} from '../controllers/sparePartOrderController.js';

const router = express.Router();

/* ========== USER ROUTES ========== */

// ✅ View logged-in user's orders
router.get('/user/:userId', verifyUser, getUserSparePartOrders);

// ✅ Place a new spare part order
router.post('/', verifyUser, createSparePartOrder);

/* ========== ADMIN ROUTES ========== */

// ✅ Get all orders
router.get('/', verifyAdmin, getAllSparePartOrders);

// ✅ Update order
router.put('/:id', verifyAdmin, updateSparePartOrder);

// ✅ Delete order
router.delete('/:id', verifyAdmin, deleteSparePartOrder);

/* ========== DYNAMIC LAST ========== */

// ✅ Get specific order by ID (user or admin)
router.get('/:id', verifyUser, getSparePartOrder);

export default router;
