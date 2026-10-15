import mongoose from 'mongoose';

const NewsItemSchema = new mongoose.Schema(
  {
    tab: {
      type: String,
      required: true,
      enum: ['popular', 'ipo', 'market'],
      default: 'market',
    },
    title: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      default: 'Finasset Market Desk',
    },
    url: {
      type: String,
      default: '',
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    badge: {
      type: String,
      default: 'Market Alert',
    },
    isFeatured: {
      type: Boolean,
      default: false,
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

export default mongoose.models.NewsItem || mongoose.model('NewsItem', NewsItemSchema);
