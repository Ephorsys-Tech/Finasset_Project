import mongoose from 'mongoose';

const PageSectionSchema = new mongoose.Schema({
  heading: { type: String, required: true },
  subHeading: { type: String, default: '' },
  body: { type: String, required: true },
  bulletPoints: [{ type: String }],
  imageUrl: { type: String, default: '' },
  order: { type: Number, default: 0 },
});

const PageSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
    },
    bannerTitle: {
      type: String,
      required: true,
    },
    bannerSubtitle: {
      type: String,
      default: '',
    },
    heroImage: {
      type: String,
      default: '',
    },
    mainContent: {
      type: String,
      default: '',
    },
    sections: [PageSectionSchema],
    metaTitle: {
      type: String,
      default: '',
    },
    metaDescription: {
      type: String,
      default: '',
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Page || mongoose.model('Page', PageSchema);
