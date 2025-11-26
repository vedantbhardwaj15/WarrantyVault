import { Router } from 'express';
import { ocrExtract } from '../controllers/ocrController.js';
import { supabaseAuth } from '../middleware/supabaseAuth.js';

const router = Router();

// Changed to use JSON body, so no 'upload.single' needed here
// Also added auth middleware to ensure user owns the file (conceptually)
router.post('/extract', supabaseAuth, ocrExtract);

export default router;
