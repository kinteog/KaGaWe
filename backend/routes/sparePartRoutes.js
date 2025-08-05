import express from 'express';
import {
  createSparePart,
  deleteSparePart,
  updateSparePart,
  getAllSpareParts,
  getSingleSparePart,
  getSparePartBySearch,
  getFeaturedSpareParts,
  getSparePartCount,
  getAllSparePartsAdmin
} from '../controllers/sparePartController.js';

import { verifyAdmin } from '../utils/verifyToken.js';

const router = express.Router();

// Admin-only route (must be above /:id)
router.get('/admin/all', verifyAdmin, getAllSparePartsAdmin);

// Search + featured + count
router.get('/search/getSparePartBySearch', getSparePartBySearch);
router.get('/search/getFeaturedSpareParts', getFeaturedSpareParts);
router.get('/search/getSparePartCount', getSparePartCount);

// Admin CRUD
router.post('/', verifyAdmin, createSparePart);
router.put('/:id', verifyAdmin, updateSparePart);
router.delete('/:id', verifyAdmin, deleteSparePart);

// Public routes
router.get('/', getAllSpareParts);         // paginated
router.get('/:id', getSingleSparePart);    // get one by ID

export default router;
