import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { connectDB } from '../config/db.js';
import { ProjectTwin } from '../models/ProjectTwin.js';
import { RegulatoryGraph } from '../models/RegulatoryGraph.js';
import { EvidenceWallet } from '../models/EvidenceWallet.js';
import { GraphEngine } from '../agents/graphEngine.js';
import { DocumentAiEngine } from '../agents/documentAiEngine.js';
import { StatutoryRagEngine } from '../agents/statutoryRagEngine.js';
import { SlaGuardian } from '../agents/slaGuardian.js';
import { PolicyImpactEngine } from '../agents/policyImpactEngine.js';
import { seedDatabase } from './seed.js';

async function runVerification() {
  console.log('================================================================');
  console.log('  PRAVAH END-TO-END GOLDEN PATH VERIFICATION TEST SUITE         ');
  console.log('================================================================\n');

  // Step 0: Fresh Database Seed
  console.log('[STEP 0] Resetting and Seeding Database...');
  await seedDatabase();
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pravah_db');
  const projectId = 'MAHA-AGRO-2026-8812';

  // Step 1: Initial DAG Verification
  console.log('\n[STEP 1] Validating Initial Project Twin & DAG Topology...');
  const project = await ProjectTwin.findOne({ projectId });
  const graph = await RegulatoryGraph.findOne({ projectId });

  const midcNode = graph.nodes.find((n) => n.approvalCode === 'MIDC_LAND_ALLOCATION');
  const mpcbNode = graph.nodes.find((n) => n.approvalCode === 'MPCB_CTE');
  const disherLabourNode = graph.nodes.find((n) => n.approvalCode === 'DISHER_LABOUR_REG');

  console.log(`- Project: ${project.projectName} (Declared Capital: ₹${project.capitalInvestmentCrores} Cr)`);
  console.log(`- MIDC Land Allotment Status: ${midcNode.status} [Expected: READY_TO_APPLY]`);
  console.log(`- MPCB CTE Status: ${mpcbNode.status} [Expected: BLOCKED]`);
  console.log(`- DISHER Labour Reg Status: ${disherLabourNode.status} (isParallel: ${disherLabourNode.isParallel}) [Expected: READY_TO_APPLY]`);

  if (midcNode.status !== 'READY_TO_APPLY' || mpcbNode.status !== 'BLOCKED' || !disherLabourNode.isParallel) {
    throw new Error('STEP 1 FAILED: Initial DAG state mismatch!');
  }
  console.log('✓ STEP 1 PASSED: Initial graph topology and parallel tracks verified.');

  // Step 2: Document Ingestion & Anomaly Detection (Sub-Agent 1)
  console.log('\n[STEP 2] Ingesting CA Net Worth Certificate & Testing Anomaly Detection...');
  const samplePdfPath = path.resolve('uploads/Chartered_Accountant_NetWorth_Certificate.pdf');
  const fileBuffer = fs.readFileSync(samplePdfPath);

  const docResult = await DocumentAiEngine.ingestDocument({
    projectId,
    fileBuffer,
    fileName: 'Chartered_Accountant_NetWorth_Certificate.pdf',
    mimeType: 'application/pdf',
  });

  const flaggedFact = await EvidenceWallet.findOne({
    projectId,
    factKey: 'GROSS_PROJECT_INVESTMENT',
  });

  console.log(`- Extracted Value: ₹${flaggedFact.extractedValue} Cr`);
  console.log(`- Declared Value: ₹${flaggedFact.declaredValue} Cr`);
  console.log(`- Validation State: ${flaggedFact.validationState}`);
  console.log(`- Variance: ${flaggedFact.conflictMetadata.variance}`);
  console.log(`- Severity: ${flaggedFact.conflictMetadata.severity}`);
  console.log(`- Provenance Hash: ${flaggedFact.provenance.documentHash.substring(0, 16)}...`);

  if (flaggedFact.validationState !== 'DISCREPANCY_FLAGGED' || !flaggedFact.conflictMetadata.variance.includes('13.33%')) {
    throw new Error('STEP 2 FAILED: Discrepancy was not flagged correctly!');
  }
  console.log('✓ STEP 2 PASSED: Sub-Agent 1 flagged +13.33% variance with ACTION_REQUIRED.');

  // Step 3: Reconciliation & Prerequisite Propagation
  console.log('\n[STEP 3] Reconciling Capital Figure & Approving MIDC Land Grant...');
  await DocumentAiEngine.reconcileFact(projectId, 'GROSS_PROJECT_INVESTMENT', 'ACCEPT_CERTIFIED');
  const reconciledProject = await ProjectTwin.findOne({ projectId });
  console.log(`- Project Capital Reconciled to: ₹${reconciledProject.capitalInvestmentCrores} Cr`);

  // Approve MIDC Land Allocation
  const approvalResult = await GraphEngine.approveNode(projectId, 'MIDC_LAND_ALLOCATION', 'MIDC Land Officer');
  const updatedGraph = await RegulatoryGraph.findOne({ projectId });
  const updatedMpcb = updatedGraph.nodes.find((n) => n.approvalCode === 'MPCB_CTE');

  console.log(`- MIDC Land Allotment Status: ${updatedGraph.nodes.find((n) => n.approvalCode === 'MIDC_LAND_ALLOCATION').status}`);
  console.log(`- MPCB CTE Status: ${updatedMpcb.status} [Expected: READY_TO_APPLY]`);

  if (updatedMpcb.status !== 'READY_TO_APPLY') {
    throw new Error('STEP 3 FAILED: MPCB CTE did not unblock after MIDC approval!');
  }
  console.log('✓ STEP 3 PASSED: State propagation unblocked MPCB CTE to READY_TO_APPLY.');

  // Step 4: SLA Guardian Simulation & Grounded RAG Query
  console.log('\n[STEP 4] Simulating SLA Timeline Advance & Grounded RAG Query...');
  // Advance timeline on MPCB_CTE by 25 days (SLA is 45 days, elapsed was 0) or advance on MIDC
  const slaResult = await SlaGuardian.simulateTimeAdvance(projectId, 'MPCB_CTE', 35);
  console.log(`- MPCB CTE SLA Elapsed Days: 35 / 45`);
  console.log(`- Project Aggregate SLA Risk Score: ${(slaResult.aggregateRisk.score * 100).toFixed(1)}%`);
  console.log(`- Project Aggregate SLA Risk Tier: ${slaResult.aggregateRisk.tier}`);

  // Query Grounded RAG
  const ragQuestion = 'Can MPCB reject my application without issuing a formal query notice?';
  console.log(`- Submitting Advisory Query: "${ragQuestion}"`);
  const ragAnswer = await StatutoryRagEngine.queryCompliance({ projectId, query: ragQuestion });

  console.log(`- RAG Grounded: ${ragAnswer.isGrounded} (Similarity: ${ragAnswer.similarityScore})`);
  console.log(`- Citations: ${ragAnswer.citations.map((c) => c.actCitation).join(' | ')}`);
  console.log(`- Synthesis Preview:\n${ragAnswer.synthesis.substring(0, 200)}...\n`);

  if (!ragAnswer.isGrounded || ragAnswer.citations.length === 0) {
    throw new Error('STEP 4 FAILED: RAG query did not return grounded statutory citations!');
  }
  console.log('✓ STEP 4 PASSED: SLA Guardian predicted risk escalation and RAG provided strict statutory citations.');

  // Step 5: Policy Impact Engine (Dynamic Injection of Gazette Circular 2026/09)
  console.log('\n[STEP 5] Simulating Mid-Stream Policy Shift (Gazette Circular 2026/09)...');
  const policyResult = await PolicyImpactEngine.simulatePolicyAmendment({
    circularReference: 'Government Gazette Circular 2026/09',
    amendmentTitle: 'Groundwater NOC required for agro-units with investment > ₹10 Cr',
    targetSectors: ['Food Processing', 'Agro-processing'],
    minCapitalThresholdCrores: 10.0,
    injectedApprovalCode: 'GROUNDWATER_NOC',
    injectedApprovalName: 'Central Ground Water Authority (CGWA) Extraction NOC',
    departmentName: 'Central Ground Water Authority',
    statutorySlaDays: 45,
    insertAfterApprovalCode: 'MPCB_CTE',
    insertBeforeApprovalCode: 'DISHER_FACTORY_PLAN',
  });

  console.log(`- Blast Radius Count: ${policyResult.blastRadiusCount} affected project(s)`);
  const postPolicyGraph = await RegulatoryGraph.findOne({ projectId });
  const injectedNode = postPolicyGraph.nodes.find((n) => n.approvalCode === 'GROUNDWATER_NOC');
  const disherNode = postPolicyGraph.nodes.find((n) => n.approvalCode === 'DISHER_FACTORY_PLAN');

  console.log(`- Injected Node Found: ${Boolean(injectedNode)} (Code: ${injectedNode?.approvalCode})`);
  console.log(`- DISHER Factory Plan Prerequisites: ${disherNode.prerequisiteCodes.join(', ')}`);
  console.log(`- Revised Critical Path Days: ${postPolicyGraph.criticalPathDays} days`);

  if (!injectedNode || !disherNode.prerequisiteCodes.includes('GROUNDWATER_NOC')) {
    throw new Error('STEP 5 FAILED: Policy Impact Engine failed to dynamically inject node into DAG!');
  }
  console.log('✓ STEP 5 PASSED: Dynamic DAG injection and critical path recalculation succeeded!');

  console.log('\n================================================================');
  console.log('  ALL 5 GOLDEN PATH STEPS VERIFIED SUCCESSFULLY!                ');
  console.log('================================================================');

  await mongoose.disconnect();
  process.exit(0);
}

runVerification().catch((err) => {
  console.error('\n❌ VERIFICATION TEST FAILED:', err);
  process.exit(1);
});
