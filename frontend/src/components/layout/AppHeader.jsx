import React, { useState } from 'react';
import {
  Search,
  Building2,
  Bell,
  CheckCircle2,
  ChevronDown,
  User,
  LogOut,
  X,
  Globe,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { translations } from '../../locales/translations.js';

export default function AppHeader({
  project,
  currentUser,
  onSignOut,
  lang = 'en',
  onSelectLang,
}) {
  const t = translations[lang] || translations.en;
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'MPCB Scrutiny Underway',
      desc: 'Consent to Establish (CTE) application is under active review by Sub-Regional Officer Pune II.',
      time: '10m ago',
      read: false,
    },
    {
      id: 2,
      title: 'Discrepancy Flagged in CA Certificate',
      desc: 'Certified capital outlay is ₹13.60 Cr vs initial ₹12.00 Cr. Variance resolution requested.',
      time: '1h ago',
      read: false,
    },
    {
      id: 3,
      title: 'Synchronized Joint Inspection',
      desc: 'Combined site visit scheduled with MPCB, DISH, and Fire Services for 12 October 2026.',
      time: '1d ago',
      read: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const userRole = currentUser?.role || 'investor';

  return (
    <header className="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between z-20 shrink-0 select-none relative">
      {/* 1. Left: Active Enterprise Identifier */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowProjectModal(true)}
          className="flex items-center gap-3 p-1.5 -ml-1.5 rounded-xl hover:bg-slate-100 transition-colors text-left cursor-pointer group"
          title="Click to view Project Profile and Single Business ID"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                {currentUser?.companyName || project?.projectName || 'Industrial Facility'}
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.2 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {project?.projectId || 'MAHA-AGRO-2026-8812'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500">
              {project?.district || 'Pune'}, Maharashtra • {project?.industrySector || 'Food Processing'}
            </p>
          </div>
        </button>
      </div>

      {/* 2. Center: Clean Search Bar */}
      <div className="flex-1 max-w-md mx-8 hidden md:block">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search clearances, documents, gazette notifications..."
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-2xs"
          />
        </div>
      </div>

      {/* 3. Right: Language Selector, Notifications, & Secure Profile Popover */}
      <div className="flex items-center gap-3">
        {/* Language Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 text-xs font-medium">
          <Globe className="w-3.5 h-3.5 text-slate-500" />
          <button
            onClick={() => onSelectLang('en')}
            className={`px-1 rounded cursor-pointer ${
              lang === 'en' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            EN
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={() => onSelectLang('mr')}
            className={`px-1 rounded cursor-pointer ${
              lang === 'mr' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            मराठी
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={() => onSelectLang('hi')}
            className={`px-1 rounded cursor-pointer ${
              lang === 'hi' ? 'bg-white text-slate-900 font-bold shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            हिंदी
          </button>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative cursor-pointer"
            title="Statutory Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-xl p-4 z-50 space-y-3 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">Statutory Notifications</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[10px] font-semibold text-blue-700 hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 rounded-xl border text-xs space-y-1 transition-colors ${
                      n.read ? 'bg-slate-50 border-slate-100' : 'bg-blue-50/50 border-blue-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 to-teal-700 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {currentUser?.name
                ? currentUser.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()
                : 'U'}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {currentUser?.name || 'Registered User'}
              </div>
              <div className="text-[10px] text-slate-500 flex items-center gap-1">
                <span className="font-medium text-slate-700 truncate max-w-[130px]">
                  {currentUser?.companyName || 'Enterprise'}
                </span>
                <span>•</span>
                <span className="capitalize text-blue-700 font-semibold">{userRole}</span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Profile Dropdown Menu - Clean, Secure, NO Switch Role! */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-slate-200 shadow-xl p-4 z-50 space-y-3 animate-in fade-in zoom-in-95 duration-150">
              <div className="border-b border-slate-100 pb-3">
                <div className="text-xs font-bold text-slate-900">{currentUser?.name}</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">{currentUser?.email}</div>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  <span className="capitalize">
                    {userRole === 'investor' ? t.roleInvestor : userRole === 'officer' ? t.roleOfficer : t.roleAdmin}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <div>Single Business ID: <strong className="font-mono text-slate-900">MAHA-AGRO-2026-8812</strong></div>
                <div>Jurisdiction: <strong>MIDC Chakan, Pune</strong></div>
              </div>

              {/* Sign Out Button */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    onSignOut();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t.signOut}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Project Details Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Industrial Facility Profile</h3>
                  <p className="text-[11px] text-slate-500">Registered Single Window Business Identity</p>
                </div>
              </div>
              <button
                onClick={() => setShowProjectModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-3 text-xs">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-sm">
                    {currentUser?.companyName || project?.projectName}
                  </div>
                  <div className="font-mono text-[11px] text-blue-800 mt-0.5">{project?.projectId}</div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Active Digital Twin
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
                <div>State: <strong>Maharashtra</strong></div>
                <div>District: <strong>{project?.district || 'Pune'}</strong></div>
                <div>Capital Outlay: <strong>₹{project?.capitalInvestmentCrores || 13.6} Crores</strong></div>
                <div>Health Score: <strong>{project?.globalHealthScore || 92}% Compliant</strong></div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowProjectModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
