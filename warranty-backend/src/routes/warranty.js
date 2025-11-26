import { Router } from 'express';
import { supabaseAuth } from '../middleware/supabaseAuth.js';
import { addWarranty, getWarranties, getWarrantyById } from '../controllers/warrantyController.js';

const router = Router();

// Removed upload.single('file') as we expect JSON now
router.post('/add', supabaseAuth, addWarranty);
router.get('/list', supabaseAuth, getWarranties);
router.get('/:id', supabaseAuth, getWarrantyById);

export default router;
