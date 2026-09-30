import React from 'react';
import { Sparkles, BookOpen } from 'lucide-react';
import { translations } from '../../locales/translations.js';

export default function FloatingTourButton({ onClick, currentStep = 1, totalSteps = 18, lang = 'en' }) {
  const t = translations[lang] || translations.en;

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none">
      <button
        onClick={onClick}
        className="group px-4 py-2.5 rounded-full bg-gradient-to-r from-blue-700 via-indigo-700 to-teal-700 hover:from-blue-800 hover:to-teal-800 text-white font-bold text-xs flex items-center gap-2.5 shadow-xl hover:shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 border border-white/20 cursor-pointer"
        title="Statutory Process Guide"
      >
        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
          <BookOpen className="w-3 h-3 text-teal-200" />
        </div>
        <span>{t.portalGuide}</span>
        <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-mono font-bold text-teal-100">
          {t.step} {currentStep}/{totalSteps}
        </span>
      </button>
    </div>
  );
}
