import express from 'express';
import { 
    createService, 
    deleteService, 
    getAllServices, 
    getSingleService, 
    updateService, 
    getServiceBySearch, 
    getFeaturedServices, 
    getServiceCount,
    getAllServicesAdmin 
} from '../controllers/serviceController.js';

import { verifyAdmin } from '../utils/verifyToken.js';

const router = express.Router();

// ✅ Admin-specific route must come first to avoid conflict with /:id
router.get('/admin/all', getAllServicesAdmin);

// ✅ Search and featured queries
router.get('/search/getServiceBySearch', getServiceBySearch);
router.get('/search/getFeaturedServices', getFeaturedServices);
router.get('/search/getServiceCount', getServiceCount);

// ✅ CRUD operations
router.post('/', verifyAdmin, createService);
router.put('/:id', verifyAdmin, updateService);
router.delete('/:id', verifyAdmin, deleteService);

// ✅ General service queries
router.get('/', getAllServices);
router.get('/:id', getSingleService); 

export default router;
