import React from 'react';
import {
  Building2,
  CheckCircle2,
  Clock,
  Lock,
  Layers,
  Activity,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  CalendarCheck,
  FileCheck,
  TrendingUp,
  ShieldCheck,
  Building,
  Users2,
  Workflow,
  Radio,
  FileSpreadsheet,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export default function OverviewView({
  project,
  graph,
  evidence,
  auditLogs,
  userRole,
  onNavigate,
  onUploadCaCert,
  onApproveMidc,
  onSimulateSla,
  activeDiscrepancy,
}) {
  const nodes = graph?.nodes || [];
  const approvedCount = nodes.filter((n) => n.status === 'APPROVED').length;
  const readyCount = nodes.filter((n) => n.status === 'READY_TO_APPLY').length;
  const blockedCount = nodes.filter((n) => n.status === 'BLOCKED').length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 select-none">
      {/* ========================================================================= */}
      {/* INVESTOR / BUSINESS USER DASHBOARD                                       */}
      {/* ========================================================================= */}
      {userRole === 'investor' && (
        <div className="space-y-6">
          {/* Welcome Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 via-slate-900 to-teal-900 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-teal-300 border border-white/20">
                Phase: {project?.activeStage || 'Site Preparation'}
              </span>
              <h2 className="text-2xl font-bold tracking-tight">
                {project?.projectName || 'Sahyadri Agro-Processing Facility'}
              </h2>
              <p className="text-sm text-slate-300 max-w-xl">
                Industrial Digital Twin active under Maharashtra Industrial Development Corporation (Chakan Phase II). All statutory clearance dependencies are being monitored by PRAVAH.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('dependency_graph')}
                className="px-4 py-2 rounded-xl bg-white text-slate-900 font-semibold text-xs hover:bg-slate-100 transition-colors shadow-sm"
              >
                View Regulatory Graph (DAG)
              </button>
            </div>
          </div>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Clearances */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Statutory Approvals</span>
                <Layers className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{nodes.length} Licenses</div>
              <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                <span className="text-emerald-600 font-semibold">{approvedCount} Approved</span> •{' '}
                <span className="text-blue-600 font-semibold">{readyCount} Ready</span> •{' '}
                <span className="text-slate-400">{blockedCount} Blocked</span>
              </div>
            </div>

            {/* Compliance Health */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Compliance Health</span>
                <Activity className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-emerald-600">
                {project?.globalHealthScore || 92}%
              </div>
              <div className="text-xs text-slate-500 pt-1">
                Zero statutory violations recorded
              </div>
            </div>

            {/* SLA Risk */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>SLA Delay Risk</span>
                <Clock className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {project?.aggregateSlaRisk?.tier || 'NOMINAL'}
              </div>
              <div className="text-xs text-slate-500 pt-1">
                Burn Score: {Math.round((project?.aggregateSlaRisk?.score || 0.42) * 100)}%
              </div>
            </div>

            {/* Critical Path Days */}
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Critical Path Timeline</span>
                <Sparkles className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {graph?.criticalPathDays || 120} Days
              </div>
              <div className="text-xs text-slate-500 pt-1">
                Target: Pre-Commissioning Q3 2026
              </div>
            </div>
          </div>

          {/* Action Needed Card (Discrepancy Banner if Active) */}
          {activeDiscrepancy && (
            <div className="p-5 rounded-xl bg-amber-50 border border-amber-200 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-900">
                    Document Discrepancy Detected (Gross Capital Outlay)
                  </h4>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Certified CA Statement indicates ₹13.60 Crores, whereas ₹12.00 Crores was declared. Please reconcile this figure to prevent officer query holds during CTE.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('verification_mismatches')}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shrink-0 transition-colors shadow-2xs"
              >
                Resolve Discrepancy
              </button>
            </div>
          )}

          {/* Two-Column Workspaces Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Milestone Approval Roadmap Preview */}
            <div className="lg:col-span-2 p-6 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Active Regulatory Clearances (Roadmap Preview)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Sequential and parallel milestones computed by PRAVAH
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('approval_roadmap')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <span>Full Roadmap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {nodes.slice(0, 4).map((node) => {
                  const isApproved = node.status === 'APPROVED';
                  const isReady = node.status === 'READY_TO_APPLY';

                  return (
                    <div
                      key={node.approvalCode}
                      className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] ${
                            isApproved
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : isReady
                              ? 'bg-blue-100 text-blue-800 border border-blue-300 animate-pulse'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {isApproved ? '✓' : isReady ? '⏱' : '🔒'}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">
                            {node.approvalName}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Department: {node.departmentName} • Statutory SLA: {node.statutorySlaDays} Days
                          </div>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-full font-semibold text-[11px] ${
                          isApproved
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isReady
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {isApproved ? 'Approved' : isReady ? 'Ready to Apply' : 'Prerequisites Pending'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Col: Government Scheme Discovery & Next Action */}
            <div className="space-y-6">
              {/* Next Action Box */}
              <div className="p-5 rounded-xl bg-blue-50/70 border border-blue-200 space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800">
                  Recommended Next Action
                </span>
                <h4 className="text-sm font-bold text-slate-900">
                  Finalize MPCB Consent to Establish
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  With MIDC Land Allotment approved, Consent to Establish (Orange Category) is now unblocked. File application to avoid critical path delay.
                </p>
                <button
                  onClick={() => onNavigate('dependency_graph')}
                  className="w-full py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shadow-2xs transition-colors"
                >
                  Proceed with Clearance
                </button>
              </div>

              {/* State Incentive Discovery */}
              <div className="p-5 rounded-xl bg-teal-50/70 border border-teal-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">
                    Applicable State Scheme
                  </span>
                  <span className="text-[10px] font-semibold text-teal-900 bg-white px-1.5 py-0.5 rounded border border-teal-200">
                    ₹2.5 Cr Eligible
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">
                  Maharashtra Agro-Processing Policy 2024
                </h4>
                <p className="text-xs text-slate-600">
                  Qualifies for 25% Capital Subsidy on plant & machinery for food units in Pune District.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* GOVERNMENT SCRUTINY OFFICER DASHBOARD                                    */}
      {/* ========================================================================= */}
      {userRole === 'officer' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                Government Officer Command Center
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                District Scrutiny & Statutory SLA Desk (Pune Division)
              </h2>
              <p className="text-xs text-slate-500">
                Monitoring MIDC, MPCB, DISHER, and Fire Services regulatory compliance under Maharashtra Right to Services Act 2015.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Total Assigned Filings</span>
              <div className="text-2xl font-bold text-blue-700">14 Active</div>
            </div>
          </div>

          {/* Scrutiny Queue Table */}
          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Assigned Industrial Applications for Scrutiny
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">Application ID</th>
                    <th className="py-2.5 px-3">Enterprise Unit</th>
                    <th className="py-2.5 px-3">Clearance Required</th>
                    <th className="py-2.5 px-3">SLA Elapsed</th>
                    <th className="py-2.5 px-3">Risk Status</th>
                    <th className="py-2.5 px-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50/60">
                    <td className="py-3 px-3 font-mono font-semibold text-slate-900">
                      APP-2026-MIDC-8812
                    </td>
                    <td className="py-3 px-3 font-medium">Sahyadri Agro-Processing Facility</td>
                    <td className="py-3 px-3">MIDC Land Possession & LOI</td>
                    <td className="py-3 px-3">12 of 30 Days (40%)</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                        Nominal
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={onApproveMidc}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] shadow-2xs"
                      >
                        Grant Approval
                      </button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50/60">
                    <td className="py-3 px-3 font-mono font-semibold text-slate-900">
                      APP-2026-MPCB-9941
                    </td>
                    <td className="py-3 px-3 font-medium">Sahyadri Agro-Processing Facility</td>
                    <td className="py-3 px-3">MPCB Consent to Establish (Orange)</td>
                    <td className="py-3 px-3">0 of 45 Days (Awaiting Land)</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-semibold">
                        Blocked Upstream
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-slate-400 text-xs">Waiting Land LOI</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PLATFORM ADMINISTRATOR DASHBOARD                                         */}
      {/* ========================================================================= */}
      {userRole === 'admin' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                System Administration
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                PRAVAH Platform Architecture & Integration Gateway
              </h2>
              <p className="text-xs text-slate-500">
                Configuring multi-department API adapters, gazette rule versioning, and canonical regulatory data models.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              All 6 Gateways Operational
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
              <span className="text-xs font-semibold text-slate-500">Active Rulebase</span>
              <div className="text-xl font-bold text-slate-900">Version MH-2026.1</div>
              <p className="text-xs text-slate-500">
                Gazette rules verified under Water Act 1974 & RTS Act 2015
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
              <span className="text-xs font-semibold text-slate-500">Database Engine</span>
              <div className="text-xl font-bold text-teal-700">Supabase PostgreSQL Cloud</div>
              <p className="text-xs text-slate-500">
                5 Relational Collections Active with RLS Security
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
              <span className="text-xs font-semibold text-slate-500">Document Threat Defense</span>
              <div className="text-xl font-bold text-blue-700">Active Scan Gateway</div>
              <p className="text-xs text-slate-500">
                Prompt-injection protection & SHA-256 tamper prevention active
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
