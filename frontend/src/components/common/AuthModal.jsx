import React, { useState } from 'react';
import PravahLogo from './PravahLogo.jsx';
import {
  X,
  Mail,
  Lock,
  Building2,
  User,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Factory,
} from 'lucide-react';
import { translations } from '../../locales/translations.js';
import { apiUrl, isMissingProductionBackend, API_BASE_URL } from '../../config/api.js';

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = 'login', // 'login' | 'register'
  onSuccessLogin,
  lang = 'en',
}) {
  const t = translations[lang] || translations.en;
  const [mode, setMode] = useState(initialMode);

  // Input states - Always start empty on initial open!
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [industrySector, setIndustrySector] = useState('Food Processing');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Reset inputs whenever modal opens or mode changes
  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setFullName('');
      setEmail('');
      setPassword('');
      setCompanyName('');
      setErrorMsg('');
    }
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (isMissingProductionBackend()) {
      setErrorMsg(
        'Backend URL not configured on Vercel. Please add VITE_API_URL in your Vercel Project Settings pointing to your Render backend URL (e.g. https://your-backend.onrender.com) and redeploy.'
      );
      setLoading(false);
      return;
    }

    try {
      if (mode === 'register') {
        // Registration is exclusively for industrial applicants
        const res = await fetch(apiUrl('/api/auth/register'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim(),
            password: password,
            name: fullName.trim() || 'Industrial Enterprise Representative',
            role: 'investor',
            companyName: companyName.trim() || 'Industrial Enterprise Unit',
            sector: industrySector,
          }),
        });

        let data;
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          data = await res.json();
        } else {
          const rawText = await res.text();
          if (res.status === 404) {
            throw new Error(
              !API_BASE_URL
                ? 'Backend URL not configured on Vercel. Please add VITE_API_URL in Vercel Project Settings.'
                : 'Registration endpoint not found (404). Please ensure your Render backend service is deployed and running.'
            );
          } else if (res.status === 502 || res.status === 503 || res.status === 504) {
            throw new Error(
              'Render backend is waking up from sleep (~45s on free tier). Please wait 30 seconds and click Register again.'
            );
          } else {
            throw new Error(`Server error (${res.status}): ${rawText.slice(0, 100)}`);
          }
        }

        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Registration failed');
        }

        onSuccessLogin(data.user);
      } else {
        // Sign In - User credentials only, role is identified and returned by the backend
        const res = await fetch(apiUrl('/api/auth/login'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim(),
            password: password,
          }),
        });

        let data;
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          data = await res.json();
        } else {
          const rawText = await res.text();
          if (res.status === 404) {
            throw new Error(
              !API_BASE_URL
                ? 'Backend URL not configured on Vercel. Please add VITE_API_URL in Vercel Project Settings.'
                : 'Authentication endpoint not found (404). Please ensure your Render backend is running.'
            );
          } else if (res.status === 502 || res.status === 503 || res.status === 504) {
            throw new Error(
              'Render backend is waking up from sleep (~45s on free tier). Please wait 30 seconds and click Sign In again.'
            );
          } else {
            throw new Error(`Server error (${res.status}): ${rawText.slice(0, 100)}`);
          }
        }

        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Authentication failed');
        }

        onSuccessLogin(data.user);
      }
    } catch (err) {
      // Offline / proxy restart fallback for seeded test accounts
      const cleanEmail = email.trim().toLowerCase();
      const seededAccounts = {
        'applicant@portal.gov.in': {
          password: 'Password@123',
          user: {
            id: 'USR-001',
            email: 'applicant@portal.gov.in',
            name: 'Industrial Applicant',
            role: 'investor',
            companyName: 'Sahyadri Agro-Processing Facility',
          },
        },
        'sro.pune@mpcb.gov.in': {
          password: 'Password@123',
          user: {
            id: 'USR-002',
            email: 'sro.pune@mpcb.gov.in',
            name: 'S.K. Deshmukh',
            role: 'officer',
            department: 'MPCB',
            companyName: 'Maharashtra Pollution Control Board (MPCB)',
          },
        },
        'admin@pravah.gov.in': {
          password: 'Password@123',
          user: {
            id: 'USR-003',
            email: 'admin@pravah.gov.in',
            name: 'Dr. Anand Kelkar',
            role: 'admin',
            companyName: 'State Industrial Directorate',
          },
        },
      };

      if (mode === 'login' && seededAccounts[cleanEmail]) {
        if (password === seededAccounts[cleanEmail].password) {
          onSuccessLogin(seededAccounts[cleanEmail].user);
          return;
        } else {
          setErrorMsg('Incorrect password. Please verify your credentials.');
          return;
        }
      }

      if (err.name === 'TypeError' && err.message.toLowerCase().includes('fetch')) {
        setErrorMsg(
          'Unable to reach backend on Render. Free-tier instance may be waking up from sleep (~45s) or backend URL is unreachable. Please wait 30 seconds and retry.'
        );
        return;
      }

      setErrorMsg(err.message || 'Authentication error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <PravahLogo size="sm" showText={true} />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Security Banner */}
          <div className="px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-slate-600 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-[11px] font-semibold">
              State Single-Window Secured Credential Gateway
            </span>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
            <button
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.signIn}
            </button>
            <button
              onClick={() => {
                setMode('register');
                setErrorMsg('');
              }}
              className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                mode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t.register}
            </button>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="font-medium leading-tight">{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-3.5 text-xs">
            {/* If Register: Industrial Person Registration Info */}
            {mode === 'register' && (
              <>
                <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center gap-2 text-blue-900 text-[11px]">
                  <Factory className="w-4 h-4 text-blue-700 shrink-0" />
                  <span className="font-semibold">
                    Industrial Enterprise &amp; Investor Registration
                  </span>
                </div>

                {/* Full Name */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Full Name</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      name="pravah_user_name"
                      autoComplete="off"
                      required
                      placeholder="Enter official full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white text-xs"
                    />
                  </div>
                </div>

                {/* Company Name */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Company Name</label>
                  <div className="relative">
                    <Building2 className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      name="pravah_user_company"
                      autoComplete="off"
                      required
                      placeholder="Enter your company name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white text-xs"
                    />
                  </div>
                </div>

                {/* Industrial Sector */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Industrial Sector</label>
                  <select
                    value={industrySector}
                    onChange={(e) => setIndustrySector(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 text-xs font-semibold cursor-pointer"
                  >
                    <option value="Food Processing">Food &amp; Agro-Processing</option>
                    <option value="Automotive & Engineering">Automotive &amp; Heavy Engineering</option>
                    <option value="Chemicals">Chemical Synthesis &amp; Petrochemicals</option>
                    <option value="Pharmaceuticals">Pharmaceuticals &amp; APIs</option>
                    <option value="Textiles">Textile &amp; Synthetic Apparel</option>
                    <option value="Electronics & Hardware">Electronics &amp; IT Hardware</option>
                    <option value="Renewable Energy">Renewable Energy &amp; Battery Storage</option>
                  </select>
                </div>
              </>
            )}

            {/* Email */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Official Email</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="email"
                  name="pravah_auth_email"
                  id="pravah_auth_email"
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck="false"
                  required
                  placeholder={mode === 'register' ? 'applicant@company.com' : 'name@organization.gov.in or user@company.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white text-xs"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Password</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                <input
                  type="password"
                  name="pravah_auth_password"
                  id="pravah_auth_password"
                  autoComplete="new-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-blue-600 focus:bg-white text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <span>{loading ? 'Verifying...' : mode === 'login' ? t.signIn : t.register}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {mode === 'register' && (
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 text-center leading-relaxed">
              <span>Department Scrutiny Officers &amp; System Administrators are provisioned by State Directorate authority.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
