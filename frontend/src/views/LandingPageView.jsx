import React from 'react';
import PravahLogo from '../components/common/PravahLogo.jsx';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileCheck,
  Compass,
  Users2,
  Flame,
  Search,
  ChevronRight,
  Sparkles,
  Globe,
} from 'lucide-react';
import { translations } from '../locales/translations.js';

export default function LandingPageView({ onOpenAuth, lang = 'en', onSelectLang }) {
  const t = translations[lang] || translations.en;

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 font-sans select-none flex flex-col">
      {/* 1. Official Government Header Strip with Trilingual Switcher */}
      <div className="h-9 bg-slate-900 text-slate-300 text-[11px] px-6 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-4">
          <span className="font-bold text-white">{t.govTitle}</span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline">{t.govSubtitle}</span>
        </div>
        <div className="flex items-center gap-5 text-[10px]">
          <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {t.rtsActive}
          </span>
          <span className="hidden md:inline text-slate-400">{t.helpline}</span>

          {/* Trilingual Language Selector */}
          <div className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
            <Globe className="w-3 h-3 text-slate-400" />
            <button
              onClick={() => onSelectLang('en')}
              className={`px-1 rounded cursor-pointer ${
                lang === 'en' ? 'text-white font-bold bg-slate-700' : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => onSelectLang('mr')}
              className={`px-1 rounded cursor-pointer ${
                lang === 'mr' ? 'text-white font-bold bg-slate-700' : 'text-slate-400 hover:text-white'
              }`}
            >
              मराठी
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => onSelectLang('hi')}
              className={`px-1 rounded cursor-pointer ${
                lang === 'hi' ? 'text-white font-bold bg-slate-700' : 'text-slate-400 hover:text-white'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Portal Header */}
      <header className="h-20 px-6 sm:px-12 border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <PravahLogo size="md" showText={true} />
          <div className="hidden lg:block h-8 w-px bg-slate-200" />
          <div className="hidden lg:block">
            <div className="text-xs font-bold text-slate-900 tracking-wide uppercase">
              {t.govSubtitle}
            </div>
            <div className="text-[10px] text-slate-500">{t.platformSubtitle}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenAuth('login')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all cursor-pointer"
          >
            {t.signIn}
          </button>

          <button
            onClick={() => onOpenAuth('register')}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>{t.register}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 3. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 py-16 px-6 sm:px-12 border-b border-slate-200">
        <div className="max-w-6xl mx-auto space-y-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>{t.rtsActive}</span>
          </div>

          <div className="space-y-4 max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              {t.heroDesc}
            </p>
          </div>

          {/* Official Portal Access Points */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto text-left pt-4">
            <div
              onClick={() => onOpenAuth('login', 'investor')}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">{t.portalInvestorTitle}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{t.portalInvestorDesc}</p>
            </div>

            <div
              onClick={() => onOpenAuth('login', 'officer')}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">{t.portalOfficerTitle}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{t.portalOfficerDesc}</p>
            </div>

            <div
              onClick={() => onOpenAuth('login', 'admin')}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-slate-800 group-hover:text-white transition-colors">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">{t.portalAdminTitle}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{t.portalAdminDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Statutory Performance Statistics */}
      <section className="py-12 px-6 sm:px-12 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-slate-900">95</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t.statClearances}
              </div>
              <p className="text-[11px] text-slate-400">{t.statClearancesDesc}</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-blue-700">32</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t.statDepts}
              </div>
              <p className="text-[11px] text-slate-400">{t.statDeptsDesc}</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-emerald-600">45 {t.days}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t.statDaysSaved}
              </div>
              <p className="text-[11px] text-slate-400">{t.statDaysSavedDesc}</p>
            </div>
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-black text-teal-600">100%</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t.statRts}
              </div>
              <p className="text-[11px] text-slate-400">{t.statRtsDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Department Directory */}
      <section className="py-16 px-6 sm:px-12 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Department-Wise Clearance Standards
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Document requirements, statutory fee schedules, and processing timelines vary by department.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Industrial Land</span>
              <h3 className="text-base font-bold text-slate-900">MIDC</h3>
              <p className="text-slate-500 leading-relaxed">
                Industrial plot allotment, 7/12 land possession orders, water supply connection, building demarcation.
              </p>
              <div className="text-blue-700 font-semibold pt-1 border-t border-slate-100">
                SLA: 30 Days (Maharashtra RTS Act)
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Pollution Control</span>
              <h3 className="text-base font-bold text-slate-900">MPCB</h3>
              <p className="text-slate-500 leading-relaxed">
                Consent to Establish (CTE), Consent to Operate (CTO), Hazardous waste authorization, ETP scrutiny.
              </p>
              <div className="text-emerald-700 font-semibold pt-1 border-t border-slate-100">
                SLA: 45 Days (Water Act 1974 Sec 25)
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Occupational Safety</span>
              <h3 className="text-base font-bold text-slate-900">DISH</h3>
              <p className="text-slate-500 leading-relaxed">
                Factory building plan scrutiny (Form 1), Boiler registration, Contract labour safety license.
              </p>
              <div className="text-amber-700 font-semibold pt-1 border-t border-slate-100">
                SLA: 60 Days (Factories Act 1948)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="mt-auto bg-white border-t border-slate-200 py-10 px-6 sm:px-12 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <PravahLogo size="sm" showText={true} />
            <p className="text-[11px] text-slate-400">
              Government of Maharashtra • Directorate of Industries • Single Window Regulatory Portal.
            </p>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <button onClick={() => onOpenAuth('login')} className="hover:text-blue-700 cursor-pointer">
              {t.signIn}
            </button>
            <button onClick={() => onOpenAuth('register')} className="hover:text-blue-700 cursor-pointer font-bold text-blue-700">
              {t.register}
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
