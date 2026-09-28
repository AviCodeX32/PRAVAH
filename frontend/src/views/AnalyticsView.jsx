import React, { useState } from 'react';
import {
  BarChart3,
  Users2,
  Building,
  FileCheck,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  Calendar,
  Layers,
  ShieldCheck,
  Printer,
} from 'lucide-react';

export default function AnalyticsView({
  subSection = 'investor_analytics',
  project,
  graph,
}) {
  const [activeTab, setActiveTab] = useState(subSection);

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
            onClick={() => setActiveTab('investor_analytics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'investor_analytics'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
            <span>Investor Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('officer_command_center')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'officer_command_center'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users2 className="w-3.5 h-3.5 text-slate-600" />
            <span>Officer Command Center</span>
          </button>

          <button
            onClick={() => setActiveTab('department_performance')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'department_performance'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-slate-600" />
            <span>Department Performance (SLA Benchmarks)</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'reports'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Statutory Reports &amp; Audit Dossier</span>
          </button>
        </div>

        <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">
          Metrics: Maharashtra RTS Act / BRAP 2025
        </span>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 overflow-y-auto">
        {/* TAB 1: INVESTOR ANALYTICS */}
        {activeTab === 'investor_analytics' && (
          <div className="p-8 max-w-6xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-600" />
                <span>Investor Velocity &amp; Regulatory Cycle Metrics</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Comparative time and financial metrics demonstrating PRAVAH orchestration vs traditional siloed departmental filings.
              </p>
            </div>

            {/* KPI Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-1">
                <span className="text-xs font-semibold text-slate-500">Days Saved via Parallel Processing</span>
                <div className="text-2xl font-bold text-emerald-600">45 Calendar Days</div>
                <p className="text-[11px] text-slate-500">MPCB CTE + Labour + Fire concurrent</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-1">
                <span className="text-xs font-semibold text-slate-500">Total Statutory Filing Fees</span>
                <div className="text-2xl font-bold text-slate-900">₹1,85,000</div>
                <p className="text-[11px] text-slate-500">Recalculated on ₹13.60 Cr capital outlay</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-1">
                <span className="text-xs font-semibold text-slate-500">SLA Adherence Ratio</span>
                <div className="text-2xl font-bold text-blue-700">100.0%</div>
                <p className="text-[11px] text-slate-500">0 statutory query lapses</p>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-1">
                <span className="text-xs font-semibold text-slate-500">Overall Compliance Index</span>
                <div className="text-2xl font-bold text-emerald-600">{project?.globalHealthScore || 92}%</div>
                <p className="text-[11px] text-slate-500">Regulatory twin fully verified</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: OFFICER COMMAND CENTER */}
        {activeTab === 'officer_command_center' && (
          <div className="p-8 max-w-6xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Users2 className="w-6 h-6 text-slate-700" />
                <span>Department Scrutiny Officer Command Center</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Statutory officers monitor regional pendency, pending query timers, and deemed approval risk triggers.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Regional Scrutiny Workload Summary
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-500">Applications Pending Scrutiny:</span>
                  <div className="text-xl font-bold text-slate-900">42 Files</div>
                  <div className="text-[11px] text-slate-500">Pune Sub-Region II</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-500">Average Turnaround:</span>
                  <div className="text-xl font-bold text-blue-700">14.8 Days</div>
                  <div className="text-[11px] text-slate-500">Statutory limit: 30 Days</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-500">Deemed Approvals Pending:</span>
                  <div className="text-xl font-bold text-emerald-600">0 Cases</div>
                  <div className="text-[11px] text-slate-500">Protected by SLA Guardian</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: DEPARTMENT PERFORMANCE */}
        {activeTab === 'department_performance' && (
          <div className="p-8 max-w-6xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Building className="w-6 h-6 text-slate-700" />
                <span>State &amp; District Department Performance Benchmarks</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Ease of Doing Business (EoDB) and BRAP compliance rankings across participating departments.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-5 py-3.5">Department</th>
                    <th className="px-5 py-3.5">Statutory Clearances</th>
                    <th className="px-5 py-3.5">Avg Scrutiny Turnaround</th>
                    <th className="px-5 py-3.5">On-Time SLA Rate</th>
                    <th className="px-5 py-3.5 text-right">Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-900">MIDC (Land &amp; Plot Allocation)</td>
                    <td className="px-5 py-4">Plot Allotment, Water Supply, Mortgage NOC</td>
                    <td className="px-5 py-4 font-semibold text-slate-800">12 Days</td>
                    <td className="px-5 py-4 font-bold text-emerald-600">96.8%</td>
                    <td className="px-5 py-4 text-right font-bold text-emerald-700">⭐⭐⭐⭐⭐</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-900">MPCB (Pollution Control Board)</td>
                    <td className="px-5 py-4">Consent to Establish (CTE), Consent to Operate (CTO)</td>
                    <td className="px-5 py-4 font-semibold text-slate-800">26 Days</td>
                    <td className="px-5 py-4 font-bold text-blue-700">91.2%</td>
                    <td className="px-5 py-4 text-right font-bold text-blue-700">⭐⭐⭐⭐</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-900">DISH (Industrial Safety &amp; Health)</td>
                    <td className="px-5 py-4">Factory Building Plan, Labour Safety Registration</td>
                    <td className="px-5 py-4 font-semibold text-slate-800">38 Days</td>
                    <td className="px-5 py-4 font-bold text-blue-700">92.4%</td>
                    <td className="px-5 py-4 text-right font-bold text-blue-700">⭐⭐⭐⭐</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: STATUTORY REPORTS */}
        {activeTab === 'reports' && (
          <div className="p-8 max-w-5xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-6 h-6 text-teal-600" />
                  <span>Statutory Compliance Certificate &amp; Audit Dossier</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Cryptographically sealed statutory compliance summary for lenders, investors, and statutory inspectors.
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Export Official Dossier (PDF)</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-2xs space-y-6">
              <div className="border-b border-slate-200 pb-5 text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Government of Maharashtra • Industrial Regulatory Orchestration Authority
                </span>
                <h3 className="text-lg font-bold text-slate-900">
                  STATUTORY COMPLIANCE &amp; PRE-ESTABLISHMENT CLEARANCE DOSSIER
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Enterprise Single Window Registration: MAHA-AGRO-2026-8812
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Project Legal Title</span>
                  <span className="font-bold text-slate-800">Sahyadri Agro Facility</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Industrial Zone</span>
                  <span className="font-bold text-slate-800">MIDC Chakan Phase II</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Capital Outlay (CA Verified)</span>
                  <span className="font-bold text-blue-700">₹13.60 Crores</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Cryptographic Seal</span>
                  <span className="font-bold text-emerald-700 font-mono">SHA256: 8fa7b2</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <span className="font-bold text-slate-800 block">Clearance Status Summary:</span>
                <div className="space-y-1 text-slate-600">
                  <div>• MIDC Land Allotment Order: <strong className="text-emerald-700">Issued &amp; Possession Granted</strong></div>
                  <div>• MPCB Consent to Establish (CTE): <strong className="text-blue-700">Under Scrutiny (Nominal SLA)</strong></div>
                  <div>• Labour Registration (CLRA): <strong className="text-blue-700">Under Scrutiny (Nominal SLA)</strong></div>
                  <div>• Provisional Fire Safety NOC: <strong className="text-blue-700">Under Scrutiny (Nominal SLA)</strong></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
