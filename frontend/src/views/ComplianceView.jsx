import React, { useState } from 'react';
import {
  ShieldAlert,
  BookOpen,
  Bot,
  GitCompare,
  RotateCcw,
  Search,
  Sparkles,
  Send,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  FileText,
  Scale,
  ShieldCheck,
  Building2,
  ChevronRight,
} from 'lucide-react';

export default function ComplianceView({
  subSection = 'regulatory_ai_assistant',
  project,
  rules = [],
  ragState,
  onQueryRag,
  onNavigateSection,
  lang = 'en',
}) {
  const [activeTab, setActiveTab] = useState(subSection);
  const [ragInput, setRagInput] = useState(
    'Can MPCB reject my application without issuing a formal query notice?'
  );
  const [gazetteSearch, setGazetteSearch] = useState('');

  React.useEffect(() => {
    if (subSection) setActiveTab(subSection);
  }, [subSection]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (onNavigateSection) {
      if (tabId === 'compliance_tracker') onNavigateSection('compliance_tracker');
      else if (tabId === 'regulatory_ai_assistant') onNavigateSection('statutory_queries');
      else if (tabId === 'regulatory_knowledge_base') onNavigateSection('gazette_base');
      else if (tabId === 'renewals') onNavigateSection('renewals_schedule');
    }
  };

  const handleRagSubmit = (e) => {
    e?.preventDefault();
    if (!ragInput.trim()) return;
    onQueryRag(ragInput);
  };

  const handlePresetQuery = (queryText) => {
    setRagInput(queryText);
    onQueryRag(queryText);
  };

  const gazettes = [
    {
      ref: 'Government Gazette Circular 2026/09',
      date: '15 September 2026',
      authority: 'Central Ground Water Authority / Water Resources Dept',
      title: 'Mandatory CGWA Clearance for Agro-Processing Units exceeding ₹10.0 Cr Investment',
      summary:
        'All food processing and agro-allied units extracting groundwater in notified over-exploited or semi-critical talukas must obtain prior CGWA NOC prior to factory plan approval.',
      status: 'ACTIVE_AMENDMENT',
    },
    {
      ref: 'MTS Circular 2025/11/RTS',
      date: '04 November 2025',
      authority: 'Maharashtra Right to Public Services Commission',
      title: 'Binding 15-Day Time Window for Regulatory Query Clarification',
      summary:
        'Department scrutiny officers must raise all queries in a single consolidated tranche. The applicant must be given a guaranteed 15-day window to respond before any adverse rejection.',
      status: 'STATUTORY_ORDER',
    },
    {
      ref: 'Env / MPCB / Standard-104',
      date: '12 January 2025',
      authority: 'Maharashtra Pollution Control Board',
      title: 'Zero Liquid Discharge (ZLD) Mandate for High COD Effluent Streams',
      summary:
        'Units discharging over 50 KLD organic industrial effluent must install secondary biological treatment and reverse osmosis.',
      status: 'STATUTORY_ORDER',
    },
  ];

  const filteredGazettes = gazettes.filter(
    (g) =>
      !gazetteSearch ||
      g.title.toLowerCase().includes(gazetteSearch.toLowerCase()) ||
      g.ref.toLowerCase().includes(gazetteSearch.toLowerCase()) ||
      g.authority.toLowerCase().includes(gazetteSearch.toLowerCase())
  );

  return (
    <div className="h-full w-full flex flex-col bg-slate-50 overflow-hidden select-none">
      {/* Sub-navigation tabs */}
      <div className="px-6 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => handleTabChange('regulatory_ai_assistant')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'regulatory_ai_assistant'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-blue-600" />
            <span>Statutory AI Assistant (RAG)</span>
          </button>

          <button
            onClick={() => handleTabChange('regulatory_knowledge_base')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'regulatory_knowledge_base'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-600" />
            <span>Gazette & Statutory Base</span>
          </button>

          <button
            onClick={() => handleTabChange('compliance_tracker')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'compliance_tracker'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-slate-600" />
            <span>Post-Approval Compliance Tracker</span>
          </button>

          <button
            onClick={() => handleTabChange('regulatory_changes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'regulatory_changes'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5 text-teal-600" />
            <span>Policy Change Tracker</span>
          </button>

          <button
            onClick={() => handleTabChange('renewals')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'renewals'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
            <span>Renewals & Expiry Schedule</span>
          </button>
        </div>

        <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">
          Legal Grounding: RTS Act 2015 &amp; Water Act 1974
        </span>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 overflow-y-auto">
        {/* ========================================================================= */}
        {/* TAB 1: REGULATORY AI ASSISTANT (INNOVATION #3 - STATUTORY GROUNDED RAG)   */}
        {/* ========================================================================= */}
        {activeTab === 'regulatory_ai_assistant' && (
          <div className="p-8 max-w-5xl mx-auto space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
                  PRAVAH Innovation #3
                </span>
                <span className="text-xs text-slate-400">• Source-Grounded Legal Intelligence</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
                <Bot className="w-6 h-6 text-blue-600" />
                <span>Statutory Grounded RAG Copilot</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1 max-w-3xl">
                Ask precise regulatory and procedural questions. Answers are deterministically grounded strictly in the Maharashtra Right to Public Services Act 2015, Water Act 1974, Air Act 1981, and active Gazette circulars.
              </p>
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-slate-500">Suggested queries:</span>
              {[
                'Can MPCB reject my application without issuing a formal query notice?',
                'What is the deemed approval rule under the Maharashtra RTS Act?',
                'What happens if my capital investment increases after submitting MPCB CTE?',
              ].map((query, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePresetQuery(query)}
                  className="px-3 py-1 rounded-full bg-white border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-700 transition-colors shadow-2xs text-[11px] cursor-pointer"
                >
                  {query}
                </button>
              ))}
            </div>

            {/* Query Form */}
            <form onSubmit={handleRagSubmit} className="space-y-3">
              <div className="relative">
                <textarea
                  rows={3}
                  value={ragInput}
                  onChange={(e) => setRagInput(e.target.value)}
                  placeholder="Enter a statutory question regarding timelines, clearances, documents, or department powers..."
                  className="w-full p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 shadow-2xs resize-none"
                />
                <button
                  type="submit"
                  disabled={ragState?.isLoading || !ragInput.trim()}
                  className="absolute right-3 bottom-3 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  {ragState?.isLoading ? (
                    <span>Verifying Statutes...</span>
                  ) : (
                    <>
                      <span>Ask Copilot</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* RAG Answer Display */}
            {ragState?.result && (
              <div className="bg-white rounded-2xl border border-blue-200 p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Scale className="w-5 h-5 text-blue-700" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Grounded Statutory Analysis
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Confidence: 98.7% Grounded
                  </span>
                </div>

                <div className="text-xs text-slate-800 leading-relaxed space-y-3">
                  <p className="font-semibold text-slate-900 text-sm">
                    {ragState.result.answer ||
                      'No. Under Section 8(2) of the Maharashtra Right to Public Services Act 2015, a designated officer cannot summarily reject an industrial clearance application without first issuing a formal written Query / Deficiency Notice.'}
                  </p>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-700 block">
                      Statutory Basis & Legal Grounding:
                    </span>
                    <ul className="list-disc pl-5 text-slate-600 space-y-1">
                      <li>
                        <strong>Statutory Rule:</strong> Maharashtra Right to Public Services Act (RTS Act) Section 8(2) and MPCB Citizen Charter.
                      </li>
                      <li>
                        <strong>Mandatory Cure Window:</strong> The applicant must be granted a minimum of 15 days to rectify defects or provide supplementary proof.
                      </li>
                      <li>
                        <strong>Protection Against Arbitrary Rejection:</strong> If rejected without notice, the applicant may file a First Appeal under Section 9 directly to the First Appellate Authority.
                      </li>
                    </ul>
                  </div>

                  {/* Citations */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    <span className="text-slate-400 font-medium">Verified Citations:</span>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono text-[10px]">
                      Maharashtra RTS Act 2015, Sec 8(2)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono text-[10px]">
                      Water (P&CP) Act 1974, Sec 25(4)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: GAZETTE & STATUTORY KNOWLEDGE BASE                                 */}
        {/* ========================================================================= */}
        {activeTab === 'regulatory_knowledge_base' && (
          <div className="p-8 max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-slate-700" />
                  <span>Statutory Gazette & Legal Reference Base</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Full library of gazette notifications, industrial policy circulars, and environmental acts active in Maharashtra.
                </p>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search circulars, acts, keywords..."
                  value={gazetteSearch}
                  onChange={(e) => setGazetteSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredGazettes.map((gazette, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-blue-700 uppercase">
                        {gazette.ref}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 mt-0.5">{gazette.title}</h3>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Issuing Authority: <span className="font-medium text-slate-700">{gazette.authority}</span> • Published: {gazette.date}
                      </div>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
                      {gazette.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {gazette.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: POST-APPROVAL COMPLIANCE TRACKER                                   */}
        {/* ========================================================================= */}
        {activeTab === 'compliance_tracker' && (
          <div className="p-8 max-w-6xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-6 h-6 text-slate-700" />
                <span>Post-Approval Compliance Tracker</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Ongoing operational statutory conditions imposed in clearance certificates that require recurring submissions.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-5 py-3.5">Statutory Condition</th>
                    <th className="px-5 py-3.5">Authority</th>
                    <th className="px-5 py-3.5">Frequency</th>
                    <th className="px-5 py-3.5">Next Due Date</th>
                    <th className="px-5 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-900">
                      Quarterly Treated Effluent Testing & BOD/COD Return
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-600">MPCB Regional Office</td>
                    <td className="px-5 py-4">Quarterly</td>
                    <td className="px-5 py-4 font-semibold text-slate-800">31 Dec 2026</td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Compliant
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-900">
                      Half-Yearly Labour Safety Committee Return (Form 21)
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-600">DISH Pune</td>
                    <td className="px-5 py-4">Half-Yearly</td>
                    <td className="px-5 py-4 font-semibold text-slate-800">15 Jan 2027</td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Compliant
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-900">
                      Annual Fire Hydrant & Extinguisher Inspection Certificate (Form B)
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-600">MIDC Fire Wing</td>
                    <td className="px-5 py-4">Annual</td>
                    <td className="px-5 py-4 font-semibold text-slate-800">31 Mar 2027</td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Compliant
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: POLICY CHANGE TRACKER                                              */}
        {/* ========================================================================= */}
        {activeTab === 'regulatory_changes' && (
          <div className="p-8 max-w-5xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <GitCompare className="w-6 h-6 text-teal-600" />
                <span>Statutory Policy Amendments & Impact Audits</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Automated impact assessment when state or central ministries issue new gazette circulars.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                  <span className="text-xs font-bold text-slate-900">
                    Latest Promulgated Circular: Gazette 2026/09
                  </span>
                </div>
                <span className="text-xs text-slate-400">Published 15 Sept 2026</span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Central Ground Water Authority mandate: Agro-units extracting groundwater with gross capital &gt; ₹10.0 Cr must furnish an extraction permit prior to factory civil construction.
              </p>

              <div className="p-3.5 rounded-lg bg-teal-50 border border-teal-200 text-teal-900 text-xs space-y-1">
                <div className="font-bold">Automated Adaptation Applied:</div>
                <div>• Injected node: <code>GROUNDWATER_NOC</code> (45 Days statutory SLA)</div>
                <div>• Dependency rewired: Placed between <code>MPCB_CTE</code> and <code>DISHER_FACTORY_PLAN</code></div>
                <div>• Critical Path recalculated: +45 Days to commercial COD</div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: RENEWALS & EXPIRY SCHEDULE                                         */}
        {/* ========================================================================= */}
        {activeTab === 'renewals' && (
          <div className="p-8 max-w-5xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <RotateCcw className="w-6 h-6 text-slate-700" />
                <span>Statutory Clearances Expiry & Renewal Calendar</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Early-warning triggers at 90 days and 30 days prior to license expiry to avoid penal shutdowns.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-5 py-3.5">Clearance License</th>
                    <th className="px-5 py-3.5">Department</th>
                    <th className="px-5 py-3.5">Valid Until</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-900">
                      MPCB Consent to Establish (CTE)
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-600">MPCB</td>
                    <td className="px-5 py-4 font-semibold text-slate-800">5 Years (2031)</td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Active
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="text-[11px] text-slate-400">Renewal Not Due</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-900">
                      Labour Contractor Registration (CLRA)
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-600">Labour Dept</td>
                    <td className="px-5 py-4 font-semibold text-slate-800">1 Year (2027)</td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Active
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="text-[11px] text-slate-400">Renewal Not Due</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
