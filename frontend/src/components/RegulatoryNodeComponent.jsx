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
      className={`w-80 rounded-xl border bg-white shadow-sm transition-all duration-200 hover:shadow-md ${
        injectedByPolicy
          ? 'border-teal-400 ring-2 ring-teal-500/30 shadow-teal-100'
          : isApproved
          ? 'border-emerald-300 bg-emerald-50/20'
          : isReady
          ? 'border-blue-400 ring-2 ring-blue-500/20 shadow-blue-50'
          : 'border-slate-200 bg-slate-50/60 opacity-90 hover:opacity-100'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-slate-400 !border-white !w-3 !h-3 !-top-1.5 shadow-xs"
      />

      {/* Card Header */}
      <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60 rounded-t-xl">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            {departmentName?.split(' ')[0] || 'DEPT'}
          </span>
          {injectedByPolicy && (
            <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-300 rounded-full">
              <Sparkles className="w-2.5 h-2.5" />
              New Policy
            </span>
          )}
          {isParallel && !injectedByPolicy && (
            <span className="px-2 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-800 border border-blue-200 rounded-full">
              Parallel Track
            </span>
          )}
        </div>

        {/* Status Badge */}
        {isApproved && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Approved
          </span>
        )}
        {isReady && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <Clock className="w-3 h-3 text-blue-600 animate-pulse" />
            Ready to Apply
          </span>
        )}
        {isBlocked && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
            <Lock className="w-3 h-3 text-slate-400" />
            Prerequisites Pending
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
            {approvalName}
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Department: <span className="text-slate-700 font-medium">{departmentName}</span>
          </p>
        </div>

        {/* SLA Progress Bar */}
        <div className="space-y-1.5 pt-1 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Statutory SLA: <span className="text-slate-800 font-semibold">{statutorySlaDays} Days</span>
            </span>
            <span
              className={
                slaRiskTier === 'BREACH_IMMINENT'
                  ? 'text-rose-600 font-bold'
                  : isApproved
                  ? 'text-emerald-700 font-medium'
                  : 'text-slate-600'
              }
            >
              {isApproved ? 'Completed' : `${daysRemaining}d remaining`}
            </span>
          </div>

          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                isApproved
                  ? 'bg-emerald-500'
                  : slaRiskTier === 'BREACH_IMMINENT'
                  ? 'bg-rose-500'
                  : 'bg-blue-600'
              }`}
              style={{ width: isApproved ? '100%' : `${burnRate}%` }}
            />
          </div>
        </div>

        {/* Quick Action Button for Ready Nodes */}
        {isReady && onApproveNode && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onApproveNode(approvalCode);
            }}
            className="w-full mt-2 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Mark Approved (Unblock Downstream)</span>
          </button>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-slate-400 !border-white !w-3 !h-3 !-bottom-1.5 shadow-xs"
      />
    </div>
  );
}
