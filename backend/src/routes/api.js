import express from 'express';
import multer from 'multer';
import { DbService } from '../services/dbService.js';
import { GraphEngine } from '../agents/graphEngine.js';
import { DocumentAiEngine } from '../agents/documentAiEngine.js';
import { StatutoryRagEngine } from '../agents/statutoryRagEngine.js';
import { SlaGuardian } from '../agents/slaGuardian.js';
import { PolicyImpactEngine } from '../agents/policyImpactEngine.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
});

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

  res.write(`data: ${JSON.stringify({ type: 'CONNECTED', projectId })}\n\n`);

  req.on('close', () => {
    const list = sseClients.get(projectId) || [];
    sseClients.set(
      projectId,
      list.filter((client) => client !== res)
    );
  });
});

// ============================================================================
// AUTHENTICATION & CREDENTIAL VALIDATION ENDPOINTS
// ============================================================================

router.get('/auth/check-user', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email parameter is required' });
    }
    const exists = await DbService.checkUserExists(email);
    res.json({ exists });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/auth/register', async (req, res) => {
  try {
    const { email, password, name, companyName, sector } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }
    // Registration is strictly for industrial persons; officer and admin roles are provisioned via seed data
    const user = await DbService.registerUser({
      email,
      password,
      name,
      role: 'investor',
      companyName,
      sector,
    });
    res.status(201).json({ success: true, user });
  } catch (error) {
    const statusCode = error.status || (error.code === 'USER_ALREADY_EXISTS' ? 409 : 400);
    res.status(statusCode).json({ success: false, error: error.message, code: error.code });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }
    const user = await DbService.loginUser({ email, password });
    res.json({ success: true, user });
  } catch (error) {
    const statusCode = error.status || (error.code === 'USER_NOT_FOUND' ? 404 : error.code === 'INVALID_PASSWORD' ? 401 : 400);
    res.status(statusCode).json({ success: false, error: error.message, code: error.code });
  }
});

router.get('/auth/users', async (req, res) => {
  try {
    const users = await DbService.getAllUsers();
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/project/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await DbService.getProject(projectId);
    if (!project) {
      return res.status(404).json({ error: `Project ${projectId} not found` });
    }

    const graph = await DbService.getGraph(projectId);
    const evidence = await DbService.getEvidence(projectId);
    const documents = await DbService.getDocuments(projectId);
    const auditLogs = await DbService.getAuditLogs(projectId, 50);
    const rules = await DbService.getRules();

    res.json({
      project,
      graph,
      evidence,
      documents,
      auditLogs,
      rules,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

    const savedDoc = await DbService.addDocument({
      projectId,
      documentName: fileName,
      departmentId: req.body.departmentId || 'MPCB',
      uploadedBy: req.body.uploadedBy || 'Enterprise Investor',
      fileSize: req.file ? `${(req.file.size / 1024 / 1024).toFixed(1)} MB` : '1.2 MB',
      mimeType,
      verificationStatus: 'UNDER_SCRUTINY',
      documentHash: result?.documentHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      officerNotes: 'Uploaded by applicant, pending officer scrutiny',
    });

    broadcastCockpitUpdate(projectId, { type: 'DOCUMENT_PROCESSED', result, document: savedDoc });
    res.json({ success: true, result, document: savedDoc });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/documents/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;
    const documents = await DbService.getDocuments(projectId);
    res.json({ success: true, documents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/documents/verify', async (req, res) => {
  try {
    const { projectId, documentId, verificationStatus, officerNotes } = req.body;
    if (!projectId || !documentId) {
      return res.status(400).json({ error: 'Missing projectId or documentId' });
    }

    const updated = await DbService.verifyDocument(projectId, documentId, verificationStatus, officerNotes);
    broadcastCockpitUpdate(projectId, { type: 'DOCUMENT_VERIFIED', document: updated });
    res.json({ success: true, document: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

router.post('/project/reset', async (req, res) => {
  try {
    DbService.resetBaseline();
    broadcastCockpitUpdate('MAHA-AGRO-2026-8812', { type: 'RESET_COMPLETE' });
    res.json({ success: true, message: 'Platform reset to initial Golden Path baseline on Supabase PostgreSQL.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
