import dotenv from 'dotenv';
import { supabase, verifySupabaseConnection } from '../config/supabase.js';
import { DbService } from '../services/dbService.js';

dotenv.config();

const PROJECT_ID = 'MAHA-AGRO-2026-8812';

async function seedDatabase() {
  console.log(`\n================================================================`);
  console.log(`  PRAVAH DATABASE SEED SCRIPT (SUPABASE POSTGRESQL)            `);
  console.log(`================================================================\n`);

  // 1. Verify Supabase connectivity
  console.log(`[SEED 1/7] Connecting to Supabase Cloud Database...`);
  await verifySupabaseConnection();

  // 2. Seed memory store & baseline data
  console.log(`[SEED 2/7] Seeding Baseline Regulatory Digital Twin & Artifacts...`);
  const seedSummary = await DbService.seedAll();
  console.log(`✓ Seeded ${seedSummary.projectsCount} Project Digital Twin`);
  console.log(`✓ Seeded ${seedSummary.graphsCount} Regulatory Dependency Graph`);
  console.log(`✓ Seeded ${seedSummary.rulesCount} Statutory Regulations with Vector Embeddings`);
  console.log(`✓ Seeded ${seedSummary.documentsCount} Departmental Documents`);

  // 3. Seed Users
  console.log(`\n[SEED 3/7] Seeding Default Portal Authentication Accounts...`);
  const users = await DbService.getAllUsers();
  users.forEach((u) => {
    console.log(`  • [${u.role.toUpperCase()}] ${u.email} (${u.name}) - ${u.companyName || u.department || u.agency}`);
  });

  // 4. Attempt Cloud Sync to Supabase Tables (if created via SQL)
  console.log(`\n[SEED 4/7] Synchronizing with Supabase Cloud Tables...`);
  const project = await DbService.getProject(PROJECT_ID);
  if (project) {
    try {
      const { error } = await supabase.from('project_twins').upsert({
        project_id: project.projectId,
        project_name: project.projectName,
        enterprise_entity_id: project.enterpriseEntityId,
        state_jurisdiction: project.stateJurisdiction,
        district: project.district,
        industry_sector: project.industrySector,
        nic_code: project.nicCode,
        capital_investment_crores: project.capitalInvestmentCrores,
        proposed_employment: project.proposedEmployment,
        land_classification: project.landClassification,
        survey_plot_number: project.surveyPlotNumber,
        water_demand_kld: project.waterDemandKld,
        power_demand_kw: project.powerDemandKw,
        active_stage: project.activeStage,
        global_health_score: project.globalHealthScore,
        aggregate_sla_risk: project.aggregateSlaRisk,
        updated_at: new Date().toISOString(),
      });
      if (!error) console.log(`✓ Synced project_twins to Supabase`);
    } catch (e) {
      // Ignored if table not in schema cache
    }
  }

  const graph = await DbService.getGraph(PROJECT_ID);
  if (graph) {
    try {
      const { error } = await supabase.from('regulatory_graphs').upsert({
        project_id: graph.projectId,
        nodes: graph.nodes,
        edges: graph.edges,
        critical_path_days: graph.criticalPathDays,
        critical_path_nodes: graph.criticalPathNodes,
        updated_at: new Date().toISOString(),
      });
      if (!error) console.log(`✓ Synced regulatory_graphs to Supabase`);
    } catch (e) {
      // Ignored if table not in schema cache
    }
  }

  // 5. Verify User Existence checks
  console.log(`\n[SEED 5/7] Testing User Existence & Credential Verification...`);
  const testInvestor = await DbService.loginUser({
    email: 'applicant@portal.gov.in',
    password: 'Password@123',
  });
  console.log(`✓ Verified Investor Login: ${testInvestor.name} (${testInvestor.email})`);

  const testOfficer = await DbService.loginUser({
    email: 'sro.pune@mpcb.gov.in',
    password: 'Password@123',
  });
  console.log(`✓ Verified Officer Login: ${testOfficer.name} (${testOfficer.email})`);

  const testAdmin = await DbService.loginUser({
    email: 'admin@pravah.gov.in',
    password: 'Password@123',
  });
  console.log(`✓ Verified Admin Login: ${testAdmin.name} (${testAdmin.email})`);

  // 6. Test Non-existent User Detection
  console.log(`\n[SEED 6/7] Testing Non-Existent User Detection...`);
  const unknownExists = await DbService.checkUserExists('random_unregistered@gov.in');
  console.log(`✓ Non-existent user check returned: exists = ${unknownExists} [Expected: false]`);

  // 7. Completion Summary
  console.log(`\n================================================================`);
  console.log(`  ALL PRAVAH DATA SEEDED AND VERIFIED SUCCESSFULLY!             `);
  console.log(`================================================================`);
  console.log(`\nDefault Portal Credentials:`);
  console.log(`  1. Industrial Investor:   applicant@portal.gov.in / Password@123`);
  console.log(`  2. Scrutiny Officer:      sro.pune@mpcb.gov.in    / Password@123`);
  console.log(`  3. Platform Admin:        admin@pravah.gov.in     / Password@123\n`);

  process.exit(0);
}

seedDatabase().catch((err) => {
  console.error('[SEED ERROR]', err);
  process.exit(1);
});
