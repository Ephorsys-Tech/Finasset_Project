import mongoose from 'mongoose';

const BlogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: true,
      default: 'Financial Planning',
    },
    author: {
      type: String,
      default: 'Finasset Research Desk',
    },
    featuredImage: {
      type: String,
      default: '',
    },
    featuredImagePublicId: {
      type: String,
      default: '',
    },
    tags: [
      {
        type: String,
      },
    ],
    readingTime: {
      type: String,
      default: '5 min read',
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
    metaTitle: {
      type: String,
      default: '',
    },
    metaDescription: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);
