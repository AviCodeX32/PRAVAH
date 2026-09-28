import React, { useState } from 'react';
import {
  Workflow,
  Clock,
  CalendarCheck,
  MessageSquareWarning,
  Flame,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Play,
  ArrowRight,
  ShieldCheck,
  Building,
  UserCheck,
  Send,
  Timer,
  ExternalLink,
} from 'lucide-react';

export default function WorkflowView({
  subSection = 'sla_guardian',
  project,
  graph,
  onSimulateSla,
  slaRiskTier = 'NOMINAL',
}) {
  const [activeTab, setActiveTab] = useState(subSection);
  const [queryResponse, setQueryResponse] = useState('');
  const [isResponseSent, setIsResponseSent] = useState(false);

  React.useEffect(() => {
    if (subSection) setActiveTab(subSection);
  }, [subSection]);

  const rawNodes = graph?.nodes || [];

  return (
    <div className="h-full w-full flex flex-col bg-slate-50 overflow-hidden select-none">
      {/* Sub-navigation tabs */}
      <div className="px-6 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('sla_guardian')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'sla_guardian'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>SLA Guardian &amp; Timers</span>
            {slaRiskTier === 'BREACH_IMMINENT' && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 animate-pulse">
                Breach Risk
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('workflow_management')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'workflow_management'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Workflow className="w-3.5 h-3.5 text-slate-600" />
            <span>Cross-Department Orchestration</span>
          </button>

          <button
            onClick={() => setActiveTab('inspections')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'inspections'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5 text-slate-600" />
            <span>Joint Inspection Scheduler</span>
          </button>

          <button
            onClick={() => setActiveTab('queries_grievances')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'queries_grievances'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <MessageSquareWarning className="w-3.5 h-3.5 text-slate-600" />
            <span>RTS 15-Day Query Notice</span>
          </button>

          <button
            onClick={() => setActiveTab('critical_path')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'critical_path'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-teal-600" />
            <span>Critical Path Monitor</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSimulateSla}
            className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Advance timeline +25 days to trigger SLA Guardian alert"
          >
            <Play className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
            <span>Simulate +25 Days SLA</span>
          </button>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 overflow-y-auto">
        {/* ========================================================================= */}
        {/* TAB 1: SLA GUARDIAN (INNOVATION #5 & STEP 3 GOLDEN PATH)                  */}
        {/* ========================================================================= */}
        {activeTab === 'sla_guardian' && (
          <div className="p-8 max-w-6xl mx-auto space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
                  PRAVAH Innovation #5
                </span>
                <span className="text-xs text-slate-400">• Statutory Maharashtra RTS Act Monitor</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
                <Clock className="w-6 h-6 text-blue-600" />
                <span>SLA Guardian (Statutory Timeline Enforcement)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-3xl">
                Monitors legally binding service level agreements across every clearance authority under the Maharashtra Right to Public Services Act 2015. Automatically escalates bottlenecks before deadlines lapse.
              </p>
            </div>

            {/* SLA Risk Banner */}
            <div
              className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                slaRiskTier === 'BREACH_IMMINENT'
                  ? 'bg-rose-50 border-rose-300 text-rose-900'
                  : 'bg-white border-slate-200 text-slate-900 shadow-2xs'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    slaRiskTier === 'BREACH_IMMINENT'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-blue-50 text-blue-700'
                  }`}
                >
                  <Timer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">
                    {slaRiskTier === 'BREACH_IMMINENT'
                      ? 'CRITICAL WARNING: SLA Breach Imminent within 5 Days'
                      : 'All Scrutiny Timelines within Nominal Statutory Parameters'}
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {slaRiskTier === 'BREACH_IMMINENT'
                      ? 'MPCB Consent to Establish (CTE) has burned 25 days out of 30 days statutory limit. District Collector escalation trigger armed.'
                      : 'Every registered application has sufficient scrutiny buffer under Citizen Charter timelines.'}
                  </p>
                </div>
              </div>

              <button
                onClick={onSimulateSla}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Advance +25 Days</span>
              </button>
            </div>

            {/* Clearance Timers Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-5 py-3.5">Approval Clearance</th>
                    <th className="px-5 py-3.5">Department</th>
                    <th className="px-5 py-3.5">Statutory Window</th>
                    <th className="px-5 py-3.5">Elapsed Days</th>
                    <th className="px-5 py-3.5">Risk Tier</th>
                    <th className="px-5 py-3.5 text-right">Escalation Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {rawNodes.map((node) => {
                    const elapsed = node.slaElapsedDays || 0;
                    const total = node.statutorySlaDays || 30;
                    const burn = Math.round((elapsed / total) * 100);
                    const isBreach = node.slaRiskTier === 'BREACH_IMMINENT' || burn >= 80;

                    return (
                      <tr key={node.approvalCode} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-4 font-bold text-slate-900">
                          {node.approvalName}
                        </td>
                        <td className="px-5 py-4 font-medium text-slate-600">{node.departmentName}</td>
                        <td className="px-5 py-4 font-semibold text-slate-800">{total} Days</td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800">{elapsed}d</span>
                            <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  node.status === 'APPROVED'
                                    ? 'bg-emerald-500'
                                    : isBreach
                                    ? 'bg-rose-500'
                                    : 'bg-blue-600'
                                }`}
                                style={{ width: `${Math.min(100, burn)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          {node.status === 'APPROVED' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              Completed
                            </span>
                          ) : isBreach ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
                              Breach Imminent ({total - elapsed}d left)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700">
                              Nominal
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          {isBreach && node.status !== 'APPROVED' ? (
                            <span className="text-[11px] font-bold text-rose-700 flex items-center justify-end gap-1">
                              <Flame className="w-3.5 h-3.5 text-rose-600" /> Auto-Escalated to HoD
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">Within Window</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CROSS-DEPARTMENT WORKFLOW MANAGEMENT (INNOVATION #9)               */}
        {/* ========================================================================= */}
        {activeTab === 'workflow_management' && (
          <div className="p-8 max-w-6xl mx-auto space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
                  PRAVAH Innovation #9
                </span>
                <span className="text-xs text-slate-400">• Multi-Department Orchestration</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
                <Workflow className="w-6 h-6 text-blue-600" />
                <span>Cross-Department Statutory Orchestrator</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-3xl">
                Breaks the statutory deadlock where Department B demands approval from Department A before starting, while Department A demands consent from Department B.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  1. Statutory Ingestion
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Single investor filing propagates standardized attributes simultaneously to MIDC, MPCB, DISH, and MSEDCL.
                </p>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-600 font-mono">
                  Payload verified: SHA-256
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  2. Parallel Evaluation
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  MPCB environmental scrutiny runs concurrently with Labour Contractor registration and Provisional Fire clearance without sequential stalls.
                </p>
                <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-100 text-[11px] text-blue-800 font-bold">
                  Saves ~45 Calendar Days
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  3. Synchronized Gate
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Factory Building Plan (DISH) automatically unlocks when all three parallel approvals publish digital seal certificates.
                </p>
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 text-[11px] text-emerald-800 font-bold">
                  Automated Gate Release
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: JOINT INSPECTION SCHEDULER                                         */}
        {/* ========================================================================= */}
        {activeTab === 'inspections' && (
          <div className="p-8 max-w-5xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <CalendarCheck className="w-6 h-6 text-slate-700" />
                <span>Synchronized Joint Inspection Scheduler</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Mandated under Business Reforms Action Plan (BRAP): Multiple department inspections (Pollution, Fire, Factory Safety) are combined into a single scheduled visit.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-blue-700 uppercase">Upcoming Scheduled Site Visit</span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    Integrated Pre-Establishment Physical Scrutiny
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                  Confirmed: 12 October 2026 (10:30 AM)
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">Maharashtra Pollution Control Board (MPCB)</span>
                    <p className="text-[11px] text-slate-500">Officer: S.K. Deshmukh (Sub-Regional Officer, Pune II)</p>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700">Attending</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">Directorate of Industrial Safety &amp; Health (DISH)</span>
                    <p className="text-[11px] text-slate-500">Officer: V.R. Patil (Joint Director, Safety)</p>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700">Attending</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900">MIDC Fire &amp; Rescue Services</span>
                    <p className="text-[11px] text-slate-500">Officer: K.M. Shinde (Divisional Fire Officer)</p>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700">Attending</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <strong>Investor Preparation Checklist:</strong> Keep ready approved structural drawings, site boundary pegs, borewell coordinates, and ETP layout drawings.
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: RTS 15-DAY QUERY & CURE WINDOW                                     */}
        {/* ========================================================================= */}
        {activeTab === 'queries_grievances' && (
          <div className="p-8 max-w-5xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <MessageSquareWarning className="w-6 h-6 text-slate-700" />
                <span>Statutory RTS 15-Day Query &amp; Cure Window</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Under the Maharashtra RTS Act 2015, queries raised by scrutiny officers freeze the SLA timer and provide a legally protected 15-day cure window.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <span className="text-xs font-bold text-slate-900">
                    Query Notice Ref: MPCB/RO/PUN/QRY-2026/041
                  </span>
                </div>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  Cure Window: 11 Days Remaining
                </span>
              </div>

              <div className="text-xs space-y-2 text-slate-700">
                <div className="font-bold text-slate-900">Department Clarification Requested:</div>
                <p className="bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed text-slate-700">
                  "Please furnish revised flow diagram showing secondary biological treatment and reverse osmosis stage for 125 KLD fruit washing effluent to comply with zero liquid discharge norms."
                </p>
              </div>

              {/* Response input */}
              <div className="space-y-3 text-xs">
                <label className="font-bold text-slate-800 block">Investor Response &amp; Supplementary Evidence:</label>
                <textarea
                  rows={3}
                  value={queryResponse}
                  onChange={(e) => setQueryResponse(e.target.value)}
                  placeholder="Explain corrective engineering measures and cite attached supplementary technical diagrams..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">
                    Supported formats: PDF, DWG (Max 25 MB)
                  </span>

                  <button
                    onClick={() => {
                      if (queryResponse.trim()) {
                        setIsResponseSent(true);
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Statutory Clarification</span>
                  </button>
                </div>

                {isResponseSent && (
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Clarification submitted to MPCB Scrutiny Officer. SLA timer resumed.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: CRITICAL PATH MONITOR (INNOVATION #8)                               */}
        {/* ========================================================================= */}
        {activeTab === 'critical_path' && (
          <div className="p-8 max-w-6xl mx-auto space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 uppercase tracking-wider">
                  PRAVAH Innovation #8
                </span>
                <span className="text-xs text-slate-400">• CPM / PERT Optimization</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
                <Layers className="w-6 h-6 text-teal-600" />
                <span>Critical Path &amp; Bottleneck Analysis</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-3xl">
                Dynamic topological calculation of the longest statutory path driving total plant commissioning time. Any delay on this path directly delays factory launch.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-slate-800">
                  Active Critical Path Sequence ({graph?.criticalPathDays || 120} Days Total)
                </span>
                <span className="text-xs font-bold text-teal-700">Topological CPM Engine</span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div className="flex-1 p-3 rounded-lg bg-emerald-50/50 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">MIDC Land Possession Order</span>
                      <p className="text-[11px] text-slate-500">Duration: 30 Days (Completed)</p>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div className="flex-1 p-3 rounded-lg bg-blue-50/50 border border-blue-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">MPCB Consent to Establish (CTE)</span>
                      <p className="text-[11px] text-slate-500">Duration: 30 Days (Active On Critical Path)</p>
                    </div>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Critical</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div className="flex-1 p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">Factory Safety Plan Approval (DISH)</span>
                      <p className="text-[11px] text-slate-500">Duration: 60 Days (Downstream Prerequisite)</p>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded">Queued</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
