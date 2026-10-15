import mongoose from 'mongoose';

const InsurerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Life Insurance', 'Health Insurance', 'General Insurance'],
      default: 'Life Insurance',
    },
    logoUrl: {
      type: String,
      default: '',
    },
    paymentPortalUrl: {
      type: String,
      required: true,
    },
    helpline: {
      type: String,
      default: '1800-XXX-XXXX',
    },
    description: {
      type: String,
      default: 'Instant online premium payment gateway for active policy holders.',
    },
    order: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Insurer || mongoose.model('Insurer', InsurerSchema);
