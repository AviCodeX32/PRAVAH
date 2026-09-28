import React, { useState } from 'react';
import {
  Compass,
  Milestone,
  FileSpreadsheet,
  CheckSquare,
  Network,
  Building2,
  CheckCircle2,
  Clock,
  Lock,
  ArrowRight,
  ExternalLink,
  Filter,
  Search,
  Sparkles,
  FileText,
  AlertCircle,
  HelpCircle,
  Shield,
  Layers,
  Check,
} from 'lucide-react';
import RegulatoryDagView from '../components/RegulatoryDagView.jsx';

export default function ApprovalsView({
  subSection = 'dependency_graph',
  project,
  graph,
  onApproveNode,
  onNavigate,
}) {
  const [activeTab, setActiveTab] = useState(subSection);
  const [filterDept, setFilterDept] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Synchronize with parent subSection prop
  React.useEffect(() => {
    if (subSection) setActiveTab(subSection);
  }, [subSection]);

  const rawNodes = graph?.nodes || [];

  const filteredNodes = rawNodes.filter((node) => {
    const matchesDept = filterDept === 'ALL' || node.departmentName?.toLowerCase().includes(filterDept.toLowerCase());
    const matchesSearch =
      !searchQuery ||
      node.approvalName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.approvalCode?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="h-full w-full flex flex-col bg-slate-50 overflow-hidden select-none">
      {/* Sub-navigation tabs */}
      <div className="px-6 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dependency_graph')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'dependency_graph'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Network className="w-3.5 h-3.5 text-blue-600" />
            <span>Interactive DAG Graph</span>
          </button>

          <button
            onClick={() => setActiveTab('approval_roadmap')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'approval_roadmap'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Milestone className="w-3.5 h-3.5 text-blue-600" />
            <span>Approval Roadmap (Phases)</span>
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'applications'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
            <span>Applications Queue</span>
          </button>

          <button
            onClick={() => setActiveTab('discover_approvals')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'discover_approvals'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-teal-600" />
            <span>Approval Discovery Wizard</span>
          </button>

          <button
            onClick={() => setActiveTab('project_profile')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'project_profile'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-slate-600" />
            <span>Project Profile</span>
          </button>
        </div>

        <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">
          {rawNodes.length} Statutory Clearances Monitored
        </span>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 overflow-y-auto">
        {/* TAB 1: INTERACTIVE DAG GRAPH */}
        {activeTab === 'dependency_graph' && (
          <div className="h-full w-full">
            <RegulatoryDagView graph={graph} onApproveNode={onApproveNode} />
          </div>
        )}

        {/* TAB 2: PHASED APPROVAL ROADMAP */}
        {activeTab === 'approval_roadmap' && (
          <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Milestone className="w-6 h-6 text-blue-600" />
                  <span>Phased Regulatory Roadmap</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Sequential and parallel milestones guiding your facility from land possession to commercial COD.
                </p>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
                Total Statutory Cycle: <span className="text-blue-700 font-bold">{graph?.criticalPathDays || 120} Days</span>
              </div>
            </div>

            {/* Phased Timeline */}
            <div className="space-y-6">
              {/* Phase 1 */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">
                      Phase 1: Land Acquisition & Industrial Plot Allocation
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Completed
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900">MIDC Land Possession & Allotment Order</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">Plot No. B-42, Chakan Industrial Area Phase II, Pune</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  </div>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">
                      Phase 2: Pre-Establishment Clearances (Parallel Processing)
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    In Progress (3 Clearances)
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {rawNodes
                    .filter((n) => ['MPCB_CTE', 'DISHER_LABOUR_REG', 'FIRE_NOC'].includes(n.approvalCode))
                    .map((node) => (
                      <div key={node.approvalCode} className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
                        <div className="flex items-start justify-between">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">{node.departmentName.split(' ')[0]}</span>
                          {node.status === 'APPROVED' ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Approved</span>
                          ) : (
                            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded animate-pulse">Actionable</span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">{node.approvalName}</h4>
                        <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 flex justify-between">
                          <span>SLA: {node.statutorySlaDays}d</span>
                          <span>Parallel: Allowed</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Phase 3 */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                      3
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">
                      Phase 3: Utility Connections & Statutory Building Approvals
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                    Awaiting Phase 2
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rawNodes
                    .filter((n) => ['MSEDCL_POWER_SANCTION', 'DISHER_FACTORY_PLAN', 'GROUNDWATER_NOC'].includes(n.approvalCode))
                    .map((node) => (
                      <div key={node.approvalCode} className="p-4 rounded-lg bg-slate-50/60 border border-slate-200 space-y-2">
                        <div className="flex items-start justify-between">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">{node.departmentName.split(' ')[0]}</span>
                          <span className="text-[10px] font-medium text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                            {node.status}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">{node.approvalName}</h4>
                        <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200 flex justify-between">
                          <span>SLA: {node.statutorySlaDays}d</span>
                          <span className="text-slate-400">Prereq: Phase 2 Clearances</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: APPLICATIONS QUEUE */}
        {activeTab === 'applications' && (
          <div className="p-8 max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <FileSpreadsheet className="w-6 h-6 text-blue-600" />
                  <span>Statutory Applications Queue</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Unified scrutiny queue for all departmental clearances, applications, and e-signatures.
                </p>
              </div>

              {/* Filter and Search */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search clearances..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <select
                  value={filterDept}
                  onChange={(e) => setFilterDept(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="ALL">All Departments</option>
                  <option value="MIDC">MIDC</option>
                  <option value="MPCB">MPCB</option>
                  <option value="DISH">DISH / Labour</option>
                  <option value="FIRE">Fire & Rescue</option>
                  <option value="MSEDCL">MSEDCL Power</option>
                </select>
              </div>
            </div>

            {/* Applications Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-5 py-3.5">Approval Service</th>
                    <th className="px-5 py-3.5">Department</th>
                    <th className="px-5 py-3.5">Statutory SLA</th>
                    <th className="px-5 py-3.5">Current Status</th>
                    <th className="px-5 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredNodes.map((node) => {
                    const isApproved = node.status === 'APPROVED';
                    const isReady = node.status === 'READY_TO_APPLY';
                    const isBlocked = node.status === 'BLOCKED';

                    return (
                      <tr key={node.approvalCode} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900">{node.approvalName}</div>
                          <div className="text-[10px] font-mono text-slate-400 mt-0.5">{node.approvalCode}</div>
                        </td>
                        <td className="px-5 py-4 font-medium text-slate-600">{node.departmentName}</td>
                        <td className="px-5 py-4">
                          <div className="font-semibold text-slate-800">{node.statutorySlaDays} Days</div>
                          <div className="text-[10px] text-slate-400">Maharashtra RTS Act</div>
                        </td>
                        <td className="px-5 py-4">
                          {isApproved && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Approved
                            </span>
                          )}
                          {isReady && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300">
                              <Clock className="w-3 h-3 text-blue-600" />
                              Ready to Apply
                            </span>
                          )}
                          {isBlocked && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-500 border border-slate-200">
                              <Lock className="w-3 h-3 text-slate-400" />
                              Pending Upstream
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          {isReady && (
                            <button
                              onClick={() => onApproveNode(node.approvalCode)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                            >
                              Approve Node
                            </button>
                          )}
                          {isApproved && (
                            <span className="text-[11px] text-emerald-700 font-semibold flex items-center justify-end gap-1">
                              <Check className="w-3.5 h-3.5" /> Order Issued
                            </span>
                          )}
                          {isBlocked && (
                            <span className="text-[11px] text-slate-400 italic">Locked</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: APPROVAL DISCOVERY WIZARD */}
        {activeTab === 'discover_approvals' && (
          <div className="p-8 max-w-4xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Compass className="w-6 h-6 text-teal-600" />
                <span>Statutory Approval Discovery Wizard</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Answer 4 structured questions about your industrial plant. PRAVAH's deterministic rule engine calculates every mandatory license, department, and parallel path.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">1. Industrial Sector & Sub-Category</label>
                  <select
                    defaultValue="Agro and Food Processing"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option>Agro and Food Processing</option>
                    <option>Automotive & Heavy Engineering</option>
                    <option>Chemicals & Petrochemicals</option>
                    <option>Pharmaceuticals & Active Ingredients</option>
                    <option>Textiles & Synthetic Weaving</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">2. Gross Capital Investment</label>
                  <select
                    defaultValue="Between ₹10 Cr and ₹50 Cr (Medium Enterprise)"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option>Less than ₹10 Cr (Small Enterprise)</option>
                    <option>Between ₹10 Cr and ₹50 Cr (Medium Enterprise)</option>
                    <option>Between ₹50 Cr and ₹250 Cr (Large Enterprise)</option>
                    <option>Above ₹250 Cr (Mega Industrial Project)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">3. Land Type & Location</label>
                  <select
                    defaultValue="MIDC Designated Industrial Zone"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option>MIDC Designated Industrial Zone</option>
                    <option>Private Non-Agricultural (NA) Land</option>
                    <option>Agricultural Land requiring 44A Conversion</option>
                    <option>Special Economic Zone (SEZ)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">4. Utility Requirements</label>
                  <select
                    defaultValue="High Power (>500 kVA) + Groundwater Extraction"
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option>High Power (&gt;500 kVA) + Groundwater Extraction</option>
                    <option>Standard Power (&lt;500 kVA) + MIDC Piped Water</option>
                    <option>Extra High Voltage (EHV 33kV+) Substation</option>
                  </select>
                </div>
              </div>

              {/* Discovery Output Summary */}
              <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-700" />
                    <span className="text-xs font-bold text-teal-900">Deterministic Engine Output: 6 Mandatory Statutory Clearances</span>
                  </div>
                  <span className="text-xs font-bold text-teal-800">SLA: 120 Days Maximum</span>
                </div>
                <p className="text-xs text-teal-800 leading-relaxed">
                  Based on Maharashtra Industrial Policy 2019, Water (Prevention & Control of Pollution) Act 1974, and Maharashtra Factories Rules 1963, your plant qualifies for concurrent parallel processing of MPCB Consent to Establish, Labour Registration, and Fire NOC upon land allocation.
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={() => setActiveTab('dependency_graph')}
                    className="px-3.5 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <span>Load Mapped DAG Graph</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PROJECT PROFILE */}
        {activeTab === 'project_profile' && (
          <div className="p-8 max-w-4xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-slate-700" />
                <span>Enterprise Project Master Profile</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Statutory industrial parameters registered under Single Business ID (MAHA-AGRO-2026-8812).
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500">Facility Legal Name:</span>
                  <div className="font-bold text-slate-900 mt-1 text-sm">{project?.projectName || 'Sahyadri Agro-Processing Facility'}</div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500">Corporate Single ID:</span>
                  <div className="font-mono font-bold text-blue-700 mt-1 text-sm">{project?.projectId || 'MAHA-AGRO-2026-8812'}</div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500">Statutory Health Index:</span>
                  <div className="font-bold text-emerald-600 mt-1 text-sm">{project?.globalHealthScore || 92}% Compliance Rate</div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500">MIDC Plot Coordinates:</span>
                  <div className="font-semibold text-slate-800 mt-1">Plot No. B-42, Chakan Phase II, Pune</div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500">NIC Sector Code:</span>
                  <div className="font-semibold text-slate-800 mt-1">1030 (Processing of fruits & vegetables)</div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500">Industrial Category:</span>
                  <div className="font-semibold text-amber-700 mt-1">Orange Category (MPCB Classification)</div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500">Gross Project Capital:</span>
                  <div className="font-bold text-slate-900 mt-1">₹12.00 Crores (Initial Declaration)</div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500">Connected Power Load:</span>
                  <div className="font-semibold text-slate-800 mt-1">450 kVA (MSEDCL High Tension)</div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-slate-500">Water Consumption:</span>
                  <div className="font-semibold text-slate-800 mt-1">125 Kilo-Litres / Day (KLD)</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
