import mongoose from 'mongoose';

const PartnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Client Partner',
      trim: true,
    },
    category: {
      type: String,
      default: 'Mutual Fund AMC',
      enum: ['Mutual Fund AMC', 'Insurance Partner', 'PMS & AIF Provider', 'Banking & Depository', 'Other Partner'],
    },
    imageUrl: {
      type: String,
      default: '',
    },
    imagePublicId: {
      type: String,
      default: '',
    },
    logoUrl: {
      type: String,
      default: '',
    },
    logoPublicId: {
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

// Keep imageUrl and logoUrl synced
PartnerSchema.pre('save', function (next) {
  if (this.imageUrl && !this.logoUrl) {
    this.logoUrl = this.imageUrl;
  } else if (this.logoUrl && !this.imageUrl) {
    this.imageUrl = this.logoUrl;
  }
  if (this.imagePublicId && !this.logoPublicId) {
    this.logoPublicId = this.imagePublicId;
  } else if (this.logoPublicId && !this.imagePublicId) {
    this.imagePublicId = this.logoPublicId;
  }
  next();
});

if (mongoose.models.Partner) {
  delete mongoose.models.Partner;
}

export default mongoose.model('Partner', PartnerSchema);
