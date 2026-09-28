import { DbService } from '../services/dbService.js';

/**
 * Sub-Agent 2: Dependency Graph & Topological Engine
 * Executes deterministic graph state transitions, identifies parallel execution tracks,
 * and recalculates the project's critical path using topological analysis.
 * Uses Supabase PostgreSQL persistence layer.
 */
export class GraphEngine {
  /**
   * Evaluates and updates the state of all nodes in a project's regulatory graph.
   */
  static async evaluateGraph(projectId, actorName = 'Graph Topological Solver') {
    const graph = await DbService.getGraph(projectId);
    if (!graph) throw new Error(`Regulatory graph for project ${projectId} not found.`);

    const nodeStatusMap = new Map();
    graph.nodes.forEach((n) => nodeStatusMap.set(n.approvalCode, n.status));

    const stateChanges = [];
    const updatedNodes = graph.nodes.map((node) => {
      const currentStatus = node.status;
      const prereqs = node.prerequisiteCodes || [];

      if (['APPROVED', 'SUBMITTED', 'IN_INSPECTION', 'REJECTED'].includes(currentStatus)) {
        return node;
      }

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

    const { criticalPathDays, criticalPathNodes } = this.calculateCriticalPath(graph.nodes, graph.edges);
    graph.criticalPathDays = criticalPathDays;
    graph.criticalPathNodes = criticalPathNodes;

    await DbService.saveGraph(projectId, graph);

    for (const change of stateChanges) {
      await DbService.addAuditLog({
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

    let maxDist = 0;
    let maxEndNode = null;
    dist.forEach((d, code) => {
      if (d > maxDist) {
        maxDist = d;
        maxEndNode = code;
      }
    });

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

  static async approveNode(projectId, approvalCode, actorName = 'Statutory Officer (MIDC/MPCB)') {
    const graph = await DbService.getGraph(projectId);
    if (!graph) throw new Error(`Project ${projectId} graph not found`);

    const targetNode = graph.nodes.find((n) => n.approvalCode === approvalCode);
    if (!targetNode) throw new Error(`Approval node ${approvalCode} not found in graph`);

    const previousStatus = targetNode.status;
    targetNode.status = 'APPROVED';
    targetNode.approvedDate = new Date();
    targetNode.slaRiskScore = 0.0;
    targetNode.slaRiskTier = 'NOMINAL';

    await DbService.saveGraph(projectId, graph);

    await DbService.addAuditLog({
      projectId,
      actorType: 'DEPARTMENT_OFFICER',
      actorName,
      eventType: 'APPROVAL_GRANTED',
      nodeCode: approvalCode,
      previousState: previousStatus,
      newState: 'APPROVED',
      justificationNote: `Statutory clearance granted for ${targetNode.approvalName} (${approvalCode}). Triggering downstream unblocking.`,
    });

    const evalResult = await this.evaluateGraph(projectId, 'Graph Topological Solver (Auto-Propagate)');
    return evalResult;
  }
}
