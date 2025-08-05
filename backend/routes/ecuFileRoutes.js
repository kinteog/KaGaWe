// routes/ecuFileRoutes.js

import express from 'express';
import {
  createECUFile,
  deleteECUFile,
  getAllECUFiles,
  getSingleECUFile,
  updateECUFile,
  getECUFileBySearch,
  getFeaturedECUFiles,
  getECUFileCount,
  getAllECUFilesAdmin,
} from '../controllers/ecuFileController.js';

import { verifyAdmin } from '../utils/verifyToken.js';

const router = express.Router();

// ✅ Admin-specific route must come first to avoid conflict with /:id
router.get('/admin/all', verifyAdmin, getAllECUFilesAdmin);

// ✅ Search and featured queries
router.get('/search/getECUFileBySearch', getECUFileBySearch);
router.get('/search/getFeaturedECUFiles', getFeaturedECUFiles);
router.get('/search/getECUFileCount', getECUFileCount);

// ✅ CRUD operations
router.post('/', verifyAdmin, createECUFile);
router.put('/:id', verifyAdmin, updateECUFile);
router.delete('/:id', verifyAdmin, deleteECUFile);

// ✅ General queries
router.get('/', getAllECUFiles);
router.get('/:id', getSingleECUFile);

export default router;
