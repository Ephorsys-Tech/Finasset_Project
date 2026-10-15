import mongoose from 'mongoose';

const InvestorToolSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    badge: {
      type: String,
      default: 'Investor Utility',
    },
    shortDescription: {
      type: String,
      required: true,
    },
    actionText: {
      type: String,
      default: 'Launch Tool',
    },
    url: {
      type: String,
      required: true,
    },
    iconName: {
      type: String,
      default: 'Calculator',
    },
    accentColor: {
      type: String,
      default: '#C7A76C',
    },
    order: {
      type: Number,
      default: 0,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    calculatorDefaults: {
      defaultSipAmount: { type: Number, default: 10000 },
      defaultTenureYears: { type: Number, default: 15 },
      defaultExpectedReturn: { type: Number, default: 12.5 },
      defaultLumpsumAmount: { type: Number, default: 500000 },
      disclaimer: {
        type: String,
        default: 'Calculations are based on assumed rates of return compounded periodically and are for illustrative purposes only. They do not constitute guaranteed returns.',
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.InvestorTool || mongoose.model('InvestorTool', InvestorToolSchema);
