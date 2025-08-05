// routes/reviewEcuFileRoutes.js

import express from 'express';
import {
  createECUFileReview,
  getAllECUFileReviews,
  updateECUFileReview,
  deleteECUFileReview
} from '../controllers/reviewECUFileController.js';

import { verifyAdmin, verifyUser } from '../utils/verifyToken.js';

const router = express.Router();

// ✅ Create a review for a specific ECU file
router.post('/:ecuFileId', verifyUser, createECUFileReview);

// ✅ Get all ECU file reviews (admin)
router.get('/', verifyAdmin, getAllECUFileReviews);

// ✅ Update review (admin)
router.put('/:id', verifyAdmin, updateECUFileReview);

// ✅ Delete review (admin)
router.delete('/:id', verifyAdmin, deleteECUFileReview);

export default router;
