import express from 'express';
import { capturePayment, verifyPayment } from '../controllers/payment';
import { auth } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/capture', auth as any, capturePayment);
router.post('/verify', verifyPayment as any);

export default router; 