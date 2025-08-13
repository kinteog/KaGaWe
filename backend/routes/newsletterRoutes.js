import express from 'express';
import { subscribeNewsletter, getAllSubscribers, deleteSubscriber } from '../controllers/newsletterController.js';

const router = express.Router();

router.post('/', subscribeNewsletter);
router.get('/', getAllSubscribers);
router.delete('/:id', deleteSubscriber);

export default router;
