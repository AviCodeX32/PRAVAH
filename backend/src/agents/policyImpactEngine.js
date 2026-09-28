import { DbService } from '../services/dbService.js';
import { GraphEngine } from './graphEngine.js';

/**
 * Sub-Agent 5: Policy Change Impact Engine (The Core USP)
 * Detects new or amended statutory gazette policies mid-stream, identifies the blast radius,
 * dynamically injects new prerequisite nodes into live DAGs in Supabase, and recalculates critical paths.
 */
export class PolicyImpactEngine {
  static async simulatePolicyAmendment({
    circularReference = 'Government Gazette Circular 2026/09',
    amendmentTitle = 'Groundwater Extraction NOC Mandate for High-Capital Agro Units',
    targetSectors = ['Food Processing', 'Agro-processing'],
    minCapitalThresholdCrores = 10.0,
    injectedApprovalCode = 'GROUNDWATER_NOC',
    injectedApprovalName = 'Central Ground Water Authority (CGWA) Extraction NOC',
    departmentName = 'Central Ground Water Authority',
    statutorySlaDays = 45,
    insertAfterApprovalCode = 'MPCB_CTE',
    insertBeforeApprovalCode = 'DISHER_FACTORY_PLAN',
    projectId = 'MAHA-AGRO-2026-8812',
  }) {
    const project = await DbService.getProject(projectId);
    if (!project) return { blastRadiusCount: 0, affectedProjects: [] };

    const matchesSector = targetSectors.includes(project.industrySector);
    const matchesCapital = project.capitalInvestmentCrores >= minCapitalThresholdCrores;

    if (!matchesSector || !matchesCapital) {
      return { blastRadiusCount: 0, affectedProjects: [] };
    }

    const graph = await DbService.getGraph(projectId);
    if (!graph) return { blastRadiusCount: 0, affectedProjects: [] };

    const existingNode = graph.nodes.find((n) => n.approvalCode === injectedApprovalCode);
    if (existingNode) {
      return {
        circularReference,
        amendmentTitle,
        blastRadiusCount: 1,
        affectedProjects: [{
          projectId: project.projectId,
          projectName: project.projectName,
          alreadyInjected: true,
          status: 'PREVIOUSLY_INJECTED',
        }],
      };
    }

    const parentNode = graph.nodes.find((n) => n.approvalCode === insertAfterApprovalCode);
    const isParentApproved = parentNode ? parentNode.status === 'APPROVED' : false;

    const newNode = {
      approvalCode: injectedApprovalCode,
      approvalName: injectedApprovalName,
      departmentName,
      prerequisiteCodes: [insertAfterApprovalCode],
      statutorySlaDays,
      status: isParentApproved ? 'READY_TO_APPLY' : 'BLOCKED',
      isParallel: false,
      slaElapsedDays: 0,
      slaRiskScore: 0.15,
      slaRiskTier: 'NOMINAL',
      inspectionStatus: 'NONE',
      queriesCount: 0,
      injectedByPolicy: true,
      injectedPolicyReference: `${circularReference}: ${amendmentTitle}`,
      position: { x: 500, y: 140 },
    };

    graph.nodes.push(newNode);

    const newParentEdge = {
      id: `e_${insertAfterApprovalCode.toLowerCase()}_${injectedApprovalCode.toLowerCase()}`,
      source: insertAfterApprovalCode,
      target: injectedApprovalCode,
      edgeType: 'MANDATORY_PREREQUISITE',
      label: 'Gazette 2026/09 Mandate',
    };
    graph.edges.push(newParentEdge);

    const downstreamNode = graph.nodes.find((n) => n.approvalCode === insertBeforeApprovalCode);
    if (downstreamNode) {
      if (!downstreamNode.prerequisiteCodes.includes(injectedApprovalCode)) {
        downstreamNode.prerequisiteCodes.push(injectedApprovalCode);
      }

      const newDownstreamEdge = {
        id: `e_${injectedApprovalCode.toLowerCase()}_${insertBeforeApprovalCode.toLowerCase()}`,
        source: injectedApprovalCode,
        target: insertBeforeApprovalCode,
        edgeType: 'MANDATORY_PREREQUISITE',
        label: 'Statutory Injection Dependency',
      };
      graph.edges.push(newDownstreamEdge);
    }

    const { criticalPathDays, criticalPathNodes } = GraphEngine.calculateCriticalPath(
      graph.nodes,
      graph.edges
    );
    graph.criticalPathDays = criticalPathDays;
    graph.criticalPathNodes = criticalPathNodes;

    await DbService.saveGraph(projectId, graph);

    await DbService.addAuditLog({
      projectId: project.projectId,
      actorType: 'AI_AGENT',
      actorName: 'Sub-Agent 5: Policy Change Impact Engine',
      eventType: 'POLICY_AMENDMENT_INJECTED',
      nodeCode: injectedApprovalCode,
      previousState: { criticalPathDays: graph.criticalPathDays - statutorySlaDays },
      newState: {
        injectedNode: injectedApprovalCode,
        newCriticalPathDays: criticalPathDays,
        circularReference,
      },
      justificationNote: `MID-STREAM POLICY SHIFT DETECTED: Promulgation of ${circularReference}. Injected mandatory node ${injectedApprovalCode} (${statutorySlaDays}d SLA). Critical path recalculated to ${criticalPathDays} days.`,
    });

    const blastRadiusResults = [{
      projectId: project.projectId,
      projectName: project.projectName,
      capitalInvestment: project.capitalInvestmentCrores,
      injectedNode: injectedApprovalCode,
      revisedCriticalPathDays: criticalPathDays,
      criticalPathNodes,
      status: 'SUCCESSFULLY_INJECTED',
    }];

    return {
      circularReference,
      amendmentTitle,
      blastRadiusCount: blastRadiusResults.length,
      affectedProjects: blastRadiusResults,
      timestamp: new Date(),
    };
  }
}
