import { Router } from 'express';
import { supabaseAuth } from '../middleware/supabaseAuth.js';
import { 
  addWarranty, 
  getWarranties, 
  getWarrantyById, 
  deleteWarranty,

  uploadWarranty,
  updateWarranty 
} from '../controllers/warrantyController.js';
import { upload } from '../utils/upload.js';

const router = Router();

router.post('/upload', supabaseAuth, upload.single('receipt'), uploadWarranty);

router.post('/add', supabaseAuth, addWarranty);

router.get('/list', supabaseAuth, getWarranties);

router.get('/:id', supabaseAuth, getWarrantyById);

router.delete('/:id', supabaseAuth, deleteWarranty);

router.put('/:id', supabaseAuth, updateWarranty);

export default router;
