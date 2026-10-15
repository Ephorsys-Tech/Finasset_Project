import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    designation: {
      type: String,
      default: 'Valued Client, Bhubaneswar',
    },
    location: {
      type: String,
      default: 'Bhubaneswar, Odisha',
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    serviceUsed: {
      type: String,
      default: 'Financial Planning & Wealth Management',
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

export default mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
