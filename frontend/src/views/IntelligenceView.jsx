import React, { useState } from 'react';
import {
  TrendingDown,
  Sparkles,
  Cpu,
  Radio,
  Bot,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Play,
  RotateCcw,
  Zap,
  Building,
  Layers,
  Activity,
  Check,
} from 'lucide-react';

export default function IntelligenceView({
  subSection = 'regulatory_digital_twin',
  project,
  graph,
  onSimulatePolicy,
  onResetProject,
  onApproveMidc,
  onNavigate,
}) {
  const [activeTab, setActiveTab] = useState(subSection);

  React.useEffect(() => {
    if (subSection) setActiveTab(subSection);
  }, [subSection]);

  const rawNodes = graph?.nodes || [];
  const hasGroundwater = rawNodes.some((n) => n.approvalCode === 'GROUNDWATER_NOC');

  return (
    <div className="h-full w-full flex flex-col bg-slate-50 overflow-hidden select-none">
      {/* Sub-navigation tabs */}
      <div className="px-6 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('regulatory_digital_twin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'regulatory_digital_twin'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-blue-600" />
            <span>Regulatory Digital Twin</span>
          </button>

          <button
            onClick={() => setActiveTab('change_impact_analysis')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'change_impact_analysis'
                ? 'bg-teal-50 text-teal-900 border border-teal-300 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-teal-600" />
            <span>Policy Change Impact Engine</span>
            {hasGroundwater && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-teal-200 text-teal-900">
                Injected
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('bottleneck_intelligence')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'bottleneck_intelligence'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Bottleneck Intelligence</span>
          </button>

          <button
            onClick={() => setActiveTab('risk_predictions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'risk_predictions'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5 text-slate-600" />
            <span>Risk Radar &amp; Predictions</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_copilot')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'ai_copilot'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-teal-600" />
            <span>Next-Action Copilot</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSimulatePolicy}
            className="px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Simulate Gazette Circular 2026/09 policy shift"
          >
            <Zap className="w-3.5 h-3.5 text-teal-600" />
            <span>Simulate Gazette 2026/09</span>
          </button>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 overflow-y-auto">
        {/* ========================================================================= */}
        {/* TAB 1: REGULATORY DIGITAL TWIN (INNOVATION #7)                            */}
        {/* ========================================================================= */}
        {activeTab === 'regulatory_digital_twin' && (
          <div className="p-8 max-w-6xl mx-auto space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
                  PRAVAH Innovation #7
                </span>
                <span className="text-xs text-slate-400">• Deterministic State Machine</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
                <Cpu className="w-6 h-6 text-blue-600" />
                <span>Industrial Regulatory Digital Twin</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-3xl">
                A live, stateful software representation of your factory's statutory existence. Every clearance transition, document verification, and policy circular immediately updates this state machine.
              </p>
            </div>

            {/* Twin Status Summary Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-bold text-slate-900">
                      Live State: {project?.activeStage || 'Site Preparation & Land Allotment'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    {project?.projectName || 'Sahyadri Agro-Processing Facility'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    ID: {project?.projectId} • Chakan Phase II, Pune • Sector: {project?.industrySector}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Twin Health Index</span>
                    <div className="text-2xl font-bold text-emerald-600">{project?.globalHealthScore || 92}%</div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Critical Path</span>
                    <div className="text-2xl font-bold text-blue-700">{graph?.criticalPathDays || 120}d</div>
                  </div>
                </div>
              </div>

              {/* State Nodes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {rawNodes.map((node) => (
                  <div key={node.approvalCode} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{node.departmentName.split(' ')[0]}</span>
                      {node.status === 'APPROVED' ? (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          APPROVED
                        </span>
                      ) : node.status === 'READY_TO_APPLY' ? (
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full animate-pulse">
                          ACTIONABLE
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                          BLOCKED
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-bold text-slate-900 line-clamp-1">{node.approvalName}</div>
                    <div className="text-[11px] text-slate-500 flex justify-between pt-1 border-t border-slate-200">
                      <span>SLA: {node.statutorySlaDays}d</span>
                      <span>Risk: {node.slaRiskTier}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CHANGE IMPACT ENGINE (INNOVATION #6 & STEP 4 GOLDEN PATH)           */}
        {/* ========================================================================= */}
        {activeTab === 'change_impact_analysis' && (
          <div className="p-8 max-w-5xl mx-auto space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 uppercase tracking-wider">
                  PRAVAH Innovation #6
                </span>
                <span className="text-xs text-slate-400">• Dynamic Policy Adaptation</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
                <Radio className="w-6 h-6 text-teal-600" />
                <span>Policy Change Impact Engine (Gazette Circular 2026/09)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-3xl">
                When a new government circular is promulgated, PRAVAH evaluates your factory's exact parameters (sector, investment, groundwater volume) and dynamically injects newly mandated statutory clearances into the DAG.
              </p>
            </div>

            {/* Gazette 2026/09 Action Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-teal-100 text-teal-800 font-mono text-[10px] font-bold">
                      Gazette Circular 2026/09
                    </span>
                    <span className="text-xs text-slate-400">Effective: 15 Sept 2026</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    Central Ground Water Authority Extraction NOC Requirement
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mandatory for agro-processing facilities with gross capital outlay &gt; ₹10.0 Crores.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!hasGroundwater ? (
                    <button
                      onClick={onSimulatePolicy}
                      className="px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Promulgate Circular &amp; Inject Node</span>
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl bg-teal-100 text-teal-800 font-bold text-xs flex items-center gap-1.5 border border-teal-300">
                      <CheckCircle2 className="w-4 h-4 text-teal-700" />
                      <span>Node Injected &amp; Graph Rewired</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Impact Breakdown */}
              <div className="space-y-3 text-xs">
                <span className="font-bold text-slate-800 block">Automated DAG Re-orchestration Results:</span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">1. Injected Clearance</span>
                    <div className="font-bold text-slate-900">GROUNDWATER_NOC</div>
                    <div className="text-slate-500">CGWA Ground Water Permit (45 Days SLA)</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">2. Dependency Placement</span>
                    <div className="font-bold text-blue-700">MPCB_CTE → GROUNDWATER_NOC</div>
                    <div className="text-slate-500">Must be secured before DISHER Factory Plan</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">3. Critical Path Impact</span>
                    <div className="font-bold text-teal-700">
                      {hasGroundwater ? 'Recalculated: 165 Days (+45d)' : 'Baseline: 120 Days'}
                    </div>
                    <div className="text-slate-500">Zero project stalling; parallel tracks preserved</div>
                  </div>
                </div>
              </div>

              {hasGroundwater && (
                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('dependency_graph')}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-semibold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>View Injected Node in Interactive DAG</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: BOTTLENECK INTELLIGENCE (INNOVATION #8)                             */}
        {/* ========================================================================= */}
        {activeTab === 'bottleneck_intelligence' && (
          <div className="p-8 max-w-5xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-blue-600" />
                <span>Department Congestion &amp; Bottleneck Analytics</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Predictive AI analyzing historical processing pendency across Pune regional offices to forecast where scrutiny bottlenecks occur.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">MPCB Sub-Regional Office Pune II</span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">Moderate Congestion</span>
                </div>
                <p className="text-slate-600">
                  Current pending queue: 142 applications. Average CTE scrutiny turnaround is 26.4 days (88% of 30-day statutory ceiling).
                </p>
                <div className="font-semibold text-blue-700">Recommendation: File EMP documents immediately upon land grant.</div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">MIDC Regional Officer Pune</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">Fast Turnaround</span>
                </div>
                <p className="text-slate-600">
                  Current pending queue: 28 applications. Average plot allocation turnaround is 12.1 days (well ahead of 30-day SLA).
                </p>
                <div className="font-semibold text-emerald-700">Efficiency rating: 96.4% on-time.</div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: RISK RADAR & PREDICTIONS                                           */}
        {/* ========================================================================= */}
        {activeTab === 'risk_predictions' && (
          <div className="p-8 max-w-5xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <TrendingDown className="w-6 h-6 text-slate-700" />
                <span>Statutory Risk Radar</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Early detection of procedural pitfalls before statutory applications are rejected by scrutiny officers.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Capital Outlay Inconsistency Risk</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">Mitigated</span>
                </div>
                <p className="text-slate-600">
                  Evidence Wallet reconciled CA certificate with MPCB fee schedule. Risk of scrutiny query reduced by 94%.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Groundwater Extraction Compliance Risk</span>
                  <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-bold text-[10px]">Monitored</span>
                </div>
                <p className="text-slate-600">
                  CGWA NOC node rewired into DAG path. Ensures plant civil construction cannot be halted by environmental inspectors.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: AI COPILOT (INNOVATION #10)                                        */}
        {/* ========================================================================= */}
        {activeTab === 'ai_copilot' && (
          <div className="p-8 max-w-5xl mx-auto space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
                  PRAVAH Innovation #10
                </span>
                <span className="text-xs text-slate-400">• Prescriptive AI</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
                <Bot className="w-6 h-6 text-teal-600" />
                <span>Next-Action Prescriptive AI Copilot</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-3xl">
                Synthesizes the entire regulatory digital twin and recommends the single most effective legal action right now to keep your project moving.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-blue-200 p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                  Highest-Priority Recommended Action
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                  Confidence: 99.1%
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900">
                  Proceed with MPCB Consent to Establish (CTE) &amp; Parallel Filings
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  With MIDC Land Allotment secured and Capital Outlay verified at ₹13.60 Cr, your unit is fully unblocked to submit parallel applications for MPCB CTE, Labour Registration, and Fire NOC.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => onNavigate('applications')}
                  className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
                >
                  <span>Open Applications Queue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
