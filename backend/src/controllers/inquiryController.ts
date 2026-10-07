import { Request, Response } from 'express';
import { z } from 'zod';
import { Inquiry } from '../models/Inquiry.js';
import { sendInquiryEmail } from '../services/emailService.js';

export const inquirySchema = z.object({
  name: z.string().min(2).max(100),
  businessName: z.string().min(2).max(120),
  phone: z.string().min(7).max(24),
  email: z.string().email().max(254),
  businessType: z.enum(['Yatra Operator', 'Travel Agency', 'Tour Operator', 'Pilgrimage Business', 'Other']),
  message: z.string().min(10).max(2000),
});

export const createInquiry = async (req: Request, res: Response): Promise<Response> => {
  const parsed = inquirySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Please check your enquiry details and try again.',
      details: parsed.error.format(),
    });
  }

  try {
    // 1. Save to MongoDB Atlas collection: 'inquiries' in database 'nx-yatra'
    const newInquiry = await Inquiry.create({
      ...parsed.data,
      email: parsed.data.email.trim().toLowerCase(),
      source: 'website',
    });

    const reference = newInquiry._id.toString();

    // 2. Send Email Notification via Nodemailer to hr@nexisparkx.com
    sendInquiryEmail({
      name: parsed.data.name,
      businessName: parsed.data.businessName,
      phone: parsed.data.phone,
      email: parsed.data.email,
      businessType: parsed.data.businessType,
      message: parsed.data.message,
      reference,
    }).catch((err) => console.error('[Email Trigger Error]:', err));

    return res.status(201).json({
      received: true,
      reference,
    });
  } catch (error) {
    console.error('[Inquiry Error]:', error);
    return res.status(500).json({
      error: "We couldn't save your enquiry right now. Please try again shortly.",
    });
  }
};

export const getInquiries = async (req: Request, res: Response): Promise<Response> => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 }).limit(100);
    return res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error) {
    console.error('[Get Inquiries Error]:', error);
    return res.status(500).json({
      error: 'Failed to fetch enquiries.',
    });
  }
};
