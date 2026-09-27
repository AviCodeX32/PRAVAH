import express from 'express';
import multer from 'multer';
import { ProjectTwin } from '../models/ProjectTwin.js';
import { RegulatoryGraph } from '../models/RegulatoryGraph.js';
import { EvidenceWallet } from '../models/EvidenceWallet.js';
import { StatutoryRule } from '../models/StatutoryRule.js';
import { AuditLedger } from '../models/AuditLedger.js';
import { GraphEngine } from '../agents/graphEngine.js';
import { DocumentAiEngine } from '../agents/documentAiEngine.js';
import { StatutoryRagEngine } from '../agents/statutoryRagEngine.js';
import { SlaGuardian } from '../agents/slaGuardian.js';
import { PolicyImpactEngine } from '../agents/policyImpactEngine.js';
import { seedDatabase } from '../scripts/seed.js';

const router = express.Router();

// Configure multer memory storage for PDF processing
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB max
});

// SSE clients map
const sseClients = new Map();

export function broadcastCockpitUpdate(projectId, data) {
  const clients = sseClients.get(projectId);
  if (clients && clients.length > 0) {
    const payload = `data: ${JSON.stringify(data)}\n\n`;
    clients.forEach((res) => {
      try {
        res.write(payload);
      } catch (err) {
        console.error('SSE write error:', err.message);
      }
    });
  }
}

/**
 * GET /api/events/:projectId
 * Server-Sent Events endpoint for real-time reactivity
 */
router.get('/events/:projectId', (req, res) => {
  const { projectId } = req.params;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  if (!sseClients.has(projectId)) {
    sseClients.set(projectId, []);
  }
  sseClients.get(projectId).push(res);

  // Send initial ping
  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', projectId })}\n\n`);

  req.on('close', () => {
    const list = sseClients.get(projectId) || [];
    sseClients.set(
      projectId,
      list.filter((client) => client !== res)
    );
  });
});

/**
 * GET /api/project/:projectId
 * Fetches the full Regulatory Digital Twin snapshot
 */
router.get('/project/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await ProjectTwin.findOne({ projectId });
    if (!project) {
      return res.status(404).json({ error: `Project ${projectId} not found` });
    }

    const graph = await RegulatoryGraph.findOne({ projectId });
    const evidence = await EvidenceWallet.find({ projectId }).sort({ updatedAt: -1 });
    const auditLogs = await AuditLedger.find({ projectId }).sort({ timestamp: -1 }).limit(50);
    const rules = await StatutoryRule.find({}, 'ruleCode ruleTitle actCitation gazetteReference baselineSlaDays');

    res.json({
      project,
      graph,
      evidence,
      auditLogs,
      rules,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/project/approve-node
 * Approves an approval node and deterministically unblocks child nodes
 */
router.post('/project/approve-node', async (req, res) => {
  try {
    const { projectId, approvalCode, actorName } = req.body;
    if (!projectId || !approvalCode) {
      return res.status(400).json({ error: 'Missing projectId or approvalCode' });
    }

    const result = await GraphEngine.approveNode(projectId, approvalCode, actorName);
    broadcastCockpitUpdate(projectId, { type: 'GRAPH_UPDATED', result });
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/project/recalculate-graph
 * Forces topological re-evaluation of dependencies
 */
router.post('/project/recalculate-graph', async (req, res) => {
  try {
    const { projectId } = req.body;
    const result = await GraphEngine.evaluateGraph(projectId);
    broadcastCockpitUpdate(projectId, { type: 'GRAPH_UPDATED', result });
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/documents/upload
 * Document AI PDF Ingestion & Zero-Tolerance Discrepancy Detection
 */
router.post('/documents/upload', upload.single('file'), async (req, res) => {
  try {
    const { projectId } = req.body;
    if (!projectId) return res.status(400).json({ error: 'Missing projectId' });

    let fileBuffer;
    let fileName = 'Chartered_Accountant_NetWorth_Certificate.pdf';
    let mimeType = 'application/pdf';

    if (req.file) {
      fileBuffer = req.file.buffer;
      fileName = req.file.originalname;
      mimeType = req.file.mimetype;
    } else {
      // Golden Path mock upload if no raw multipart body sent
      const mockText = `
M/S R. K. DESHMUKH & ASSOCIATES
CHARTERED ACCOUNTANTS
Certificate of Net Worth & Aggregate Gross Capital Investment
Project: Sahyadri Agro-Processing Facility
Applicant Entity: MH-ENT-2026-9901
Location: Plot No. C-44, Phase II, Chakan MIDC Industrial Area, Pune

We hereby certify that we have examined the audited financial books, machinery invoices, and civil contracts.
The aggregate investment in plant, machinery and civil works stands certified at INR 13,60,00,000/- (Rupees Thirteen Crores Sixty Lakhs only).
Dated: 18th March 2026
UDIN: 26048123ABCE99812
`;
      fileBuffer = Buffer.from(mockText, 'utf-8');
      fileName = 'Chartered_Accountant_NetWorth_Certificate.pdf';
      mimeType = 'text/plain';
    }

    const result = await DocumentAiEngine.ingestDocument({
      projectId,
      fileBuffer,
      fileName,
      mimeType,
    });

    broadcastCockpitUpdate(projectId, { type: 'DOCUMENT_PROCESSED', result });
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/documents/reconcile
 * Reconciles flagged fact discrepancy
 */
router.post('/documents/reconcile', async (req, res) => {
  try {
    const { projectId, factKey, resolutionChoice } = req.body;
    const result = await DocumentAiEngine.reconcileFact(projectId, factKey, resolutionChoice);
    broadcastCockpitUpdate(projectId, { type: 'FACT_RECONCILED', result });
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/rag/query
 * Statutory Grounded RAG Advisory Query
 */
router.post('/rag/query', async (req, res) => {
  try {
    const { projectId, query } = req.body;
    if (!query) return res.status(400).json({ error: 'Missing compliance query' });

    const result = await StatutoryRagEngine.queryCompliance({ projectId, query });
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/sla/simulate
 * Sub-Agent 4 SLA Timeline Simulation (e.g. +25 days)
 */
router.post('/sla/simulate', async (req, res) => {
  try {
    const { projectId, nodeCode, daysDelta } = req.body;
    const result = await SlaGuardian.simulateTimeAdvance(projectId, nodeCode, daysDelta || 25);
    broadcastCockpitUpdate(projectId, { type: 'SLA_SIMULATED', result });
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/policy/simulate
 * Sub-Agent 5 Regulatory Change Impact Engine (USP: Dynamic DAG Injection)
 */
router.post('/policy/simulate', async (req, res) => {
  try {
    const result = await PolicyImpactEngine.simulatePolicyAmendment(req.body || {});
    if (result.affectedProjects && result.affectedProjects.length > 0) {
      result.affectedProjects.forEach((p) => {
        broadcastCockpitUpdate(p.projectId, { type: 'POLICY_INJECTED', result });
      });
    }
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/project/reset
 * Resets the project database back to initial Golden Path state
 */
router.post('/project/reset', async (req, res) => {
  try {
    await seedDatabase();
    broadcastCockpitUpdate('MAHA-AGRO-2026-8812', { type: 'RESET_COMPLETE' });
    res.json({ success: true, message: 'Platform reset to initial Golden Path baseline.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
