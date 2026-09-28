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
          fill: '#334155',
          fontSize: '11px',
          fontWeight: 600,
        },
        labelBgStyle: {
          fill: '#FFFFFF',
          fillOpacity: 0.95,
          rx: 4,
          ry: 4,
          stroke: '#CBD5E1',
          strokeWidth: 1,
        },
        style: {
          stroke: isPolicyInjected
            ? '#0D9488'
            : isParallel
            ? '#4F46E5'
            : '#64748B',
          strokeWidth: isPolicyInjected ? 2.5 : 2,
          strokeDasharray: isParallel ? '6,6' : undefined,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isPolicyInjected ? '#0D9488' : isParallel ? '#4F46E5' : '#64748B',
          width: 16,
          height: 16,
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
    <div className="h-full w-full flex flex-col bg-slate-50 text-slate-900 relative">
      {/* Top Workflow Status & Explainer Banner */}
      <div className="px-6 py-3.5 border-b border-slate-200 bg-white flex items-center justify-between z-10 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Regulatory Dependency Graph (DAG Engine)
            </h2>
            <p className="text-xs text-slate-500">
              Live deterministic regulatory twin from land allotment to commercial operations. Steps unblock automatically when upstream statutory prerequisites are satisfied.
            </p>
          </div>
        </div>

        {/* Status Counters */}
        <div className="flex items-center gap-2.5 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{approvedCount} Completed</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-semibold">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>{readyCount} Actionable</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 font-medium">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>{blockedCount} Awaiting Upstream</span>
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 font-bold">
            <Layers className="w-3.5 h-3.5 text-teal-600" />
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
          <Background color="#CBD5E1" gap={24} size={1} />
          <Controls
            showInteractive={false}
            position="bottom-left"
            className="!bg-white !border-slate-200 !rounded-lg !overflow-hidden !shadow-sm"
          />
        </ReactFlow>

        {/* Node Detail Slide-Over Drawer */}
        {selectedNode && (
          <div className="absolute top-4 right-4 w-96 max-h-[calc(100%-2rem)] rounded-xl border border-slate-200 bg-white/95 backdrop-blur-md shadow-2xl p-5 z-20 overflow-y-auto space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {selectedNode.departmentName}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {selectedNode.approvalName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500">Current Status:</span>
                <span className="font-bold text-slate-900">
                  {selectedNode.status === 'APPROVED'
                    ? 'Statutory Approval Granted'
                    : selectedNode.status === 'READY_TO_APPLY'
                    ? 'Eligible / Ready to Apply'
                    : 'Prerequisites Pending'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500">Department Authority:</span>
                <span className="font-semibold text-slate-800 text-right">
                  {selectedNode.departmentName}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500">Statutory SLA Window:</span>
                <span className="font-bold text-blue-700">
                  {selectedNode.statutorySlaDays} Days (MTS / RTS Act)
                </span>
              </div>

              {selectedNode.injectedByPolicy && (
                <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 text-teal-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <ShieldCheck className="w-4 h-4 text-teal-700" />
                    <span>Injected via Gazette Circular 2026/09</span>
                  </div>
                  <p className="text-[11px] text-teal-800 leading-relaxed">
                    Mandatory for agro-processing units extracting ground water with capital outlay &gt; ₹10.0 Crores.
                  </p>
                </div>
              )}

              {/* Prerequisites list */}
              {selectedNode.prerequisites && selectedNode.prerequisites.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <span className="font-bold text-slate-700 block">
                    Statutory Prerequisites:
                  </span>
                  <div className="space-y-1">
                    {selectedNode.prerequisites.map((prereq) => (
                      <div
                        key={prereq}
                        className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-mono text-[11px] flex items-center justify-between"
                      >
                        <span>{prereq}</span>
                        <span className="text-[10px] text-emerald-700 font-sans font-semibold">
                          Satisfied
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action */}
              {selectedNode.status === 'READY_TO_APPLY' && (
                <button
                  onClick={() => {
                    onApproveNode(selectedNode.approvalCode);
                    setSelectedNode(null);
                  }}
                  className="w-full mt-4 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Grant Statutory Clearance</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
