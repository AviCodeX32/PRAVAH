import React, { useState } from 'react';
import {
  FolderOpen,
  ListChecks,
  Wallet,
  FileSearch,
  AlertTriangle,
  FileCheck,
  UploadCloud,
  CheckCircle2,
  Clock,
  Shield,
  FileText,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ExternalLink,
  ArrowRight,
  RefreshCw,
  Building,
  Check,
  X,
} from 'lucide-react';

export default function DocumentsView({
  subSection = 'evidence_wallet',
  project,
  evidence = [],
  auditLogs = [],
  onUploadCaCert,
  onReconcileFact,
  activeDiscrepancy = false,
}) {
  const [activeTab, setActiveTab] = useState(subSection);
  const [expandedHashes, setExpandedHashes] = useState({});
  const [selectedFolder, setSelectedFolder] = useState('ALL');

  React.useEffect(() => {
    if (subSection) setActiveTab(subSection);
  }, [subSection]);

  const toggleHash = (factKey) => {
    setExpandedHashes((prev) => ({ ...prev, [factKey]: !prev[factKey] }));
  };

  const investmentFact = evidence?.find((e) => e.factKey === 'GROSS_PROJECT_INVESTMENT');
  const isFlagged = investmentFact?.validationState === 'DISCREPANCY_FLAGGED';

  const mockDocuments = [
    {
      id: 'DOC-001',
      title: 'MIDC Plot 7/12 Land Extract & Allotment Order',
      department: 'MIDC Land Dept',
      status: 'VERIFIED',
      date: '2026-08-15',
      size: '2.4 MB',
      type: 'Land Record',
    },
    {
      id: 'DOC-002',
      title: 'Chartered Accountant Capital Outlay Certificate',
      department: 'Finance & Planning',
      status: isFlagged ? 'DISCREPANCY_FLAGGED' : 'VERIFIED',
      date: '2026-09-27',
      size: '1.1 MB',
      type: 'Financial Audit',
    },
    {
      id: 'DOC-003',
      title: 'Environmental Management & Effluent Treatment Plan',
      department: 'MPCB Water Wing',
      status: 'UNDER_SCRUTINY',
      date: '2026-09-20',
      size: '5.8 MB',
      type: 'Environmental Audit',
    },
    {
      id: 'DOC-004',
      title: 'Factory Building & Plant Machinery Layout Plan',
      department: 'Directorate of Industrial Safety',
      status: 'READY_TO_SUBMIT',
      date: '2026-09-22',
      size: '8.2 MB',
      type: 'Architectural Blueprint',
    },
    {
      id: 'DOC-005',
      title: 'Provisional Fire Safety & Evacuation NOC',
      department: 'Fire Services',
      status: 'VERIFIED',
      date: '2026-09-18',
      size: '1.9 MB',
      type: 'Statutory Safety',
    },
  ];

  return (
    <div className="h-full w-full flex flex-col bg-slate-50 overflow-hidden select-none">
      {/* Sub-navigation tabs */}
      <div className="px-6 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('evidence_wallet')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'evidence_wallet'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-blue-600" />
            <span>Evidence Wallet (Golden Records)</span>
          </button>

          <button
            onClick={() => setActiveTab('verification_mismatches')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'verification_mismatches'
                ? 'bg-amber-50 text-amber-900 border border-amber-300 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <AlertTriangle className={`w-3.5 h-3.5 ${isFlagged ? 'text-amber-600 animate-pulse' : 'text-slate-500'}`} />
            <span>Verification & Mismatches</span>
            {isFlagged && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                1 Variance
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('document_intelligence')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'document_intelligence'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileSearch className="w-3.5 h-3.5 text-teal-600" />
            <span>Document AI & OCR</span>
          </button>

          <button
            onClick={() => setActiveTab('document_repository')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'document_repository'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FolderOpen className="w-3.5 h-3.5 text-slate-600" />
            <span>Document Repository</span>
          </button>

          <button
            onClick={() => setActiveTab('document_checklist')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'document_checklist'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ListChecks className="w-3.5 h-3.5 text-slate-600" />
            <span>Statutory Checklist</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onUploadCaCert}
            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Upload sample CA Certificate"
          >
            <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
            <span>Upload CA Cert</span>
          </button>
        </div>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 overflow-y-auto">
        {/* ========================================================================= */}
        {/* TAB 1: EVIDENCE WALLET (INNOVATION #2)                                     */}
        {/* ========================================================================= */}
        {activeTab === 'evidence_wallet' && (
          <div className="p-8 max-w-6xl mx-auto space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
                  PRAVAH Innovation #2
                </span>
                <span className="text-xs text-slate-400">• Cross-Department Golden Record</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
                <Wallet className="w-6 h-6 text-blue-600" />
                <span>Evidence Wallet (Verified Facts Engine)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-3xl">
                Extract once, verify once, reuse across all statutory departments. Every verified fact carries cryptographic SHA-256 provenance hashes and is locked against duplicate filing burdens.
              </p>
            </div>

            {/* Facts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {evidence.map((fact) => {
                const isItemFlagged = fact.validationState === 'DISCREPANCY_FLAGGED';
                const isVerified = fact.validationState === 'VERIFIED_MATCH';
                const isCapital = fact.factKey === 'GROSS_PROJECT_INVESTMENT';
                const isExpanded = expandedHashes[fact.factKey];

                return (
                  <div
                    key={fact.factKey}
                    className={`bg-white rounded-xl border p-5 shadow-2xs space-y-3 transition-all ${
                      isItemFlagged
                        ? 'border-amber-400 ring-2 ring-amber-500/20 shadow-amber-50'
                        : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-semibold text-slate-500">{fact.factLabel}</span>
                        <div className="text-lg font-bold text-slate-900 mt-0.5">
                          {isCapital ? `₹${fact.declaredValue} Crores` : fact.extractedValue || fact.declaredValue}
                          {fact.unit && !isCapital ? ` ${fact.unit}` : ''}
                        </div>
                      </div>

                      {isVerified && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Verified
                        </span>
                      )}
                      {isItemFlagged && (
                        <button
                          onClick={() => setActiveTab('verification_mismatches')}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse cursor-pointer"
                        >
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          Resolve Variance
                        </button>
                      )}
                    </div>

                    <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Primary Source:</span>
                        <span className="font-medium text-slate-700">{fact.sourceDocumentName || 'MIDC Master Application'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Department Authority:</span>
                        <span className="font-medium text-slate-700">{fact.attestingAuthority || 'MIDC Land Scrutiny Wing'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Cross-Department Reuse:</span>
                        <span className="font-semibold text-blue-700">Accepted by 4 Departments</span>
                      </div>
                    </div>

                    {/* SHA-256 Provenance Dropdown */}
                    <div className="pt-2">
                      <button
                        onClick={() => toggleHash(fact.factKey)}
                        className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Shield className="w-3 h-3 text-teal-600" />
                        <span>Cryptographic Provenance (SHA-256)</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>

                      {isExpanded && (
                        <div className="mt-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-mono text-slate-600 break-all space-y-1">
                          <div>
                            <span className="text-slate-400 font-sans">Hash: </span>
                            {fact.sourceHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                          </div>
                          <div>
                            <span className="text-slate-400 font-sans">Confidence Score: </span>
                            {(fact.confidenceScore * 100).toFixed(1)}% (Deterministic Extraction)
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: VERIFICATION & MISMATCHES (INNOVATION #4 & STEP 1-2 GOLDEN PATH)    */}
        {/* ========================================================================= */}
        {activeTab === 'verification_mismatches' && (
          <div className="p-8 max-w-5xl mx-auto space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 uppercase tracking-wider">
                  PRAVAH Innovation #4
                </span>
                <span className="text-xs text-slate-400">• Proactive Cross-Document Reconciliation</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-amber-600" />
                <span>Verification & Cross-Document Mismatch Resolution</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-3xl">
                PRAVAH flags inconsistencies between certified statutory documents before departmental scrutiny commences, preventing weeks of administrative delay and query notices.
              </p>
            </div>

            {isFlagged ? (
              <div className="bg-white rounded-2xl border border-amber-300 p-6 shadow-sm space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Capital Outlay Discrepancy Flagged
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        New Chartered Accountant Certificate indicates ₹13.60 Crores vs Registered Portal Baseline of ₹12.00 Crores.
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    Variance: +13.33%
                  </span>
                </div>

                {/* Side-by-Side Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left: Registered Profile */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Initial Declared Profile
                    </span>
                    <div className="text-2xl font-bold text-slate-800">
                      ₹12.00 <span className="text-sm font-normal text-slate-500">Crores</span>
                    </div>
                    <div className="text-xs text-slate-500 space-y-0.5 pt-1">
                      <div>Document: MIDC Online Common Application Form</div>
                      <div>Status: Initial Baseline Entry</div>
                    </div>
                  </div>

                  {/* Right: Uploaded CA Certificate */}
                  <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
                    <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                      Certified CA Certificate (Newly Uploaded)
                    </span>
                    <div className="text-2xl font-bold text-amber-900">
                      ₹13.60 <span className="text-sm font-normal text-amber-700">Crores</span>
                    </div>
                    <div className="text-xs text-amber-800 space-y-0.5 pt-1">
                      <div>Attestation: R.K. Mehta & Associates (Chartered Accountants)</div>
                      <div>UDIN: 26084128AAAAAA9912 (Verified with ICAI Portal)</div>
                    </div>
                  </div>
                </div>

                {/* Impact Analysis Warning */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>Statutory Impact of Updating Capital Outlay:</span>
                  </div>
                  <ul className="list-disc pl-5 text-slate-600 space-y-1">
                    <li>
                      <strong>MPCB Consent to Establish Fee:</strong> Recalculates from ₹50,000 to ₹75,000 based on Maharashtra Water/Air Pollution statutory fee slabs.
                    </li>
                    <li>
                      <strong>Groundwater Extraction NOC:</strong> Capital remains above the ₹10.0 Cr threshold under Gazette Circular 2026/09.
                    </li>
                  </ul>
                </div>

                {/* User Decision Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    onClick={() => onReconcileFact('GROSS_PROJECT_INVESTMENT', 'UPDATE_PROFILE_TO_EXTRACTED')}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Accept Certified ₹13.60 Cr & Recalculate Fees</span>
                  </button>

                  <button
                    onClick={() => onReconcileFact('GROSS_PROJECT_INVESTMENT', 'REJECT_CERTIFICATE')}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                    <span>Reject & Request Amended Certificate</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-2xs">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    All Statutory Filings & Certificates Fully Reconciled
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    No discrepancies detected across Common Application Form, CA Certificate, Land Records, or Environmental Audit.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={onUploadCaCert}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs inline-flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <UploadCloud className="w-4 h-4 text-blue-600" />
                    <span>Re-simulate Ingestion Mismatch (Test Flow)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: DOCUMENT INTELLIGENCE & OCR                                        */}
        {/* ========================================================================= */}
        {activeTab === 'document_intelligence' && (
          <div className="p-8 max-w-6xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileSearch className="w-6 h-6 text-teal-600" />
                <span>AI Document Intelligence & Entity Extraction</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Automated administrative document parsing with confidence scoring, table recognition, and field normalization.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Processed Documents
                </span>
                <div className="space-y-2">
                  {mockDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 rounded-lg border border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-white cursor-pointer transition-all space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-blue-700">{doc.id}</span>
                        <span className="text-[10px] text-slate-400">{doc.size}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-900 line-clamp-1">{doc.title}</div>
                      <div className="text-[10px] text-slate-500">{doc.department}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Extraction Target</span>
                    <h3 className="text-sm font-bold text-slate-900">CA_Capital_Outlay_Audit_2026.pdf</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
                    Confidence: 99.4%
                  </span>
                </div>

                <div className="space-y-4 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Extracted Field</span>
                      <span className="font-bold text-slate-800">Gross Fixed Capital Outlay</span>
                    </div>
                    <span className="font-mono font-bold text-blue-700 text-sm">₹13,60,00,000</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Extracted Field</span>
                      <span className="font-bold text-slate-800">Plant & Machinery Component</span>
                    </div>
                    <span className="font-mono font-bold text-slate-800 text-sm">₹8,40,00,000</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Extracted Field</span>
                      <span className="font-bold text-slate-800">Civil & Structural Works</span>
                    </div>
                    <span className="font-mono font-bold text-slate-800 text-sm">₹5,20,00,000</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Extracted Field</span>
                      <span className="font-bold text-slate-800">Statutory UDIN</span>
                    </div>
                    <span className="font-mono font-bold text-slate-800 text-sm">26084128AAAAAA9912</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: DOCUMENT REPOSITORY                                                */}
        {/* ========================================================================= */}
        {activeTab === 'document_repository' && (
          <div className="p-8 max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <FolderOpen className="w-6 h-6 text-slate-700" />
                  <span>Statutory Document Repository</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Centralized secure repository synchronized with DigiLocker and State Single Window archives.
                </p>
              </div>

              <button
                onClick={onUploadCaCert}
                className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs flex items-center gap-2 shadow-2xs cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload New Document</span>
              </button>
            </div>

            {/* Documents List */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-5 py-3.5">Document Title</th>
                    <th className="px-5 py-3.5">Department</th>
                    <th className="px-5 py-3.5">Verification Status</th>
                    <th className="px-5 py-3.5">Uploaded Date</th>
                    <th className="px-5 py-3.5 text-right">Size</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {mockDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>{doc.title}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 ml-6">{doc.type}</div>
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-600">{doc.department}</td>
                      <td className="px-5 py-4">
                        {doc.status === 'VERIFIED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Verified
                          </span>
                        )}
                        {doc.status === 'DISCREPANCY_FLAGGED' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            Discrepancy Flagged
                          </span>
                        )}
                        {doc.status === 'UNDER_SCRUTINY' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-100 text-blue-800 border border-blue-200">
                            <Clock className="w-3 h-3 text-blue-600" />
                            Under Scrutiny
                          </span>
                        )}
                        {doc.status === 'READY_TO_SUBMIT' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-500">{doc.date}</td>
                      <td className="px-5 py-4 text-right font-mono text-slate-500">{doc.size}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: DOCUMENT CHECKLIST                                                 */}
        {/* ========================================================================= */}
        {activeTab === 'document_checklist' && (
          <div className="p-8 max-w-5xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ListChecks className="w-6 h-6 text-slate-700" />
                <span>Statutory Clearances Checklist</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Mandatory document readiness index before application submission across all 5 departments.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800">Overall Document Readiness</span>
                <span className="text-xs font-bold text-emerald-600">80% Ready (4 of 5 Required Filed)</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold text-slate-900">MIDC Land Possession Order & 7/12 Extract</span>
                      <p className="text-[11px] text-slate-500">Satisfies land ownership proof for all downstream applications.</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">Ready</span>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold text-slate-900">Chartered Accountant Net Worth & Outlay Certificate</span>
                      <p className="text-[11px] text-slate-500">Determines MPCB pollution consent fee tier and incentive slab.</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">Ready</span>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold text-slate-900">Environmental Management Plan (EMP) & Water Balance Flowchart</span>
                      <p className="text-[11px] text-slate-500">Required for MPCB Consent to Establish scrutiny.</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">Ready</span>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-bold text-slate-900">Factory Architect Structural & Safety Layout Plan</span>
                      <p className="text-[11px] text-slate-500">Signed by registered civil structural engineer under DISH norms.</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">Ready</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <div>
                      <span className="font-bold text-slate-700">Central Ground Water Authority (CGWA) Impact Assessment</span>
                      <p className="text-[11px] text-slate-500">Required conditionally if groundwater extraction is activated under Gazette 2026/09.</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-medium text-[10px]">Conditional</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
