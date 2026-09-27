import mongoose from 'mongoose';

const NodeSchema = new mongoose.Schema({
  approvalCode: {
    type: String,
    required: true,
  },
  approvalName: {
    type: String,
    required: true,
  },
  departmentName: {
    type: String,
    required: true,
  },
  prerequisiteCodes: {
    type: [String],
    default: [],
  },
  statutorySlaDays: {
    type: Number,
    required: true,
    default: 30,
  },
  status: {
    type: String,
    enum: [
      'BLOCKED',
      'READY_TO_APPLY',
      'SUBMITTED',
      'IN_INSPECTION',
      'APPROVED',
      'REJECTED',
    ],
    default: 'BLOCKED',
  },
  isParallel: {
    type: Boolean,
    default: false,
  },
  slaElapsedDays: {
    type: Number,
    default: 0,
  },
  slaRiskScore: {
    type: Number,
    default: 0.1,
  },
  slaRiskTier: {
    type: String,
    enum: ['NOMINAL', 'MONITORED', 'BREACH_IMMINENT'],
    default: 'NOMINAL',
  },
  inspectionStatus: {
    type: String,
    enum: ['NONE', 'PENDING', 'SCHEDULED', 'COMPLETED'],
    default: 'NONE',
  },
  queriesCount: {
    type: Number,
    default: 0,
  },
  injectedByPolicy: {
    type: Boolean,
    default: false,
  },
  injectedPolicyReference: {
    type: String,
    default: null,
  },
  applicationReferenceNumber: {
    type: String,
    default: null,
  },
  appliedDate: {
    type: Date,
    default: null,
  },
  approvedDate: {
    type: Date,
    default: null,
  },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
  },
});

const EdgeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  target: {
    type: String,
    required: true,
  },
  edgeType: {
    type: String,
    enum: [
      'MANDATORY_PREREQUISITE',
      'CONDITIONAL_ON_CAPITAL_THRESHOLD',
      'PARALLEL_PERMISSIBLE',
    ],
    default: 'MANDATORY_PREREQUISITE',
  },
  label: {
    type: String,
    default: '',
  },
});

const RegulatoryGraphSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    nodes: [NodeSchema],
    edges: [EdgeSchema],
    criticalPathDays: {
      type: Number,
      default: 105,
    },
    criticalPathNodes: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const RegulatoryGraph = mongoose.model('RegulatoryGraph', RegulatoryGraphSchema);
