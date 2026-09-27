import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { CheckCircle2, Clock, Lock, Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';

export default function RegulatoryNodeComponent({ data }) {
  const {
    approvalCode,
    approvalName,
    departmentName,
    status,
    statutorySlaDays,
    slaElapsedDays = 0,
    slaRiskTier = 'NOMINAL',
    isParallel = false,
    injectedByPolicy = false,
    onApproveNode,
  } = data;

  const isApproved = status === 'APPROVED';
  const isReady = status === 'READY_TO_APPLY';
  const isBlocked = status === 'BLOCKED';

  const burnRate = statutorySlaDays > 0 ? Math.min(100, Math.round((slaElapsedDays / statutorySlaDays) * 100)) : 0;
  const daysRemaining = Math.max(0, statutorySlaDays - slaElapsedDays);

  return (
    <div
      className={`w-80 rounded-xl border bg-slate-900/95 backdrop-blur-sm shadow-xl transition-all duration-200 hover:shadow-2xl ${
        injectedByPolicy
          ? 'border-cyan-500/80 ring-2 ring-cyan-500/20 shadow-cyan-950/30'
          : isApproved
          ? 'border-emerald-500/40 bg-gradient-to-b from-slate-900 to-emerald-950/20'
          : isReady
          ? 'border-indigo-500/60 ring-2 ring-indigo-500/20 shadow-indigo-950/30'
          : 'border-slate-800 opacity-80 hover:opacity-100'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-slate-500 !border-slate-700 !w-3 !h-3 !-top-1.5"
      />

      {/* Card Header */}
      <div className="px-4 py-2.5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider">
            {departmentName.split(' ')[0]}
          </span>
          {injectedByPolicy && (
            <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-cyan-950 text-cyan-300 border border-cyan-800 rounded-full">
              <Sparkles className="w-2.5 h-2.5" />
              New Policy
            </span>
          )}
          {isParallel && !injectedByPolicy && (
            <span className="px-2 py-0.5 text-[10px] font-medium bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-full">
              Parallel Track
            </span>
          )}
        </div>

        {/* Status Badge */}
        {isApproved && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-950/90 text-emerald-400 border border-emerald-700/60">
            <CheckCircle2 className="w-3 h-3" />
            Approved
          </span>
        )}
        {isReady && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-950/90 text-indigo-300 border border-indigo-700/60 animate-pulse">
            <Clock className="w-3 h-3" />
            Ready to Apply
          </span>
        )}
        {isBlocked && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
            <Lock className="w-3 h-3" />
            Prerequisites Pending
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3">
        <div>
          <h4 className="text-sm font-semibold text-white leading-snug line-clamp-2">
            {approvalName}
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            Department: <span className="text-slate-300">{departmentName}</span>
          </p>
        </div>

        {/* SLA Progress Bar */}
        <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Statutory SLA: <span className="text-slate-200 font-medium">{statutorySlaDays} Days</span>
            </span>
            <span
              className={
                slaRiskTier === 'BREACH_IMMINENT'
                  ? 'text-rose-400 font-semibold'
                  : isApproved
                  ? 'text-emerald-400'
                  : 'text-slate-300'
              }
            >
              {isApproved ? 'Completed' : `${daysRemaining}d remaining`}
            </span>
          </div>

          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isApproved
                  ? 'bg-emerald-500'
                  : slaRiskTier === 'BREACH_IMMINENT'
                  ? 'bg-rose-500'
                  : 'bg-indigo-500'
              }`}
              style={{ width: isApproved ? '100%' : `${burnRate}%` }}
            />
          </div>
        </div>

        {/* Quick Action Button */}
        {isReady && onApproveNode && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onApproveNode(approvalCode);
            }}
            className="w-full mt-2 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/40 transition-all"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark Approved (Unblock Downstream)</span>
          </button>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-slate-500 !border-slate-700 !w-3 !h-3 !-bottom-1.5"
      />
    </div>
  );
}
