import React, { useState, useEffect, useCallback } from 'react';
import LandingPageView from './views/LandingPageView.jsx';
import AuthModal from './components/common/AuthModal.jsx';
import AppHeader from './components/layout/AppHeader.jsx';
import AppSidebar from './components/layout/AppSidebar.jsx';
import FloatingTourButton from './components/common/FloatingTourButton.jsx';
import GoldenPathTourModal from './components/common/GoldenPathTourModal.jsx';

// Core Streamlined Views
import OverviewView from './views/OverviewView.jsx';
import ProcessNodeSystem from './components/ProcessNodeSystem.jsx';
import DepartmentHubView from './views/DepartmentHubView.jsx';
import DocumentsView from './views/DocumentsView.jsx';
import ComplianceView from './views/ComplianceView.jsx';
import WorkflowView from './views/WorkflowView.jsx';
import AdminView from './views/AdminView.jsx';

const PROJECT_ID = 'MAHA-AGRO-2026-8812';

export default function App() {
  // Localization State ('en' | 'mr' | 'hi')
  const [lang, setLang] = useState('en');

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: 'Industrial Applicant',
    email: 'applicant@portal.gov.in',
    companyName: 'Industrial Venture Unit',
    role: 'investor', // 'investor' | 'officer' | 'admin'
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [authModalRole, setAuthModalRole] = useState('investor');

  // Backend Project Data State
  const [project, setProject] = useState(null);
  const [graph, setGraph] = useState(null);
  const [evidence, setEvidence] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [rules, setRules] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [ragState, setRagState] = useState({ isLoading: false, result: null });

  // Navigation State
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [tourStepIndex, setTourStepIndex] = useState(0);

  // Fetch full project snapshot from backend
  const fetchProjectData = useCallback(async () => {
    try {
      const res = await fetch(`/api/project/${PROJECT_ID}`);
      if (!res.ok) throw new Error('Failed to fetch project data');
      const data = await res.json();
      setProject(data.project);
      setGraph(data.graph);
      setEvidence(data.evidence || []);
      setDocuments(data.documents || []);
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

  // Auth Handlers
  const handleOpenAuth = (mode = 'login', defaultRole = 'investor') => {
    setAuthModalMode(mode);
    setAuthModalRole(defaultRole);
    setIsAuthModalOpen(true);
  };

  const handleSuccessLogin = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);

    // Navigate to appropriate starting section for the role
    if (user.role === 'officer') {
      setCurrentSection('officer_queue');
    } else if (user.role === 'admin') {
      setCurrentSection('services_catalog');
    } else {
      setCurrentSection('dashboard');
    }
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
  };

  const handleSwitchRole = (newRole) => {
    setCurrentUser((prev) => ({
      ...prev,
      role: newRole,
    }));
    if (newRole === 'officer') setCurrentSection('officer_queue');
    else if (newRole === 'admin') setCurrentSection('services_catalog');
    else setCurrentSection('dashboard');
  };

  // Statutory Workflow Handlers
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
        setCurrentSection('evidence_wallet');
      }
    } catch (err) {
      console.error('Error uploading CA cert:', err);
    }
  };

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

  const handleApproveNode = async (approvalCode) => {
    try {
      const res = await fetch('/api/project/approve-node', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: PROJECT_ID,
          approvalCode,
          actorName:
            currentUser.role === 'officer'
              ? currentUser.name
              : 'MIDC Land Scrutiny Officer',
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
    setCurrentSection('process_nodes');
  };

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
        if (currentUser.role === 'officer') {
          setCurrentSection('officer_queue');
        } else {
          setCurrentSection('statutory_queries');
        }
      }
    } catch (err) {
      console.error('Error simulating SLA:', err);
    }
  };

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
        setCurrentSection('process_nodes');
      }
    } catch (err) {
      console.error('Error simulating policy change:', err);
    }
  };

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
    // Map tour step modules to new simplified section IDs
    const moduleMapping = {
      project_profile: 'dashboard',
      discover_approvals: 'process_nodes',
      approval_roadmap: 'process_nodes',
      dependency_graph: 'process_nodes',
      document_repository: 'department_hub',
      document_intelligence: 'evidence_wallet',
      verification_mismatches: 'evidence_wallet',
      evidence_wallet: 'evidence_wallet',
      sla_guardian: 'statutory_queries',
    };

    const targetSection = moduleMapping[step.module] || step.module;
    setCurrentSection(targetSection);

    if (step.step === 6) {
      await handleUploadCaCert();
    } else if (step.step === 8) {
      setCurrentSection('evidence_wallet');
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

  // =========================================================================
  // VIEW RENDER: 1. UN-AUTHENTICATED PRE-LOGIN GOVERNMENT LANDING PAGE
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <>
        <LandingPageView
          onOpenAuth={handleOpenAuth}
          lang={lang}
          onSelectLang={setLang}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          initialMode={authModalMode}
          initialRole={authModalRole}
          onSuccessLogin={handleSuccessLogin}
          lang={lang}
        />
      </>
    );
  }

  // =========================================================================
  // VIEW RENDER: 2. AUTHENTICATED SINGLE-WINDOW COCKPIT
  // =========================================================================
  const userRole = currentUser.role || 'investor';

  return (
    <div className="h-screen w-screen flex bg-slate-50 text-slate-900 overflow-hidden font-sans select-none">
      {/* 1. Left Role-Filtered Sidebar */}
      <AppSidebar
        currentSection={currentSection}
        onSelectSection={setCurrentSection}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
        userRole={userRole}
        activeDiscrepancy={activeDiscrepancy}
        slaRiskTier={slaRiskTier}
        lang={lang}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Clean Spacious Navbar */}
        <AppHeader
          project={project}
          currentUser={currentUser}
          onSignOut={handleSignOut}
          onSwitchRole={handleSwitchRole}
          lang={lang}
          onSelectLang={setLang}
        />

        {/* Dynamic Workspace */}
        <main className="flex-1 min-h-0 flex flex-col overflow-hidden relative bg-slate-50">
          {/* ================= INVESTOR PORTAL SCREENS ================= */}
          {userRole === 'investor' && (
            <>
              {currentSection === 'dashboard' && (
                <OverviewView
                  project={project}
                  graph={graph}
                  evidence={evidence}
                  documents={documents}
                  auditLogs={auditLogs}
                  userRole="investor"
                  onNavigate={setCurrentSection}
                  onUploadCaCert={handleUploadCaCert}
                  onApproveMidc={handleApproveMidc}
                  onSimulateSla={handleSimulateSla}
                  activeDiscrepancy={activeDiscrepancy}
                  lang={lang}
                />
              )}

              {currentSection === 'process_nodes' && (
                <ProcessNodeSystem
                  graph={graph}
                  onApproveNode={handleApproveNode}
                  onSimulatePolicy={handleSimulatePolicy}
                  onSimulateSla={handleSimulateSla}
                />
              )}

              {currentSection === 'department_hub' && (
                <DepartmentHubView
                  onUploadCaCert={handleUploadCaCert}
                  activeDiscrepancy={activeDiscrepancy}
                  userRole="investor"
                  lang={lang}
                />
              )}

              {currentSection === 'evidence_wallet' && (
                <DocumentsView
                  subSection={activeDiscrepancy ? 'verification_mismatches' : 'evidence_wallet'}
                  project={project}
                  evidence={evidence}
                  auditLogs={auditLogs}
                  onUploadCaCert={handleUploadCaCert}
                  onReconcileFact={handleReconcileFact}
                  activeDiscrepancy={activeDiscrepancy}
                />
              )}

              {(currentSection === 'compliance_tracker' ||
                currentSection === 'statutory_queries' ||
                currentSection === 'gazette_base' ||
                currentSection === 'renewals_schedule') && (
                <ComplianceView
                  subSection={
                    currentSection === 'compliance_tracker'
                      ? 'compliance_tracker'
                      : currentSection === 'gazette_base'
                      ? 'regulatory_knowledge_base'
                      : currentSection === 'renewals_schedule'
                      ? 'renewals'
                      : 'regulatory_ai_assistant'
                  }
                  project={project}
                  rules={rules}
                  ragState={ragState}
                  onQueryRag={handleQueryRag}
                  onNavigateSection={setCurrentSection}
                  lang={lang}
                />
              )}
            </>
          )}

          {/* ================= OFFICER PORTAL SCREENS ================= */}
          {userRole === 'officer' && (
            <>
              {currentSection === 'officer_queue' && (
                <OverviewView
                  project={project}
                  graph={graph}
                  evidence={evidence}
                  documents={documents}
                  auditLogs={auditLogs}
                  userRole="officer"
                  onNavigate={setCurrentSection}
                  onUploadCaCert={handleUploadCaCert}
                  onApproveMidc={handleApproveMidc}
                  onSimulateSla={handleSimulateSla}
                  activeDiscrepancy={activeDiscrepancy}
                  lang={lang}
                />
              )}

              {currentSection === 'dept_standards' && (
                <DepartmentHubView
                  onUploadCaCert={handleUploadCaCert}
                  activeDiscrepancy={activeDiscrepancy}
                  userRole="officer"
                  lang={lang}
                />
              )}

              {currentSection === 'inspections' && (
                <WorkflowView
                  subSection="inspections"
                  project={project}
                  graph={graph}
                  onSimulateSla={handleSimulateSla}
                  slaRiskTier={slaRiskTier}
                />
              )}

              {currentSection === 'rts_queries' && (
                <WorkflowView
                  subSection="queries_grievances"
                  project={project}
                  graph={graph}
                  onSimulateSla={handleSimulateSla}
                  slaRiskTier={slaRiskTier}
                />
              )}
            </>
          )}

          {/* ================= ADMIN PORTAL SCREENS ================= */}
          {userRole === 'admin' && (
            <>
              {currentSection === 'services_catalog' && (
                <AdminView
                  subSection="departments_services"
                  auditLogs={auditLogs}
                  rules={rules}
                  project={project}
                />
              )}

              {currentSection === 'users_rbac' && (
                <AdminView
                  subSection="users_roles"
                  auditLogs={auditLogs}
                  rules={rules}
                  project={project}
                />
              )}

              {currentSection === 'audit_ledger' && (
                <AdminView
                  subSection="audit_logs"
                  auditLogs={auditLogs}
                  rules={rules}
                  project={project}
                />
              )}

              {currentSection === 'system_health' && (
                <AdminView
                  subSection="settings"
                  auditLogs={auditLogs}
                  rules={rules}
                  project={project}
                />
              )}
            </>
          )}
        </main>

        {/* Clean Footer Bar */}
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
            <span>PRAVAH v2.8 Streamlined Edition</span>
            <span>Maharashtra RTS Act 2015</span>
          </div>
        </footer>
      </div>

      {/* 3. Bottom-Right Floating 18-Step Tour Button */}
      <FloatingTourButton
        onClick={() => setIsTourOpen(true)}
        currentStep={tourStepIndex + 1}
        totalSteps={18}
        lang={lang}
      />

      {/* 4. 18-Step Interactive Golden Path Modal */}
      <GoldenPathTourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        currentStepIndex={tourStepIndex}
        onGoToStep={setTourStepIndex}
        onExecuteCurrentStep={handleExecuteTourStep}
      />

      {/* 5. Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        initialRole={authModalRole}
        onSuccessLogin={handleSuccessLogin}
        lang={lang}
      />
    </div>
  );
}
