import express from 'express';
import {
  createSparePartReview,
  getAllSparePartReviews,
  updateSparePartReview,
  deleteSparePartReview,
  getSparePartReviewsByPartId
} from '../controllers/sparePartReviewController.js';

import { verifyAdmin, verifyUser } from '../utils/verifyToken.js';

const router = express.Router();

// ✅ Users can post reviews for a spare part by ID
router.post('/:sparePartId', verifyUser, createSparePartReview);

router.get('/part/:sparePartId', getSparePartReviewsByPartId);

// ✅ Admin can view all reviews
router.get('/', verifyAdmin, getAllSparePartReviews);

// ✅ Admin can update a review
router.put('/:id', verifyAdmin, updateSparePartReview);

// ✅ Admin can delete a review
router.delete('/:id', verifyAdmin, deleteSparePartReview);

export default router;
