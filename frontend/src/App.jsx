import React, { useState, useEffect, useCallback } from 'react';
import HeaderBar from './components/HeaderBar.jsx';
import RegulatoryDagView from './components/RegulatoryDagView.jsx';
import CentralWorkspace from './components/CentralWorkspace.jsx';
import EvidenceWalletAndAudit from './components/EvidenceWalletAndAudit.jsx';

const PROJECT_ID = 'MAHA-AGRO-2026-8812';

export default function App() {
  const [project, setProject] = useState(null);
  const [graph, setGraph] = useState(null);
  const [evidence, setEvidence] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [rules, setRules] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [ragState, setRagState] = useState({ isLoading: false, result: null });
  const [activeTab, setActiveTab] = useState('roadmap'); // 'roadmap' | 'document' | 'copilot' | 'evidence'

  // Fetch full project snapshot
  const fetchProjectData = useCallback(async () => {
    try {
      const res = await fetch(`/api/project/${PROJECT_ID}`);
      if (!res.ok) throw new Error('Failed to fetch project data');
      const data = await res.json();
      setProject(data.project);
      setGraph(data.graph);
      setEvidence(data.evidence || []);
      setAuditLogs(data.auditLogs || []);
      setRules(data.rules || []);
    } catch (err) {
      console.error('Error fetching project snapshot:', err);
    }
  }, []);

  // Connect to SSE stream for live updates
  useEffect(() => {
    fetchProjectData();

    const eventSource = new EventSource(`/api/events/${PROJECT_ID}`);

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        console.log('[SSE Event]:', payload.type);
        fetchProjectData();
      } catch (err) {
        console.error('Error parsing SSE event:', err);
      }
    };

    eventSource.onerror = () => {
      setIsConnected(false);
    };

    return () => {
      eventSource.close();
    };
  }, [fetchProjectData]);

  // Handler: Upload CA Certificate (Step 1)
  const handleUploadCaCert = async () => {
    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: PROJECT_ID }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchProjectData();
        // Switch to document tab to show the friendly reconciliation card
        setActiveTab('document');
      }
    } catch (err) {
      console.error('Error uploading CA cert:', err);
    }
  };

  // Handler: Reconcile Fact (Step 2)
  const handleReconcileFact = async (factKey, resolutionChoice) => {
    try {
      const res = await fetch('/api/documents/reconcile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: PROJECT_ID,
          factKey,
          resolutionChoice,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchProjectData();
      }
    } catch (err) {
      console.error('Error reconciling fact:', err);
    }
  };

  // Handler: Approve Approval Node (Step 2 - Prerequisite Propagation)
  const handleApproveNode = async (approvalCode) => {
    try {
      const res = await fetch('/api/project/approve-node', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: PROJECT_ID,
          approvalCode,
          actorName: 'MIDC Land Scrutiny Officer',
        }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchProjectData();
        setActiveTab('roadmap');
      }
    } catch (err) {
      console.error('Error approving node:', err);
    }
  };

  const handleApproveMidc = () => {
    handleApproveNode('MIDC_LAND_ALLOCATION');
  };

  // Handler: Advance SLA Timeline +25 Days (Step 3)
  const handleSimulateSla = async () => {
    try {
      const res = await fetch('/api/sla/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: PROJECT_ID,
          daysDelta: 25,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchProjectData();
        setActiveTab('roadmap');
      }
    } catch (err) {
      console.error('Error simulating SLA:', err);
    }
  };

  // Handler: Gazette Circular 2026/09 Policy Shift (Step 4)
  const handleSimulatePolicy = async () => {
    try {
      const res = await fetch('/api/policy/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
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
        }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchProjectData();
        setActiveTab('roadmap');
      }
    } catch (err) {
      console.error('Error simulating policy change:', err);
    }
  };

  // Handler: Reset Project Baseline
  const handleResetProject = async () => {
    try {
      const res = await fetch('/api/project/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.success) {
        setRagState({ isLoading: false, result: null });
        await fetchProjectData();
        setActiveTab('roadmap');
      }
    } catch (err) {
      console.error('Error resetting project:', err);
    }
  };

  // Handler: Query Grounded RAG
  const handleQueryRag = async (query) => {
    setRagState({ isLoading: true, result: null });
    try {
      const res = await fetch('/api/rag/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: PROJECT_ID, query }),
      });
      const data = await res.json();
      if (data.success) {
        setRagState({ isLoading: false, result: data.result });
      } else {
        setRagState({ isLoading: false, result: null });
      }
    } catch (err) {
      console.error('Error querying RAG:', err);
      setRagState({ isLoading: false, result: null });
    }
  };

  const investmentFact = evidence?.find((e) => e.factKey === 'GROSS_PROJECT_INVESTMENT');
  const hasActionItem = investmentFact?.validationState === 'DISCREPANCY_FLAGGED';

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* Redesigned Executive Header */}
      <HeaderBar
        project={project}
        graph={graph}
        isConnected={isConnected}
        onUploadCaCert={handleUploadCaCert}
        onApproveMidc={handleApproveMidc}
        onSimulateSla={handleSimulateSla}
        onSimulatePolicy={handleSimulatePolicy}
        onResetProject={handleResetProject}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        hasActionItem={hasActionItem}
      />

      {/* Spacious Full-Width Workspace Container */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === 'roadmap' && (
          <RegulatoryDagView
            graph={graph}
            onApproveNode={handleApproveNode}
          />
        )}

        {activeTab === 'document' && (
          <CentralWorkspace
            project={project}
            evidence={evidence}
            onReconcileFact={handleReconcileFact}
            onQueryRag={handleQueryRag}
            ragState={ragState}
            rules={rules}
            activeSubView="document"
          />
        )}

        {activeTab === 'copilot' && (
          <CentralWorkspace
            project={project}
            evidence={evidence}
            onReconcileFact={handleReconcileFact}
            onQueryRag={handleQueryRag}
            ragState={ragState}
            rules={rules}
            activeSubView="rag"
          />
        )}

        {activeTab === 'evidence' && (
          <EvidenceWalletAndAudit
            evidence={evidence}
            auditLogs={auditLogs}
            onReconcileFact={handleReconcileFact}
          />
        )}
      </main>

      {/* Clean Subtle Footer */}
      <footer className="h-8 px-6 border-t border-slate-800 bg-slate-900/60 backdrop-blur-sm flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Statutory Intelligence Active: Maharashtra Right to Public Services Act & Water Act Framework</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400 text-[11px]">
          <span>PRAVAH v2.7</span>
          <span>Deterministic State Engine</span>
        </div>
      </footer>
    </div>
  );
}
