import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { 
  Building2, 
  Database, 
  FileCheck2, 
  ShieldCheck, 
  History, 
  Settings, 
  User,
  ExternalLink,
  ChevronRight,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Wrench,
  ToggleLeft,
  Sliders,
  Terminal,
  Cpu
} from "lucide-react";
import { ALTERNATE_DATA_SOURCES, INDUSTRY_TYPES, STATES_LIST } from "../constants";

export const PlaceholderPage: React.FC = () => {
  const location = useLocation();
  const { profile } = useAuth();
  const path = location.pathname;

  // State managers for various interactive elements on sub-pages
  const [activeTab, setActiveTab] = useState("all");
  const [toggleState, setToggleState] = useState<Record<string, boolean>>({
    gstn: true,
    bank: true,
    utility: false,
    trade: true
  });

  const handleToggle = (key: string) => {
    setToggleState(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Dynamic Metadata and Structure based on actual route
  let title = "Secure Page Workspace";
  let subtitle = "MSME360 Foundation and Architecture Node";
  let icon = <Database className="w-6 h-6" />;
  let customContent = <div></div>;

  if (path === "/msme-directory") {
    title = "MSME Credit Directory";
    subtitle = "Secure indexing and registry of New-to-Credit and New-to-Bank businesses";
    icon = <Building2 className="w-6 h-6 text-blue-700" />;
    customContent = (
      <div className="space-y-6">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
          <div className="text-xs text-slate-500 max-w-lg">
            This module registers MSMEs who do not possess traditional credit ratings or complete tax filing history. Connecting external datasets enables immediate health scoring.
          </div>
          <button className="flex items-center gap-1 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors shrink-0">
            <Plus className="w-3.5 h-3.5" />
            <span>Enrol MSME Borrower</span>
          </button>
        </div>

        {/* Directory Schema representation */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Registered MSME Directory Parameters</h4>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border border-slate-100 rounded-lg p-4 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Database Schema</span>
              <h5 className="font-bold text-slate-800 text-sm">Entity Core Profiles</h5>
              <p className="text-xs text-slate-500">Saves business registration number (GSTIN, Udyam, PAN), legal incorporation certificates, and primary contact parameters.</p>
            </div>
            <div className="border border-slate-100 rounded-lg p-4 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Database Schema</span>
              <h5 className="font-bold text-slate-800 text-sm">Data Extraction Keys</h5>
              <p className="text-xs text-slate-500">Secures dynamic consent tokens and API links representing GSTR feeds, e-Way bills, and statement analyzer pipelines.</p>
            </div>
            <div className="border border-slate-100 rounded-lg p-4 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Database Schema</span>
              <h5 className="font-bold text-slate-800 text-sm">Underwriting Scores</h5>
              <p className="text-xs text-slate-500">Maps historic Health Card scores (overall scores and granular breakdowns) to assess volatility trends over 12-month cohorts.</p>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (path === "/health-cards") {
    title = "Financial Health Cards";
    subtitle = "Alternative credit scoring reports compiled using behavioral, operational, and tax data";
    icon = <FileCheck2 className="w-6 h-6 text-blue-700" />;
    customContent = (
      <div className="space-y-6">
        <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-900">
            <strong>Credit Rating Mechanism:</strong> Each Health Card combines compliance, cashflow stability, utility payout punctuality, and supplier settlement velocity into an index of 300 to 900.
          </div>
        </div>

        {/* Health card visualization placeholder */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs max-w-2xl mx-auto">
          <div className="bg-gradient-to-tr from-blue-950 to-slate-900 text-white p-6 relative">
            <div className="absolute top-6 right-6 font-bold text-2xl tracking-widest opacity-25">MSME360</div>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Financial Health Score Card</span>
                <h3 className="text-lg font-bold text-white mt-1">AURA METAL CRAFTS PVT LTD</h3>
                <p className="text-xs text-slate-300 font-mono mt-0.5">ID: M360-8492 • GSTIN: 27AAACA9342R1Z8</p>
              </div>
            </div>

            <div className="flex gap-8 mt-12 items-end">
              <div>
                <span className="text-[10px] text-blue-300 uppercase font-bold tracking-wider">Alternative Score</span>
                <div className="text-4xl font-black text-white mt-1 font-mono">742</div>
              </div>
              <div className="border-l border-slate-800 h-10"></div>
              <div>
                <span className="text-[10px] text-blue-300 uppercase font-bold tracking-wider">Risk Category</span>
                <div className="text-base font-bold text-emerald-400 mt-1">Low Underwriting Risk</div>
              </div>
              <div className="border-l border-slate-800 h-10"></div>
              <div>
                <span className="text-[10px] text-blue-300 uppercase font-bold tracking-wider">Sync State</span>
                <div className="text-xs font-semibold text-blue-300 mt-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>Direct Feeds Live</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-slate-100 bg-slate-50/50 text-xs">
            <div>
              <p className="text-slate-400">GST filing accuracy</p>
              <p className="font-bold text-slate-800 mt-0.5">85 / 100</p>
            </div>
            <div>
              <p className="text-slate-400">Cashflow volatility</p>
              <p className="font-bold text-slate-800 mt-0.5">78 / 100</p>
            </div>
            <div>
              <p className="text-slate-400">Utility payment lag</p>
              <p className="font-bold text-slate-800 mt-0.5">92 / 100</p>
            </div>
            <div>
              <p className="text-slate-400">Supplier compliance</p>
              <p className="font-bold text-slate-800 mt-0.5">80 / 100</p>
            </div>
          </div>

          <div className="p-5 flex justify-between items-center bg-white text-xs text-slate-500">
            <span>Model Validation: Core Underwriter v2.4</span>
            <button className="text-blue-700 font-bold hover:underline flex items-center gap-1">
              <span>Inspect ledger audits</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  } else if (path === "/data-feeds") {
    title = "Alternative Data Integrations";
    subtitle = "Configure direct secure endpoints for transactional compliance feeds";
    icon = <Database className="w-6 h-6 text-blue-700" />;
    customContent = (
      <div className="space-y-6">
        <p className="text-xs text-slate-500">
          Activate or pause API connections representing the alternative data matrix. Direct feeds are retrieved securely via customer consent tokens.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ALTERNATE_DATA_SOURCES.map((source) => (
            <div key={source.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between hover:border-blue-300/80 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded-md px-2 py-0.5 tracking-wide">
                    {source.category}
                  </span>
                  <h4 className="font-extrabold text-slate-800 text-sm mt-2">{source.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">Weight Contribution: {source.scoreWeight}</p>
                </div>
                
                {/* Custom toggle button */}
                <button 
                  onClick={() => handleToggle(source.id.toLowerCase())}
                  className="focus:outline-hidden"
                >
                  <div className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                    toggleState[source.id.toLowerCase()] ? "bg-blue-700" : "bg-slate-200"
                  }`}>
                    <div className={`bg-white w-5 h-5 rounded-full shadow-md transform duration-200 ease-in-out ${
                      toggleState[source.id.toLowerCase()] ? "translate-x-5" : "translate-x-0"
                    }`}></div>
                  </div>
                </button>
              </div>

              <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${toggleState[source.id.toLowerCase()] ? "text-emerald-600" : "text-slate-300"}`} />
                  {toggleState[source.id.toLowerCase()] ? "Live Connection Syncing" : "Feed Connection Inactive"}
                </span>
                <span className="hover:text-blue-700 cursor-pointer flex items-center gap-0.5">
                  Configure keys <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  } else if (path === "/risk-assessment") {
    title = "Risk Model Calculator";
    subtitle = "Configure weighting metrics and evaluation categories for underwriting algorithms";
    icon = <Sliders className="w-6 h-6 text-blue-700" />;
    customContent = (
      <div className="space-y-6">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-500">
          This system uses machine-learning parameters calibrated to assess credit risk for entities without credit ratings. Adjust threshold weights beneath to simulate underwriting volatility.
        </div>

        {/* Model weight adjusters */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-5">
          <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">Active Underwriting Weights</h4>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">Tax Compliance Weight (GSTR filing regularity)</span>
                <span className="font-bold text-blue-700">30%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-700 h-2 rounded-full" style={{ width: "30%" }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">Banking Statements Weight (Cash Adequacy Index)</span>
                <span className="font-bold text-blue-700">35%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-700 h-2 rounded-full" style={{ width: "35%" }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">Utility Payment Weight (Promptness index)</span>
                <span className="font-bold text-blue-700">15%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-700 h-2 rounded-full" style={{ width: "15%" }}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">Trade Creditor Payout Weight (Supplier compliance)</span>
                <span className="font-bold text-blue-700">20%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div className="bg-blue-700 h-2 rounded-full" style={{ width: "20%" }}></div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 text-xs">
            <button className="px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 font-semibold text-slate-700">Restore Calibration</button>
            <button className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg transition-colors">Commit Risk Matrix</button>
          </div>
        </div>
      </div>
    );
  } else if (path === "/audit-logs") {
    title = "System Security Audit";
    subtitle = "Immutable ledger recording authentication events, database connections, and model calibrations";
    icon = <History className="w-6 h-6 text-blue-700" />;
    customContent = (
      <div className="space-y-6">
        <div className="flex justify-between items-center text-xs text-slate-500">
          <span>Non-repudiation cryptographic verification: ACTIVE</span>
          <span className="font-mono text-slate-400">Ledger hash: SHA256/748A-9E2F</span>
        </div>

        {/* Audit Log representation table */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-4">Operator</th>
                <th className="py-2.5 px-4">Action Event</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4 text-right">Failsafe Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
              <tr>
                <td className="py-3 px-4 font-mono text-slate-400">2026-07-08 00:09:54</td>
                <td className="py-3 px-4">{profile?.email || "officer@msme360.com"}</td>
                <td className="py-3 px-4">User Session Auth Gateway Approved</td>
                <td className="py-3 px-4"><span className="text-blue-700 bg-blue-50 px-2 py-0.5 border border-blue-100 rounded-full text-[10px] font-bold">AUTH</span></td>
                <td className="py-3 px-4 text-right text-emerald-600 font-bold">SECURED</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-slate-400">2026-07-07 14:32:10</td>
                <td className="py-3 px-4">system@msme360.com</td>
                <td className="py-3 px-4">Central Registry GSTN Endpoint Polled Successfully</td>
                <td className="py-3 px-4"><span className="text-purple-700 bg-purple-50 px-2 py-0.5 border border-purple-100 rounded-full text-[10px] font-bold">DATA</span></td>
                <td className="py-3 px-4 text-right text-emerald-600 font-bold">SECURED</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-slate-400">2026-07-07 11:15:00</td>
                <td className="py-3 px-4">admin@msme360.com</td>
                <td className="py-3 px-4">Adjusted Alternate Score calibration matrix v2.4</td>
                <td className="py-3 px-4"><span className="text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-100 rounded-full text-[10px] font-bold">CALIBRATION</span></td>
                <td className="py-3 px-4 text-right text-emerald-600 font-bold">SECURED</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-mono text-slate-400">2026-07-06 18:45:12</td>
                <td className="py-3 px-4">security-daemon@msme360.com</td>
                <td className="py-3 px-4">Audit Ledger verification cycle completed (SHA256 valid)</td>
                <td className="py-3 px-4"><span className="text-slate-700 bg-slate-50 px-2 py-0.5 border border-slate-100 rounded-full text-[10px] font-bold">SYSTEM</span></td>
                <td className="py-3 px-4 text-right text-emerald-600 font-bold">SECURED</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  } else if (path === "/settings") {
    title = "System Configurations";
    subtitle = "Adjust platform, security policies, API thresholds, and Firebase configurations";
    icon = <Settings className="w-6 h-6 text-blue-700" />;
    customContent = (
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-5 space-y-4">
            <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">Firebase Direct Connector</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-400">Firestore Project ID</p>
                <p className="font-bold text-slate-800 font-mono mt-0.5">manisha-first-project-489912</p>
              </div>
              <div>
                <p className="text-slate-400">Firestore Region Location</p>
                <p className="font-bold text-slate-800 font-mono mt-0.5">us-central</p>
              </div>
              <div>
                <p className="text-slate-400">Auth Gateway State</p>
                <p className="font-bold text-emerald-600 font-mono mt-0.5">ACTIVE (onAuthStateChanged)</p>
              </div>
              <div>
                <p className="text-slate-400">Database Schema sync mode</p>
                <p className="font-bold text-slate-800 font-mono mt-0.5">AUTOMATIC Blueprints</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          <div className="p-5 space-y-4">
            <h4 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">Enterprise Security Rules</h4>
            <div className="text-xs text-slate-500 leading-relaxed">
              Our file structure maps Firestore security policies dynamically using `/firestore.rules` preventing data leakage:
              <ul className="list-disc list-inside mt-2 space-y-1 text-slate-600">
                <li>Bank officers can run evaluations across all MSME Borrowers.</li>
                <li>MSME borrowers can only retrieve, connect, and read their own cards.</li>
                <li>Write security parameters are locked to administrators only.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  } else if (path === "/profile") {
    title = "User Credentials Profile";
    subtitle = "View and customize your authorized identity metadata and organizational keys";
    icon = <User className="w-6 h-6 text-blue-700" />;
    customContent = (
      <div className="space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 max-w-2xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 border-2 border-blue-600 text-blue-900 text-2xl font-black flex items-center justify-center">
              {profile?.name?.substring(0, 2).toUpperCase() || "US"}
            </div>
            <div>
              <h4 className="font-extrabold text-slate-800 text-base">{profile?.name || "System User"}</h4>
              <p className="text-xs text-slate-400 mt-0.5">{profile?.email}</p>
              <span className="inline-block mt-1.5 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-2.5 py-0.5 uppercase tracking-wide">
                {profile?.role?.replace("_", " ") || "Officer"}
              </span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-slate-400">Employer Organization</p>
              <p className="font-bold text-slate-800 mt-0.5">{profile?.company || "MSME360 Corporate Partner"}</p>
            </div>
            <div>
              <p className="text-slate-400">Date of Enrollment</p>
              <p className="font-bold text-slate-800 mt-0.5">{profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "07/08/2026"}</p>
            </div>
            <div>
              <p className="text-slate-400">Access Node ID</p>
              <p className="font-bold text-slate-800 font-mono mt-0.5">{profile?.uid || "UID-STALE-KEY"}</p>
            </div>
            <div>
              <p className="text-slate-400">Federated Identity Gateway</p>
              <p className="font-bold text-emerald-600 mt-0.5">Firebase Security Service</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Dynamic Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
            {icon}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Custom Sub-Page Content */}
      <div className="animate-in fade-in slide-in-from-top-2 duration-200">
        {customContent}
      </div>

    </div>
  );
};
