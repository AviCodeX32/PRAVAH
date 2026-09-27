import mongoose from 'mongoose';
import { ProjectTwin } from '../models/ProjectTwin.js';
import { RegulatoryGraph } from '../models/RegulatoryGraph.js';
import { EvidenceWallet } from '../models/EvidenceWallet.js';
import { StatutoryRule } from '../models/StatutoryRule.js';
import { AuditLedger } from '../models/AuditLedger.js';
import { createDeterministicEmbedding } from '../agents/embeddingHelper.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pravah_db';

const RULES_DATA = [
  {
    departmentId: 'MIDC',
    ruleCode: 'MIDC_LAND_ALLOTMENT_2025',
    ruleTitle: 'Maharashtra Industrial Development Corporation Land Allotment Regulations',
    actCitation: 'MIDC Act, 1961 - Section 14 & Disposal of Land Regulations, 1975',
    gazetteReference: 'Circular No. MIDC/CP/DLR/2025/119',
    baselineSlaDays: 30,
    applicableConditions: {
      sectors: ['Food Processing', 'Chemical Synthesis', 'Engineering', 'Textile'],
      minCapitalCrores: 0,
      maxCapitalCrores: 10000,
      landTypes: ['MIDC Industrial Zone'],
    },
    documentRequirements: [
      'Detailed Project Report (DPR)',
      'Enterprise Registration Certificate / Udyam',
      'Architectural Block Layout Plan',
      'Net Worth / CA Certified Financial Statement',
    ],
    gazetteSnippet: `Under Section 14 of the MIDC Act, 1961 and Regulation 7 of the Disposal of Land Regulations, allotment of industrial plots in notified industrial areas shall be finalized within a statutory period of 30 days from complete submission. The Letter of Intent (LOI) serves as the primary prerequisite for statutory environmental and safety clearances. Provisional allotment remains valid for 180 days within which basic site development work or statutory CTE applications must be initiated.`,
    versionTag: 'MH-2025.2',
  },
  {
    departmentId: 'MPCB',
    ruleCode: 'MPCB_CTE_ORANGE_2026',
    ruleTitle: 'MPCB Consent to Establish (CTE) Norms for Agro & Food Processing (Orange Category)',
    actCitation: 'Water (Prevention and Control of Pollution) Act, 1974 - Section 25 & Air (Prevention and Control of Pollution) Act, 1981 - Section 21',
    gazetteReference: 'MPCB Gazette Circular No. B-29012/ESS(CPA)/2026/04',
    baselineSlaDays: 45,
    applicableConditions: {
      sectors: ['Food Processing', 'Agro-processing', 'Cold Storage'],
      minCapitalCrores: 5,
      maxCapitalCrores: 500,
      landTypes: ['MIDC Industrial Zone', 'Private Agricultural Conversion'],
    },
    documentRequirements: [
      'MIDC Land Possession Letter or Registered Lease Deed',
      'CA Net Worth / Gross Capital Investment Certificate',
      'Effluent Treatment Plant (ETP) Process Flow Diagram',
      'Water Balance Chart and Raw Material Mass Balance',
    ],
    gazetteSnippet: `In accordance with Section 25(4) of the Water (Prevention and Control of Pollution) Act, 1974 and Section 21 of the Air Act, 1981, any industrial unit falling under the Orange Category (Pollution Index 41-59) must secure Consent to Establish (CTE) prior to initiating any civil foundation or structural construction on site. A valid Land Possession Letter or Allotment Order from the industrial authority (MIDC) is a non-derogable prerequisite. All capital investment figures must be certified by a practicing Chartered Accountant; discrepancies between declared and certified capital will halt processing pending an official discrepancy notice.`,
    versionTag: 'MH-2026.1',
  },
  {
    departmentId: 'RTS_COMMISSION',
    ruleCode: 'MH_RTS_REJECTION_MANDATE_2015',
    ruleTitle: 'Maharashtra Right to Public Services Act - Query & Natural Justice Protection Norms',
    actCitation: 'Maharashtra Right to Public Services Act, 2015 - Section 8 & Section 10',
    gazetteReference: 'Govt. of Maharashtra Gazette Extraordinary Part IV-B, Notification RTS-2015/CR-01/15',
    baselineSlaDays: 15,
    applicableConditions: {
      sectors: ['All Industrial Sectors'],
      minCapitalCrores: 0,
      maxCapitalCrores: 100000,
      landTypes: ['All'],
    },
    documentRequirements: ['Statutory Application Reference Number'],
    gazetteSnippet: `Under Section 8(2) of the Maharashtra Right to Public Services Act, 2015 read with General Administrative Guidelines, NO competent statutory department—including MPCB, MIDC, or DISHER—shall summarily reject or dismiss an industrial regulatory application without first issuing a formal, itemized Query Notice or Show-Cause Notice through the designated online single-window portal. The designated officer must provide the applicant a mandatory statutory rectification cure period of not less than 15 calendar days from the date of query dispatch. Any rejection issued in contravention of Section 8 without granting this 15-day rectification window is legally null and void and constitutes a statutory SLA default actionable under Section 10 penalties.`,
    versionTag: 'MH-2015.4',
  },
  {
    departmentId: 'FIRE',
    ruleCode: 'MFS_FIRE_NOC_2024',
    ruleTitle: 'Maharashtra Fire Services Provisional No Objection Certificate for Industrial Occupancies',
    actCitation: 'Maharashtra Fire Prevention and Life Safety Measures Act, 2006 - Section 3 & Rules 2009',
    gazetteReference: 'MFS Directive Ref: DIR/FP-LSM/2024/88',
    baselineSlaDays: 30,
    applicableConditions: {
      sectors: ['Food Processing', 'Chemical Synthesis', 'Manufacturing'],
      minCapitalCrores: 1,
      maxCapitalCrores: 10000,
      landTypes: ['MIDC Industrial Zone', 'Private Agricultural Conversion'],
    },
    documentRequirements: [
      'Certified Site Plan with 6m peripheral fire tender access road',
      'Structural Fire Protection & Hydrant Layout Plan',
      'MIDC Sanctioned Plot Demarcation',
    ],
    gazetteSnippet: `Under Section 3 of the Maharashtra Fire Prevention and Life Safety Measures Act, 2006, industrial factories exceeding 500 sq.m built-up area or maintaining hazardous materials/boilers require a Provisional Fire NOC prior to approval of building plans. The authority must inspect or clear the architectural fire safety design within 30 days. Prerequisites require unencumbered possession of the plot with documented motorable access.`,
    versionTag: 'MH-2024.3',
  },
  {
    departmentId: 'DISHER',
    ruleCode: 'DISHER_LABOUR_AND_PLAN_2025',
    ruleTitle: 'Directorate of Industrial Safety and Health (DISH) Factory Building Plan & Labour Registration',
    actCitation: 'Factories Act, 1948 - Section 6 & Maharashtra Factory Rules, 1963 - Rule 3',
    gazetteReference: 'DISH Circular DISH/ENF/MFR/2025/02',
    baselineSlaDays: 45,
    applicableConditions: {
      sectors: ['Food Processing', 'Chemical', 'Heavy Engineering'],
      minCapitalCrores: 0,
      maxCapitalCrores: 10000,
      landTypes: ['MIDC Industrial Zone', 'Notified Industrial Estate'],
    },
    documentRequirements: [
      'Flow Process Chart and Manufacturing Description',
      'Factory Building Sectional Drawings with ventilation ratios',
      'Provisional Fire NOC from Fire Authority',
      'Consent to Establish from Pollution Control Board',
    ],
    gazetteSnippet: `Pursuant to Section 6 of the Factories Act, 1948 and Rule 3 of the Maharashtra Factory Rules, 1963, no factory structure shall be erected or expanded without prior written approval of the site and plans by the Chief Inspector of Factories (DISHER). DISHER factory plan approval mandatorily requires both MPCB Consent to Establish and Provisional Fire NOC as upstream prerequisites. Note: General Labour Registration under the Inter-State Migrant / Contract Labour Act is permitted as an independent parallel application concurrently with environmental clearance.`,
    versionTag: 'MH-2025.1',
  },
  {
    departmentId: 'MSEDCL',
    ruleCode: 'MSEDCL_POWER_SANCTION_2024',
    ruleTitle: 'Maharashtra State Electricity Distribution Co. HT/LT Industrial Power Sanction',
    actCitation: 'Electricity Act, 2003 - Section 43 & MERC (Electricity Supply Code) Regulations, 2021',
    gazetteReference: 'MSEDCL Commercial Circular No. CE(Comm)/2024/782',
    baselineSlaDays: 20,
    applicableConditions: {
      sectors: ['All Industrial Sectors'],
      minCapitalCrores: 0,
      maxCapitalCrores: 10000,
      landTypes: ['All'],
    },
    documentRequirements: [
      'Proof of land ownership / MIDC Allotment Letter',
      'Connected Load Estimate and Single Line Diagram (SLD)',
    ],
    gazetteSnippet: `Under Section 43 of the Electricity Act, 2003 and MERC Supply Code Regulations 2021, distribution licensees must issue demand notes and load feasibility within 20 working days from receipt of application for industrial consumers up to 1000 kVA. This clearance may proceed in parallel once land allotment is confirmed.`,
    versionTag: 'MH-2024.1',
  },
  {
    departmentId: 'CGWA',
    ruleCode: 'CGWA_GROUNDWATER_NOC_2026',
    ruleTitle: 'Central Ground Water Authority / State Groundwater Board Industrial Extraction NOC',
    actCitation: 'Environment (Protection) Act, 1986 - Section 3(3) & CGWA Gazette Notification S.O. 3289(E)',
    gazetteReference: 'Government Gazette Circular 2026/09 (Amended Ground Water Norms)',
    baselineSlaDays: 45,
    applicableConditions: {
      sectors: ['Food Processing', 'Agro-processing', 'Beverages', 'Distillery'],
      minCapitalCrores: 10,
      maxCapitalCrores: 10000,
      landTypes: ['All Zones'],
    },
    documentRequirements: [
      'Comprehensive Hydrogeological Assessment Report',
      'Water Audit and Rainwater Harvesting Design Plan',
      'Piezometer Telemetry Installation Blueprint',
    ],
    gazetteSnippet: `By order of Government Gazette Circular 2026/09 under Section 3(3) of the Environment (Protection) Act, 1986, all agro-industrial and food processing enterprises with aggregate capital investment exceeding INR 10 Crores operating or proposed in semi-critical, critical, or notified assessment units must secure a specialized Groundwater Abstraction NOC prior to factory plan approval and water connection execution. An automated piezometric telemetry system and mandatory rainwater recharge shaft must be incorporated into the civil layout.`,
    versionTag: 'MH-2026.9',
  },
];

export async function seedDatabase(shouldCloseConnection = false) {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI);
  }
  console.log('[SEED] Connected to MongoDB for initialization...');

  // Clear existing data
  await ProjectTwin.deleteMany({});
  await RegulatoryGraph.deleteMany({});
  await EvidenceWallet.deleteMany({});
  await StatutoryRule.deleteMany({});
  await AuditLedger.deleteMany({});
  console.log('[SEED] Cleared existing collections.');

  // Seed Statutory Rules with deterministic vector embeddings
  const rulesToInsert = RULES_DATA.map((rule) => {
    const fullText = `${rule.ruleTitle} ${rule.actCitation} ${rule.gazetteSnippet} ${rule.documentRequirements.join(' ')}`;
    const vectorEmbedding = createDeterministicEmbedding(fullText, 64);
    return {
      ...rule,
      vectorEmbedding,
    };
  });
  await StatutoryRule.insertMany(rulesToInsert);
  console.log(`[SEED] Inserted ${rulesToInsert.length} authoritative statutory rules.`);

  // Seed Golden Path Project: "Sahyadri Agro-Processing Facility"
  const projectId = 'MAHA-AGRO-2026-8812';
  const project = await ProjectTwin.create({
    projectId,
    projectName: 'Sahyadri Agro-Processing Facility',
    enterpriseEntityId: 'MH-ENT-2026-9901',
    stateJurisdiction: 'MH',
    district: 'Pune',
    industrySector: 'Food Processing',
    nicCode: '10792',
    capitalInvestmentCrores: 12.0, // Declared ₹12.0 Cr
    proposedEmployment: 150,
    landClassification: 'MIDC Industrial Zone',
    surveyPlotNumber: 'Plot No. C-44, Phase II, Chakan MIDC',
    waterDemandKld: 45.0,
    powerDemandKw: 750,
    activeStage: 'Site Preparation',
    globalHealthScore: 88,
    aggregateSlaRisk: {
      score: 0.42,
      tier: 'MONITORED',
      delayFactors: ['CA Gross Investment Certificate pending document reconciliation'],
    },
  });
  console.log(`[SEED] Created Project Digital Twin: ${project.projectName} (${project.projectId})`);

  // Seed Regulatory Dependency Graph (DAG)
  const nodes = [
    {
      approvalCode: 'MIDC_LAND_ALLOCATION',
      approvalName: 'MIDC Industrial Plot Allotment & Possession',
      departmentName: 'MIDC (Maharashtra Industrial Dev Corp)',
      prerequisiteCodes: [],
      statutorySlaDays: 30,
      status: 'READY_TO_APPLY',
      isParallel: false,
      slaElapsedDays: 12,
      slaRiskScore: 0.35,
      slaRiskTier: 'NOMINAL',
      inspectionStatus: 'SCHEDULED',
      queriesCount: 0,
      position: { x: 50, y: 150 },
    },
    {
      approvalCode: 'MPCB_CTE',
      approvalName: 'Consent to Establish (Orange Category - Agro)',
      departmentName: 'MPCB (Pollution Control Board)',
      prerequisiteCodes: ['MIDC_LAND_ALLOCATION'],
      statutorySlaDays: 45,
      status: 'BLOCKED',
      isParallel: false,
      slaElapsedDays: 0,
      slaRiskScore: 0.1,
      slaRiskTier: 'NOMINAL',
      inspectionStatus: 'NONE',
      queriesCount: 0,
      position: { x: 340, y: 80 },
    },
    {
      approvalCode: 'DISHER_LABOUR_REG',
      approvalName: 'Inter-State Migrant & Contract Labour Registration',
      departmentName: 'DISHER (Directorate of Industrial Safety & Health)',
      prerequisiteCodes: [],
      statutorySlaDays: 30,
      status: 'READY_TO_APPLY',
      isParallel: true,
      slaElapsedDays: 6,
      slaRiskScore: 0.2,
      slaRiskTier: 'NOMINAL',
      inspectionStatus: 'NONE',
      queriesCount: 0,
      position: { x: 340, y: 260 },
    },
    {
      approvalCode: 'FIRE_NOC',
      approvalName: 'Provisional Fire Safety NOC',
      departmentName: 'Maharashtra Fire Services Directorate',
      prerequisiteCodes: ['MIDC_LAND_ALLOCATION'],
      statutorySlaDays: 30,
      status: 'BLOCKED',
      isParallel: false,
      slaElapsedDays: 0,
      slaRiskScore: 0.1,
      slaRiskTier: 'NOMINAL',
      inspectionStatus: 'NONE',
      queriesCount: 0,
      position: { x: 340, y: 420 },
    },
    {
      approvalCode: 'DISHER_FACTORY_PLAN',
      approvalName: 'Factory Building Plan Approval & Safety License',
      departmentName: 'DISHER (Directorate of Industrial Safety & Health)',
      prerequisiteCodes: ['MPCB_CTE', 'FIRE_NOC'],
      statutorySlaDays: 45,
      status: 'BLOCKED',
      isParallel: false,
      slaElapsedDays: 0,
      slaRiskScore: 0.1,
      slaRiskTier: 'NOMINAL',
      inspectionStatus: 'NONE',
      queriesCount: 0,
      position: { x: 650, y: 200 },
    },
    {
      approvalCode: 'MSEDCL_POWER_SANCTION',
      approvalName: '750 kW Industrial Load Sanction & Feasibility',
      departmentName: 'MSEDCL (State Electricity Dist. Co.)',
      prerequisiteCodes: ['MIDC_LAND_ALLOCATION'],
      statutorySlaDays: 20,
      status: 'BLOCKED',
      isParallel: true,
      slaElapsedDays: 0,
      slaRiskScore: 0.1,
      slaRiskTier: 'NOMINAL',
      inspectionStatus: 'NONE',
      queriesCount: 0,
      position: { x: 650, y: 380 },
    },
  ];

  const edges = [
    {
      id: 'e_midc_mpcb',
      source: 'MIDC_LAND_ALLOCATION',
      target: 'MPCB_CTE',
      edgeType: 'MANDATORY_PREREQUISITE',
      label: 'Statutory Prerequisite',
    },
    {
      id: 'e_midc_fire',
      source: 'MIDC_LAND_ALLOCATION',
      target: 'FIRE_NOC',
      edgeType: 'MANDATORY_PREREQUISITE',
      label: 'Site Boundary Access',
    },
    {
      id: 'e_midc_power',
      source: 'MIDC_LAND_ALLOCATION',
      target: 'MSEDCL_POWER_SANCTION',
      edgeType: 'PARALLEL_PERMISSIBLE',
      label: 'Parallel Branch',
    },
    {
      id: 'e_mpcb_disher',
      source: 'MPCB_CTE',
      target: 'DISHER_FACTORY_PLAN',
      edgeType: 'MANDATORY_PREREQUISITE',
      label: 'Env Clearance Prerequisite',
    },
    {
      id: 'e_fire_disher',
      source: 'FIRE_NOC',
      target: 'DISHER_FACTORY_PLAN',
      edgeType: 'MANDATORY_PREREQUISITE',
      label: 'Fire NOC Prerequisite',
    },
  ];

  await RegulatoryGraph.create({
    projectId,
    nodes,
    edges,
    criticalPathDays: 120,
    criticalPathNodes: ['MIDC_LAND_ALLOCATION', 'MPCB_CTE', 'DISHER_FACTORY_PLAN'],
  });
  console.log(`[SEED] Created Regulatory DAG with ${nodes.length} nodes and ${edges.length} edges.`);

  // Seed Evidence Wallet Initial Fact
  await EvidenceWallet.create([
    {
      projectId,
      factKey: 'GROSS_PROJECT_INVESTMENT',
      factLabel: 'Gross Project Investment',
      extractedValue: 12.0,
      declaredValue: 12.0,
      unit: 'INR Crores',
      normalizedDataType: 'CURRENCY',
      provenance: {
        sourceDocumentName: 'Entrepreneur_Udyam_Declaration.pdf',
        documentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        pageNumber: 1,
        paragraph: 'Section 4(A)',
        contextSnippet: 'Proposed capital outlay in plant and machinery declared at INR 12,00,00,000/-',
        confidenceScore: 0.99,
        extractedBy: 'Statutory Registration Parser',
      },
      validationState: 'UNVERIFIED',
      conflictMetadata: {
        severity: 'NONE',
        statutoryReference: 'Self-declared preliminary estimate subject to certified CA audit statement',
      },
    },
    {
      projectId,
      factKey: 'SURVEY_PLOT_NUMBER',
      factLabel: 'MIDC Plot & Survey Allotment Code',
      extractedValue: 'Plot No. C-44, Phase II, Chakan MIDC',
      declaredValue: 'Plot No. C-44, Phase II, Chakan MIDC',
      unit: '',
      normalizedDataType: 'STRING',
      provenance: {
        sourceDocumentName: 'MIDC_Plot_Application_Receipt.pdf',
        documentHash: 'a7c938f2e2938814bbce847a98d36f23348123fa4356a871d3e89bcdef123456',
        pageNumber: 1,
        paragraph: 'Header Table',
        contextSnippet: 'Application acknowledged for Plot No. C-44, Phase II, Chakan Industrial Area, Pune',
        confidenceScore: 0.99,
        extractedBy: 'Automated Document AI',
      },
      validationState: 'VERIFIED_MATCH',
      conflictMetadata: {
        severity: 'NONE',
        statutoryReference: 'MIDC Land Disposal Regulations 1975',
      },
    },
    {
      projectId,
      factKey: 'POLLUTION_INDEX_SCORE',
      factLabel: 'Industrial Pollution Category Score',
      extractedValue: 48.0,
      declaredValue: 48.0,
      unit: 'Index Points (Orange)',
      normalizedDataType: 'NUMBER',
      provenance: {
        sourceDocumentName: 'DPR_Environmental_Assessment.pdf',
        documentHash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
        pageNumber: 3,
        paragraph: 'Table 2.1 - Emission & Effluent Classification',
        contextSnippet: 'Composite pollution score calculated at 48 (Orange Category - 41 to 59)',
        confidenceScore: 0.97,
        extractedBy: 'Automated Document AI',
      },
      validationState: 'VERIFIED_MATCH',
      conflictMetadata: {
        severity: 'NONE',
        statutoryReference: 'CPCB/MPCB Industrial Categorization Directives 2016/2026',
      },
    },
    {
      projectId,
      factKey: 'WATER_REQUIREMENT_KLD',
      factLabel: 'Daily Fresh Water Requirement',
      extractedValue: 45.0,
      declaredValue: 45.0,
      unit: 'KLD',
      normalizedDataType: 'NUMBER',
      provenance: {
        sourceDocumentName: 'DPR_Environmental_Assessment.pdf',
        documentHash: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
        pageNumber: 4,
        paragraph: 'Water Balance Sheet',
        contextSnippet: 'Gross fresh water demand estimated at 45.0 KLD for process and domestic utilities',
        confidenceScore: 0.96,
        extractedBy: 'Automated Document AI',
      },
      validationState: 'VERIFIED_MATCH',
      conflictMetadata: {
        severity: 'NONE',
        statutoryReference: 'MIDC Water Supply Norms 2024',
      },
    },
  ]);
  console.log('[SEED] Seeded initial facts in Evidence Wallet.');

  // Seed Initial Audit Ledger Event
  await AuditLedger.create([
    {
      projectId,
      actorType: 'SYSTEM_SCHEDULER',
      actorName: 'PRAVAH Orchestrator',
      eventType: 'PROJECT_INITIALIZED',
      justificationNote: 'Project Digital Twin initialized for Sahyadri Agro-Processing Facility under jurisdiction MH-Pune.',
    },
    {
      projectId,
      actorType: 'AI_AGENT',
      actorName: 'Topological Graph Engine',
      eventType: 'NODE_STATE_CHANGED',
      nodeCode: 'MIDC_LAND_ALLOCATION',
      previousState: 'INITIAL',
      newState: 'READY_TO_APPLY',
      justificationNote: 'Zero unmet upstream dependencies detected. MIDC Land Allotment node transitioned to READY_TO_APPLY.',
    },
    {
      projectId,
      actorType: 'AI_AGENT',
      actorName: 'Topological Graph Engine',
      eventType: 'NODE_STATE_CHANGED',
      nodeCode: 'DISHER_LABOUR_REG',
      previousState: 'INITIAL',
      newState: 'READY_TO_APPLY',
      justificationNote: 'Independent statutory branch identified. DISHER Labour registration marked PARALLEL-READY.',
    },
  ]);
  console.log('[SEED] Seeded initial audit events.');

  console.log('[SEED] Database initialization completed successfully.');
  if (shouldCloseConnection) {
    await mongoose.disconnect();
  }
}

// If executed directly from CLI: node src/scripts/seed.js
const isDirectRun = process.argv[1] && process.argv[1].replace(/\\/g, '/').endsWith('seed.js');
if (isDirectRun) {
  seedDatabase(true).then(() => process.exit(0)).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
