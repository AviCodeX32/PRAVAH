import { DbService } from '../services/dbService.js';

/**
 * Sub-Agent 4: SLA Guardian & Bottleneck Risk Model
 * Calculates linear SLA burn rates and applies multi-factor delay heuristics.
 * Synchronizes with Supabase PostgreSQL data layer.
 */
export class SlaGuardian {
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

    const burnRate = statutorySlaDays > 0 ? slaElapsedDays / statutorySlaDays : 0;
    let delayScore = burnRate * 0.6;
    const delayFactors = [];

    if (burnRate > 0.60 && (!inspectionStatus || inspectionStatus === 'NONE' || inspectionStatus === 'PENDING')) {
      delayScore += 0.20;
      delayFactors.push(`Burn rate ${(burnRate * 100).toFixed(0)}% exceeds 60% threshold without confirmed site inspection`);
    }

    if (queriesCount > 0) {
      const frictionPenalty = Math.min(0.20, queriesCount * 0.10);
      delayScore += frictionPenalty;
      delayFactors.push(`${queriesCount} departmental clarification query/queries raised by scrutiny officer`);
    }

    if (inspectionStatus === 'PENDING') {
      delayScore += 0.15;
      delayFactors.push('Regional inspection backlog: joint site visit pending scheduling');
    }

    const finalScore = Math.min(1.0, Math.max(0.0, Number(delayScore.toFixed(3))));

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

  static async evaluateProjectSla(projectId) {
    const graph = await DbService.getGraph(projectId);
    if (!graph) throw new Error(`Project ${projectId} graph not found`);

    const project = await DbService.getProject(projectId);
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

    await DbService.saveGraph(projectId, graph);

    project.aggregateSlaRisk = {
      score: maxRiskScore,
      tier: worstTier,
      delayFactors: allContributingFactors.slice(0, 3),
    };
    project.globalHealthScore = Math.max(30, Math.round(100 - maxRiskScore * 50));
    await DbService.updateProject(projectId, project);

    return {
      graph,
      project,
      aggregateRisk: project.aggregateSlaRisk,
    };
  }

  static async simulateTimeAdvance(projectId, nodeCode = null, daysDelta = 25) {
    const graph = await DbService.getGraph(projectId);
    if (!graph) throw new Error(`Project ${projectId} graph not found`);

    let affectedNode = null;

    if (nodeCode) {
      affectedNode = graph.nodes.find((n) => n.approvalCode === nodeCode);
      if (affectedNode) {
        affectedNode.slaElapsedDays = (affectedNode.slaElapsedDays || 0) + daysDelta;
      }
    } else {
      affectedNode = graph.nodes.find((n) => n.status === 'READY_TO_APPLY' || n.status === 'SUBMITTED');
      if (affectedNode) {
        affectedNode.slaElapsedDays = (affectedNode.slaElapsedDays || 0) + daysDelta;
      }
    }

    await DbService.saveGraph(projectId, graph);

    const evalResult = await this.evaluateProjectSla(projectId);

    if (affectedNode) {
      await DbService.addAuditLog({
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
