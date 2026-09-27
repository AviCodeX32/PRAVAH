import React, { useState } from 'react';
import {
  Wallet,
  History,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Shield,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  Bot,
  User,
  Building,
} from 'lucide-react';

export default function EvidenceWalletAndAudit({
  evidence = [],
  auditLogs = [],
  onReconcileFact,
}) {
  const [expandedHashes, setExpandedHashes] = useState({});

  const toggleHash = (factKey) => {
    setExpandedHashes((prev) => ({
      ...prev,
      [factKey]: !prev[factKey],
    }));
  };

  return (
    <div className="h-full w-full max-w-7xl mx-auto p-8 overflow-y-auto space-y-8 bg-slate-950 text-slate-100">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Wallet className="w-6 h-6 text-indigo-400" />
          <span>Evidence Wallet & Activity History</span>
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Reusable, verified facts shared across departments, and an immutable statutory history of all transitions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ================= COLUMN 1: EVIDENCE WALLET ================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-sm font-semibold text-white">
              Verified Enterprise Facts ({evidence.length})
            </span>
            <span className="text-xs text-slate-400">
              Cross-Department Reuse Active
            </span>
          </div>

          <div className="space-y-3">
            {evidence.map((fact) => {
              const isFlagged = fact.validationState === 'DISCREPANCY_FLAGGED';
              const isVerified = fact.validationState === 'VERIFIED_MATCH';
              const isExpanded = expandedHashes[fact.factKey];
              const isCapital = fact.factKey === 'GROSS_PROJECT_INVESTMENT';

              return (
                <div
                  key={fact.factKey}
                  className={`p-4 rounded-xl border bg-slate-900/70 shadow-sm transition-all ${
                    isFlagged
                      ? 'border-amber-500/60 bg-amber-950/10'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs text-slate-400 font-medium">
                        {fact.factLabel}
                      </span>
                      <div className="text-lg font-bold text-white mt-0.5">
                        {isCapital
                          ? `₹${fact.declaredValue} Crores`
                          : fact.extractedValue || fact.declaredValue}
                        {fact.unit && !isCapital ? ` ${fact.unit}` : ''}
                      </div>
                    </div>

                    {isVerified && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    )}
                    {isFlagged && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950 text-amber-300 border border-amber-800 animate-pulse">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Action Needed
                      </span>
                    )}
                  </div>

                  {/* Provenance summary */}
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span>
                      Source: <strong className="text-slate-300">{fact.provenance?.sourceDocumentName}</strong>
                    </span>

                    <button
                      onClick={() => toggleHash(fact.factKey)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                    >
                      <span>{isExpanded ? 'Hide Technical Details' : 'View Provenance'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Expandable Technical Metadata (Abstracted by Default) */}
                  {isExpanded && (
                    <div className="mt-3 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1.5 font-mono text-slate-300">
                      <div>Page / Section: {fact.provenance?.paragraph || `Page ${fact.provenance?.pageNumber}`}</div>
                      <div className="text-[11px] truncate text-slate-400">
                        SHA-256: {fact.provenance?.documentHash}
                      </div>
                      <div className="text-xs italic text-slate-300 pt-1">
                        "{fact.provenance?.contextSnippet}"
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= COLUMN 2: RECENT ACTIVITY TIMELINE ================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-sm font-semibold text-white">
              Statutory Activity & Audit Trail
            </span>
            <span className="text-xs text-slate-400">
              Immutable Log ({auditLogs.length} events)
            </span>
          </div>

          <div className="space-y-3">
            {auditLogs.slice(0, 15).map((log, idx) => {
              const timeStr = new Date(log.timestamp).toLocaleTimeString();
              const isAgent = log.actorType === 'AI_AGENT';
              const isOfficer = log.actorType === 'DEPARTMENT_OFFICER';

              return (
                <div
                  key={log._id || idx}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3 hover:border-slate-700 transition-colors"
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                      isAgent
                        ? 'bg-purple-950 text-purple-400 border border-purple-800'
                        : isOfficer
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {isAgent ? <Bot className="w-4 h-4" /> : isOfficer ? <Building className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">
                        {log.actorName}
                      </span>
                      <span className="text-slate-500 font-mono text-[11px]">{timeStr}</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {log.justificationNote}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
