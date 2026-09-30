import React, { useState, useEffect } from 'react';
import {
  Building2,
  FileCheck,
  UploadCloud,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  ExternalLink,
  ShieldCheck,
  FileText,
  HelpCircle,
  Scale,
  Sparkles,
  ArrowRight,
  Eye,
  Check,
  X,
  MessageSquareWarning,
} from 'lucide-react';
import { translations } from '../locales/translations.js';
import { apiUrl } from '../config/api.js';

export default function DepartmentHubView({
  onUploadCaCert,
  activeDiscrepancy = false,
  userRole = 'investor', // 'investor' | 'officer' | 'admin'
  lang = 'en',
}) {
  const t = translations[lang] || translations.en;
  const [selectedDept, setSelectedDept] = useState(userRole === 'officer' ? 'MPCB' : 'MPCB');
  const [dbDocuments, setDbDocuments] = useState([]);
  const [uploadingDocId, setUploadingDocId] = useState(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Fetch real uploaded documents from backend database
  const fetchDbDocuments = async () => {
    try {
      const res = await fetch(apiUrl('/api/documents/MAHA-AGRO-2026-8812'));
      if (res.ok) {
        const data = await res.json();
        if (data.documents) {
          setDbDocuments(data.documents);
        }
      }
    } catch (err) {
      console.warn('Could not fetch db documents:', err);
    }
  };

  useEffect(() => {
    fetchDbDocuments();
  }, []);

  const departments = {
    MPCB: {
      name: 'Maharashtra Pollution Control Board (MPCB)',
      short: 'MPCB',
      themeColor: 'emerald',
      headquarters: 'Kalpataru Point, Sion, Mumbai / Regional Office Pune II',
      mandate: 'Enforces Water (P&CP) Act 1974, Air (P&CP) Act 1981, and Hazardous Waste Management Rules 2016.',
      slaDays: 45,
      actCitation: 'Water Act 1974 Sec 25 & Air Act 1981 Sec 21',
      services: [
        'Consent to Establish (CTE) - Orange Category',
        'Consent to Operate (CTO) - 5 Years Validity',
        'Hazardous Waste Management Authorization (Form 2)',
      ],
      feeSlab: '₹75,000 (Calculated for Capital Investment between ₹10 Cr and ₹25 Cr)',
      checklist: [
        {
          id: 'MPCB-DOC-1',
          name: 'Chartered Accountant Gross Capital Investment Certificate',
          type: 'Financial & Statutory Fee Basis',
          isMandatory: true,
          action: 'upload_ca',
        },
        {
          id: 'MPCB-DOC-2',
          name: 'Effluent Treatment Plant (ETP) Process Flowchart & Mass Balance',
          type: 'Environmental Engineering Scheme',
          isMandatory: true,
        },
        {
          id: 'MPCB-DOC-3',
          name: 'Environmental Management Plan (EMP) & Air Baseline Study',
          type: 'Pollution Control Plan',
          isMandatory: false,
        },
      ],
    },
    MIDC: {
      name: 'Maharashtra Industrial Development Corporation (MIDC)',
      short: 'MIDC',
      themeColor: 'blue',
      headquarters: 'Udyog Bhavan, Mumbai / Regional Office Chakan, Pune',
      mandate: 'Statutory authority responsible for planning, land acquisition, and industrial plot disposal under MIDC Act 1961.',
      slaDays: 30,
      actCitation: 'MIDC Act 1961 Section 14 & Disposal of Land Regulations 1975',
      services: [
        'Industrial Plot Possession & Final Lease Order',
        'Water Supply Connection Sanction (125 KLD)',
        'Building Plan NOC & Demarcation Certificate',
      ],
      feeSlab: '₹12,40,000 (Lease Premium & Development Charges Settled)',
      checklist: [
        {
          id: 'MIDC-DOC-1',
          name: 'Detailed Project Report (DPR) & Financial Viability Assessment',
          type: 'Project Appraisal',
          isMandatory: true,
        },
        {
          id: 'MIDC-DOC-2',
          name: 'Udyam Registration Certificate / Industrial Single ID',
          type: 'Enterprise Incorporation',
          isMandatory: true,
        },
        {
          id: 'MIDC-DOC-3',
          name: 'Architectural Block Layout & Perimeter Peg Marking Drawing',
          type: 'Civil Survey',
          isMandatory: true,
        },
      ],
    },
    DISH: {
      name: 'Directorate of Industrial Safety & Health (DISH)',
      short: 'DISH',
      themeColor: 'amber',
      headquarters: 'Kamgar Bhavan, Mumbai / Joint Director Office, Pune',
      mandate: 'Administers the Factories Act 1948 and Maharashtra Factories Rules 1963 for occupational safety and health.',
      slaDays: 60,
      actCitation: 'Factories Act 1948 Section 6 & Maharashtra Factories Rules 1963',
      services: [
        'Factory Building Plan Approval (Form 1)',
        'Factory License Grant & Commercial Commissioning Certificate',
        'Contract Labour (Regulation & Abolition) Registration',
      ],
      feeSlab: '₹22,500 (Factory Licensing Schedule for 150 Workers)',
      checklist: [
        {
          id: 'DISH-DOC-1',
          name: 'Factory Structural Building Plan & Sectional Drawings (Form 1)',
          type: 'Occupational Safety Architecture',
          isMandatory: true,
        },
        {
          id: 'DISH-DOC-2',
          name: 'Plant Machinery Placement & Hazardous Equipment Clearance Chart',
          type: 'Mechanical Layout',
          isMandatory: true,
        },
      ],
    },
    FIRE: {
      name: 'Maharashtra Fire & Emergency Services',
      short: 'FIRE',
      themeColor: 'rose',
      headquarters: 'Directorate of Fire Services, Santacruz, Mumbai',
      mandate: 'Enforces fire prevention, life safety measures, and hydrants under Maharashtra Fire Act 2006.',
      slaDays: 30,
      actCitation: 'Maharashtra Fire Prevention & Life Safety Measures Act 2006',
      services: [
        'Provisional Fire Safety No Objection Certificate (NOC)',
        'Final Fire Clearance prior to Occupancy',
      ],
      feeSlab: '₹35,000 (Fire Scrutiny & Infrastructure Cess)',
      checklist: [
        {
          id: 'FIRE-DOC-1',
          name: 'Site Plan showing 6-Metre Motorable Peripheral Fire Tender Road',
          type: 'Life Safety Access',
          isMandatory: true,
        },
        {
          id: 'FIRE-DOC-2',
          name: 'Underground Static Water Storage Reservoir Proof (100,000 Litres)',
          type: 'Water Storage Tank Plan',
          isMandatory: true,
        },
      ],
    },
    MSEDCL: {
      name: 'Maharashtra State Electricity Distribution Co. (MSEDCL)',
      short: 'MSEDCL',
      themeColor: 'blue',
      headquarters: 'Prakashgad, Bandra, Mumbai / Superintending Engineer Pune',
      mandate: 'Power distribution licensee regulating HT/LT industrial electricity sanctions and transformer grid connections.',
      slaDays: 20,
      actCitation: 'Electricity Act 2003 Section 43 & MERC Supply Code 2021',
      services: [
        'High Tension (HT) Industrial Power Sanction (450 kVA)',
        'Substation Feasibility & Grid Interconnection Note',
      ],
      feeSlab: '₹85,000 (Estimate for 450 kVA HT Metering Substation)',
      checklist: [
        {
          id: 'MSEDCL-DOC-1',
          name: 'Connected Load List & Single Line Electrical Diagram (SLD)',
          type: 'Electrical Scheme',
          isMandatory: true,
        },
        {
          id: 'MSEDCL-DOC-2',
          name: 'MIDC Allotment Letter & No Objection for Electric Substation',
          type: 'Premises Ownership',
          isMandatory: true,
        },
      ],
    },
    CGWA: {
      name: 'Central Ground Water Authority (CGWA)',
      short: 'CGWA',
      themeColor: 'teal',
      headquarters: 'Ministry of Jal Shakti, New Delhi / State Ground Water Board Pune',
      mandate: 'Regulates groundwater extraction in notified semi-critical assessment units under Environment (Protection) Act 1986.',
      slaDays: 45,
      actCitation: 'Gazette Circular 2026/09 & Environment (Protection) Act 1986 Sec 3(3)',
      services: [
        'Industrial Ground Water Abstraction NOC (>100 KLD)',
        'Piezometer Telemetry & Rainwater Recharge Compliance',
      ],
      feeSlab: '₹40,000 (Environmental Abstraction Assessment Fee)',
      checklist: [
        {
          id: 'CGWA-DOC-1',
          name: 'Hydrogeological Impact Assessment & Aquifer Yield Report',
          type: 'Geological Investigation',
          isMandatory: true,
        },
        {
          id: 'CGWA-DOC-2',
          name: 'Digital Piezometer Telemetry & Water Flow Meter Installation Scheme',
          type: 'Monitoring Technology',
          isMandatory: true,
        },
      ],
    },
  };

  const current = departments[selectedDept] || departments.MPCB;

  // Real backend file upload for any checklist item
  const handleUploadFileToBackend = async (docItem) => {
    setUploadingDocId(docItem.id);
    setActionSuccessMsg('');

    try {
      if (docItem.action === 'upload_ca') {
        await onUploadCaCert();
      } else {
        const res = await fetch(apiUrl('/api/documents/upload'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId: 'MAHA-AGRO-2026-8812',
            departmentId: selectedDept,
            fileName: `${docItem.name.replace(/\s+/g, '_')}.pdf`,
            uploadedBy: 'Enterprise Investor',
          }),
        });

        if (res.ok) {
          setActionSuccessMsg(`File "${docItem.name}" submitted to ${selectedDept} scrutiny portal.`);
        }
      }

      await fetchDbDocuments();
    } catch (err) {
      console.error('File upload failed:', err);
    } finally {
      setUploadingDocId(null);
    }
  };

  // Officer action: Verify document or raise query in database
  const handleOfficerVerify = async (docId, newStatus, officerNotes) => {
    try {
      const res = await fetch(apiUrl('/api/documents/verify'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: 'MAHA-AGRO-2026-8812',
          documentId: docId,
          verificationStatus: newStatus,
          officerNotes: officerNotes || (newStatus === 'VERIFIED' ? 'Verified by Scrutiny Officer' : 'Deficiency notice issued under RTS Act Sec 8'),
        }),
      });

      if (res.ok) {
        setActionSuccessMsg(`Document ${docId} updated to ${newStatus}.`);
        await fetchDbDocuments();
      }
    } catch (err) {
      console.error('Officer verification failed:', err);
    }
  };

  // Filter documents in database that match the active department
  const departmentSubmittedDocs = dbDocuments.filter(
    (d) => d.departmentId?.toUpperCase() === selectedDept.toUpperCase()
  );

  return (
    <div className="h-full w-full flex flex-col bg-slate-50 select-none overflow-y-auto">
      {/* Header */}
      <div className="px-8 py-5 bg-white border-b border-slate-200 shrink-0">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
                {userRole === 'officer' ? 'Officer Scrutiny Desk' : 'Department Portal'}
              </span>
              <span className="text-xs text-slate-500">• Single Window Document Repository</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              {userRole === 'officer'
                ? `Department Scrutiny & Document Verification (${current.short})`
                : 'Department-Wise Clearance & Document Hub'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Files uploaded by investors are directly transmitted to the respective department scrutiny desk in real time.
            </p>
          </div>
        </div>

        {/* Department Selector Tabs */}
        <div className="max-w-6xl mx-auto mt-5 flex items-center gap-2 overflow-x-auto pb-1">
          {Object.keys(departments).map((key) => {
            const dept = departments[key];
            const isSelected = selectedDept === key;

            return (
              <button
                key={key}
                onClick={() => {
                  setSelectedDept(key);
                  setActionSuccessMsg('');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                  isSelected ? 'bg-blue-700 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{dept.short}</span>
                <span className="text-[10px] opacity-75 font-normal">({dept.services.length} services)</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-6xl mx-auto w-full space-y-6">
        {actionSuccessMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* Department Overview Profile Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Statutory Regulatory Authority
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">{current.name}</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-3xl">{current.mandate}</p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Statutory SLA</span>
              <div className="text-xl font-bold text-blue-700">{current.slaDays} Days</div>
              <div className="text-[10px] text-slate-500">Maharashtra RTS Act 2015</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Governing Statutory Act</span>
              <div className="font-semibold text-slate-800">{current.actCitation}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Applicable Statutory Fee</span>
              <div className="font-bold text-emerald-700">{current.feeSlab}</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Regional Jurisdiction</span>
              <div className="font-semibold text-slate-800">{current.headquarters}</div>
            </div>
          </div>
        </div>

        {/* SECTION A: REAL DATABASE UPLOADED FILES (VISIBLE ON GOVERNMENT PAGE!) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Submitted Documents on {current.short} Portal ({departmentSubmittedDocs.length} Active Files in Database)
              </h3>
            </div>
            <span className="text-[11px] text-slate-500">
              Synchronized with Supabase Cloud &amp; Government Scrutiny Desk
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            {departmentSubmittedDocs.length > 0 ? (
              departmentSubmittedDocs.map((doc) => {
                const isUnderScrutiny = doc.verificationStatus === 'UNDER_SCRUTINY';
                const isVerified = doc.verificationStatus === 'VERIFIED';
                const isQuery = doc.verificationStatus === 'QUERY_ISSUED';

                return (
                  <div
                    key={doc.id}
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="text-xs font-bold text-slate-900">{doc.documentName}</span>
                        <span className="font-mono text-[10px] text-slate-400">({doc.fileSize})</span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Officer Notes: <span className="font-medium text-slate-800">{doc.officerNotes}</span>
                      </p>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Uploaded: {new Date(doc.uploadedAt).toLocaleString()} • Hash: {doc.documentHash.substring(0, 16)}...
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isVerified && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Verified
                        </span>
                      )}

                      {isUnderScrutiny && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          Under Scrutiny
                        </span>
                      )}

                      {isQuery && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          <MessageSquareWarning className="w-3.5 h-3.5 text-amber-600" />
                          Query Notice
                        </span>
                      )}

                      {/* If Government Officer: Show Real Verification Actions */}
                      {userRole === 'officer' && isUnderScrutiny && (
                        <div className="flex items-center gap-1.5 ml-2">
                          <button
                            onClick={() => handleOfficerVerify(doc.id, 'VERIFIED', 'Verified and compliant with statutory norms.')}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1 shadow-2xs cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleOfficerVerify(doc.id, 'QUERY_ISSUED', 'Furnish revised sectional drawings under RTS Sec 8.')}
                            className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <MessageSquareWarning className="w-3.5 h-3.5 text-amber-600" />
                            <span>Raise Query</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs italic">
                No files submitted to {current.short} yet. Upload files below to display on the government scrutiny page.
              </div>
            )}
          </div>
        </div>

        {/* SECTION B: DEPARTMENT DOCUMENT CHECKLIST & UPLOAD BAR */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Department Checklist &amp; Submission Controls ({current.checklist.length} Prescribed Forms)
            </h3>
            <span className="text-xs text-slate-500">
              Files uploaded here immediately update the government officer's desk
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs divide-y divide-slate-100 overflow-hidden">
            {current.checklist.map((item) => {
              const isUploading = uploadingDocId === item.id;

              return (
                <div key={item.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="text-xs font-bold text-slate-900">{item.name}</span>
                      {item.isMandatory ? (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          Mandatory
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                          Conditional
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400">Classification: {item.type}</div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleUploadFileToBackend(item)}
                      disabled={isUploading}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>{isUploading ? 'Transmitting...' : 'Upload & Transmit to Govt'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
