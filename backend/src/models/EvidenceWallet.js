import mongoose from 'mongoose';

const EvidenceWalletItemSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
      index: true,
    },
    factKey: {
      type: String,
      required: true,
    },
    factLabel: {
      type: String,
      required: true,
    },
    extractedValue: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    declaredValue: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    unit: {
      type: String,
      default: '',
    },
    normalizedDataType: {
      type: String,
      enum: ['CURRENCY', 'NUMBER', 'STRING', 'DATE'],
      default: 'STRING',
    },
    provenance: {
      sourceDocumentId: { type: String, default: null },
      sourceDocumentName: { type: String, required: true },
      documentHash: { type: String, required: true },
      pageNumber: { type: Number, default: 1 },
      paragraph: { type: String, default: '' },
      contextSnippet: { type: String, required: true },
      confidenceScore: { type: Number, default: 0.95 },
      extractedBy: { type: String, default: 'Automated Document AI' },
    },
    validationState: {
      type: String,
      enum: ['UNVERIFIED', 'VERIFIED_MATCH', 'DISCREPANCY_FLAGGED'],
      default: 'UNVERIFIED',
    },
    conflictMetadata: {
      variance: { type: String, default: null },
      varianceNumeric: { type: Number, default: 0 },
      severity: { type: String, enum: ['NONE', 'INFO', 'ACTION_REQUIRED'], default: 'NONE' },
      statutoryReference: { type: String, default: '' },
      discrepancyAlert: { type: String, default: '' },
      actionNeeded: { type: String, default: '' },
      reconciledAt: { type: Date, default: null },
      reconcileResolution: { type: String, default: null },
    },
  },
  {
    timestamps: true,
  }
);

export const EvidenceWallet = mongoose.model('EvidenceWallet', EvidenceWalletItemSchema);
