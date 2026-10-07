import { Router } from 'express';
import { createInquiry, getInquiries } from '../controllers/inquiryController.js';

const router = Router();

// Endpoint matching frontend API call: /api/nx-yatra/inquiries
router.post('/nx-yatra/inquiries', createInquiry);
router.get('/nx-yatra/inquiries', getInquiries);

export default router;
