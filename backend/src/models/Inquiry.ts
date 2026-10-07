import mongoose, { Schema, Document } from 'mongoose';

export interface IInquiry extends Document {
  name: string;
  businessName: string;
  phone: string;
  email: string;
  businessType: 'Yatra Operator' | 'Travel Agency' | 'Tour Operator' | 'Pilgrimage Business' | 'Other';
  message: string;
  source: string;
  createdAt: Date;
}

const InquirySchema: Schema = new Schema<IInquiry>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    businessName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 120,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      maxlength: 24,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    businessType: {
      type: String,
      required: true,
      enum: ['Yatra Operator', 'Travel Agency', 'Tour Operator', 'Pilgrimage Business', 'Other'],
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 2000,
    },
    source: {
      type: String,
      default: 'website',
    },
  },
  {
    timestamps: true,
  }
);

export const Inquiry = mongoose.model<IInquiry>('Inquiry', InquirySchema);
