import mongoose from 'mongoose';

const ProjectTwinSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    enterpriseEntityId: {
      type: String,
      required: true,
      trim: true,
    },
    stateJurisdiction: {
      type: String,
      required: true,
      default: 'MH',
    },
    district: {
      type: String,
      required: true,
      default: 'Pune',
    },
    industrySector: {
      type: String,
      required: true,
      default: 'Food Processing',
    },
    nicCode: {
      type: String,
      default: '10792', // Manufacture of food products
    },
    capitalInvestmentCrores: {
      type: Number,
      required: true,
      default: 12.0,
    },
    proposedEmployment: {
      type: Number,
      required: true,
      default: 150,
    },
    landClassification: {
      type: String,
      required: true,
      enum: [
        'MIDC Industrial Zone',
        'Private Agricultural Conversion',
        'Coastal Regulation Zone',
        'Notified Industrial Estate',
      ],
      default: 'MIDC Industrial Zone',
    },
    surveyPlotNumber: {
      type: String,
      default: 'Plot No. C-44, Phase II, Chakan MIDC',
    },
    waterDemandKld: {
      type: Number,
      default: 45.0, // KLD
    },
    powerDemandKw: {
      type: Number,
      default: 750, // KW
    },
    activeStage: {
      type: String,
      enum: [
        'Planning',
        'Site Preparation',
        'Construction',
        'Pre-Commissioning',
        'Operational',
      ],
      default: 'Site Preparation',
    },
    globalHealthScore: {
      type: Number,
      default: 92, // 0 - 100
      min: 0,
      max: 100,
    },
    aggregateSlaRisk: {
      score: {
        type: Number,
        default: 0.42, // 0.0 - 1.0
      },
      tier: {
        type: String,
        enum: ['NOMINAL', 'MONITORED', 'BREACH_IMMINENT'],
        default: 'MONITORED',
      },
      delayFactors: [String],
    },
  },
  {
    timestamps: true,
  }
);

export const ProjectTwin = mongoose.model('ProjectTwin', ProjectTwinSchema);
