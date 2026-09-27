import { RegulatoryGraph } from '../models/RegulatoryGraph.js';
import { AuditLedger } from '../models/AuditLedger.js';
import { ProjectTwin } from '../models/ProjectTwin.js';

/**
 * Sub-Agent 2: Dependency Graph & Topological Engine
 * Executes deterministic graph state transitions, identifies parallel execution tracks,
 * and recalculates the project's critical path using topological analysis.
 */
export class GraphEngine {
  /**
   * Evaluates and updates the state of all nodes in a project's regulatory graph.
   * Deterministic logic:
   * - A node is unblocked to 'READY_TO_APPLY' if all its prerequisite nodes are 'APPROVED'.
   * - If any prerequisite is not 'APPROVED', downstream nodes stay 'BLOCKED' (unless already submitted/approved).
   * - Independent nodes with zero prerequisites are marked 'READY_TO_APPLY' and flagged for parallel execution.
   */
  static async evaluateGraph(projectId, actorName = 'Graph Topological Solver') {
    const graph = await RegulatoryGraph.findOne({ projectId });
    if (!graph) throw new Error(`Regulatory graph for project ${projectId} not found.`);

    const nodeStatusMap = new Map();
    graph.nodes.forEach((n) => nodeStatusMap.set(n.approvalCode, n.status));

    const stateChanges = [];
    const updatedNodes = graph.nodes.map((node) => {
      const currentStatus = node.status;
      const prereqs = node.prerequisiteCodes || [];

      // Terminal or in-flight states are preserved unless explicitly modified
      if (['APPROVED', 'SUBMITTED', 'IN_INSPECTION', 'REJECTED'].includes(currentStatus)) {
        return node;
      }

      // Check if all prerequisites are APPROVED
      const allPrereqsApproved =
        prereqs.length === 0 ||
        prereqs.every((pCode) => nodeStatusMap.get(pCode) === 'APPROVED');

      let newStatus = currentStatus;
      if (allPrereqsApproved) {
        if (currentStatus === 'BLOCKED') {
          newStatus = 'READY_TO_APPLY';
          stateChanges.push({
            nodeCode: node.approvalCode,
            from: currentStatus,
            to: newStatus,
            reason:
              prereqs.length === 0
                ? 'Independent statutory track unblocked.'
                : `All prerequisites satisfied (${prereqs.join(', ')} APPROVED).`,
          });
        }
      } else {
        if (currentStatus === 'READY_TO_APPLY') {
          newStatus = 'BLOCKED';
          stateChanges.push({
            nodeCode: node.approvalCode,
            from: currentStatus,
            to: newStatus,
            reason: `Prerequisite dependency unmet (${prereqs.filter((p) => nodeStatusMap.get(p) !== 'APPROVED').join(', ')} not yet approved).`,
          });
        }
      }

      node.status = newStatus;
      return node;
    });

    graph.nodes = updatedNodes;

    // Recalculate Critical Path
    const { criticalPathDays, criticalPathNodes } = this.calculateCriticalPath(graph.nodes, graph.edges);
    graph.criticalPathDays = criticalPathDays;
    graph.criticalPathNodes = criticalPathNodes;

    await graph.save();

    // Log audit events for state changes
    for (const change of stateChanges) {
      await AuditLedger.create({
        projectId,
        actorType: 'AI_AGENT',
        actorName,
        eventType: 'NODE_UNBLOCKED',
        nodeCode: change.nodeCode,
        previousState: change.from,
        newState: change.to,
        justificationNote: `Topological engine unblocked node ${change.nodeCode}: ${change.reason}`,
      });
    }

    return {
      graph,
      stateChanges,
      criticalPathDays,
      criticalPathNodes,
    };
  }

  /**
   * Topological longest path (Critical Path) calculator
   */
  static calculateCriticalPath(nodes, edges) {
    const nodeMap = new Map();
    nodes.forEach((n) => nodeMap.set(n.approvalCode, n));

    const adj = new Map();
    const inDegree = new Map();

    nodes.forEach((n) => {
      adj.set(n.approvalCode, []);
      inDegree.set(n.approvalCode, 0);
    });

    edges.forEach((edge) => {
      if (adj.has(edge.source) && adj.has(edge.target)) {
        adj.get(edge.source).push(edge.target);
        inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
      }
    });

    // Kahn's algorithm for topological order
    const queue = [];
    inDegree.forEach((degree, code) => {
      if (degree === 0) queue.push(code);
    });

    const topoOrder = [];
    while (queue.length > 0) {
      const u = queue.shift();
      topoOrder.push(u);
      for (const v of adj.get(u) || []) {
        inDegree.set(v, inDegree.get(v) - 1);
        if (inDegree.get(v) === 0) {
          queue.push(v);
        }
      }
    }

    // Longest path in DAG
    const dist = new Map();
    const parent = new Map();
    nodes.forEach((n) => dist.set(n.approvalCode, n.statutorySlaDays || 0));

    for (const u of topoOrder) {
      const uDist = dist.get(u) || 0;
      for (const v of adj.get(u) || []) {
        const vNode = nodeMap.get(v);
        const vWeight = vNode ? vNode.statutorySlaDays || 0 : 0;
        if (uDist + vWeight > (dist.get(v) || 0)) {
          dist.set(v, uDist + vWeight);
          parent.set(v, u);
        }
      }
    }

    // Find end node with maximum distance
    let maxDist = 0;
    let maxEndNode = null;
    dist.forEach((d, code) => {
      if (d > maxDist) {
        maxDist = d;
        maxEndNode = code;
      }
    });

    // Reconstruct critical path
    const path = [];
    let curr = maxEndNode;
    while (curr) {
      path.unshift(curr);
      curr = parent.get(curr);
    }

    return {
      criticalPathDays: maxDist,
      criticalPathNodes: path,
    };
  }

  /**
   * Approves a specific node and propagates state forward
   */
  static async approveNode(projectId, approvalCode, actorName = 'Statutory Officer (MIDC/MPCB)') {
    const graph = await RegulatoryGraph.findOne({ projectId });
    if (!graph) throw new Error(`Project ${projectId} graph not found`);

    const targetNode = graph.nodes.find((n) => n.approvalCode === approvalCode);
    if (!targetNode) throw new Error(`Approval node ${approvalCode} not found in graph`);

    const previousStatus = targetNode.status;
    targetNode.status = 'APPROVED';
    targetNode.approvedDate = new Date();
    targetNode.slaRiskScore = 0.0;
    targetNode.slaRiskTier = 'NOMINAL';

    await graph.save();

    await AuditLedger.create({
      projectId,
      actorType: 'DEPARTMENT_OFFICER',
      actorName,
      eventType: 'APPROVAL_GRANTED',
      nodeCode: approvalCode,
      previousState: previousStatus,
      newState: 'APPROVED',
      justificationNote: `Statutory clearance granted for ${targetNode.approvalName} (${approvalCode}). Triggering downstream unblocking.`,
    });

    // Automatically re-evaluate graph topological states
    const evalResult = await this.evaluateGraph(projectId, 'Graph Topological Solver (Auto-Propagate)');
    return evalResult;
  }
}
