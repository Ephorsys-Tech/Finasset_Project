import mongoose from 'mongoose';

const EnquiryNoteSchema = new mongoose.Schema({
  note: { type: String, required: true },
  adminName: { type: String, default: 'Admin' },
  createdAt: { type: Date, default: Date.now },
});

const EnquirySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['callback', 'contact', 'career', 'consultation'],
      default: 'callback',
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
    },
    serviceOfInterest: {
      type: String,
      default: 'General Wealth Consultation',
    },
    preferredTime: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    sourcePage: {
      type: String,
      default: 'Homepage',
    },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'CLOSED'],
      default: 'NEW',
    },
    notes: [EnquiryNoteSchema],
    ipAddress: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);
