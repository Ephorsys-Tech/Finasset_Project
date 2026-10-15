import mongoose from 'mongoose';

const MediaSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    altText: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'general',
      enum: ['general', 'services', 'slides', 'blog', 'partners', 'insurers'],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Media || mongoose.model('Media', MediaSchema);
