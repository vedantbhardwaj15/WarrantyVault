import { Router } from 'express';
import { setSession, refreshSession, logout, getUser } from '../controllers/authController.js';

const router = Router();

router.post('/session', setSession);
router.post('/refresh', refreshSession);
router.post('/logout', logout);
router.get('/me', getUser);

export default router;
