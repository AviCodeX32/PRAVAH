import React, { useState } from 'react';
import PravahLogo from '../common/PravahLogo.jsx';
import {
  LayoutDashboard,
  FolderGit2,
  Bell,
  Building2,
  Compass,
  Milestone,
  FileSpreadsheet,
  CheckSquare,
  Network,
  FolderOpen,
  ListChecks,
  Wallet,
  FileSearch,
  AlertTriangle,
  ShieldAlert,
  BookOpen,
  Bot,
  GitCompare,
  RotateCcw,
  Workflow,
  Clock,
  CalendarCheck,
  MessageSquareWarning,
  Flame,
  Layers,
  Sparkles,
  TrendingDown,
  Cpu,
  BarChart3,
  Users2,
  Building,
  Settings2,
  Radio,
  FileCheck,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

export default function AppSidebar({
  currentSection,
  onSelectSection,
  isCollapsed,
  onToggleCollapse,
  activeDiscrepancy = false,
  slaRiskTier = 'NOMINAL',
}) {
  const [openGroups, setOpenGroups] = useState({
    overview: true,
    approvals: true,
    documents: true,
    compliance: false,
    workflow: false,
    intelligence: true,
    analytics: false,
    admin: false,
  });

  const toggleGroup = (key) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const navGroups = [
    {
      id: 'overview',
      title: '1. OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'my_projects', label: 'My Projects', icon: FolderGit2 },
        { id: 'notifications', label: 'Notifications', icon: Bell, badge: '3' },
      ],
    },
    {
      id: 'approvals',
      title: '2. PROJECT & APPROVALS',
      items: [
        { id: 'project_profile', label: 'Project Profile', icon: Building2 },
        { id: 'discover_approvals', label: 'Discover Approvals', icon: Compass },
        { id: 'approval_roadmap', label: 'Approval Roadmap', icon: Milestone },
        { id: 'applications', label: 'Applications Queue', icon: FileSpreadsheet },
        { id: 'approval_tracking', label: 'Approval Tracking', icon: CheckSquare },
        { id: 'dependency_graph', label: 'Dependency Graph (DAG)', icon: Network, highlight: true },
      ],
    },
    {
      id: 'documents',
      title: '3. DOCUMENTS & EVIDENCE',
      items: [
        { id: 'document_repository', label: 'Document Repository', icon: FolderOpen },
        { id: 'document_checklist', label: 'Document Checklist', icon: ListChecks },
        { id: 'evidence_wallet', label: 'Evidence Wallet', icon: Wallet, highlight: true },
        { id: 'document_intelligence', label: 'Document Intelligence', icon: FileSearch, highlight: true },
        {
          id: 'verification_mismatches',
          label: 'Verification & Mismatches',
          icon: AlertTriangle,
          badge: activeDiscrepancy ? 'Action Required' : null,
          badgeColor: 'amber',
        },
      ],
    },
    {
      id: 'compliance',
      title: '4. COMPLIANCE & REGULATIONS',
      items: [
        { id: 'compliance_tracker', label: 'Compliance Tracker', icon: ShieldAlert },
        { id: 'regulatory_knowledge_base', label: 'Regulatory Knowledge Base', icon: BookOpen },
        { id: 'regulatory_ai_assistant', label: 'Regulatory AI Assistant', icon: Bot, highlight: true },
        { id: 'regulatory_changes', label: 'Regulatory Changes', icon: GitCompare },
        { id: 'renewals', label: 'Renewals & Expiry', icon: RotateCcw },
      ],
    },
    {
      id: 'workflow',
      title: '5. WORKFLOW & MONITORING',
      items: [
        { id: 'workflow_management', label: 'Workflow Management', icon: Workflow, highlight: true },
        {
          id: 'sla_guardian',
          label: 'SLA Guardian',
          icon: Clock,
          highlight: true,
          badge: slaRiskTier === 'BREACH_IMMINENT' ? 'Critical' : null,
          badgeColor: 'red',
        },
        { id: 'inspections', label: 'Joint Inspections', icon: CalendarCheck },
        { id: 'queries_grievances', label: 'Queries & RTS Notice', icon: MessageSquareWarning },
        { id: 'escalations', label: 'Escalations Matrix', icon: Flame },
        { id: 'critical_path', label: 'Critical Path Monitor', icon: Layers, highlight: true },
      ],
    },
    {
      id: 'intelligence',
      title: '6. PRAVAH INTELLIGENCE',
      items: [
        { id: 'risk_predictions', label: 'Risk Predictions', icon: TrendingDown },
        { id: 'bottleneck_intelligence', label: 'Bottleneck Intelligence', icon: Sparkles, highlight: true },
        { id: 'regulatory_digital_twin', label: 'Regulatory Digital Twin', icon: Cpu, highlight: true },
        { id: 'change_impact_analysis', label: 'Change Impact Analysis', icon: Radio, highlight: true },
        { id: 'ai_copilot', label: 'AI Next-Action Copilot', icon: Bot, highlight: true },
      ],
    },
    {
      id: 'analytics',
      title: '7. ANALYTICS & REPORTS',
      items: [
        { id: 'investor_analytics', label: 'Investor Analytics', icon: BarChart3 },
        { id: 'officer_command_center', label: 'Officer Command Center', icon: Users2 },
        { id: 'department_performance', label: 'Department Performance', icon: Building },
        { id: 'reports', label: 'Statutory Reports', icon: FileCheck },
      ],
    },
    {
      id: 'admin',
      title: '8. ADMINISTRATION',
      items: [
        { id: 'users_roles', label: 'Users & RBAC Roles', icon: Users2 },
        { id: 'departments_services', label: 'Departments & Services', icon: Building2 },
        { id: 'rules_regulations', label: 'Rules & Gazette Base', icon: BookOpen },
        { id: 'integrations', label: 'Integration Gateway', icon: Workflow },
        { id: 'audit_logs', label: 'Tamper-Evident Audit Log', icon: FileCheck },
        { id: 'settings', label: 'Platform Settings', icon: Settings2 },
      ],
    },
  ];

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
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title={isCollapsed ? 'Expand Navigation' : 'Collapse Navigation'}
        >
          {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {navGroups.map((group) => {
          const isOpen = openGroups[group.id] || isCollapsed;

          return (
            <div key={group.id} className="space-y-1">
              {!isCollapsed && (
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-bold tracking-wider text-slate-400 hover:text-slate-700 uppercase"
                >
                  <span>{group.title}</span>
                  {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>
              )}

              {isOpen && (
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentSection === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => onSelectSection(item.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-blue-50 text-blue-900 font-semibold border-l-3 border-blue-600 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                        title={isCollapsed ? item.label : undefined}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
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
                                : item.badgeColor === 'red'
                                ? 'bg-red-100 text-red-800 animate-pulse'
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
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 text-[10px] text-slate-500 flex items-center justify-between">
        {!isCollapsed ? (
          <div>
            <div className="font-semibold text-slate-700">GovTech Regulatory Engine</div>
            <div>Connected: Supabase PostgreSQL</div>
          </div>
        ) : (
          <span className="w-2 h-2 rounded-full bg-emerald-500 mx-auto" />
        )}
      </div>
    </aside>
  );
}
