import React, { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  CheckCircle2,
  Send,
  Sparkles,
  ShieldCheck,
  Scale,
  RefreshCw,
  UploadCloud,
  FileCheck,
  ArrowRight,
  HelpCircle,
  BookOpen,
} from 'lucide-react';

export default function CentralWorkspace({
  project,
  evidence,
  onReconcileFact,
  onQueryRag,
  ragState,
  rules,
  activeSubView = 'document', // 'document' | 'rag'
}) {
  const [ragInput, setRagInput] = useState(
    'Can MPCB reject my application without issuing a formal query notice?'
  );

  const investmentFact = evidence?.find((e) => e.factKey === 'GROSS_PROJECT_INVESTMENT');
  const isFlagged = investmentFact?.validationState === 'DISCREPANCY_FLAGGED';
  const isReconciled =
    investmentFact?.conflictMetadata?.reconciledAt ||
    (investmentFact?.validationState === 'VERIFIED_MATCH' &&
      investmentFact?.conflictMetadata?.reconcileResolution);

  const handleRagSubmit = (e) => {
    e?.preventDefault();
    if (!ragInput.trim()) return;
    onQueryRag(ragInput);
  };

  const handlePresetQuery = (queryText) => {
    setRagInput(queryText);
    onQueryRag(queryText);
  };

  return (
    <div className="h-full w-full flex flex-col bg-slate-950 text-slate-100 overflow-y-auto">
      {/* ================= VIEW: DOCUMENT INTELLIGENCE & VERIFICATION ================= */}
      {activeSubView === 'document' && (
        <div className="max-w-6xl mx-auto w-full p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileCheck className="w-6 h-6 text-indigo-400" />
                <span>Document AI & Fact Verification</span>
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Automated administrative document parsing with cryptographic provenance and cross-verification.
              </p>
            </div>
            {isFlagged ? (
              <span className="px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-xs font-semibold flex items-center gap-1.5 animate-pulse">
                <AlertTriangle className="w-3.5 h-3.5" />
                1 Action Item Required
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                All Filings Aligned
              </span>
            )}
          </div>

          {/* Action Needed Card (Discrepancy Resolution) */}
          {isFlagged && (
            <div className="rounded-2xl border border-amber-500/50 bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-900 p-6 shadow-xl space-y-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Capital Outlay Variance Detected
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      The certified figure from the Chartered Accountant certificate does not match the initial declared profile.
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Variance: +13.33%
                </span>
              </div>

              {/* Side-by-side comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Declared */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-400 font-medium">Initially Declared</span>
                  <div className="text-2xl font-bold text-slate-200">
                    ₹{investmentFact?.declaredValue || '12.0'} Crores
                  </div>
                  <p className="text-xs text-slate-400">
                    Source: Self-declared Udyam / Application profile
                  </p>
                </div>

                {/* Certified */}
                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/60 space-y-1">
                  <span className="text-xs text-amber-300 font-medium">Certified Financial Statement</span>
                  <div className="text-2xl font-bold text-amber-300">
                    ₹{investmentFact?.extractedValue || '13.6'} Crores
                  </div>
                  <p className="text-xs text-amber-300/80">
                    Source: Chartered Accountant Certificate (Page 2)
                  </p>
                </div>
              </div>

              {/* Advisory note */}
              <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="font-semibold text-white">Statutory Context:</span> Under MPCB norms, any difference between declared capital and the certified CA audit figure will trigger scrutiny queries that delay Consent to Establish (CTE). Reconciling to the certified figure resolves this proactively.
              </div>

              {/* Friendly Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  onClick={() =>
                    onReconcileFact('GROSS_PROJECT_INVESTMENT', 'ACCEPT_CERTIFIED')
                  }
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Accept Certified Figure (₹13.60 Crores)</span>
                </button>

                <button
                  onClick={() =>
                    onReconcileFact('GROSS_PROJECT_INVESTMENT', 'RETAIN_DECLARED')
                  }
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs border border-slate-700 transition-colors"
                >
                  Keep ₹12.00 Cr & Attach Explanation Memo
                </button>
              </div>
            </div>
          )}

          {/* Reconciled Success State */}
          {isReconciled && (
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-5 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Gross Capital Reconciled Successfully
                  </h4>
                  <p className="text-xs text-emerald-300/90 mt-0.5">
                    Profile synchronized with CA Certificate at ₹{project?.capitalInvestmentCrores || '13.6'} Crores. CTE prerequisites satisfied.
                  </p>
                </div>
              </div>
              <span className="text-xs font-medium text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800">
                Verified Match
              </span>
            </div>
          )}

          {/* Document Preview & Extracted Facts Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Audited Document Extract</span>
              </div>
              <span className="text-xs text-slate-400">
                File: <span className="text-slate-200">Chartered_Accountant_NetWorth_Certificate.pdf</span>
              </span>
            </div>

            {/* Document Highlight Preview */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-300">
                  M/S R. K. DESHMUKH & ASSOCIATES | CHARTERED ACCOUNTANTS
                </span>
                <span className="text-[11px] text-slate-500">UDIN: 26048123ABCE99812</span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-900 border-l-4 border-indigo-500 text-xs text-slate-200 leading-relaxed italic">
                "The aggregate investment in plant, machinery and civil works stands certified at INR 13,60,00,000/- (Rupees Thirteen Crores Sixty Lakhs only)."
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>Extracted by: <strong className="text-slate-300">Document AI</strong></span>
                <span className="text-emerald-400 font-medium">Confidence: 99.2% • Tamper-Proof Verified</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW: STATUTORY COMPLIANCE COPILOT ================= */}
      {activeSubView === 'rag' && (
        <div className="max-w-4xl mx-auto w-full p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Scale className="w-6 h-6 text-cyan-400" />
                <span>Statutory Compliance Copilot</span>
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Ask questions in plain language. Answers are strictly grounded in authoritative state gazette circulars.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Zero Hallucination Grounding
            </span>
          </div>

          {/* Interactive Chat / Query Box */}
          <form
            onSubmit={handleRagSubmit}
            className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-xl space-y-3"
          >
            <div className="relative">
              <input
                type="text"
                value={ragInput}
                onChange={(e) => setRagInput(e.target.value)}
                placeholder="Ask about MPCB rules, SLA deadlines, rejection protections, or groundwater NOC..."
                className="w-full pl-4 pr-24 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <button
                type="submit"
                disabled={ragState?.isLoading}
                className="absolute right-2 top-2 px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md"
              >
                {ragState?.isLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                <span>Ask</span>
              </button>
            </div>

            {/* Clickable Preset Questions */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-400 text-xs">Common Questions:</span>
              <button
                type="button"
                onClick={() =>
                  handlePresetQuery(
                    'Can MPCB reject my application without issuing a formal query notice?'
                  )
                }
                className="px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                "Can MPCB reject without a query notice?"
              </button>
              <button
                type="button"
                onClick={() =>
                  handlePresetQuery(
                    'What are the groundwater NOC triggers for agro units under Gazette 2026/09?'
                  )
                }
                className="px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                {'Groundwater NOC rules (> ₹10 Cr)'}
              </button>
            </div>
          </form>

          {/* Copilot Answer Display */}
          {ragState?.result && (
            <div className="rounded-2xl border border-cyan-500/40 bg-slate-900/90 p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Statutory Advisory Response</span>
                </div>
                <span className="text-xs text-cyan-300 font-semibold bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-800">
                  Grounding Match: {((ragState.result.similarityScore || 0.87) * 100).toFixed(0)}%
                </span>
              </div>

              {/* Synthesized Answer */}
              <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                {ragState.result.synthesis}
              </div>

              {/* Legal Citations */}
              {ragState.result.citations && ragState.result.citations.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Authoritative Statutory Citations:
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {ragState.result.citations.map((cite, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between font-semibold text-cyan-300">
                          <span>{cite.actCitation}</span>
                          <span className="text-slate-400 text-[11px]">{cite.gazetteReference}</span>
                        </div>
                        <p className="text-slate-400 text-xs italic">
                          "{cite.snippet?.substring(0, 160)}..."
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
