import mongoose from 'mongoose';

const HeroSlideSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    badge: {
      type: String,
      default: 'Finasset Wealth Management',
    },
    cta1Text: {
      type: String,
      default: 'Explore Services',
    },
    cta1Url: {
      type: String,
      default: '/services',
    },
    cta2Text: {
      type: String,
      default: 'Calculate Wealth',
    },
    cta2Url: {
      type: String,
      default: '/investor/financial-calculator',
    },
    bgImageUrl: {
      type: String,
      default: '',
    },
    publicId: {
      type: String,
      default: '',
    },
    statsHighlight: {
      label: { type: String, default: 'Client Trust' },
      value: { type: String, default: '15+ Years in Odisha' },
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.HeroSlide || mongoose.model('HeroSlide', HeroSlideSchema);
