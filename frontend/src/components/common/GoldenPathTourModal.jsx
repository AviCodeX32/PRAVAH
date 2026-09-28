import React from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Play,
  RotateCcw,
  Building2,
  Compass,
  Milestone,
  Network,
  UploadCloud,
  FileSearch,
  AlertTriangle,
  Wallet,
  Clock,
  UserCheck,
  CalendarCheck,
  Radio,
  FileCheck,
} from 'lucide-react';

export const TOUR_STEPS = [
  {
    step: 1,
    title: 'Create Industrial Project',
    module: 'project_profile',
    description: 'Initiate the industrial Regulatory Digital Twin for Sahyadri Agro-Processing Facility under Maharashtra jurisdiction.',
    actionLabel: 'View Project Profile',
  },
  {
    step: 2,
    title: 'Enter Enterprise Details',
    module: 'project_profile',
    description: 'Input aggregate capital outlay (₹12.0 Cr), sector (Food Processing - NIC 10792), employment (150), and Chakan MIDC location.',
    actionLabel: 'Verify Profile Parameters',
  },
  {
    step: 3,
    title: 'Discover Applicable Approvals',
    module: 'discover_approvals',
    description: 'PRAVAH scans 147 statutory regulations and identifies 6 mandatory state clearances across MIDC, MPCB, DISHER, and Fire Services.',
    actionLabel: 'View Approval Discovery',
  },
  {
    step: 4,
    title: 'Dynamic Approval Roadmap',
    module: 'approval_roadmap',
    description: 'A phased milestone roadmap is generated with statutory SLAs, prerequisites, and estimated commercial production dates.',
    actionLabel: 'View Phased Roadmap',
  },
  {
    step: 5,
    title: 'Regulatory Dependency Graph (DAG)',
    module: 'dependency_graph',
    description: 'Visualizes approvals as a Directed Acyclic Graph. MIDC Land Allotment is READY_TO_APPLY; MPCB CTE and Fire NOC are BLOCKED pending land possession.',
    actionLabel: 'Explore Interactive DAG',
  },
  {
    step: 6,
    title: 'Upload Administrative Filings',
    module: 'document_repository',
    description: 'Upload Chartered_Accountant_NetWorth_Certificate.pdf with SHA-256 tamper-proof provenance.',
    actionLabel: 'Trigger Document Upload',
  },
  {
    step: 7,
    title: 'AI Document Intelligence Extraction',
    module: 'document_intelligence',
    description: 'Sub-Agent 1 parses the PDF, extracting Gross Capital Outlay, Plot Survey Code, and Water Demand with page citations.',
    actionLabel: 'View Extracted Bounding Boxes',
  },
  {
    step: 8,
    title: 'Identify Document Mismatch Anomaly',
    module: 'verification_mismatches',
    description: 'Zero-tolerance cross-verification flags that certified capital (₹13.6 Cr) differs from declared capital (₹12.0 Cr) by +13.33%.',
    actionLabel: 'Inspect Discrepancy Alert',
  },
  {
    step: 9,
    title: 'Evidence Wallet Fact Store',
    module: 'evidence_wallet',
    description: 'Verified facts (Survey Plot C-44, Orange Category Pollution Index 48) are stored with cryptographic hashes for multi-department reuse.',
    actionLabel: 'Open Evidence Wallet',
  },
  {
    step: 10,
    title: 'Identify Parallel Permissible Tracks',
    module: 'dependency_graph',
    description: 'Topological solver identifies that DISHER Labour Registration can proceed concurrently with MPCB CTE, compressing total lead time.',
    actionLabel: 'View Parallel Branch',
  },
  {
    step: 11,
    title: 'SLA Guardian Deadline Monitoring',
    module: 'sla_guardian',
    description: 'SLA Guardian computes linear burn rate (12 of 30 days elapsed on MIDC) and predicts delay risk before statutory lapse.',
    actionLabel: 'Inspect SLA Burn Meters',
  },
  {
    step: 12,
    title: 'Officer Application Review & Approval',
    module: 'applications',
    description: 'Officer reviews MIDC Land Allotment and grants statutory approval. Topological solver automatically unblocks MPCB CTE!',
    actionLabel: 'Simulate Officer Approval',
  },
  {
    step: 13,
    title: 'Schedule Joint Site Inspection',
    module: 'inspections',
    description: 'Coordinated site visit scheduled between MIDC planning engineer and Fire safety inspector to avoid redundant inspections.',
    actionLabel: 'View Inspection Schedule',
  },
  {
    step: 14,
    title: 'Bottleneck & Delay Root-Cause Analysis',
    module: 'bottleneck_intelligence',
    description: 'Bottleneck intelligence flags regional inspection queue backlog in Chakan industrial zone.',
    actionLabel: 'View Bottleneck Analytics',
  },
  {
    step: 15,
    title: 'Explainable AI Next-Action Copilot',
    module: 'ai_copilot',
    description: 'Copilot recommends immediate submission of MPCB CTE with specific statutory citations (Water Act 1974 Section 25).',
    actionLabel: 'Consult Copilot Advice',
  },
  {
    step: 16,
    title: 'Promulgate Gazette Circular 2026/09',
    module: 'regulatory_changes',
    description: 'State issues new circular requiring mandatory Groundwater Extraction NOC for agro-units with investment > ₹10 Cr.',
    actionLabel: 'View Gazette Amendment',
  },
  {
    step: 17,
    title: 'Regulatory Change Impact Engine (Blast Radius)',
    module: 'change_impact_analysis',
    description: 'Sub-Agent 5 detects Sahyadri agro facility in blast radius and dynamically injects GROUNDWATER_NOC node into the live DAG!',
    actionLabel: 'Execute Dynamic DAG Injection',
  },
  {
    step: 18,
    title: 'Updated Critical Path & Human Review',
    module: 'critical_path',
    description: 'Project critical path recalculates from 120d to 165d. Downstream building plan holds until human officer verifies groundwater compliance.',
    actionLabel: 'Review Final Orchestrated State',
  },
];

export default function GoldenPathTourModal({
  isOpen,
  onClose,
  currentStepIndex,
  onGoToStep,
  onExecuteCurrentStep,
}) {
  if (!isOpen) return null;

  const current = TOUR_STEPS[currentStepIndex] || TOUR_STEPS[0];

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                18-Step End-to-End Demonstration Tour
              </h3>
              <p className="text-xs text-slate-500">
                Follow the live regulatory journey from project creation to dynamic policy shift.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>Step {current.step} of 18</span>
              <span className="text-teal-700">{Math.round((current.step / 18) * 100)}% Completed</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-teal-600 transition-all duration-300 rounded-full"
                style={{ width: `${(current.step / 18) * 100}%` }}
              />
            </div>
          </div>

          {/* Active Step Highlight Card */}
          <div className="p-5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider">
              <span>Active Stage:</span>
              <span className="px-2 py-0.5 rounded bg-white text-blue-800 border border-blue-200">
                {current.module.replace(/_/g, ' ')}
              </span>
            </div>

            <h4 className="text-lg font-bold text-slate-900">
              {current.title}
            </h4>

            <p className="text-sm text-slate-600 leading-relaxed">
              {current.description}
            </p>

            <button
              onClick={() => onExecuteCurrentStep(current)}
              className="mt-2 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{current.actionLabel}</span>
            </button>
          </div>

          {/* Steps Quick Selector Grid */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Jump to Demonstration Milestone:
            </span>
            <div className="grid grid-cols-6 gap-2">
              {TOUR_STEPS.map((s, idx) => {
                const isActive = idx === currentStepIndex;
                const isPast = idx < currentStepIndex;

                return (
                  <button
                    key={s.step}
                    onClick={() => onGoToStep(idx)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold text-center border transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : isPast
                        ? 'bg-teal-50 text-teal-800 border-teal-200'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {s.step}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <button
            onClick={() => onGoToStep(Math.max(0, currentStepIndex - 1))}
            disabled={currentStepIndex === 0}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 flex items-center gap-1 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <button
            onClick={() => onGoToStep(Math.min(TOUR_STEPS.length - 1, currentStepIndex + 1))}
            disabled={currentStepIndex === TOUR_STEPS.length - 1}
            className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium flex items-center gap-1"
          >
            <span>Next Step</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
