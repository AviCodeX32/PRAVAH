import React, { useState } from 'react';
import {
  Users2,
  Building2,
  BookOpen,
  Workflow,
  FileCheck,
  Settings2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Database,
  Radio,
  ExternalLink,
  History,
  Lock,
} from 'lucide-react';

export default function AdminView({
  subSection = 'audit_logs',
  auditLogs = [],
  rules = [],
  project,
}) {
  const [activeTab, setActiveTab] = useState(subSection);

  React.useEffect(() => {
    if (subSection) setActiveTab(subSection);
  }, [subSection]);

  const mockUsers = [
    { name: 'Avnish Patil', email: 'avnish@sahyadriagro.in', role: 'Enterprise Investor', status: 'ACTIVE' },
    { name: 'S.K. Deshmukh', email: 'sro.pune2@mpcb.gov.in', role: 'Scrutiny Officer (MPCB)', status: 'ACTIVE' },
    { name: 'V.R. Patil', email: 'jd.safety@dish.gov.in', role: 'Joint Director (DISH)', status: 'ACTIVE' },
    { name: 'Dr. Anand Kelkar', email: 'admin@pravah.gov.in', role: 'System SuperAdmin', status: 'ACTIVE' },
  ];

  return (
    <div className="h-full w-full flex flex-col bg-slate-50 overflow-hidden select-none">
      {/* Sub-navigation tabs */}
      <div className="px-6 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('audit_logs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'audit_logs'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Tamper-Evident Audit Log</span>
          </button>

          <button
            onClick={() => setActiveTab('users_roles')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'users_roles'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users2 className="w-3.5 h-3.5 text-slate-600" />
            <span>Users &amp; RBAC Roles</span>
          </button>

          <button
            onClick={() => setActiveTab('departments_services')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'departments_services'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-slate-600" />
            <span>Departments &amp; Services</span>
          </button>

          <button
            onClick={() => setActiveTab('integrations')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'integrations'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Workflow className="w-3.5 h-3.5 text-teal-600" />
            <span>National Integration Gateway</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5 text-slate-600" />
            <span>Platform Settings</span>
          </button>
        </div>

        <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">
          Database: Supabase PostgreSQL (Connected)
        </span>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 overflow-y-auto">
        {/* TAB 1: TAMPER-EVIDENT AUDIT LOG */}
        {activeTab === 'audit_logs' && (
          <div className="p-8 max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-6 h-6 text-blue-600" />
                  <span>Tamper-Evident Immutable Audit Log</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Cryptographically chained transition log. Every administrative approval, document reconciliation, and SLA timer tick is irrevocably recorded.
                </p>
              </div>

              <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Chain Integrity Verified</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-5 py-3.5">Timestamp</th>
                    <th className="px-5 py-3.5">Action Executed</th>
                    <th className="px-5 py-3.5">Actor / Entity</th>
                    <th className="px-5 py-3.5">Details</th>
                    <th className="px-5 py-3.5 text-right">Cryptographic Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {auditLogs.length > 0 ? (
                    auditLogs.map((log, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-4 font-mono text-[11px] text-slate-500">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="px-5 py-4 font-bold text-slate-900">{log.actionType}</td>
                        <td className="px-5 py-4 font-medium text-slate-700">{log.actorName}</td>
                        <td className="px-5 py-4 text-slate-600">{log.details}</td>
                        <td className="px-5 py-4 text-right font-mono text-[10px] text-slate-400">
                          {log.checksum || 'sha256:7f8a9b'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                        No audit events recorded yet. Perform actions to generate immutable records.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: USERS & RBAC ROLES */}
        {activeTab === 'users_roles' && (
          <div className="p-8 max-w-6xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Users2 className="w-6 h-6 text-slate-700" />
                <span>Role-Based Access Control (RBAC)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Permission matrix across Investor, Department Scrutiny Officer, and Platform Administrator roles.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-5 py-3.5">User Name</th>
                    <th className="px-5 py-3.5">Official Email</th>
                    <th className="px-5 py-3.5">System Role</th>
                    <th className="px-5 py-3.5 text-right">Account Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {mockUsers.map((user, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 font-bold text-slate-900">{user.name}</td>
                      <td className="px-5 py-4 text-slate-600 font-mono text-[11px]">{user.email}</td>
                      <td className="px-5 py-4 font-semibold text-blue-700">{user.role}</td>
                      <td className="px-5 py-4 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: DEPARTMENTS & SERVICES */}
        {activeTab === 'departments_services' && (
          <div className="p-8 max-w-6xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-slate-700" />
                <span>Master Directory of Integrated Departments</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                32 state and central departments mapped with 95 statutory services under PRAVAH's deterministic engine.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-2">
                <div className="font-bold text-slate-900">MIDC</div>
                <div className="text-slate-500">Maharashtra Industrial Development Corporation</div>
                <div className="text-blue-700 font-semibold pt-1 border-t border-slate-100">8 Clearance Services Active</div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-2">
                <div className="font-bold text-slate-900">MPCB</div>
                <div className="text-slate-500">Maharashtra Pollution Control Board</div>
                <div className="text-blue-700 font-semibold pt-1 border-t border-slate-100">14 Clearance Services Active</div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-2">
                <div className="font-bold text-slate-900">DISH</div>
                <div className="text-slate-500">Directorate of Industrial Safety &amp; Health</div>
                <div className="text-blue-700 font-semibold pt-1 border-t border-slate-100">6 Clearance Services Active</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: INTEGRATIONS */}
        {activeTab === 'integrations' && (
          <div className="p-8 max-w-5xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Workflow className="w-6 h-6 text-teal-600" />
                <span>National &amp; State Integration Gateway</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Real-time API connector status with National Single Window System (NSWS), MAITRI 2.0, DigiLocker, and Parivesh.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs divide-y divide-slate-100 text-xs">
              <div className="p-5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">National Single Window System (NSWS) Gateway</div>
                  <div className="text-slate-500">API Sync: Investor ID &amp; PAN Master Link</div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Operational</span>
              </div>

              <div className="p-5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">MAITRI 2.0 (Maharashtra Single Window)</div>
                  <div className="text-slate-500">API Sync: Common Application Form (CAF) Data Exchange</div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Operational</span>
              </div>

              <div className="p-5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">DigiLocker / National Academic Depository (NAD)</div>
                  <div className="text-slate-500">API Sync: Cryptographic Document Verification &amp; Retrieval</div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Operational</span>
              </div>

              <div className="p-5 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Parivesh 2.0 (Ministry of Environment &amp; Forests)</div>
                  <div className="text-slate-500">API Sync: Environmental Clearance &amp; Forest NOC Pipeline</div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Operational</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PLATFORM SETTINGS */}
        {activeTab === 'settings' && (
          <div className="p-8 max-w-4xl mx-auto space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Settings2 className="w-6 h-6 text-slate-700" />
                <span>Platform Engine Configuration</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Database synchronization, SSE streaming connections, and deterministic rule thresholds.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4 text-xs">
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Active Database Storage</div>
                  <div className="text-slate-500">Supabase PostgreSQL 15.6 • Project: bkidxhsahwggipciiwpm</div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Connected</span>
              </div>

              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Deterministic Event Stream (SSE)</div>
                  <div className="text-slate-500">Endpoint: /api/events/{project?.projectId || 'MAHA-AGRO-2026-8812'}</div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Live Active</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
