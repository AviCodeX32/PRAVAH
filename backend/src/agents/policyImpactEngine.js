import { RegulatoryGraph } from '../models/RegulatoryGraph.js';
import { ProjectTwin } from '../models/ProjectTwin.js';
import { StatutoryRule } from '../models/StatutoryRule.js';
import { AuditLedger } from '../models/AuditLedger.js';
import { GraphEngine } from './graphEngine.js';

/**
 * Sub-Agent 5: Regulatory Change Impact Engine (The Core USP)
 * Detects new or amended statutory gazette policies mid-stream, identifies the blast radius
 * of affected projects, dynamically injects new prerequisite nodes into live DAGs,
 * and recalculates statutory critical paths.
 */
export class PolicyImpactEngine {
  /**
   * Simulates or applies an amended gazette circular across all matching active projects
   * Golden Path default amendment:
   * "Government Gazette Circular 2026/09 — Additional Groundwater NOC required for agro-units with investment > ₹10 Cr"
   */
  static async simulatePolicyAmendment({
    circularReference = 'Government Gazette Circular 2026/09',
    amendmentTitle = 'Groundwater Extraction NOC Mandate for High-Capital Agro Units',
    targetSectors = ['Food Processing', 'Agro-processing'],
    minCapitalThresholdCrores = 10.0,
    injectedApprovalCode = 'GROUNDWATER_NOC',
    injectedApprovalName = 'Central Ground Water Authority (CGWA) Extraction NOC',
    departmentName = 'Central Ground Water Authority / State GW Board',
    statutorySlaDays = 45,
    insertAfterApprovalCode = 'MPCB_CTE',
    insertBeforeApprovalCode = 'DISHER_FACTORY_PLAN',
  }) {
    // 1. Identify all active matching projects (The Blast Radius)
    const matchingProjects = await ProjectTwin.find({
      industrySector: { $in: targetSectors },
      capitalInvestmentCrores: { $gte: minCapitalThresholdCrores },
    });

    const blastRadiusResults = [];

    for (const project of matchingProjects) {
      const graph = await RegulatoryGraph.findOne({ projectId: project.projectId });
      if (!graph) continue;

      // Check if node is already injected to prevent duplication
      const existingNode = graph.nodes.find((n) => n.approvalCode === injectedApprovalCode);
      if (existingNode) {
        blastRadiusResults.push({
          projectId: project.projectId,
          projectName: project.projectName,
          alreadyInjected: true,
          status: 'PREVIOUSLY_INJECTED',
        });
        continue;
      }

      // Check if upstream prerequisite node exists
      const parentNode = graph.nodes.find((n) => n.approvalCode === insertAfterApprovalCode);
      const isParentApproved = parentNode ? parentNode.status === 'APPROVED' : false;

      // Create the injected node
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

      // Re-route edges:
      // 1. Connect parent -> injected node
      const newParentEdge = {
        id: `e_${insertAfterApprovalCode.toLowerCase()}_${injectedApprovalCode.toLowerCase()}`,
        source: insertAfterApprovalCode,
        target: injectedApprovalCode,
        edgeType: 'MANDATORY_PREREQUISITE',
        label: 'Gazette 2026/09 Mandate',
      };
      graph.edges.push(newParentEdge);

      // 2. Add injected node as prerequisite to downstream node
      const downstreamNode = graph.nodes.find((n) => n.approvalCode === insertBeforeApprovalCode);
      if (downstreamNode) {
        if (!downstreamNode.prerequisiteCodes.includes(injectedApprovalCode)) {
          downstreamNode.prerequisiteCodes.push(injectedApprovalCode);
        }

        // Add edge: injected node -> downstream node
        const newDownstreamEdge = {
          id: `e_${injectedApprovalCode.toLowerCase()}_${insertBeforeApprovalCode.toLowerCase()}`,
          source: injectedApprovalCode,
          target: insertBeforeApprovalCode,
          edgeType: 'MANDATORY_PREREQUISITE',
          label: 'Statutory Injection Dependency',
        };
        graph.edges.push(newDownstreamEdge);
      }

      // Recalculate Critical Path
      const { criticalPathDays, criticalPathNodes } = GraphEngine.calculateCriticalPath(
        graph.nodes,
        graph.edges
      );
      graph.criticalPathDays = criticalPathDays;
      graph.criticalPathNodes = criticalPathNodes;

      await graph.save();

      // Log to Audit Ledger
      await AuditLedger.create({
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

      blastRadiusResults.push({
        projectId: project.projectId,
        projectName: project.projectName,
        capitalInvestment: project.capitalInvestmentCrores,
        injectedNode: injectedApprovalCode,
        revisedCriticalPathDays: criticalPathDays,
        criticalPathNodes,
        status: 'SUCCESSFULLY_INJECTED',
      });
    }

    return {
      circularReference,
      amendmentTitle,
      blastRadiusCount: blastRadiusResults.length,
      affectedProjects: blastRadiusResults,
      timestamp: new Date(),
    };
  }
}
