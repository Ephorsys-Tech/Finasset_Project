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
      default: '',
      trim: true,
    },
    quote: {
      type: String,
      default: '',
      trim: true,
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
      trim: true,
    },
    avatarPublicId: {
      type: String,
      default: '',
      trim: true,
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

// Pre-validate synchronization hook
TestimonialSchema.pre('validate', function (next) {
  if (this.reviewText && !this.quote) this.quote = this.reviewText;
  if (this.quote && !this.reviewText) this.reviewText = this.quote;
  next();
});

if (mongoose.models.Testimonial) {
  delete mongoose.models.Testimonial;
}

export default mongoose.model('Testimonial', TestimonialSchema);
