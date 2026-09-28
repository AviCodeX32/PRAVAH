import React from 'react';
import {
  FileText,
  CheckCircle,
  Clock,
  Sparkles,
  RotateCcw,
  Activity,
  Layers,
  ShieldCheck,
  Building2,
  Scale,
  Wallet,
  Play,
} from 'lucide-react';

export default function HeaderBar({
  project,
  graph,
  isConnected,
  onUploadCaCert,
  onApproveMidc,
  onSimulateSla,
  onSimulatePolicy,
  onResetProject,
  activeTab,
  onSelectTab,
  hasActionItem,
}) {
  const riskTier = project?.aggregateSlaRisk?.tier || 'NOMINAL';

  return (
    <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-30 select-none">
      {/* Top Identity & Executive Metrics Bar */}
      <div className="px-6 py-3 flex items-center justify-between border-b border-slate-800/80">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-950/50">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-white">
                  PRAVAH
                </h1>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Regulatory Digital Twin
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Industrial Compliance Orchestration Layer
              </p>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800" />

          {/* Active Project Identification */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Enterprise:</span>
            <span className="font-semibold text-slate-100 bg-slate-800/60 px-2.5 py-1 rounded-md border border-slate-700/60">
              {project?.projectName || 'Sahyadri Agro-Processing Facility'}
            </span>
            <span className="text-slate-400">({project?.district || 'Pune'}, MH)</span>
          </div>
        </div>

        {/* Executive KPI Chips */}
        <div className="flex items-center gap-3 text-xs">
          {/* Health Score */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Compliance Health:</span>
            <span className="font-bold text-emerald-400">
              {project?.globalHealthScore || 92}%
            </span>
          </div>

          {/* SLA Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400">SLA Status:</span>
            <span
              className={`font-semibold ${
                riskTier === 'BREACH_IMMINENT'
                  ? 'text-rose-400'
                  : riskTier === 'MONITORED'
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {riskTier === 'BREACH_IMMINENT'
                ? 'Breach Imminent'
                : riskTier === 'MONITORED'
                ? 'Monitored'
                : 'Nominal'}
            </span>
          </div>

          {/* Critical Path */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400">Critical Path:</span>
            <span className="font-bold text-white">
              {graph?.criticalPathDays || 120} Days
            </span>
          </div>

          {/* Supabase PostgreSQL Cloud Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-300 font-semibold text-[11px]">
              Supabase PostgreSQL
            </span>
          </div>

          <div className="h-5 w-px bg-slate-800" />

          {/* Reset Baseline */}
          <button
            onClick={onResetProject}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
            title="Reset platform back to initial Golden Path baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs & Interactive Scenario Simulator Strip */}
      <div className="px-6 py-2 flex items-center justify-between bg-slate-900/50">
        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1">
          <button
            onClick={() => onSelectTab('roadmap')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'roadmap'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Compliance Roadmap</span>
          </button>

          <button
            onClick={() => onSelectTab('document')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
              activeTab === 'document'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Document Intelligence</span>
            {hasActionItem && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping ml-1" />
            )}
          </button>

          <button
            onClick={() => onSelectTab('copilot')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'copilot'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>Statutory Copilot</span>
          </button>

          <button
            onClick={() => onSelectTab('evidence')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'evidence'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Evidence & History</span>
          </button>
        </nav>

        {/* Interactive Scenario Simulator Controller */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
            <Play className="w-3 h-3 text-cyan-400 fill-cyan-400" />
            Demo Steps:
          </span>

          <button
            onClick={onUploadCaCert}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 font-medium border border-amber-800/50 text-xs transition-colors flex items-center gap-1.5"
            title="Step 1: Upload CA Net Worth Cert to detect discrepancy"
          >
            <span>1. Ingest CA Cert</span>
          </button>

          <button
            onClick={onApproveMidc}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 font-medium border border-emerald-800/50 text-xs transition-colors flex items-center gap-1.5"
            title="Step 2: Approve MIDC Land Grant to unblock MPCB CTE"
          >
            <span>2. Approve Land Grant</span>
          </button>

          <button
            onClick={onSimulateSla}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 font-medium border border-rose-800/50 text-xs transition-colors flex items-center gap-1.5"
            title="Step 3: Advance timeline by 25 days to demonstrate SLA Guardian"
          >
            <span>3. Simulate SLA (+25d)</span>
          </button>

          <button
            onClick={onSimulatePolicy}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-medium border border-cyan-800/50 text-xs transition-colors flex items-center gap-1.5"
            title="Step 4: Promulgate Gazette Circular 2026/09 (Dynamic DAG Injection)"
          >
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>4. Gazette 2026/09 Shift</span>
          </button>
        </div>
      </div>
    </header>
  );
}
