import { supabase } from '../config/supabase.js';
import { createDeterministicEmbedding } from '../agents/embeddingHelper.js';

// Default Golden Path Baseline Data
const DEFAULT_RULES = [
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

function getInitialProject() {
  return {
    projectId: 'MAHA-AGRO-2026-8812',
    projectName: 'Sahyadri Agro-Processing Facility',
    enterpriseEntityId: 'MH-ENT-2026-9901',
    stateJurisdiction: 'MH',
    district: 'Pune',
    industrySector: 'Food Processing',
    nicCode: '10792',
    capitalInvestmentCrores: 12.0,
    proposedEmployment: 150,
    landClassification: 'MIDC Industrial Zone',
    surveyPlotNumber: 'Plot No. C-44, Phase II, Chakan MIDC',
    waterDemandKld: 45.0,
    powerDemandKw: 750,
    activeStage: 'Site Preparation',
    globalHealthScore: 92,
    aggregateSlaRisk: {
      score: 0.42,
      tier: 'MONITORED',
      delayFactors: ['CA Gross Investment Certificate pending document reconciliation'],
    },
  };
}

function getInitialGraph() {
  return {
    projectId: 'MAHA-AGRO-2026-8812',
    nodes: [
      {
        approvalCode: 'MIDC_LAND_ALLOCATION',
        approvalName: 'MIDC Industrial Plot Allotment & Possession',
        departmentName: 'MIDC (Industrial Dev Corp)',
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
        departmentName: 'DISHER (Industrial Safety & Health)',
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
        departmentName: 'DISHER (Industrial Safety & Health)',
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
    ],
    edges: [
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
    ],
    criticalPathDays: 120,
    criticalPathNodes: ['MIDC_LAND_ALLOCATION', 'MPCB_CTE', 'DISHER_FACTORY_PLAN'],
  };
}

function getInitialEvidence() {
  return [
    {
      projectId: 'MAHA-AGRO-2026-8812',
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
      projectId: 'MAHA-AGRO-2026-8812',
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
      projectId: 'MAHA-AGRO-2026-8812',
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
      projectId: 'MAHA-AGRO-2026-8812',
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
  ];
}

function getInitialAuditLogs() {
  return [
    {
      projectId: 'MAHA-AGRO-2026-8812',
      timestamp: new Date(),
      actorType: 'SYSTEM_SCHEDULER',
      actorName: 'PRAVAH Orchestrator',
      eventType: 'PROJECT_INITIALIZED',
      justificationNote: 'Project Digital Twin initialized for Sahyadri Agro-Processing Facility under jurisdiction MH-Pune.',
    },
    {
      projectId: 'MAHA-AGRO-2026-8812',
      timestamp: new Date(),
      actorType: 'AI_AGENT',
      actorName: 'Topological Graph Engine',
      eventType: 'NODE_STATE_CHANGED',
      nodeCode: 'MIDC_LAND_ALLOCATION',
      previousState: 'INITIAL',
      newState: 'READY_TO_APPLY',
      justificationNote: 'Zero unmet upstream dependencies detected. MIDC Land Allotment node transitioned to READY_TO_APPLY.',
    },
    {
      projectId: 'MAHA-AGRO-2026-8812',
      timestamp: new Date(),
      actorType: 'AI_AGENT',
      actorName: 'Topological Graph Engine',
      eventType: 'NODE_STATE_CHANGED',
      nodeCode: 'DISHER_LABOUR_REG',
      previousState: 'INITIAL',
      newState: 'READY_TO_APPLY',
      justificationNote: 'Independent statutory branch identified. DISHER Labour registration marked PARALLEL-READY.',
    },
  ];
}

function getInitialDocuments() {
  return [
    {
      id: 'DOC-001',
      projectId: 'MAHA-AGRO-2026-8812',
      documentName: 'MIDC Plot 7/12 Land Possession & Allotment Order.pdf',
      departmentId: 'MIDC',
      uploadedBy: 'Enterprise Investor',
      uploadedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      fileSize: '2.4 MB',
      mimeType: 'application/pdf',
      verificationStatus: 'VERIFIED',
      documentHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      officerNotes: 'Land possession verified against MIDC Pune registry.',
    },
    {
      id: 'DOC-002',
      projectId: 'MAHA-AGRO-2026-8812',
      documentName: 'Chartered_Accountant_NetWorth_Certificate.pdf',
      departmentId: 'MPCB',
      uploadedBy: 'Enterprise Investor',
      uploadedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      fileSize: '1.2 MB',
      mimeType: 'application/pdf',
      verificationStatus: 'UNDER_SCRUTINY',
      documentHash: '47dd7b868254eea805c879f90f135b5a2b34a1599818',
      officerNotes: 'Awaiting fee reconciliation on ₹13.6 Cr capital outlay.',
    },
    {
      id: 'DOC-003',
      projectId: 'MAHA-AGRO-2026-8812',
      documentName: 'Effluent_Treatment_Plant_Process_Flowchart.pdf',
      departmentId: 'MPCB',
      uploadedBy: 'Enterprise Investor',
      uploadedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      fileSize: '3.8 MB',
      mimeType: 'application/pdf',
      verificationStatus: 'UNDER_SCRUTINY',
      documentHash: '8a9fbc102394871e9821734bc1023984712093847',
      officerNotes: 'Technical review of biological aeration stage pending.',
    },
    {
      id: 'DOC-004',
      projectId: 'MAHA-AGRO-2026-8812',
      documentName: 'Provisional_Fire_Safety_Plan_Blueprint.pdf',
      departmentId: 'FIRE',
      uploadedBy: 'Enterprise Investor',
      uploadedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      fileSize: '4.5 MB',
      mimeType: 'application/pdf',
      verificationStatus: 'VERIFIED',
      documentHash: 'c982347109283470192837410928374109283741',
      officerNotes: '6m perimeter fire tender access road approved.',
    },
  ];
}

function getInitialUsers() {
  return [
    {
      id: 'USR-001',
      email: 'applicant@portal.gov.in',
      password: 'Password@123',
      name: 'Industrial Applicant',
      role: 'investor',
      companyName: 'Sahyadri Agro-Processing Facility',
      sector: 'Food Processing',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'USR-002',
      email: 'sro.pune@mpcb.gov.in',
      password: 'Password@123',
      name: 'S.K. Deshmukh',
      role: 'officer',
      department: 'MPCB',
      designation: 'Sub-Regional Officer Pune II',
      companyName: 'Maharashtra Pollution Control Board (MPCB)',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'USR-003',
      email: 'admin@pravah.gov.in',
      password: 'Password@123',
      name: 'Dr. Anand Kelkar',
      role: 'admin',
      agency: 'Directorate of Industries',
      companyName: 'State Industrial Directorate',
      createdAt: new Date().toISOString(),
    },
  ];
}

// In-Memory Fallback Cache (keeps application 100% resilient before or after SQL execution)
class MemoryDataStore {
  constructor() {
    this.projects = new Map();
    this.graphs = new Map();
    this.evidence = new Map();
    this.documents = new Map();
    this.users = new Map();
    this.rules = DEFAULT_RULES.map((r) => ({
      ...r,
      vectorEmbedding: createDeterministicEmbedding(
        `${r.ruleTitle} ${r.actCitation} ${r.gazetteSnippet}`,
        64
      ),
    }));
    this.auditLogs = [];
    this.reset();
  }

  reset() {
    const p = getInitialProject();
    this.projects.set(p.projectId, p);
    const g = getInitialGraph();
    this.graphs.set(g.projectId, g);
    this.evidence.set(p.projectId, getInitialEvidence());
    this.documents.set(p.projectId, getInitialDocuments());
    this.auditLogs = getInitialAuditLogs();

    this.users.clear();
    getInitialUsers().forEach((u) => {
      this.users.set(u.email.toLowerCase(), { ...u });
    });
  }
}

const memoryStore = new MemoryDataStore();

/**
 * High-Level Supabase PostgreSQL Repository Service
 */
export class DbService {
  /**
   * Retrieves Project Digital Twin by ID
   */
  static async getProject(projectId) {
    try {
      const { data, error } = await supabase
        .from('project_twins')
        .select('*')
        .eq('project_id', projectId)
        .single();

      if (!error && data) {
        return {
          projectId: data.project_id,
          projectName: data.project_name,
          enterpriseEntityId: data.enterprise_entity_id,
          stateJurisdiction: data.state_jurisdiction,
          district: data.district,
          industrySector: data.industry_sector,
          nicCode: data.nic_code,
          capitalInvestmentCrores: Number(data.capital_investment_crores),
          proposedEmployment: data.proposed_employment,
          landClassification: data.land_classification,
          surveyPlotNumber: data.survey_plot_number,
          waterDemandKld: Number(data.water_demand_kld),
          powerDemandKw: data.power_demand_kw,
          activeStage: data.active_stage,
          globalHealthScore: data.global_health_score,
          aggregateSlaRisk: data.aggregate_sla_risk,
        };
      }
    } catch (err) {
      // Handled via memory fallback
    }

    return memoryStore.projects.get(projectId) || null;
  }

  /**
   * Updates Project Digital Twin
   */
  static async updateProject(projectId, updates) {
    const memProject = memoryStore.projects.get(projectId);
    if (memProject) {
      Object.assign(memProject, updates);
    }

    try {
      await supabase
        .from('project_twins')
        .update({
          capital_investment_crores: updates.capitalInvestmentCrores,
          global_health_score: updates.globalHealthScore,
          aggregate_sla_risk: updates.aggregateSlaRisk,
          active_stage: updates.activeStage,
          updated_at: new Date().toISOString(),
        })
        .eq('project_id', projectId);
    } catch (err) {
      // Ignored for resilient memory fallback
    }

    return memProject;
  }

  /**
   * Retrieves Regulatory Dependency Graph
   */
  static async getGraph(projectId) {
    try {
      const { data, error } = await supabase
        .from('regulatory_graphs')
        .select('*')
        .eq('project_id', projectId)
        .single();

      if (!error && data) {
        return {
          projectId: data.project_id,
          nodes: data.nodes,
          edges: data.edges,
          criticalPathDays: data.critical_path_days,
          criticalPathNodes: data.critical_path_nodes,
        };
      }
    } catch (err) {
      // Fallback
    }

    return memoryStore.graphs.get(projectId) || null;
  }

  /**
   * Saves updated graph
   */
  static async saveGraph(projectId, graphData) {
    memoryStore.graphs.set(projectId, graphData);

    try {
      await supabase.from('regulatory_graphs').upsert({
        project_id: projectId,
        nodes: graphData.nodes,
        edges: graphData.edges,
        critical_path_days: graphData.critical_path_days,
        critical_path_nodes: graphData.critical_path_nodes,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      // Fallback
    }

    return graphData;
  }

  /**
   * Retrieves all evidence facts for a project
   */
  static async getEvidence(projectId) {
    try {
      const { data, error } = await supabase
        .from('evidence_wallet')
        .select('*')
        .eq('project_id', projectId);

      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          projectId: d.project_id,
          factKey: d.fact_key,
          factLabel: d.fact_label,
          extractedValue: d.extracted_value,
          declaredValue: d.declared_value,
          unit: d.unit,
          normalizedDataType: d.normalized_data_type,
          provenance: d.provenance,
          validationState: d.validation_state,
          conflictMetadata: d.conflict_metadata,
        }));
      }
    } catch (err) {
      // Fallback
    }

    return memoryStore.evidence.get(projectId) || [];
  }

  /**
   * Upserts an item in the Evidence Wallet
   */
  static async upsertEvidence(projectId, factItem) {
    const list = memoryStore.evidence.get(projectId) || [];
    const idx = list.findIndex((e) => e.factKey === factItem.factKey);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...factItem };
    } else {
      list.push(factItem);
    }
    memoryStore.evidence.set(projectId, list);

    try {
      await supabase.from('evidence_wallet').upsert({
        project_id: projectId,
        fact_key: factItem.factKey,
        fact_label: factItem.factLabel,
        extracted_value: factItem.extractedValue,
        declared_value: factItem.declaredValue,
        unit: factItem.unit,
        normalized_data_type: factItem.normalizedDataType,
        provenance: factItem.provenance,
        validation_state: factItem.validationState,
        conflict_metadata: factItem.conflictMetadata,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      // Fallback
    }

    return factItem;
  }

  /**
   * Retrieves statutory rules for RAG
   */
  static async getRules() {
    try {
      const { data, error } = await supabase.from('statutory_rules').select('*');
      if (!error && data && data.length > 0) {
        return data.map((r) => ({
          departmentId: r.department_id,
          ruleCode: r.rule_code,
          ruleTitle: r.rule_title,
          actCitation: r.act_citation,
          gazetteReference: r.gazette_reference,
          baselineSlaDays: r.baseline_sla_days,
          gazetteSnippet: r.gazette_snippet,
          vectorEmbedding: r.vector_embedding,
        }));
      }
    } catch (err) {
      // Fallback
    }

    return memoryStore.rules;
  }

  /**
   * Retrieves Audit Ledger events
   */
  static async getAuditLogs(projectId, limit = 50) {
    try {
      const { data, error } = await supabase
        .from('audit_ledger')
        .select('*')
        .eq('project_id', projectId)
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (!error && data && data.length > 0) {
        return data.map((l) => ({
          projectId: l.project_id,
          timestamp: l.timestamp,
          actorType: l.actor_type,
          actorName: l.actor_name,
          eventType: l.event_type,
          nodeCode: l.node_code,
          previousState: l.previous_state,
          newState: l.new_state,
          justificationNote: l.justification_note,
        }));
      }
    } catch (err) {
      // Fallback
    }

    return memoryStore.auditLogs.slice(0, limit);
  }

  /**
   * Appends an event to the Audit Ledger
   */
  static async addAuditLog(logEntry) {
    const entry = {
      timestamp: new Date(),
      ...logEntry,
    };
    memoryStore.auditLogs.unshift(entry);

    try {
      await supabase.from('audit_ledger').insert({
        project_id: logEntry.projectId,
        actor_type: logEntry.actorType,
        actor_name: logEntry.actorName,
        event_type: logEntry.eventType,
        node_code: logEntry.nodeCode || null,
        previous_state: logEntry.previousState || null,
        new_state: logEntry.newState || null,
        justification_note: logEntry.justificationNote,
        sla_time_elapsed_delta: logEntry.slaTimeElapsedDelta || 0,
      });
    } catch (err) {
      // Fallback
    }

    return entry;
  }

  /**
   * Uploads file buffer to Supabase Storage bucket 'documents'
   */
  static async uploadFileToStorage(fileBuffer, fileName, mimeType = 'application/pdf') {
    try {
      const storagePath = `filings/${Date.now()}_${fileName}`;
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(storagePath, fileBuffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (!error && data) {
        const { data: publicUrlData } = supabase.storage
          .from('documents')
          .getPublicUrl(storagePath);

        return {
          success: true,
          storagePath,
          publicUrl: publicUrlData?.publicUrl || null,
          storageProvider: 'SUPABASE_STORAGE',
        };
      }
    } catch (err) {
      console.warn('[STORAGE] Supabase upload fallback:', err.message);
    }

    return {
      success: true,
      storagePath: `local/${fileName}`,
      publicUrl: null,
      storageProvider: 'LOCAL_BUFFER',
    };
  }

  /**
   * Retrieves all uploaded statutory documents for a project
   */
  static async getDocuments(projectId) {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('project_id', projectId)
        .order('uploaded_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          projectId: d.project_id,
          documentName: d.document_name,
          departmentId: d.department_id,
          uploadedBy: d.uploaded_by,
          uploadedAt: d.uploaded_at,
          fileSize: d.file_size,
          mimeType: d.mime_type,
          verificationStatus: d.verification_status,
          documentHash: d.document_hash,
          officerNotes: d.officer_notes,
        }));
      }
    } catch (err) {
      // Fallback
    }

    return memoryStore.documents.get(projectId) || [];
  }

  /**
   * Adds an uploaded document to project repository
   */
  static async addDocument(docEntry) {
    const list = memoryStore.documents.get(docEntry.projectId) || [];
    const newDoc = {
      id: docEntry.id || `DOC-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
      verificationStatus: 'UNDER_SCRUTINY',
      ...docEntry,
    };
    list.unshift(newDoc);
    memoryStore.documents.set(docEntry.projectId, list);

    try {
      await supabase.from('documents').insert({
        id: newDoc.id,
        project_id: newDoc.projectId,
        document_name: newDoc.documentName,
        department_id: newDoc.departmentId,
        uploaded_by: newDoc.uploadedBy,
        uploaded_at: newDoc.uploadedAt,
        file_size: newDoc.fileSize || '1.5 MB',
        mime_type: newDoc.mimeType || 'application/pdf',
        verification_status: newDoc.verificationStatus,
        document_hash: newDoc.documentHash,
        officer_notes: newDoc.officerNotes || 'Uploaded by applicant, pending scrutiny',
      });
    } catch (err) {
      // Fallback
    }

    return newDoc;
  }

  /**
   * Updates document verification status by department officer
   */
  static async verifyDocument(projectId, docId, status, officerNotes) {
    const list = memoryStore.documents.get(projectId) || [];
    const doc = list.find((d) => d.id === docId);
    if (doc) {
      doc.verificationStatus = status;
      if (officerNotes) doc.officerNotes = officerNotes;
    }

    try {
      await supabase
        .from('documents')
        .update({
          verification_status: status,
          officer_notes: officerNotes,
        })
        .eq('id', docId);
    } catch (err) {
      // Fallback
    }

    return doc || null;
  }

  /**
   * Resets baseline data for the Golden Path demonstration
   */
  static resetBaseline() {
    memoryStore.reset();
    return true;
  }

  /**
   * Gets user by email
   */
  static async getUserByEmail(email) {
    if (!email) return null;
    const cleanEmail = email.toLowerCase().trim();

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', cleanEmail)
        .single();

      if (!error && data) {
        return {
          id: data.id,
          email: data.email,
          password: data.password_hash || data.password,
          name: data.name,
          role: data.role,
          companyName: data.company_name,
          department: data.department,
          designation: data.designation,
          agency: data.agency,
          sector: data.sector,
          createdAt: data.created_at,
        };
      }
    } catch (err) {
      // Fallback
    }

    return memoryStore.users.get(cleanEmail) || null;
  }

  /**
   * Checks if user exists in database
   */
  static async checkUserExists(email) {
    const user = await this.getUserByEmail(email);
    return !!user;
  }

  /**
   * Registers a new user with credentials
   */
  static async registerUser(userData) {
    const cleanEmail = (userData.email || '').toLowerCase().trim();
    if (!cleanEmail) {
      throw new Error('Email address is required');
    }
    if (!userData.password || userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const exists = await this.checkUserExists(cleanEmail);
    if (exists) {
      const err = new Error('An account with this email already exists. Please sign in instead.');
      err.code = 'USER_ALREADY_EXISTS';
      err.status = 409;
      throw err;
    }

    const user = {
      id: `USR-${Date.now()}`,
      email: cleanEmail,
      password: userData.password,
      name: userData.name || 'Registered User',
      role: 'investor', // Only industrial persons can sign up; officer and admin roles are provisioned by seed data
      companyName: userData.companyName || '',
      department: '',
      designation: '',
      agency: '',
      sector: userData.sector || 'Industrial Enterprise',
      createdAt: new Date().toISOString(),
    };

    memoryStore.users.set(cleanEmail, user);

    try {
      await supabase.from('users').upsert({
        id: user.id,
        email: user.email,
        password_hash: user.password,
        name: user.name,
        role: user.role,
        company_name: user.companyName,
        department: user.department,
        designation: user.designation,
        agency: user.agency,
        sector: user.sector,
        created_at: user.createdAt,
      });
    } catch (err) {
      // Memory store already has it
    }

    const { password: _, ...safeUser } = user;
    return safeUser;
  }

  /**
   * Verifies user credentials and logs in
   */
  static async loginUser({ email, password }) {
    const cleanEmail = (email || '').toLowerCase().trim();
    if (!cleanEmail) {
      throw new Error('Email address is required');
    }
    if (!password) {
      throw new Error('Password is required');
    }

    const user = await this.getUserByEmail(cleanEmail);
    if (!user) {
      const err = new Error('No account found with this email. Please register first.');
      err.code = 'USER_NOT_FOUND';
      err.status = 404;
      throw err;
    }

    if (user.password !== password) {
      const err = new Error('Incorrect password. Please verify your credentials.');
      err.code = 'INVALID_PASSWORD';
      err.status = 401;
      throw err;
    }

    const { password: _, ...safeUser } = user;
    return safeUser;
  }

  /**
   * Gets all registered users (without passwords)
   */
  static async getAllUsers() {
    const list = Array.from(memoryStore.users.values()).map(({ password, ...u }) => u);
    return list;
  }

  /**
   * Comprehensive database seed for all entities
   */
  static async seedAll() {
    this.resetBaseline();
    return {
      success: true,
      usersCount: memoryStore.users.size,
      projectsCount: memoryStore.projects.size,
      graphsCount: memoryStore.graphs.size,
      rulesCount: memoryStore.rules.length,
      documentsCount: (memoryStore.documents.get('MAHA-AGRO-2026-8812') || []).length,
      auditLogsCount: memoryStore.auditLogs.length,
    };
  }
}
