// routes/ecuFileOrderRoutes.js

import express from 'express';
import {
  verifyAdmin,
  verifyUser,
} from '../utils/verifyToken.js';

import {
  createEcuFileOrder,
  getAllEcuFileOrders,
  getEcuFileOrder,
  updateEcuFileOrder,
  deleteEcuFileOrder,
  getUserEcuFileOrders,
} from '../controllers/ecuOrderController.js';



const router = express.Router();

/* ========== USER ROUTES ========== */

// ✅ Get all orders for a specific user (must come first)
router.get('/user/:userId', verifyUser, getUserEcuFileOrders);

// ✅ Place an order
router.post('/', verifyUser, createEcuFileOrder);

/* ========== ADMIN ROUTES ========== */

// ✅ Get all orders (admin only)
router.get('/', verifyAdmin, getAllEcuFileOrders);

// ✅ Update order (admin only)
router.put('/:id', verifyAdmin, updateEcuFileOrder);

// ✅ Delete order (admin only)
router.delete('/:id', verifyAdmin, deleteEcuFileOrder);

/* ========== DYNAMIC LAST ========== */

// ✅ Get a specific order by ID
router.get('/:id', verifyUser, getEcuFileOrder);

export default router;
