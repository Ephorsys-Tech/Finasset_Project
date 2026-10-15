import mongoose from 'mongoose';

const MarketIndexSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    currentValue: {
      type: Number,
      required: true,
    },
    change: {
      type: Number,
      required: true,
    },
    percentChange: {
      type: Number,
      required: true,
    },
    high52: {
      type: Number,
      default: 0,
    },
    low52: {
      type: Number,
      default: 0,
    },
    isPositive: {
      type: Boolean,
      default: true,
    },
    source: {
      type: String,
      default: 'NSE / BSE Feed (Curated)',
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.MarketIndex || mongoose.model('MarketIndex', MarketIndexSchema);
