import React from 'react';
import PravahLogo from '../common/PravahLogo.jsx';
import {
  LayoutDashboard,
  Layers,
  Building2,
  Wallet,
  Bot,
  Users2,
  CalendarCheck,
  MessageSquareWarning,
  FileCheck,
  Database,
  PanelLeftClose,
  PanelLeftOpen,
  AlertTriangle,
  FolderOpen,
  Workflow,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ShieldAlert,
  BookOpen,
  RotateCcw,
} from 'lucide-react';

import { translations } from '../../locales/translations.js';

export default function AppSidebar({
  currentSection,
  onSelectSection,
  isCollapsed,
  onToggleCollapse,
  userRole = 'investor',
  activeDiscrepancy = false,
  slaRiskTier = 'NOMINAL',
  lang = 'en',
}) {
  const t = translations[lang] || translations.en;

  // 1. Role-Filtered Navigation Definitions
  const investorNav = [
    {
      id: 'dashboard',
      label: t.navDashboard || 'Dashboard & Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'process_nodes',
      label: t.navProcessNodes || 'Process Node Pipeline',
      icon: Layers,
      highlight: true,
      badge: 'Core',
    },
    {
      id: 'department_hub',
      label: t.navDeptHub || 'Department Documents Hub',
      icon: Building2,
      highlight: true,
    },
    {
      id: 'evidence_wallet',
      label: t.navEvidenceWallet || 'Evidence Wallet & Mismatches',
      icon: Wallet,
      badge: activeDiscrepancy ? 'Action Required' : null,
      badgeColor: 'amber',
    },
    {
      id: 'compliance_tracker',
      label: t.navComplianceTracker || 'Post-Approval Compliance Tracker',
      icon: ShieldAlert,
      highlight: true,
      badge: 'Active',
      badgeColor: 'blue',
    },
    {
      id: 'statutory_queries',
      label: t.navLegalCopilot || 'Statutory AI Assistant (RAG)',
      icon: Bot,
      badge: slaRiskTier === 'BREACH_IMMINENT' ? 'SLA Alert' : null,
      badgeColor: 'rose',
    },
    {
      id: 'gazette_base',
      label: t.navGazetteBase || 'Gazette & Statutory Base',
      icon: BookOpen,
    },
    {
      id: 'renewals_schedule',
      label: t.navRenewals || 'Renewals & Expiry Schedule',
      icon: RotateCcw,
    },
  ];

  const officerNav = [
    {
      id: 'officer_queue',
      label: t.navScrutinyQueue || 'Scrutiny Queue (MPCB)',
      icon: Clock,
      badge: '3 Pending',
      badgeColor: 'blue',
      highlight: true,
    },
    {
      id: 'dept_standards',
      label: t.navDeptStandards || 'Department Checklists & Criteria',
      icon: FolderOpen,
    },
    {
      id: 'inspections',
      label: t.navInspections || 'Joint Inspection Scheduler',
      icon: CalendarCheck,
    },
    {
      id: 'rts_queries',
      label: t.navRtsQueries || 'RTS Query & Cure Tracking',
      icon: MessageSquareWarning,
    },
  ];

  const adminNav = [
    {
      id: 'services_catalog',
      label: t.navServicesCatalog || '32 Departments & Services',
      icon: Building2,
    },
    {
      id: 'users_rbac',
      label: t.navUsersRbac || 'Users & RBAC Permissions',
      icon: Users2,
    },
    {
      id: 'audit_ledger',
      label: t.navAuditLedger || 'Tamper-Evident Audit Ledger',
      icon: FileCheck,
      highlight: true,
    },
    {
      id: 'system_health',
      label: t.navSystemHealth || 'Supabase & Gateway Health',
      icon: Database,
    },
  ];

  // Pick active list according to role
  const activeNavItems =
    userRole === 'officer' ? officerNav : userRole === 'admin' ? adminNav : investorNav;

  return (
    <aside
      className={`h-screen flex flex-col bg-white border-r border-slate-200 transition-all duration-300 z-20 shrink-0 select-none ${
        isCollapsed ? 'w-18' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 border-b border-slate-200 flex items-center justify-between">
        <PravahLogo size="sm" showText={!isCollapsed} />
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          title={isCollapsed ? 'Expand Navigation' : 'Collapse Navigation'}
        >
          {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Role Indicator Banner */}
      {!isCollapsed && (
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[10px]">
          <span className="font-bold text-slate-400 uppercase tracking-wider">Active Portal:</span>
          <span
            className={`font-bold px-2 py-0.5 rounded-full ${
              userRole === 'officer'
                ? 'bg-emerald-100 text-emerald-800'
                : userRole === 'admin'
                ? 'bg-slate-200 text-slate-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {userRole === 'officer'
              ? t.roleOfficer || 'Scrutiny Officer'
              : userRole === 'admin'
              ? t.roleAdmin || 'Platform Admin'
              : t.roleInvestor || 'Enterprise Investor'}
          </span>
        </div>
      )}

      {/* Navigation Links Scroll Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {activeNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-50 text-blue-900 font-bold border-l-4 border-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive
                      ? 'text-blue-600'
                      : item.highlight
                      ? 'text-teal-600'
                      : 'text-slate-400'
                  }`}
                />
                {!isCollapsed && (
                  <span className="truncate text-left">{item.label}</span>
                )}
              </div>

              {!isCollapsed && item.badge && (
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    item.badgeColor === 'amber'
                      ? 'bg-amber-100 text-amber-800'
                      : item.badgeColor === 'rose'
                      ? 'bg-rose-100 text-rose-800 animate-pulse'
                      : item.badgeColor === 'blue'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Footer Info */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 text-[10px] text-slate-500 flex items-center justify-between">
        {!isCollapsed ? (
          <div>
            <div className="font-semibold text-slate-700">GovTech Single Window Engine</div>
            <div className="text-slate-400">Connected: Supabase Cloud</div>
          </div>
        ) : (
          <span className="w-2 h-2 rounded-full bg-emerald-500 mx-auto" />
        )}
      </div>
    </aside>
  );
}
