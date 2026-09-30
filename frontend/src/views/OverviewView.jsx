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
  UploadCloud,
  FileText,
  MessageSquareWarning,
  Scale,
  Sparkles,
} from 'lucide-react';
import { translations } from '../locales/translations.js';

export default function OverviewView({
  project,
  graph,
  evidence = [],
  documents = [],
  auditLogs = [],
  userRole = 'investor',
  onNavigate,
  onUploadCaCert,
  onApproveMidc,
  onSimulateSla,
  activeDiscrepancy = false,
  lang = 'en',
}) {
  const t = translations[lang] || translations.en;
  const nodes = graph?.nodes || [];
  const approvedCount = nodes.filter((n) => n.status === 'APPROVED').length;
  const readyCount = nodes.filter((n) => n.status === 'READY_TO_APPLY').length;
  const blockedCount = nodes.filter((n) => n.status === 'BLOCKED').length;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 select-none overflow-y-auto">
      {/* ========================================================================= */}
      {/* 1. INVESTOR / BUSINESS USER DASHBOARD                                    */}
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
                Single Window Industrial Registration: <strong>{project?.projectId || 'MAHA-AGRO-2026-8812'}</strong>. Under jurisdiction of MIDC Chakan Phase II, Pune. All statutory clearances monitored in real time.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => onNavigate('process_nodes')}
                className="px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <span>{t.navProcessNodes}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* KPI Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Clearances */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>{t.activeClearances}</span>
                <Layers className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{nodes.length} Approvals</div>
              <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
                <span className="text-emerald-600 font-semibold">{approvedCount} {t.approved}</span> •{' '}
                <span className="text-blue-600 font-semibold">{readyCount} {t.readyToApply}</span> •{' '}
                <span className="text-slate-400">{blockedCount} {t.prereqPending}</span>
              </div>
            </div>

            {/* Compliance Health */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>{t.complianceScore}</span>
                <Activity className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-emerald-600">
                {project?.globalHealthScore || 92}%
              </div>
              <div className="text-xs text-slate-500 pt-1">
                Zero statutory violations recorded
              </div>
            </div>

            {/* SLA Delay Risk */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Statutory SLA Window</span>
                <Clock className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {project?.aggregateSlaRisk?.tier || 'NOMINAL'}
              </div>
              <div className="text-xs text-slate-500 pt-1">
                Protected under Maharashtra RTS Act
              </div>
            </div>

            {/* Critical Path Days */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>{t.criticalPath}</span>
                <Sparkles className="w-4 h-4 text-teal-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {graph?.criticalPathDays || 120} {t.days}
              </div>
              <div className="text-xs text-slate-500 pt-1">
                Target COD: Commercial Operations Q3
              </div>
            </div>
          </div>

          {/* Action Needed Card (Discrepancy Banner if Active) */}
          {activeDiscrepancy && (
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-900">
                    Document Discrepancy Detected (Gross Capital Outlay)
                  </h4>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Certified CA Statement indicates ₹13.60 Crores, whereas ₹12.00 Crores was initially declared. Please reconcile this figure to prevent officer query notices during MPCB CTE scrutiny.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigate('evidence_wallet')}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shrink-0 transition-colors shadow-2xs cursor-pointer"
              >
                Reconcile Variance (+13.33%)
              </button>
            </div>
          )}

          {/* Active 15-Day RTS Query Notice Widget */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <MessageSquareWarning className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{t.rtsAlertTitle}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                    Notice Ref: MPCB/PUN/2026/041
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{t.rtsAlertDesc}</p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('statutory_queries')}
              className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs shrink-0 transition-colors cursor-pointer"
            >
              {t.respondQuery}
            </button>
          </div>

          {/* Two-Column Government Operational Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Phased Process Nodes Status */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">Statutory Clearance Pipeline</h3>
                </div>
                <button
                  onClick={() => onNavigate('process_nodes')}
                  className="text-xs font-semibold text-blue-700 hover:underline cursor-pointer"
                >
                  View Full Pipeline &rarr;
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {/* MIDC Land */}
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900">MIDC Land Possession Order</span>
                    <div className="text-[11px] text-slate-500">Plot C-44, Chakan Phase II (12,500 sq.m)</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Approved
                  </span>
                </div>

                {/* MPCB CTE */}
                <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900">MPCB Consent to Establish (CTE)</span>
                    <div className="text-[11px] text-slate-500">Orange Category Agro • 45-day statutory window</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 animate-pulse">
                    Ready to Apply
                  </span>
                </div>

                {/* Labour Registration */}
                <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900">Contract Labour Registration (CLRA)</span>
                    <div className="text-[11px] text-slate-500">DISH Directorate • Parallel permissible track</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                    Parallel Ready
                  </span>
                </div>

                {/* Fire NOC */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800">Provisional Fire Safety NOC</span>
                    <div className="text-[11px] text-slate-500">Maharashtra Fire Services • 30-day SLA</div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-200 text-slate-700">
                    In Scrutiny
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Scheduled Inspection & Department Documents */}
            <div className="space-y-6">
              {/* Joint Inspection Widget */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm font-bold text-slate-900">{t.upcomingInspection}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Confirmed
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{t.inspectionDesc}</p>
                <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-0.5">
                  <div>Participating Officers: S.K. Deshmukh (MPCB), V.R. Patil (DISH), K.M. Shinde (Fire)</div>
                  <div>Site Coordinates: Plot C-44, Chakan Phase II, Pune</div>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Quick Statutory Actions</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => onNavigate('department_hub')}
                    className="p-3 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-white text-left transition-all cursor-pointer space-y-1"
                  >
                    <Building className="w-4 h-4 text-blue-600" />
                    <div className="font-bold text-slate-900">Department Hub</div>
                    <div className="text-[10px] text-slate-500">Check required docs by dept</div>
                  </button>

                  <button
                    onClick={() => onNavigate('evidence_wallet')}
                    className="p-3 rounded-xl border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-white text-left transition-all cursor-pointer space-y-1"
                  >
                    <FileCheck className="w-4 h-4 text-teal-600" />
                    <div className="font-bold text-slate-900">Evidence Wallet</div>
                    <div className="text-[10px] text-slate-500">Verified facts &amp; SHA-256 proofs</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. GOVERNMENT OFFICER DASHBOARD                                           */}
      {/* ========================================================================= */}
      {userRole === 'officer' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-300 border border-white/20">
                Official Departmental Portal
              </span>
              <h2 className="text-2xl font-bold tracking-tight">
                Maharashtra Pollution Control Board (MPCB) — Scrutiny Desk
              </h2>
              <p className="text-sm text-slate-300 max-w-xl">
                Officer Desk: <strong>Sub-Regional Officer Pune II</strong>. Enforcing Water (P&amp;CP) Act 1974 &amp; Maharashtra RTS Act 2015.
              </p>
            </div>
          </div>

          {/* Officer Scrutiny Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-xs text-slate-500 font-medium">Pending Files for Scrutiny</span>
              <div className="text-2xl font-bold text-blue-700">4 Applications</div>
              <div className="text-xs text-slate-500 pt-1">Average turnaround: 14 Days</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-xs text-slate-500 font-medium">Active RTS Query Notices</span>
              <div className="text-2xl font-bold text-amber-600">1 Query Notice</div>
              <div className="text-xs text-slate-500 pt-1">11 days remaining for applicant cure</div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
              <span className="text-xs text-slate-500 font-medium">Scheduled Joint Inspections</span>
              <div className="text-2xl font-bold text-emerald-600">1 Scheduled</div>
              <div className="text-xs text-slate-500 pt-1">Date: 12 October 2026 (Chakan)</div>
            </div>
          </div>

          {/* Pending Application Review Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Application Pending Approval</span>
                <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                  Consent to Establish (CTE) — Sahyadri Agro-Processing Facility
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                SLA: 45 Days (MTS Act)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Capital Outlay</span>
                <span className="font-bold text-slate-900">₹13.60 Crores (CA Certified)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Industrial Category</span>
                <span className="font-bold text-amber-700">Orange Category (Score 48)</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px]">Statutory Fee</span>
                <span className="font-bold text-emerald-700">₹75,000 (Paid &amp; Reconciled)</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => onApproveMidc()}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Issue Consent Order (Grant Clearance)</span>
              </button>
              <button
                onClick={() => onNavigate('dept_standards')}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
              >
                Inspect Submitted Documents
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
