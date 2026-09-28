# PRAVAH: Intelligent Industrial Regulatory Orchestration Platform

> **"Single-Window Portals: 'Here are 15 disconnected application forms.'**  
> **PRAVAH Intelligence: 'Here is the dependency graph, parallel path, evidence reuse, and SLA risk for your unit.'"**

---

## 🏛️ Platform Architecture & Database Migration (Supabase PostgreSQL)

PRAVAH is powered by **Supabase PostgreSQL & Cloud Storage**, maintaining strict separation between the **Deterministic Layer** (PostgreSQL relational state, Kahn's algorithm DAG solver) and the **Cognitive Layer** (multimodal fact extraction, zero-tolerance anomaly detection, vector-grounded statutory RAG, and policy change impact analysis).

### 🔑 Supabase Cloud Integration
- **Project URL**: `https://bkidxhsahwggipciiwpm.supabase.co`
- **Database**: PostgreSQL with Row-Level Security (RLS)
- **Storage**: Supabase Storage bucket `documents` for tamper-proof administrative PDF filings
- **Auth & Sessions**: Supabase Auth support for authorized regulatory operators

---

## 🚀 One-Click Supabase PostgreSQL Schema Setup

To create all 5 relational tables and storage buckets in your Supabase project:
1. Open the [Supabase SQL Editor](https://supabase.com/dashboard/project/bkidxhsahwggipciiwpm/sql).
2. Copy and paste the contents of [`supabase_schema.sql`](./supabase_schema.sql).
3. Click **Run**. All tables (`project_twins`, `regulatory_graphs`, `evidence_wallet`, `statutory_rules`, `audit_ledger`) and initial baseline data will be instantly created!

> *Note: PRAVAH includes an automatic resilient fallback layer, allowing the entire application and Golden Path scenarios to run seamlessly immediately.*

---

## 🤖 The 5-Sub-Agent System Specification

| Sub-Agent | Core Responsibility | Operational Technology |
| :--- | :--- | :--- |
| **Sub-Agent 1: Document AI & Provenance** | Parses administrative PDFs, uploads to Supabase Storage, computes SHA-256 hashes, and flags discrepancies. | Multimodal Extraction + Supabase Storage |
| **Sub-Agent 2: Dependency Graph Engine** | Evaluates DAG state transitions, unblocks child nodes when prerequisites approve, and computes critical paths. | Kahn's Algorithm / Deterministic PostgreSQL State |
| **Sub-Agent 3: Statutory Grounded RAG** | Advises entrepreneurs strictly citing Acts, Sections, and Gazette circulars with zero hallucination. | Cosine Vector Similarity + Grounded Legal Synthesis |
| **Sub-Agent 4: SLA Guardian & Risk Model** | Predicts statutory delays using linear burn rates and multi-factor heuristic penalties. | Weighted Scoring Matrix (Nominal, Monitored, Breach Imminent) |
| **Sub-Agent 5: Policy Change Impact Engine** | Detects mid-stream gazette amendments, identifies project blast radiuses, and injects prerequisite nodes. | Dynamic Graph Modification & Dependency Rerouting (USP) |

---

## 🖥️ Modern, Human-Centered UI

Designed according to high-level abstraction and progressive disclosure:
- **`🗺️ Compliance Roadmap`**: Spacious visual workflow of regulatory milestones with comfortable node cards and interactive details drawer.
- **`📄 Document Intelligence`**: Clean side-by-side document inspection with 1-click friendly discrepancy reconciliation.
- **`⚖️ Statutory Copilot`**: Conversational compliance AI with grounded legal citations.
- **`🗂️ Evidence & History`**: Abstracted enterprise facts with progressive disclosure and human activity timeline.

---

## 🏃 Quickstart

### 1. Backend Server (Port 5050)
```bash
cd backend
npm install
npm start
```

### 2. Frontend Cockpit (Port 5173)
```bash
cd frontend
npm install
npm run dev
```

### 3. Automated Verification Suite
```bash
cd backend
node src/scripts/testPipeline.js
```
