import mongoose from 'mongoose';

const NewsItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'News title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    // Backwards-compatible alias for description
    summary: {
      type: String,
      default: '',
      trim: true,
    },
    // Tag badge pill (e.g., "Tax Alert", "Market Alert", "IPO Alert")
    tag: {
      type: String,
      default: 'Tax Alert',
      trim: true,
    },
    // Backwards-compatible alias for tag
    badge: {
      type: String,
      default: 'Tax Alert',
      trim: true,
    },
    // Sub-tag / desk attribution (e.g., "Tax & Compliance Desk")
    subTag: {
      type: String,
      default: 'Tax & Compliance Desk',
      trim: true,
    },
    // Backwards-compatible alias for subTag
    source: {
      type: String,
      default: 'Tax & Compliance Desk',
      trim: true,
    },
    // Date with year, not time (e.g., "11 Jan, 2025")
    date: {
      type: String,
      default: '',
      trim: true,
    },
    // Minutes of read (e.g., "3 min Read")
    readTime: {
      type: String,
      default: '3 min Read',
      trim: true,
    },
    // Cloudinary Image URL & Public ID for deletion
    imageUrl: {
      type: String,
      default: '',
      trim: true,
    },
    imagePublicId: {
      type: String,
      default: '',
      trim: true,
    },
    publicUrl: {
      type: String,
      default: '',
      trim: true,
    },
    tab: {
      type: String,
      enum: ['popular', 'ipo', 'market'],
      default: 'market',
    },
    url: {
      type: String,
      default: '',
      trim: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
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

// Pre-validate synchronization hook
NewsItemSchema.pre('validate', function (next) {
  if (this.description && !this.summary) this.summary = this.description;
  if (this.summary && !this.description) this.description = this.summary;
  if (this.tag && !this.badge) this.badge = this.tag;
  if (this.badge && !this.tag) this.tag = this.badge;
  if (this.subTag && !this.source) this.source = this.subTag;
  if (this.source && !this.subTag) this.subTag = this.source;
  if (!this.date && this.publishedAt) {
    try {
      this.date = new Date(this.publishedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      this.date = '';
    }
  }
  next();
});

if (mongoose.models.NewsItem) {
  delete mongoose.models.NewsItem;
}

export default mongoose.model('NewsItem', NewsItemSchema);
