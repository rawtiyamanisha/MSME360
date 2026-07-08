import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { 
  Settings as SettingsIcon, 
  User, 
  Building, 
  Key, 
  Database, 
  ShieldAlert, 
  CheckCircle2, 
  Info, 
  Bell, 
  Sliders,
  Sparkles,
  ExternalLink,
  Lock,
  Save,
  Check
} from "lucide-react";

export const Settings: React.FC = () => {
  const { profile } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [businessName, setBusinessName] = useState("APEX METAL CRAFTS PVT LTD");
  const [gstin, setGstin] = useState("27AAACA9342R1Z8");
  const [pan, setPan] = useState("AAACA9342R");
  const [regType, setRegType] = useState("Private Limited Company");

  const [notifSms, setNotifSms] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifScoreChange, setNotifScoreChange] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-bold text-blue-700 tracking-wider uppercase bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            System Profiles
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-2.5">
            Settings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Configure your enterprise registries, customize real-time credit change alerts, and manage secure database keys.
          </p>
        </div>

        <button 
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-blue-200"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Save Success Banner */}
      {isSaved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>System configuration and registry attributes updated successfully.</span>
        </div>
      )}

      {/* Main Grid: Settings categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns: Main configuration forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Corporate Registry Identifiers */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
              <Building className="w-4.5 h-4.5 text-blue-700" />
              <span>Corporate Registry Identifiers</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Registered Enterprise Name</label>
                <input 
                  type="text" 
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Enterprise Constitution</label>
                <select 
                  value={regType}
                  onChange={(e) => setRegType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold focus:outline-hidden focus:border-blue-500"
                >
                  <option value="Private Limited Company">Private Limited Company</option>
                  <option value="Partnership Firm">Partnership Firm</option>
                  <option value="Sole Proprietorship">Sole Proprietorship</option>
                  <option value="Limited Liability Partnership (LLP)">LLP Enterprise</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">GSTIN Certificate (GST India)</label>
                <input 
                  type="text" 
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-mono focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Company PAN (10-Digit Alphanumeric)</label>
                <input 
                  type="text" 
                  value={pan}
                  onChange={(e) => setPan(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-mono focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Alert Notification Toggles */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
              <Bell className="w-4.5 h-4.5 text-blue-700" />
              <span>Real-Time Score Alerts</span>
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Email Underwriting Report Notifications</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Receive monthly alternate data reports and lender matches in your inbox.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifEmail}
                  onChange={(e) => setNotifEmail(e.target.checked)}
                  className="w-4.5 h-4.5 text-blue-600 border-slate-300 rounded-md focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">SMS Alert Subscriptions</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Get immediate transactional alerts on repayment due dates and limits.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifSms}
                  onChange={(e) => setNotifSms(e.target.checked)}
                  className="w-4.5 h-4.5 text-blue-600 border-slate-300 rounded-md focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Score Variation Triggers</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Notify instantly when connected API updates affect your credit risk parameters.</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifScoreChange}
                  onChange={(e) => setNotifScoreChange(e.target.checked)}
                  className="w-4.5 h-4.5 text-blue-600 border-slate-300 rounded-md focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Side Column: Underwriting keys & credentials */}
        <div className="space-y-6">
          
          {/* Cryptographic Key Credentials */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-2 mb-3 flex items-center gap-2">
              <Key className="w-4.5 h-4.5 text-blue-700" />
              <span>Cryptographic Keys</span>
            </h3>
            <p className="text-[11px] text-slate-400 leading-normal mb-4">
              Your MSME360 Credit Credentials are cryptographically protected via secure private hashes.
            </p>

            <div className="space-y-3.5">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Entity Public Hash</span>
                <div className="mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-mono text-slate-500 select-all truncate">
                  sha256:8f9e0a12b...cd56eef71
                </div>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Authorized Signature</span>
                <div className="mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-mono text-slate-500 select-all truncate">
                  sig:apex-metal-2026-cgtmse-active
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-slate-100 text-[10px] text-slate-400 flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
              <span>Public hashes allow partner banks to verify your alternative scorecard instantly without revealing raw database records.</span>
            </div>
          </div>

          {/* Underwriting safety audit info */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-xs text-slate-600 leading-normal space-y-2">
            <h4 className="font-black text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wide">
              <Lock className="w-4 h-4 text-blue-700" />
              <span>Compliance Guarantee</span>
            </h4>
            <p>
              Underwriting indexes operate in full alignment with central bank data safety standards.
            </p>
            <p className="font-bold text-blue-700 cursor-pointer hover:underline text-[11px]">
              Review Privacy & Consent Logs &rarr;
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
