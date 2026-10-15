import mongoose from 'mongoose';

const PartnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: 'Mutual Fund AMC',
      enum: ['Mutual Fund AMC', 'Insurance Partner', 'PMS & AIF Provider', 'Banking & Depository'],
    },
    logoUrl: {
      type: String,
      default: '',
    },
    websiteUrl: {
      type: String,
      default: '',
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

export default mongoose.models.Partner || mongoose.model('Partner', PartnerSchema);
