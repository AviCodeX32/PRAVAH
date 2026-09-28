import React from 'react';
import {
  Search,
  Building2,
  UserCheck,
  Bell,
  Play,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Clock,
  ChevronDown,
  Layers,
  Activity,
  FileCheck,
} from 'lucide-react';

export default function AppHeader({
  project,
  userRole,
  onSelectRole,
  onOpenTour,
  onUploadCaCert,
  onApproveMidc,
  onSimulateSla,
  onSimulatePolicy,
  onResetProject,
  activeDiscrepancy,
}) {
  return (
    <header className="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between z-10 shrink-0 select-none">
      {/* Left: Active Project & Quick Breadcrumb */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">
                {project?.projectName || 'Sahyadri Agro-Processing Facility'}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {project?.projectId || 'MAHA-AGRO-2026-8812'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500">
              Jurisdiction: <span className="font-medium text-slate-700">{project?.district || 'Pune'}, {project?.stateJurisdiction || 'MH'}</span> • Sector: {project?.industrySector || 'Food Processing'}
            </p>
          </div>
        </div>
      </div>

      {/* Center: Global Search & Demo Tour Button */}
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search approvals, circulars, documents..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
          />
        </div>

        {/* 18-Step Interactive Tour Trigger */}
        <button
          onClick={onOpenTour}
          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-700 to-teal-700 hover:from-blue-800 hover:to-teal-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-teal-200" />
          <span>18-Step Interactive Tour</span>
        </button>
      </div>

      {/* Right: Role Switcher & Golden Path Scenarios */}
      <div className="flex items-center gap-3">
        {/* User Role Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
          <span className="text-[10px] font-semibold text-slate-500 pl-1.5 uppercase tracking-wider">
            Role:
          </span>
          <select
            value={userRole}
            onChange={(e) => onSelectRole(e.target.value)}
            className="bg-white border border-slate-300 rounded px-2 py-0.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-600 cursor-pointer shadow-2xs"
          >
            <option value="investor">🏢 Investor / Business</option>
            <option value="officer">🏛️ Government Officer</option>
            <option value="admin">⚙️ Platform Admin</option>
          </select>
        </div>

        {/* Fast Demonstration Action Bar */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
          <button
            onClick={onUploadCaCert}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              activeDiscrepancy
                ? 'bg-amber-100 text-amber-900 border border-amber-300 font-semibold'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
            title="Ingest CA Cert & Detect ₹13.6 Cr vs ₹12.0 Cr Mismatch"
          >
            1. Ingest Doc
          </button>
          <button
            onClick={onApproveMidc}
            className="px-2 py-1 rounded text-[11px] font-medium text-slate-700 hover:bg-slate-200 transition-colors"
            title="Approve Land Grant to unblock MPCB CTE"
          >
            2. Approve Land
          </button>
          <button
            onClick={onSimulateSla}
            className="px-2 py-1 rounded text-[11px] font-medium text-slate-700 hover:bg-slate-200 transition-colors"
            title="Advance timeline +25d to trigger SLA Guardian"
          >
            3. SLA +25d
          </button>
          <button
            onClick={onSimulatePolicy}
            className="px-2 py-1 rounded text-[11px] font-medium text-teal-800 hover:bg-teal-50 transition-colors font-semibold"
            title="Promulgate Gazette Circular 2026/09 (Dynamic DAG Injection)"
          >
            4. Gazette 2026/09
          </button>
          <button
            onClick={onResetProject}
            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors ml-0.5"
            title="Reset platform state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
