import React from 'react';

export default function PravahLogo({
  size = 'md', // 'sm' | 'md' | 'lg'
  showText = true,
  className = '',
}) {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  }[size] || 'w-9 h-9';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Geometric Flow Nexus Mark */}
      <svg
        className={`${iconDimensions} shrink-0`}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="48" height="48" rx="10" fill="#0F294A" />

        {/* Dynamic flowing regulatory streams */}
        <path
          d="M10 16C16 16 18 24 24 24C30 24 32 16 38 16"
          stroke="#14B8A6"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M10 24C16 24 18 24 24 24C30 24 32 32 38 32"
          stroke="#38BDF8"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M10 32C16 32 18 24 24 24C30 24 32 24 38 24"
          stroke="#94A3B8"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="1 3"
        />

        {/* Central Orchestration Nexus Nodes */}
        <circle cx="24" cy="24" r="4.5" fill="#FFFFFF" />
        <circle cx="24" cy="24" r="2.5" fill="#0F294A" />

        {/* Input & Output Milestone Points */}
        <circle cx="10" cy="16" r="2" fill="#14B8A6" />
        <circle cx="10" cy="24" r="2" fill="#38BDF8" />
        <circle cx="38" cy="16" r="2.5" fill="#14B8A6" />
        <circle cx="38" cy="32" r="2.5" fill="#38BDF8" />
      </svg>

      {/* Typography Brand Lockup */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-sans font-extrabold tracking-wider text-slate-900 text-lg leading-tight">
              PRAVAH
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-teal-50 text-teal-800 border border-teal-200">
              GovTech
            </span>
          </div>
          <span className="text-[10px] font-medium text-slate-500 tracking-tight leading-none mt-0.5">
            Regulatory Orchestration Platform
          </span>
        </div>
      )}
    </div>
  );
}
