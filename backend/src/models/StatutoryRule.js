import mongoose from 'mongoose';

const StatutoryRuleSchema = new mongoose.Schema(
  {
    departmentId: {
      type: String,
      required: true,
      index: true,
    },
    ruleCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    ruleTitle: {
      type: String,
      required: true,
    },
    actCitation: {
      type: String,
      required: true,
    },
    gazetteReference: {
      type: String,
      required: true,
    },
    effectiveDate: {
      type: Date,
      default: Date.now,
    },
    baselineSlaDays: {
      type: Number,
      required: true,
      default: 30,
    },
    applicableConditions: {
      sectors: [String],
      minCapitalCrores: { type: Number, default: 0 },
      maxCapitalCrores: { type: Number, default: 100000 },
      landTypes: [String],
    },
    documentRequirements: [String],
    gazetteSnippet: {
      type: String,
      required: true,
    },
    vectorEmbedding: {
      type: [Number],
      default: [],
    },
    versionTag: {
      type: String,
      default: 'MH-2026.1',
    },
  },
  {
    timestamps: true,
  }
);

export const StatutoryRule = mongoose.model('StatutoryRule', StatutoryRuleSchema);
