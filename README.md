# PRAVAH: Intelligent Industrial Regulatory Orchestration Platform

> **"Single-Window Portals: 'Here are 15 disconnected application forms.'**  
> **PRAVAH Intelligence: 'Here is the dependency graph, parallel path, evidence reuse, and SLA risk for your unit.'"**

---

## 🏛️ Executive Summary & Platform Manifesto

**PRAVAH** is an Intelligent Industrial Regulatory Orchestration & Compliance Platform operating as the statutory intelligence layer between fragmented governmental bodies (MIDC, MPCB, DISHER, Fire Services, CGWA, MSEDCL).

Unlike generic single-window listing directories (NSWS, MAITRI 2.0), PRAVAH models each enterprise as a **Regulatory Digital Twin**—a live, stateful software representation of an industrial factory's legal journey from land acquisition to commercial production. It resolves regulatory deadlocks, surfaces hidden parallel processing paths, extracts verified facts into a cryptographic **Evidence Wallet**, and automatically recalculates critical paths when government circulars change.

---

## ⚖️ Strict Deterministic vs. Non-Deterministic Boundary

1. **Deterministic Layer (Node.js/Express & MongoDB)**:
   - Manages application states, legal approval workflows, statutory deadline counters, user permissions, and Directed Acyclic Graph (DAG) topological transitions.
   - **Constitutional Principle**: *Legal approvals are never granted or denied by an LLM.*
2. **Cognitive Layer (LLM & Vector Search)**:
   - Operates strictly as a copilot and analyzer.
   - Multimodal extraction of structured administrative facts with page and paragraph citations.
   - Computes SHA-256 tamper-prevention document fingerprints.
   - Enforces zero-tolerance anomaly detection against declared project metadata.
   - Strictly grounded statutory advisory (RAG) with zero-hallucination fallback when similarity < 0.70.
   - Computes semantic blast radius and dynamically injects nodes into live DAGs upon gazette circular promulgation.

---

## 🤖 The 5-Sub-Agent System Specification

| Sub-Agent | Core Responsibility | Operational Technology |
| :--- | :--- | :--- |
| **Sub-Agent 1: Document AI & Provenance** | Parses administrative PDFs, extracts high-value entities, computes SHA-256 hashes, and flags discrepancies. | Multimodal Extraction + Zero-Tolerance Cross-Verification |
| **Sub-Agent 2: Dependency Graph Engine** | Evaluates DAG state transitions, unblocks child nodes when prerequisites approve, and computes critical paths. | Kahn's Algorithm / Deterministic Topological Sort |
| **Sub-Agent 3: Statutory Grounded RAG** | Advises entrepreneurs strictly citing Acts, Sections, and Gazette circulars with zero hallucination. | Cosine Vector Similarity + Grounded Legal Synthesis |
| **Sub-Agent 4: SLA Guardian & Risk Model** | Predicts statutory delays using linear burn rates and multi-factor heuristic penalties. | Weighted Scoring Matrix (Nominal, Monitored, Breach Imminent) |
| **Sub-Agent 5: Policy Change Impact Engine** | Detects mid-stream gazette amendments, identifies project blast radiuses, and injects prerequisite nodes. | Dynamic Graph Modification & Dependency Rerouting (USP) |

---

## 🖥️ Stitch Institutional Design System

Designed according to high-density institutional software specifications (Palantir Foundry, Linear, UK GDS):
- **Background Palette**: Deep Slate / Charcoal (`#0B0D13`, `#12151E`, `#1A1E2B`)
- **Hairline Dividers**: Strict 1px borders (`#262B3D`) without blurred glowing shadows.
- **Status Tokens**: Forest Green (`#064E3B`/`#34D399`), Amber Ochre (`#78350F`/`#FBBF24`), Crimson Brick (`#7F1D1D`/`#F87171`), Muted Zinc (`#27272A`/`#A1A1AA`).
- **Typography**: Inter for interface elements; JetBrains Mono for reference codes, currency figures, and legal citations.
- **Layout**: Fixed 3-pane operational cockpit without body scroll:
  - **Left (25%)**: Regulatory Workflow Canvas (Interactive React Flow DAG)
  - **Center (45%)**: Document & Statutory Workspace (Split PDF Viewer, Anomaly Alert, Grounded RAG Console)
  - **Right (30%)**: Evidence Wallet & Real-Time Audit Ledger

---

## 🚀 Quickstart & Demonstration

### 1. Backend Server
```bash
cd backend
npm install
npm run seed     # Seeds authoritative gazette rules and Sahyadri Agro-Processing Facility
npm start        # Runs on http://localhost:5050
```

### 2. Frontend Cockpit
```bash
cd frontend
npm install
npm run dev      # Runs on http://localhost:5173
```

### 3. Automated Verification Suite
```bash
cd backend
node src/scripts/testPipeline.js
```
