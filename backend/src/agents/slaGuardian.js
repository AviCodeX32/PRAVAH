import { RegulatoryGraph } from '../models/RegulatoryGraph.js';
import { ProjectTwin } from '../models/ProjectTwin.js';
import { AuditLedger } from '../models/AuditLedger.js';

/**
 * Sub-Agent 4: SLA Guardian & Bottleneck Risk Model
 * Calculates linear SLA burn rates and applies a multi-factor heuristic scoring matrix
 * to flag bottleneck risks and imminent SLA breaches before statutory periods lapse.
 */
export class SlaGuardian {
  /**
   * Evaluates SLA risk for an individual node
   */
  static evaluateNodeRisk(node) {
    const { statutorySlaDays, slaElapsedDays, inspectionStatus, queriesCount, status } = node;

    if (status === 'APPROVED') {
      return {
        burnRate: 0,
        riskScore: 0,
        riskTier: 'NOMINAL',
        delayFactors: [],
      };
    }

    if (status === 'BLOCKED') {
      return {
        burnRate: 0,
        riskScore: 0.1,
        riskTier: 'NOMINAL',
        delayFactors: ['Upstream prerequisites pending'],
      };
    }

    // Linear burn rate: Days Elapsed / Statutory SLA Limit
    const burnRate = statutorySlaDays > 0 ? slaElapsedDays / statutorySlaDays : 0;

    let delayScore = burnRate * 0.6; // 60% base weight from elapsed time
    const delayFactors = [];

    // Factor 1: High time consumption without inspection scheduled
    if (burnRate > 0.60 && (!inspectionStatus || inspectionStatus === 'NONE' || inspectionStatus === 'PENDING')) {
      delayScore += 0.20;
      delayFactors.push(`Burn rate ${(burnRate * 100).toFixed(0)}% exceeds 60% threshold without confirmed site inspection`);
    }

    // Factor 2: Departmental query friction
    if (queriesCount > 0) {
      const frictionPenalty = Math.min(0.20, queriesCount * 0.10);
      delayScore += frictionPenalty;
      delayFactors.push(`${queriesCount} departmental clarification query/queries raised by scrutiny officer`);
    }

    // Factor 3: Inspection pending penalty
    if (inspectionStatus === 'PENDING') {
      delayScore += 0.15;
      delayFactors.push('Regional inspection backlog: joint site visit pending scheduling');
    }

    // Cap score at 1.0
    const finalScore = Math.min(1.0, Math.max(0.0, Number(delayScore.toFixed(3))));

    // Categorize operational tier
    let riskTier = 'NOMINAL';
    if (finalScore > 0.70) {
      riskTier = 'BREACH_IMMINENT';
    } else if (finalScore > 0.40) {
      riskTier = 'MONITORED';
    }

    return {
      burnRate: Number(burnRate.toFixed(3)),
      riskScore: finalScore,
      riskTier,
      delayFactors,
    };
  }

  /**
   * Recalculates SLA risks across the entire project graph
   */
  static async evaluateProjectSla(projectId) {
    const graph = await RegulatoryGraph.findOne({ projectId });
    if (!graph) throw new Error(`Project ${projectId} graph not found`);

    const project = await ProjectTwin.findOne({ projectId });
    if (!project) throw new Error(`Project ${projectId} not found`);

    let maxRiskScore = 0;
    let worstTier = 'NOMINAL';
    const allContributingFactors = [];

    graph.nodes.forEach((node) => {
      const evaluation = this.evaluateNodeRisk(node);
      node.slaRiskScore = evaluation.riskScore;
      node.slaRiskTier = evaluation.riskTier;

      if (node.status !== 'APPROVED') {
        if (evaluation.riskScore > maxRiskScore) {
          maxRiskScore = evaluation.riskScore;
          worstTier = evaluation.riskTier;
        }
        if (evaluation.delayFactors.length > 0) {
          allContributingFactors.push(`${node.approvalCode}: ${evaluation.delayFactors.join('; ')}`);
        }
      }
    });

    await graph.save();

    // Update Project Twin aggregate SLA risk
    project.aggregateSlaRisk = {
      score: maxRiskScore,
      tier: worstTier,
      delayFactors: allContributingFactors.slice(0, 3),
    };

    // Health score inversely proportional to SLA risk
    project.globalHealthScore = Math.max(30, Math.round(100 - maxRiskScore * 50));
    await project.save();

    return {
      graph,
      project,
      aggregateRisk: project.aggregateSlaRisk,
    };
  }

  /**
   * Advances simulation timeline by N days on a specific node or active nodes
   * Used for Golden Path demonstration step: advance by 25 days on 30-day limit
   */
  static async simulateTimeAdvance(projectId, nodeCode = null, daysDelta = 25) {
    const graph = await RegulatoryGraph.findOne({ projectId });
    if (!graph) throw new Error(`Project ${projectId} graph not found`);

    let affectedNode = null;

    if (nodeCode) {
      affectedNode = graph.nodes.find((n) => n.approvalCode === nodeCode);
      if (affectedNode) {
        affectedNode.slaElapsedDays = (affectedNode.slaElapsedDays || 0) + daysDelta;
      }
    } else {
      // Find the first active node (READY_TO_APPLY or SUBMITTED)
      affectedNode = graph.nodes.find((n) => n.status === 'READY_TO_APPLY' || n.status === 'SUBMITTED');
      if (affectedNode) {
        affectedNode.slaElapsedDays = (affectedNode.slaElapsedDays || 0) + daysDelta;
      }
    }

    await graph.save();

    // Recalculate
    const evalResult = await this.evaluateProjectSla(projectId);

    // Audit event
    if (affectedNode) {
      await AuditLedger.create({
        projectId,
        actorType: 'SYSTEM_SCHEDULER',
        actorName: 'Sub-Agent 4: SLA Guardian',
        eventType: 'SLA_RISK_ESCALATED',
        nodeCode: affectedNode.approvalCode,
        previousState: { slaElapsedDays: affectedNode.slaElapsedDays - daysDelta },
        newState: {
          slaElapsedDays: affectedNode.slaElapsedDays,
          riskTier: affectedNode.slaRiskTier,
          riskScore: affectedNode.slaRiskScore,
        },
        justificationNote: `SLA timeline simulation: advanced elapsed time by +${daysDelta} days on ${affectedNode.approvalCode}. Statutory burn rate leaped to ${((affectedNode.slaElapsedDays / affectedNode.statutorySlaDays) * 100).toFixed(0)}% [${affectedNode.slaRiskTier}].`,
        slaTimeElapsedDelta: daysDelta,
      });
    }

    return evalResult;
  }
}
