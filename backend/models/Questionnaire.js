import mongoose from 'mongoose';

const OptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  score: { type: Number, required: true },
  description: { type: String, default: '' },
});

const QuestionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  category: { type: String, default: 'General' },
  options: [OptionSchema],
});

const ResultBandSchema = new mongoose.Schema({
  minScore: { type: Number, required: true },
  maxScore: { type: Number, required: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  recommendation: { type: String, required: true },
  assetAllocation: {
    equity: { type: Number, default: 50 },
    debt: { type: Number, default: 40 },
    goldRealEstate: { type: Number, default: 10 },
  },
  badgeColor: { type: String, default: '#C7A76C' },
});

const QuestionnaireSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      enum: ['risk-profile', 'financial-fitness'],
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    questions: [QuestionSchema],
    resultBands: [ResultBandSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Questionnaire || mongoose.model('Questionnaire', QuestionnaireSchema);
