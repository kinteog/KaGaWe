
import express from 'express';
import {
  createRevieww,
  getAllServiceReviews,
  updateServiceReview,
  deleteServiceReview
} from '../controllers/reviewServiceController.js';
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js';

const router = express.Router()

router.post('/:serviceId',verifyUser, createRevieww )
router.get('/', verifyAdmin, getAllServiceReviews);
router.put('/:id', verifyAdmin, updateServiceReview);
router.delete('/:id', verifyAdmin, deleteServiceReview);

export default router




