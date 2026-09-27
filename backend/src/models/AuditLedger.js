import mongoose from 'mongoose';

const AuditLedgerSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    actorType: {
      type: String,
      enum: ['ENTREPRENEUR', 'DEPARTMENT_OFFICER', 'SYSTEM_SCHEDULER', 'AI_AGENT'],
      required: true,
    },
    actorName: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: [
        'PROJECT_INITIALIZED',
        'NODE_UNBLOCKED',
        'NODE_STATE_CHANGED',
        'DOCUMENT_EXTRACTED',
        'DISCREPANCY_FLAGGED',
        'FIGURE_RECONCILED',
        'APPROVAL_GRANTED',
        'POLICY_AMENDMENT_INJECTED',
        'SLA_TICK',
        'SLA_RISK_ESCALATED',
        'QUERY_RAISED',
      ],
    },
    nodeCode: {
      type: String,
      default: null,
    },
    previousState: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    newState: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    justificationNote: {
      type: String,
      required: true,
    },
    slaTimeElapsedDelta: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const AuditLedger = mongoose.model('AuditLedger', AuditLedgerSchema);
