-- ==============================================================================
-- PRAVAH: Intelligent Industrial Regulatory Orchestration Platform
-- PostgreSQL / Supabase Schema Definition & Seeding Script
-- Target Database: Supabase PostgreSQL (https://bkidxhsahwggipciiwpm.supabase.co)
-- ==============================================================================

-- 1. Project Digital Twin Entity
CREATE TABLE IF NOT EXISTS public.project_twins (
    project_id VARCHAR(64) PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    enterprise_entity_id VARCHAR(64) NOT NULL,
    state_jurisdiction VARCHAR(8) DEFAULT 'MH',
    district VARCHAR(64) DEFAULT 'Pune',
    industry_sector VARCHAR(128) NOT NULL DEFAULT 'Food Processing',
    nic_code VARCHAR(32) DEFAULT '10792',
    capital_investment_crores NUMERIC(10, 2) NOT NULL DEFAULT 12.00,
    proposed_employment INTEGER NOT NULL DEFAULT 150,
    land_classification VARCHAR(128) DEFAULT 'MIDC Industrial Zone',
    survey_plot_number VARCHAR(255) DEFAULT 'Plot No. C-44, Phase II, Chakan MIDC',
    water_demand_kld NUMERIC(8, 2) DEFAULT 45.00,
    power_demand_kw INTEGER DEFAULT 750,
    active_stage VARCHAR(64) DEFAULT 'Site Preparation',
    global_health_score INTEGER DEFAULT 92,
    aggregate_sla_risk JSONB DEFAULT '{"score": 0.42, "tier": "MONITORED", "delayFactors": ["CA Gross Investment Certificate pending document reconciliation"]}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Regulatory Dependency Graph (DAG) Entity
CREATE TABLE IF NOT EXISTS public.regulatory_graphs (
    project_id VARCHAR(64) PRIMARY KEY REFERENCES public.project_twins(project_id) ON DELETE CASCADE,
    nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
    edges JSONB NOT NULL DEFAULT '[]'::jsonb,
    critical_path_days INTEGER DEFAULT 120,
    critical_path_nodes JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Evidence Wallet Entity (Provenance-First Fact Store)
CREATE TABLE IF NOT EXISTS public.evidence_wallet (
    id BIGSERIAL PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL REFERENCES public.project_twins(project_id) ON DELETE CASCADE,
    fact_key VARCHAR(128) NOT NULL,
    fact_label VARCHAR(255) NOT NULL,
    extracted_value JSONB,
    declared_value JSONB,
    unit VARCHAR(64) DEFAULT '',
    normalized_data_type VARCHAR(32) DEFAULT 'STRING',
    provenance JSONB DEFAULT '{}'::jsonb,
    validation_state VARCHAR(64) DEFAULT 'UNVERIFIED',
    conflict_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(project_id, fact_key)
);

-- 4. Statutory Rulebase Entity
CREATE TABLE IF NOT EXISTS public.statutory_rules (
    rule_code VARCHAR(128) PRIMARY KEY,
    department_id VARCHAR(64) NOT NULL,
    rule_title VARCHAR(255) NOT NULL,
    act_citation TEXT NOT NULL,
    gazette_reference VARCHAR(255) NOT NULL,
    effective_date TIMESTAMPTZ DEFAULT NOW(),
    baseline_sla_days INTEGER NOT NULL DEFAULT 30,
    applicable_conditions JSONB DEFAULT '{}'::jsonb,
    document_requirements JSONB DEFAULT '[]'::jsonb,
    gazette_snippet TEXT NOT NULL,
    vector_embedding JSONB DEFAULT '[]'::jsonb,
    version_tag VARCHAR(32) DEFAULT 'MH-2026.1',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SLA & Statutory Audit Ledger Entity
CREATE TABLE IF NOT EXISTS public.audit_ledger (
    id BIGSERIAL PRIMARY KEY,
    project_id VARCHAR(64) NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    actor_type VARCHAR(64) NOT NULL,
    actor_name VARCHAR(128) NOT NULL,
    event_type VARCHAR(64) NOT NULL,
    node_code VARCHAR(128),
    previous_state JSONB,
    new_state JSONB,
    justification_note TEXT NOT NULL,
    sla_time_elapsed_delta NUMERIC(6, 1) DEFAULT 0
);

-- Enable Row Level Security (RLS) & Allow Anonymous Read/Write for Platform Demo
ALTER TABLE public.project_twins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regulatory_graphs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_wallet ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.statutory_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read/write project_twins" ON public.project_twins FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write regulatory_graphs" ON public.regulatory_graphs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write evidence_wallet" ON public.evidence_wallet FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write statutory_rules" ON public.statutory_rules FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public read/write audit_ledger" ON public.audit_ledger FOR ALL USING (true) WITH CHECK (true);

-- Create Storage Bucket for Administrative Filings (PDFs)
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access to Documents Bucket" ON storage.objects
FOR ALL USING (bucket_id = 'documents') WITH CHECK (bucket_id = 'documents');

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- Seed Golden Path Project: "Sahyadri Agro-Processing Facility"
INSERT INTO public.project_twins (
    project_id, project_name, enterprise_entity_id, state_jurisdiction, district,
    industry_sector, nic_code, capital_investment_crores, proposed_employment,
    land_classification, survey_plot_number, water_demand_kld, power_demand_kw,
    active_stage, global_health_score, aggregate_sla_risk
) VALUES (
    'MAHA-AGRO-2026-8812',
    'Sahyadri Agro-Processing Facility',
    'MH-ENT-2026-9901',
    'MH',
    'Pune',
    'Food Processing',
    '10792',
    12.00,
    150,
    'MIDC Industrial Zone',
    'Plot No. C-44, Phase II, Chakan MIDC',
    45.00,
    750,
    'Site Preparation',
    92,
    '{"score": 0.42, "tier": "MONITORED", "delayFactors": ["CA Gross Investment Certificate pending document reconciliation"]}'::jsonb
) ON CONFLICT (project_id) DO UPDATE SET
    capital_investment_crores = EXCLUDED.capital_investment_crores,
    global_health_score = EXCLUDED.global_health_score;

-- Seed Regulatory DAG
INSERT INTO public.regulatory_graphs (
    project_id, nodes, edges, critical_path_days, critical_path_nodes
) VALUES (
    'MAHA-AGRO-2026-8812',
    '[
      {"approvalCode": "MIDC_LAND_ALLOCATION", "approvalName": "MIDC Industrial Plot Allotment & Possession", "departmentName": "MIDC (Industrial Dev Corp)", "prerequisiteCodes": [], "statutorySlaDays": 30, "status": "READY_TO_APPLY", "isParallel": false, "slaElapsedDays": 12, "slaRiskScore": 0.35, "slaRiskTier": "NOMINAL", "inspectionStatus": "SCHEDULED", "queriesCount": 0},
      {"approvalCode": "MPCB_CTE", "approvalName": "Consent to Establish (Orange Category - Agro)", "departmentName": "MPCB (Pollution Control Board)", "prerequisiteCodes": ["MIDC_LAND_ALLOCATION"], "statutorySlaDays": 45, "status": "BLOCKED", "isParallel": false, "slaElapsedDays": 0, "slaRiskScore": 0.1, "slaRiskTier": "NOMINAL", "inspectionStatus": "NONE", "queriesCount": 0},
      {"approvalCode": "DISHER_LABOUR_REG", "approvalName": "Inter-State Migrant & Contract Labour Registration", "departmentName": "DISHER (Industrial Safety & Health)", "prerequisiteCodes": [], "statutorySlaDays": 30, "status": "READY_TO_APPLY", "isParallel": true, "slaElapsedDays": 6, "slaRiskScore": 0.2, "slaRiskTier": "NOMINAL", "inspectionStatus": "NONE", "queriesCount": 0},
      {"approvalCode": "FIRE_NOC", "approvalName": "Provisional Fire Safety NOC", "departmentName": "Maharashtra Fire Services Directorate", "prerequisiteCodes": ["MIDC_LAND_ALLOCATION"], "statutorySlaDays": 30, "status": "BLOCKED", "isParallel": false, "slaElapsedDays": 0, "slaRiskScore": 0.1, "slaRiskTier": "NOMINAL", "inspectionStatus": "NONE", "queriesCount": 0},
      {"approvalCode": "DISHER_FACTORY_PLAN", "approvalName": "Factory Building Plan Approval & Safety License", "departmentName": "DISHER (Industrial Safety & Health)", "prerequisiteCodes": ["MPCB_CTE", "FIRE_NOC"], "statutorySlaDays": 45, "status": "BLOCKED", "isParallel": false, "slaElapsedDays": 0, "slaRiskScore": 0.1, "slaRiskTier": "NOMINAL", "inspectionStatus": "NONE", "queriesCount": 0},
      {"approvalCode": "MSEDCL_POWER_SANCTION", "approvalName": "750 kW Industrial Load Sanction & Feasibility", "departmentName": "MSEDCL (State Electricity Dist. Co.)", "prerequisiteCodes": ["MIDC_LAND_ALLOCATION"], "statutorySlaDays": 20, "status": "BLOCKED", "isParallel": true, "slaElapsedDays": 0, "slaRiskScore": 0.1, "slaRiskTier": "NOMINAL", "inspectionStatus": "NONE", "queriesCount": 0}
    ]'::jsonb,
    '[
      {"id": "e_midc_mpcb", "source": "MIDC_LAND_ALLOCATION", "target": "MPCB_CTE", "edgeType": "MANDATORY_PREREQUISITE", "label": "Statutory Prerequisite"},
      {"id": "e_midc_fire", "source": "MIDC_LAND_ALLOCATION", "target": "FIRE_NOC", "edgeType": "MANDATORY_PREREQUISITE", "label": "Site Boundary Access"},
      {"id": "e_midc_power", "source": "MIDC_LAND_ALLOCATION", "target": "MSEDCL_POWER_SANCTION", "edgeType": "PARALLEL_PERMISSIBLE", "label": "Parallel Branch"},
      {"id": "e_mpcb_disher", "source": "MPCB_CTE", "target": "DISHER_FACTORY_PLAN", "edgeType": "MANDATORY_PREREQUISITE", "label": "Env Clearance Prerequisite"},
      {"id": "e_fire_disher", "source": "FIRE_NOC", "target": "DISHER_FACTORY_PLAN", "edgeType": "MANDATORY_PREREQUISITE", "label": "Fire NOC Prerequisite"}
    ]'::jsonb,
    120,
    '["MIDC_LAND_ALLOCATION", "MPCB_CTE", "DISHER_FACTORY_PLAN"]'::jsonb
) ON CONFLICT (project_id) DO NOTHING;

-- Seed Authoritative Statutory Rules
INSERT INTO public.statutory_rules (
    rule_code, department_id, rule_title, act_citation, gazette_reference,
    baseline_sla_days, gazette_snippet, version_tag
) VALUES
(
    'MIDC_LAND_ALLOTMENT_2025', 'MIDC',
    'Maharashtra Industrial Development Corporation Land Allotment Regulations',
    'MIDC Act, 1961 - Section 14 & Disposal of Land Regulations, 1975',
    'Circular No. MIDC/CP/DLR/2025/119',
    30,
    'Under Section 14 of the MIDC Act, 1961 and Regulation 7 of the Disposal of Land Regulations, allotment of industrial plots in notified industrial areas shall be finalized within a statutory period of 30 days from complete submission.',
    'MH-2025.2'
),
(
    'MPCB_CTE_ORANGE_2026', 'MPCB',
    'MPCB Consent to Establish (CTE) Norms for Agro & Food Processing (Orange Category)',
    'Water (Prevention and Control of Pollution) Act, 1974 - Section 25 & Air Act, 1981 - Section 21',
    'MPCB Gazette Circular No. B-29012/ESS(CPA)/2026/04',
    45,
    'In accordance with Section 25(4) of the Water (Prevention and Control of Pollution) Act, 1974 and Section 21 of the Air Act, 1981, any industrial unit falling under the Orange Category must secure Consent to Establish (CTE) prior to initiating any civil foundation or structural construction on site.',
    'MH-2026.1'
),
(
    'MH_RTS_REJECTION_MANDATE_2015', 'RTS_COMMISSION',
    'Maharashtra Right to Public Services Act - Query & Natural Justice Protection Norms',
    'Maharashtra Right to Public Services Act, 2015 - Section 8 & Section 10',
    'Govt. of Maharashtra Gazette Extraordinary Part IV-B, Notification RTS-2015/CR-01/15',
    15,
    'Under Section 8(2) of the Maharashtra Right to Public Services Act, 2015 read with General Administrative Guidelines, NO competent statutory department—including MPCB, MIDC, or DISHER—shall summarily reject or dismiss an industrial regulatory application without first issuing a formal, itemized Query Notice with a mandatory cure period of not less than 15 calendar days.',
    'MH-2015.4'
),
(
    'CGWA_GROUNDWATER_NOC_2026', 'CGWA',
    'Central Ground Water Authority Industrial Extraction NOC Mandate',
    'Environment (Protection) Act, 1986 - Section 3(3) & CGWA Gazette Notification S.O. 3289(E)',
    'Government Gazette Circular 2026/09 (Amended Ground Water Norms)',
    45,
    'By order of Government Gazette Circular 2026/09 under Section 3(3) of the Environment (Protection) Act, 1986, all agro-industrial and food processing enterprises with aggregate capital investment exceeding INR 10 Crores must secure a specialized Groundwater Abstraction NOC prior to factory plan approval.',
    'MH-2026.9'
) ON CONFLICT (rule_code) DO NOTHING;
