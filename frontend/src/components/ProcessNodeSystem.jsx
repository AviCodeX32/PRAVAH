import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Lock,
  ArrowRight,
  ShieldCheck,
  Building2,
  Layers,
  Sparkles,
  Check,
  FileText,
  AlertTriangle,
  Play,
  Zap,
} from 'lucide-react';

export default function ProcessNodeSystem({
  graph,
  onApproveNode,
  onSimulatePolicy,
  onSimulateSla,
}) {
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'COMPLETED'
  const rawNodes = graph?.nodes || [];

  const getNode = (code) => rawNodes.find((n) => n.approvalCode === code);

  const midcNode = getNode('MIDC_LAND_ALLOCATION');
  const mpcbNode = getNode('MPCB_CTE');
  const labourNode = getNode('DISHER_LABOUR_REG');
  const fireNode = getNode('FIRE_NOC');
  const powerNode = getNode('MSEDCL_POWER_SANCTION');
  const groundwaterNode = getNode('GROUNDWATER_NOC');
  const factoryPlanNode = getNode('DISHER_FACTORY_PLAN');

  const completedCount = rawNodes.filter((n) => n.status === 'APPROVED').length;
  const readyCount = rawNodes.filter((n) => n.status === 'READY_TO_APPLY').length;
  const blockedCount = rawNodes.filter((n) => n.status === 'BLOCKED').length;

  const phases = [
    {
      phaseNumber: 1,
      phaseTitle: 'Phase 1: Industrial Land Allotment & Possession',
      authority: 'MIDC Land Scrutiny Wing',
      description: 'Acquire unencumbered industrial plot with registered lease deed to establish legal site jurisdiction.',
      nodes: [
        {
          code: 'MIDC_LAND_ALLOCATION',
          title: 'MIDC Industrial Plot Possession Order & Allotment Deed',
          department: 'Maharashtra Industrial Development Corporation (MIDC)',
          slaDays: 30,
          elapsedDays: midcNode?.slaElapsedDays || 30,
          status: midcNode?.status || 'APPROVED',
          isPrereqForNext: true,
          docs: ['Detailed Project Report (DPR)', 'Udyam Registration', 'Plot 7/12 Extract'],
        },
      ],
    },
    {
      phaseNumber: 2,
      phaseTitle: 'Phase 2: Pre-Establishment Clearances (Concurrent Parallel Track)',
      authority: 'MPCB, Labour & Fire Directorates',
      description: 'Parallel statutory scrutiny permissible under Business Reforms Action Plan (BRAP) without waiting sequentially.',
      isParallel: true,
      nodes: [
        {
          code: 'MPCB_CTE',
          title: 'Consent to Establish (CTE) - Orange Category',
          department: 'Maharashtra Pollution Control Board (MPCB)',
          slaDays: 45,
          elapsedDays: mpcbNode?.slaElapsedDays || 0,
          riskTier: mpcbNode?.slaRiskTier || 'NOMINAL',
          status: mpcbNode?.status || 'READY_TO_APPLY',
          docs: ['ETP Process Flowchart', 'CA Certified Capital Outlay', 'Water Balance Chart'],
        },
        {
          code: 'DISHER_LABOUR_REG',
          title: 'Contract Labour Registration (CLRA Form 1)',
          department: 'Directorate of Industrial Safety & Health (DISH)',
          slaDays: 15,
          elapsedDays: labourNode?.slaElapsedDays || 0,
          status: labourNode?.status || 'READY_TO_APPLY',
          docs: ['Principal Employer Form I', 'Contractor List', 'EPFO Registration'],
        },
        {
          code: 'FIRE_NOC',
          title: 'Provisional Fire Safety & Evacuation NOC',
          department: 'Maharashtra Fire & Emergency Services',
          slaDays: 30,
          elapsedDays: fireNode?.slaElapsedDays || 0,
          status: fireNode?.status || 'READY_TO_APPLY',
          docs: ['Architectural Fire Blueprint', '6m Access Road Layout', 'Hydrant Tank Proof'],
        },
      ],
    },
    {
      phaseNumber: 3,
      phaseTitle: 'Phase 3: Utility Connections & Environmental Extraction',
      authority: 'MSEDCL & Central Ground Water Authority',
      description: 'Power grid connection and specialized groundwater abstraction permits prior to civil works.',
      nodes: [
        {
          code: 'MSEDCL_POWER_SANCTION',
          title: 'HT Industrial Power Sanction (450 kVA Load Feasibility)',
          department: 'Maharashtra State Electricity Distribution Co. (MSEDCL)',
          slaDays: 20,
          elapsedDays: powerNode?.slaElapsedDays || 0,
          status: powerNode?.status || 'READY_TO_APPLY',
          docs: ['Single Line Diagram (SLD)', 'Connected Machinery Load Estimate'],
        },
        ...(groundwaterNode
          ? [
              {
                code: 'GROUNDWATER_NOC',
                title: 'Central Ground Water Authority Extraction NOC',
                department: 'Central Ground Water Authority (CGWA)',
                slaDays: 45,
                elapsedDays: groundwaterNode?.slaElapsedDays || 0,
                status: groundwaterNode?.status || 'BLOCKED',
                injectedByPolicy: true,
                docs: ['Hydrogeology Impact Report', 'Rainwater Recharge Design', 'Telemetry Piezometer Blueprint'],
              },
            ]
          : []),
      ],
    },
    {
      phaseNumber: 4,
      phaseTitle: 'Phase 4: Factory Civil Plan Approval & Safety Gate',
      authority: 'Chief Inspector of Factories (DISH)',
      description: 'Final statutory scrutiny gate before initiating full-scale factory structural construction.',
      nodes: [
        {
          code: 'DISHER_FACTORY_PLAN',
          title: 'Factory Building Plan Approval (Form 1 Approval)',
          department: 'Directorate of Industrial Safety & Health (DISH)',
          slaDays: 60,
          elapsedDays: factoryPlanNode?.slaElapsedDays || 0,
          status: factoryPlanNode?.status || 'BLOCKED',
          docs: ['Sectional Civil Drawings', 'Machine Placement Plan', 'MPCB CTE & Fire NOC Copies'],
        },
      ],
    },
  ];

  return (
    <div className="h-full w-full flex flex-col bg-slate-50 select-none overflow-y-auto">
      {/* Top Header Summary Strip */}
      <div className="px-8 py-5 bg-white border-b border-slate-200 shrink-0">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
                Process Pipeline
              </span>
              <span className="text-xs text-slate-500">• Single Window Phased Journey</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Industrial Clearance Process Node Pipeline
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Clear, step-by-step statutory progress. As upstream clearance requirements are fulfilled, downstream process nodes unlock automatically.
            </p>
          </div>

          {/* Status Metrics */}
          <div className="flex items-center gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-lg font-bold text-emerald-700">{completedCount}</div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase">Completed</div>
            </div>

            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-center">
              <div className="text-lg font-bold text-blue-700">{readyCount}</div>
              <div className="text-[10px] text-blue-800 font-semibold uppercase">Actionable</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-lg font-bold text-slate-400">{blockedCount}</div>
              <div className="text-[10px] text-slate-500 font-semibold uppercase">Queued</div>
            </div>

            <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-center">
              <div className="text-lg font-bold text-teal-800">{graph?.criticalPathDays || 120}d</div>
              <div className="text-[10px] text-teal-800 font-semibold uppercase">Critical Path</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Process Nodes Stream */}
      <div className="p-8 max-w-6xl mx-auto w-full space-y-8">
        {phases.map((phase) => (
          <div key={phase.phaseNumber} className="space-y-4">
            {/* Phase Header */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                  {phase.phaseNumber}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{phase.phaseTitle}</h3>
                  <p className="text-xs text-slate-500">{phase.description}</p>
                </div>
              </div>

              {phase.isParallel && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  Concurrent Parallel Processing Active
                </span>
              )}
            </div>

            {/* Phase Process Nodes Cards */}
            <div className={`grid gap-4 ${phase.nodes.length > 1 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {phase.nodes.map((node) => {
                const isApproved = node.status === 'APPROVED';
                const isReady = node.status === 'READY_TO_APPLY';
                const isBlocked = node.status === 'BLOCKED';
                const isBreach = node.riskTier === 'BREACH_IMMINENT';

                return (
                  <div
                    key={node.code}
                    className={`rounded-2xl border bg-white p-5 shadow-2xs transition-all duration-200 hover:shadow-md flex flex-col justify-between space-y-4 ${
                      node.injectedByPolicy
                        ? 'border-teal-300 ring-2 ring-teal-500/20 shadow-teal-50'
                        : isApproved
                        ? 'border-emerald-200 bg-emerald-50/20'
                        : isReady
                        ? 'border-blue-300 ring-2 ring-blue-500/10'
                        : 'border-slate-200 opacity-80'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          {node.department.split(' ')[0]}
                        </span>

                        {isApproved && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Approved
                          </span>
                        )}

                        {isReady && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200 animate-pulse">
                            <Clock className="w-3.5 h-3.5 text-blue-600" />
                            Ready to Apply
                          </span>
                        )}

                        {isBlocked && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
                            <Lock className="w-3.5 h-3.5 text-slate-400" />
                            Awaiting Upstream
                          </span>
                        )}
                      </div>

                      {/* Title & Department */}
                      <div>
                        {node.injectedByPolicy && (
                          <span className="inline-flex items-center gap-1 mb-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
                            <Zap className="w-3 h-3 text-teal-700" />
                            Injected via Gazette 2026/09
                          </span>
                        )}
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">{node.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-1">{node.department}</p>
                      </div>

                      {/* SLA Progress Bar */}
                      <div className="space-y-1 pt-2 border-t border-slate-100 text-xs">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">Statutory SLA Window:</span>
                          <span className={isBreach ? 'font-bold text-rose-600' : 'font-semibold text-slate-800'}>
                            {isApproved ? 'Completed' : `${node.slaDays} Days (RTS Act)`}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isApproved
                                ? 'bg-emerald-500'
                                : isBreach
                                ? 'bg-rose-500'
                                : 'bg-blue-600'
                            }`}
                            style={{
                              width: isApproved
                                ? '100%'
                                : `${Math.min(100, Math.round((node.elapsedDays / node.slaDays) * 100))}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Required Documents Preview */}
                      <div className="space-y-1 text-[11px]">
                        <span className="text-slate-400 font-semibold">Key Mandatory Filings:</span>
                        <ul className="text-slate-600 space-y-0.5 list-disc pl-4">
                          {node.docs.map((doc, i) => (
                            <li key={i} className="line-clamp-1">{doc}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-2">
                      {isReady && onApproveNode && (
                        <button
                          onClick={() => onApproveNode(node.code)}
                          className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve Clearance (Unblock Next)</span>
                        </button>
                      )}

                      {isApproved && (
                        <div className="w-full py-2 px-3 rounded-xl bg-slate-50 border border-slate-200 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Statutory Order Issued</span>
                        </div>
                      )}

                      {isBlocked && (
                        <div className="w-full py-2 px-3 rounded-xl bg-slate-100 text-slate-400 font-medium text-xs flex items-center justify-center gap-1.5">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Prerequisites Pending</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
