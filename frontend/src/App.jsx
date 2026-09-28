import React, { useState, useEffect, useCallback } from 'react';
import AppHeader from './components/layout/AppHeader.jsx';
import AppSidebar from './components/layout/AppSidebar.jsx';
import GoldenPathTourModal from './components/common/GoldenPathTourModal.jsx';

// 8 Modular Views
import OverviewView from './views/OverviewView.jsx';
import ApprovalsView from './views/ApprovalsView.jsx';
import DocumentsView from './views/DocumentsView.jsx';
import ComplianceView from './views/ComplianceView.jsx';
import WorkflowView from './views/WorkflowView.jsx';
import IntelligenceView from './views/IntelligenceView.jsx';
import AnalyticsView from './views/AnalyticsView.jsx';
import AdminView from './views/AdminView.jsx';

const PROJECT_ID = 'MAHA-AGRO-2026-8812';

export default function App() {
  const [project, setProject] = useState(null);
  const [graph, setGraph] = useState(null);
  const [evidence, setEvidence] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [rules, setRules] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [ragState, setRagState] = useState({ isLoading: false, result: null });

  // Navigation and Role State
  const [userRole, setUserRole] = useState('investor'); // 'investor' | 'officer' | 'admin'
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourStepIndex, setTourStepIndex] = useState(0);

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
        setCurrentSection('verification_mismatches');
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
      }
    } catch (err) {
      console.error('Error approving node:', err);
    }
  };

  const handleApproveMidc = () => {
    handleApproveNode('MIDC_LAND_ALLOCATION');
    setCurrentSection('dependency_graph');
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
        setCurrentSection('sla_guardian');
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
        setCurrentSection('dependency_graph');
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
        setCurrentSection('dashboard');
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

  // Golden Path Tour Step Execution
  const handleExecuteTourStep = async (step) => {
    setCurrentSection(step.module);
    if (step.step === 6) {
      await handleUploadCaCert();
    } else if (step.step === 8) {
      setCurrentSection('verification_mismatches');
    } else if (step.step === 11) {
      await handleSimulateSla();
    } else if (step.step === 13) {
      await handleApproveMidc();
    } else if (step.step === 16) {
      await handleSimulatePolicy();
    }
  };

  const investmentFact = evidence?.find((e) => e.factKey === 'GROSS_PROJECT_INVESTMENT');
  const activeDiscrepancy = investmentFact?.validationState === 'DISCREPANCY_FLAGGED';
  const rawNodes = graph?.nodes || [];
  const midcNode = rawNodes.find((n) => n.approvalCode === 'MIDC_LAND_ALLOCATION');
  const slaRiskTier = midcNode?.slaRiskTier || 'NOMINAL';

  // Section Group Determiners
  const isOverview = ['dashboard', 'my_projects', 'notifications'].includes(currentSection);
  const isApprovals = [
    'project_profile',
    'discover_approvals',
    'approval_roadmap',
    'applications',
    'approval_tracking',
    'dependency_graph',
  ].includes(currentSection);
  const isDocuments = [
    'document_repository',
    'document_checklist',
    'evidence_wallet',
    'document_intelligence',
    'verification_mismatches',
  ].includes(currentSection);
  const isCompliance = [
    'compliance_tracker',
    'regulatory_knowledge_base',
    'regulatory_ai_assistant',
    'regulatory_changes',
    'renewals',
  ].includes(currentSection);
  const isWorkflow = [
    'workflow_management',
    'sla_guardian',
    'inspections',
    'queries_grievances',
    'escalations',
    'critical_path',
  ].includes(currentSection);
  const isIntelligence = [
    'risk_predictions',
    'bottleneck_intelligence',
    'regulatory_digital_twin',
    'change_impact_analysis',
    'ai_copilot',
  ].includes(currentSection);
  const isAnalytics = [
    'investor_analytics',
    'officer_command_center',
    'department_performance',
    'reports',
  ].includes(currentSection);
  const isAdmin = [
    'users_roles',
    'departments_services',
    'rules_regulations',
    'integrations',
    'audit_logs',
    'settings',
  ].includes(currentSection);

  return (
    <div className="h-screen w-screen flex bg-slate-50 text-slate-900 overflow-hidden font-sans select-none">
      {/* 1. Left Collapsible Sidebar */}
      <AppSidebar
        currentSection={currentSection}
        onSelectSection={setCurrentSection}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        activeDiscrepancy={activeDiscrepancy}
        slaRiskTier={slaRiskTier}
      />

      {/* 2. Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <AppHeader
          project={project}
          userRole={userRole}
          onSelectRole={setUserRole}
          onOpenTour={() => setIsTourOpen(true)}
          onUploadCaCert={handleUploadCaCert}
          onApproveMidc={handleApproveMidc}
          onSimulateSla={handleSimulateSla}
          onSimulatePolicy={handleSimulatePolicy}
          onResetProject={handleResetProject}
          activeDiscrepancy={activeDiscrepancy}
        />

        {/* Dynamic Workspace Container */}
        <main className="flex-1 overflow-hidden relative bg-slate-50">
          {/* Module 1: Overview */}
          {isOverview && (
            <OverviewView
              project={project}
              graph={graph}
              evidence={evidence}
              auditLogs={auditLogs}
              userRole={userRole}
              onNavigate={setCurrentSection}
              onUploadCaCert={handleUploadCaCert}
              onApproveMidc={handleApproveMidc}
              onSimulateSla={handleSimulateSla}
              activeDiscrepancy={activeDiscrepancy}
            />
          )}

          {/* Module 2: Project & Approvals */}
          {isApprovals && (
            <ApprovalsView
              subSection={currentSection}
              project={project}
              graph={graph}
              onApproveNode={handleApproveNode}
              onNavigate={setCurrentSection}
            />
          )}

          {/* Module 3: Documents & Evidence */}
          {isDocuments && (
            <DocumentsView
              subSection={currentSection}
              project={project}
              evidence={evidence}
              auditLogs={auditLogs}
              onUploadCaCert={handleUploadCaCert}
              onReconcileFact={handleReconcileFact}
              activeDiscrepancy={activeDiscrepancy}
            />
          )}

          {/* Module 4: Compliance & Regulations */}
          {isCompliance && (
            <ComplianceView
              subSection={currentSection}
              project={project}
              rules={rules}
              ragState={ragState}
              onQueryRag={handleQueryRag}
            />
          )}

          {/* Module 5: Workflow & Monitoring */}
          {isWorkflow && (
            <WorkflowView
              subSection={currentSection}
              project={project}
              graph={graph}
              onSimulateSla={handleSimulateSla}
              slaRiskTier={slaRiskTier}
            />
          )}

          {/* Module 6: PRAVAH Intelligence */}
          {isIntelligence && (
            <IntelligenceView
              subSection={currentSection}
              project={project}
              graph={graph}
              onSimulatePolicy={handleSimulatePolicy}
              onResetProject={handleResetProject}
              onApproveMidc={handleApproveMidc}
              onNavigate={setCurrentSection}
            />
          )}

          {/* Module 7: Analytics & Reports */}
          {isAnalytics && (
            <AnalyticsView
              subSection={currentSection}
              project={project}
              graph={graph}
            />
          )}

          {/* Module 8: Administration */}
          {isAdmin && (
            <AdminView
              subSection={currentSection}
              auditLogs={auditLogs}
              rules={rules}
              project={project}
            />
          )}
        </main>

        {/* Clean Light-Themed Footer */}
        <footer className="h-7 px-6 border-t border-slate-200 bg-white flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span>
              Deterministic State Engine: {isConnected ? 'Live Synchronized' : 'Connecting...'} • Supabase PostgreSQL Connected
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>PRAVAH v2.7 Government-Grade Edition</span>
            <span>Ease of Doing Business (EoDB)</span>
          </div>
        </footer>
      </div>

      {/* 18-Step Interactive Golden Path Modal */}
      <GoldenPathTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        currentStepIndex={tourStepIndex}
        onGoToStep={setTourStepIndex}
        onExecuteCurrentStep={handleExecuteTourStep}
      />
    </div>
  );
}
