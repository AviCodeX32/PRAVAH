import React, { useMemo, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react';
import RegulatoryNodeComponent from './RegulatoryNodeComponent.jsx';
import {
  Network,
  CheckCircle2,
  Clock,
  Lock,
  Layers,
  Info,
  X,
  ExternalLink,
  ShieldCheck,
  Check,
} from 'lucide-react';

const nodeTypes = {
  regulatoryNode: RegulatoryNodeComponent,
};

export default function RegulatoryDagView({ graph, onApproveNode }) {
  const [selectedNode, setSelectedNode] = useState(null);

  const rawNodes = graph?.nodes || [];
  const rawEdges = graph?.edges || [];

  // Organized, spacious multi-tiered coordinates for clean readability
  const flowNodes = useMemo(() => {
    const hasGroundwater = rawNodes.some((n) => n.approvalCode === 'GROUNDWATER_NOC');

    return rawNodes.map((node) => {
      let x = 100;
      let y = 50;

      switch (node.approvalCode) {
        // Tier 1: Land Foundation
        case 'MIDC_LAND_ALLOCATION':
          x = 420;
          y = 40;
          break;

        // Tier 2: Environmental, Labour & Fire
        case 'MPCB_CTE':
          x = 120;
          y = 280;
          break;
        case 'DISHER_LABOUR_REG':
          x = 480;
          y = 280;
          break;
        case 'FIRE_NOC':
          x = 840;
          y = 280;
          break;

        // Tier 3: Injected / Utilities
        case 'GROUNDWATER_NOC':
          x = 120;
          y = 520;
          break;
        case 'MSEDCL_POWER_SANCTION':
          x = 840;
          y = 520;
          break;

        // Tier 4: Factory Building Plan (Final Gate)
        case 'DISHER_FACTORY_PLAN':
          x = 480;
          y = hasGroundwater ? 740 : 520;
          break;

        default:
          x = 400;
          y = 100;
      }

      return {
        id: node.approvalCode,
        type: 'regulatoryNode',
        position: { x, y },
        data: {
          ...node,
          onApproveNode: (code) => {
            onApproveNode(code);
            setSelectedNode(null);
          },
        },
      };
    });
  }, [rawNodes, onApproveNode]);

  const flowEdges = useMemo(() => {
    return rawEdges.map((edge) => {
      const isParallel = edge.edgeType === 'PARALLEL_PERMISSIBLE';
      const isPolicyInjected = edge.id.includes('groundwater');

      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        animated: isPolicyInjected || edge.source === 'MIDC_LAND_ALLOCATION',
        label: edge.label,
        labelStyle: {
          fill: '#94A3B8',
          fontSize: '11px',
          fontWeight: 500,
        },
        labelBgStyle: {
          fill: '#0F172A',
          fillOpacity: 0.9,
          rx: 4,
          ry: 4,
        },
        style: {
          stroke: isPolicyInjected
            ? '#06B6D4'
            : isParallel
            ? '#818CF8'
            : '#475569',
          strokeWidth: isPolicyInjected ? 2.5 : 2,
          strokeDasharray: isParallel ? '6,6' : undefined,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isPolicyInjected ? '#06B6D4' : isParallel ? '#818CF8' : '#475569',
          width: 18,
          height: 18,
        },
      };
    });
  }, [rawEdges]);

  const [nodes, setNodes, onNodesChange] = useNodesState(flowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowEdges);

  React.useEffect(() => {
    setNodes(flowNodes);
    setEdges(flowEdges);
  }, [flowNodes, flowEdges, setNodes, setEdges]);

  const approvedCount = rawNodes.filter((n) => n.status === 'APPROVED').length;
  const readyCount = rawNodes.filter((n) => n.status === 'READY_TO_APPLY').length;
  const blockedCount = rawNodes.filter((n) => n.status === 'BLOCKED').length;

  const handleNodeClick = (event, node) => {
    const originalNode = rawNodes.find((n) => n.approvalCode === node.id);
    if (originalNode) {
      setSelectedNode(originalNode);
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-slate-950 text-slate-100 relative">
      {/* Top Workflow Status & Explainer Banner */}
      <div className="px-6 py-3.5 border-b border-slate-800 bg-slate-900/60 backdrop-blur-sm flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-950/60 border border-indigo-800/40 text-indigo-400">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">
              Industrial Compliance Journey & Dependency Graph
            </h2>
            <p className="text-xs text-slate-400">
              Deterministic regulatory map from land allotment to commercial operations. Steps unblock automatically when prerequisites are completed.
            </p>
          </div>
        </div>

        {/* Status Counters */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{approvedCount} Completed</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 font-medium">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{readyCount} Actionable</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 text-slate-400 border border-slate-700 font-medium">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>{blockedCount} Awaiting Upstream</span>
          </div>

          <div className="h-4 w-px bg-slate-700 mx-1" />

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-medium">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Critical Path: {graph?.criticalPathDays || 120} Days</span>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.12 }}
          minZoom={0.3}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#1E293B" gap={20} size={1} />
          <Controls
            showInteractive={false}
            position="bottom-left"
            className="!bg-slate-900 !border-slate-800 !rounded-lg !overflow-hidden"
          />
        </ReactFlow>

        {/* Node Detail Slide-Over Drawer */}
        {selectedNode && (
          <div className="absolute top-4 right-4 w-96 max-h-[calc(100%-2rem)] rounded-xl border border-slate-700 bg-slate-900/95 backdrop-blur-md shadow-2xl p-5 z-20 overflow-y-auto space-y-4">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {selectedNode.departmentName}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {selectedNode.approvalName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-400">Current Status:</span>
                <span className="font-semibold text-white">
                  {selectedNode.status === 'APPROVED'
                    ? '✓ Approved'
                    : selectedNode.status === 'READY_TO_APPLY'
                    ? '⏱ Ready to Apply'
                    : '🔒 Blocked (Prerequisites Pending)'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-400">Statutory SLA:</span>
                <span className="font-semibold text-slate-200">
                  {selectedNode.statutorySlaDays} Calendar Days
                </span>
              </div>

              {selectedNode.prerequisiteCodes?.length > 0 && (
                <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-700/60 space-y-1.5">
                  <span className="text-slate-400 font-medium">Upstream Prerequisites:</span>
                  <div className="space-y-1">
                    {selectedNode.prerequisiteCodes.map((code) => {
                      const pNode = rawNodes.find((n) => n.approvalCode === code);
                      const isDone = pNode?.status === 'APPROVED';
                      return (
                        <div
                          key={code}
                          className="flex items-center justify-between text-[11px]"
                        >
                          <span className="text-slate-300">
                            {pNode?.approvalName || code}
                          </span>
                          <span
                            className={
                              isDone ? 'text-emerald-400 font-medium' : 'text-slate-500'
                            }
                          >
                            {isDone ? '✓ Completed' : 'Pending'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {selectedNode.injectedByPolicy && (
                <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/60 text-cyan-200">
                  <span className="font-semibold">Statutory Gazette Injection:</span>
                  <p className="mt-1 text-[11px] text-cyan-300/90">
                    {selectedNode.injectedPolicyReference ||
                      'Dynamically added per Government Gazette Circular 2026/09.'}
                  </p>
                </div>
              )}

              {selectedNode.status === 'READY_TO_APPLY' && (
                <button
                  onClick={() => {
                    onApproveNode(selectedNode.approvalCode);
                    setSelectedNode(null);
                  }}
                  className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Grant Statutory Approval</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
