import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { 
  Database, 
  FileText, 
  Briefcase, 
  Activity, 
  Award, 
  CheckCircle2, 
  Plus, 
  X, 
  AlertCircle, 
  ExternalLink, 
  Lock, 
  TrendingUp, 
  Check, 
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  HelpCircle,
  Clock,
  Zap,
  Smartphone,
  Share2,
  Landmark,
  IdCard,
  Building2,
  CheckCircle,
  Users,
  Eye,
  EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

// Defined categories and score multipliers
interface DataSourceDef {
  id: string;
  name: string;
  category: "Tax" | "Banking" | "Operations" | "Utility";
  description: string;
  scoreWeight: number;
  iconType: "FileText" | "Smartphone" | "Share2" | "Briefcase" | "Zap" | "Landmark" | "Award" | "IdCard";
  color: string;
  defaultConfidence: string;
}

const DEFAULT_SOURCES: DataSourceDef[] = [
  {
    id: "gst",
    name: "GST Tax Filing API",
    category: "Tax",
    description: "Direct live syncing of monthly corporate tax returns and e-way bill compliance. Validates quarterly operational revenue and cashflow velocity.",
    scoreWeight: 50,
    iconType: "FileText",
    color: "from-blue-600 to-indigo-600",
    defaultConfidence: "98% (High)"
  },
  {
    id: "upi",
    name: "UPI Transaction Log",
    category: "Banking",
    description: "Real-time micro-transaction analysis capturing daily operational velocity, direct retail cash receipts, and immediately available liquidity.",
    scoreWeight: 40,
    iconType: "Smartphone",
    color: "from-pink-600 to-rose-600",
    defaultConfidence: "95% (High)"
  },
  {
    id: "account_aggregator",
    name: "Account Aggregator Hub",
    category: "Banking",
    description: "Consent-driven financial data aggregation across verified banks, mutual funds, corporate deposits, and insurance assets.",
    scoreWeight: 50,
    iconType: "Share2",
    color: "from-teal-600 to-cyan-600",
    defaultConfidence: "97% (High)"
  },
  {
    id: "epfo",
    name: "EPFO Payroll Verification",
    category: "Operations",
    description: "Automated employee headcount and wage deposit validation indicating payroll scale, growth indicators, and organizational stability.",
    scoreWeight: 40,
    iconType: "Briefcase",
    color: "from-indigo-600 to-violet-600",
    defaultConfidence: "90% (Medium)"
  },
  {
    id: "utility",
    name: "Utility & Telecom Payments",
    category: "Utility",
    description: "Historical analysis of commercial power schedules, water, gas, and enterprise high-speed broadband bill compliance.",
    scoreWeight: 20,
    iconType: "Zap",
    color: "from-amber-500 to-orange-600",
    defaultConfidence: "85% (Medium)"
  },
  {
    id: "bank_statements",
    name: "Bank Statement Analyzer",
    category: "Banking",
    description: "Secure multi-bank checking feeds parsing statement histories, transactional health, average balance indices, and loan servicing rates.",
    scoreWeight: 60,
    iconType: "Landmark",
    color: "from-sky-500 to-blue-600",
    defaultConfidence: "99% (High)"
  },
  {
    id: "udyam",
    name: "Udyam MSME Registry",
    category: "Operations",
    description: "Official statutory validation of Indian micro, small, and medium enterprise registry records, asset investments, and classifications.",
    scoreWeight: 30,
    iconType: "Award",
    color: "from-emerald-600 to-teal-600",
    defaultConfidence: "100% (High)"
  },
  {
    id: "pan",
    name: "PAN Card Registry",
    category: "Tax",
    description: "Corporate tax identification ledger validating business legal status, active registration records, and underlying structural attributes.",
    scoreWeight: 30,
    iconType: "IdCard",
    color: "from-rose-600 to-red-600",
    defaultConfidence: "100% (High)"
  }
];

export const AlternateDataSources: React.FC = () => {
  const { profile, updateProfile, isAuthenticated } = useAuth();
  
  const [sourcesState, setSourcesState] = useState<Record<string, {
    status: "Connected" | "Pending" | "Disconnected";
    lastSync: string;
    dataConfidence: string;
  }>>({});

  const [loading, setLoading] = useState(true);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"ALL" | "CONNECTED" | "AVAILABLE">("ALL");
  const [toast, setToast] = useState<{ message: string; type: "success" | "info" | "error" } | null>(null);

  // Connection Dialog states
  const [activeConnectionSource, setActiveConnectionSource] = useState<DataSourceDef | null>(null);
  const [isVerifyingConnection, setIsVerifyingConnection] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form input fields for dynamic modal simulation
  const [formData, setFormData] = useState({
    gstin: "",
    gstUsername: "",
    gstOtp: "",
    upiId: "",
    upiPhone: "",
    aaManager: "OneMoney",
    aaPhone: "",
    aaOtp: "",
    epfoUan: "",
    epfoPass: "",
    epfoOtp: "",
    utilityType: "Electricity",
    utilityOperator: "",
    utilityConsumerId: "",
    bankName: "HDFC Bank",
    bankCustomerId: "",
    bankOtp: "",
    udyamNumber: "",
    udyamPhone: "",
    udyamOtp: "",
    panNumber: "",
    panDob: ""
  });

  // Display Toast messages with auto-expiry
  const showToast = (message: string, type: "success" | "info" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => prev?.message === message ? null : prev);
    }, 4000);
  };

  // Sync state from profile on mount / update
  useEffect(() => {
    if (profile?.alternateDataSources) {
      setSourcesState(profile.alternateDataSources);
      setLoading(false);
    } else if (profile) {
      // Initialize with default states (all Disconnected initially)
      const initial: Record<string, {
        status: "Connected" | "Pending" | "Disconnected";
        lastSync: string;
        dataConfidence: string;
      }> = {};
      DEFAULT_SOURCES.forEach(s => {
        initial[s.id] = {
          status: "Disconnected",
          lastSync: "Never synced",
          dataConfidence: "Not connected"
        };
      });
      setSourcesState(initial);
      setLoading(false);
      
      // Save initial state back to Firestore
      if (isAuthenticated) {
        updateProfile({
          alternateDataSources: initial
        }).catch(err => {
          console.error("Failed to write initial alternateDataSources to Firestore:", err);
          showToast("Failed to initialize database records. Offline mode active.", "error");
        });
      }
    } else {
      // Not logged in or profile still loading
      setLoading(true);
    }
  }, [profile, isAuthenticated]);

  // Handle individual source Refresh action with animation
  const handleRefreshSource = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const sourceVal = sourcesState[id];
    if (!sourceVal || sourceVal.status === "Disconnected") {
      showToast("Please link this channel before attempting to sync.", "info");
      return;
    }

    setRefreshingId(id);
    
    // Simulate real network fetch latency
    setTimeout(async () => {
      const updatedSources = { ...sourcesState };
      updatedSources[id] = {
        status: updatedSources[id].status === "Pending" ? "Connected" : updatedSources[id].status,
        lastSync: "Just now",
        dataConfidence: DEFAULT_SOURCES.find(s => s.id === id)?.defaultConfidence || "High"
      };

      setSourcesState(updatedSources);
      setRefreshingId(null);
      showToast(`${DEFAULT_SOURCES.find(s => s.id === id)?.name} synced successfully to the secure ledger!`, "success");

      // Sync updated state to Firestore
      if (isAuthenticated) {
        try {
          await updateProfile({ alternateDataSources: updatedSources });
        } catch (err) {
          console.error("Firestore sync error:", err);
          showToast("Changes saved locally, but failed to sync to secure ledger.", "error");
        }
      }
    }, 1200);
  };

  // Handle Sync All feeds action
  const handleSyncAllFeeds = () => {
    const connectedCount = Object.keys(sourcesState).filter(k => sourcesState[k]?.status !== "Disconnected").length;
    if (connectedCount === 0) {
      showToast("No active channels linked. Please connect a source first.", "info");
      return;
    }

    setIsSyncingAll(true);
    
    setTimeout(async () => {
      const updatedSources = { ...sourcesState };
      Object.keys(updatedSources).forEach(key => {
        if (updatedSources[key].status !== "Disconnected") {
          updatedSources[key] = {
            status: "Connected",
            lastSync: "Just now",
            dataConfidence: DEFAULT_SOURCES.find(s => s.id === key)?.defaultConfidence || "High"
          };
        }
      });

      setSourcesState(updatedSources);
      setIsSyncingAll(false);
      showToast("All active financial feeds synchronized successfully!", "success");

      if (isAuthenticated) {
        try {
          await updateProfile({ alternateDataSources: updatedSources });
        } catch (err) {
          console.error("Firestore sync error:", err);
        }
      }
    }, 1800);
  };

  // Revoke/Disconnect confirmation
  const handleDisconnectSource = async (id: string) => {
    const confirmRevoke = window.confirm(`Are you sure you want to revoke secure API access keys for ${DEFAULT_SOURCES.find(s => s.id === id)?.name}? This will immediately reduce your MSME credit score boost.`);
    if (!confirmRevoke) return;

    const updatedSources = { ...sourcesState };
    updatedSources[id] = {
      status: "Disconnected",
      lastSync: "Revoked key access",
      dataConfidence: "Not connected"
    };

    setSourcesState(updatedSources);
    showToast(`Access revoked for ${DEFAULT_SOURCES.find(s => s.id === id)?.name}. Keys cleared.`, "info");

    if (isAuthenticated) {
      try {
        await updateProfile({ alternateDataSources: updatedSources });
      } catch (err) {
        console.error("Firestore sync error:", err);
      }
    }
  };

  // Open interactive connection modal
  const handleOpenConnectModal = (source: DataSourceDef) => {
    setActiveConnectionSource(source);
    setConsentChecked(false);
    setShowPassword(false);
    // Reset form inputs for realistic feel
    setFormData({
      gstin: "",
      gstUsername: "",
      gstOtp: "",
      upiId: "",
      upiPhone: "",
      aaManager: "OneMoney",
      aaPhone: "",
      aaOtp: "",
      epfoUan: "",
      epfoPass: "",
      epfoOtp: "",
      utilityType: "Electricity",
      utilityOperator: "",
      utilityConsumerId: "",
      bankName: "HDFC Bank",
      bankCustomerId: "",
      bankOtp: "",
      udyamNumber: "",
      udyamPhone: "",
      udyamOtp: "",
      panNumber: "",
      panDob: ""
    });
  };

  // Confirm connection simulation
  const handleConfirmConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConnectionSource) return;
    if (!consentChecked) {
      showToast("Please acknowledge and check the data sovereignty consent checkbox.", "error");
      return;
    }

    setIsVerifyingConnection(true);

    // Simulate multi-stage API connection and authentication
    setTimeout(async () => {
      const id = activeConnectionSource.id;
      const updatedSources = { ...sourcesState };
      updatedSources[id] = {
        status: "Connected",
        lastSync: "Just now",
        dataConfidence: activeConnectionSource.defaultConfidence
      };

      setSourcesState(updatedSources);
      setIsVerifyingConnection(false);
      setActiveConnectionSource(null);
      showToast(`${activeConnectionSource.name} linked successfully! Credit score updated.`, "success");

      if (isAuthenticated) {
        try {
          await updateProfile({ alternateDataSources: updatedSources });
        } catch (err) {
          console.error("Firestore sync error:", err);
          showToast("Linked locally, but failed to sync online.", "error");
        }
      }
    }, 2000);
  };

  // Helper to dynamically render corresponding Lucide Icons
  const renderSourceIcon = (iconName: string) => {
    switch (iconName) {
      case "FileText": return <FileText className="w-5.5 h-5.5" />;
      case "Smartphone": return <Smartphone className="w-5.5 h-5.5" />;
      case "Share2": return <Share2 className="w-5.5 h-5.5" />;
      case "Briefcase": return <Briefcase className="w-5.5 h-5.5" />;
      case "Zap": return <Zap className="w-5.5 h-5.5" />;
      case "Landmark": return <Landmark className="w-5.5 h-5.5" />;
      case "Award": return <Award className="w-5.5 h-5.5" />;
      case "IdCard": return <IdCard className="w-5.5 h-5.5" />;
      default: return <Database className="w-5.5 h-5.5" />;
    }
  };

  // Dynamic calculations for dynamic scoreboard widgets
  const connectedSourcesCount = Object.keys(sourcesState).filter(k => sourcesState[k]?.status === "Connected").length;
  const pendingSourcesCount = Object.keys(sourcesState).filter(k => sourcesState[k]?.status === "Pending").length;
  
  // Calculate score booster based on weights of connected data sources
  const currentBoosterPoints = DEFAULT_SOURCES.reduce((acc, src) => {
    const val = sourcesState[src.id];
    if (val?.status === "Connected") {
      return acc + src.scoreWeight;
    } else if (val?.status === "Pending") {
      return acc + Math.round(src.scoreWeight * 0.4); // partial point booster for pending
    }
    return acc;
  }, 0);

  const maxBoosterPoints = DEFAULT_SOURCES.reduce((acc, src) => acc + src.scoreWeight, 0);
  const activePercent = Math.round((connectedSourcesCount / DEFAULT_SOURCES.length) * 100);

  // Filter sources for viewing tab
  const visibleSources = DEFAULT_SOURCES.filter(src => {
    const val = sourcesState[src.id];
    const status = val?.status || "Disconnected";
    if (activeTab === "CONNECTED") return status === "Connected" || status === "Pending";
    if (activeTab === "AVAILABLE") return status === "Disconnected";
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <RefreshCw className="w-10 h-10 text-blue-700 animate-spin" />
        <p className="text-xs font-semibold text-slate-500 tracking-wide animate-pulse">
          Decrypting sovereign ledger attributes...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Toast Alert Banner */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 shadow-2xl rounded-2xl p-4 border max-w-sm flex items-start gap-3 backdrop-blur-md bg-white"
            style={{
              borderColor: toast.type === "success" ? "#bbf7d0" : toast.type === "error" ? "#fecaca" : "#e2e8f0"
            }}
          >
            {toast.type === "success" && <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
            {toast.type === "error" && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />}
            {toast.type === "info" && <HelpCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />}
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-900">{toast.message}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-bold text-blue-700 tracking-wider uppercase bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            Underwriting Integrations
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-2.5">
            Alternate Data Collection
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Authorize and manage non-traditional financial indicators securely inside our encrypted sandbox ledger.
          </p>
        </div>

        <button 
          onClick={handleSyncAllFeeds}
          disabled={isSyncingAll}
          className="flex items-center gap-2 px-4.5 py-2.5 bg-slate-950 hover:bg-slate-900 text-white disabled:opacity-50 rounded-xl text-xs font-bold transition-all shadow-md shadow-slate-200 hover:shadow-lg"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? "animate-spin" : ""}`} />
          <span>{isSyncingAll ? "Synchronizing ledger channels..." : "Refresh Connected Feeds"}</span>
        </button>
      </div>

      {/* Dynamic Scoreboards & Data Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Dynamic Credit Score Booster Card */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
          <div className="absolute right-[-10px] top-[-10px] opacity-10">
            <TrendingUp className="w-32 h-32 text-blue-400" />
          </div>
          
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-black text-blue-300 tracking-wider">MSME Credit Booster</span>
              <h2 className="text-3xl font-black tracking-tight mt-1">+{currentBoosterPoints} <span className="text-sm font-semibold text-slate-300">/ {maxBoosterPoints} pts</span></h2>
            </div>
            <div className="px-2.5 py-1 bg-blue-500/15 border border-blue-400/30 rounded-lg text-[10px] font-extrabold text-blue-300 uppercase">
              Score Weighted
            </div>
          </div>
          
          <p className="text-[11px] text-slate-300 leading-normal mt-3">
            Your linked alternate profiles add credential weight directly to your financial health index. Each channel expands borrowing limits.
          </p>

          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-4 overflow-hidden">
            <div 
              className="bg-blue-400 h-full rounded-full transition-all duration-1000"
              style={{ width: `${Math.round((currentBoosterPoints / maxBoosterPoints) * 100)}%` }}
            />
          </div>
        </div>

        {/* Integration Coverage Index */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Feed Coverage Index</span>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">{connectedSourcesCount} <span className="text-sm font-semibold text-slate-400">/ {DEFAULT_SOURCES.length} linked</span></h2>
              </div>
              <div className="p-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal mt-3">
              Comprehensive profiles cover tax registries, banking ledgers, identity logs, and utility records to maximize loan validation trust.
            </p>
          </div>

          <div className="flex items-center gap-2.5 mt-4">
            <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                style={{ width: `${activePercent}%` }}
              />
            </div>
            <span className="text-xs font-extrabold text-slate-700">{activePercent}%</span>
          </div>
        </div>

        {/* Security & Sovereign Consent Notice */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Sovereign Encryption Node</span>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-1">AES-256 <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 uppercase inline-block">Active</span></h2>
              </div>
              <div className="p-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-xl">
                <Lock className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal mt-3">
              We leverage read-only tokens directly connected to official APIs (GSTN, EPFO, Open Banking portals). Central storage is fully key-wrapped.
            </p>
          </div>
          <div className="text-[10px] text-slate-400 font-bold border-t border-slate-100 pt-3 mt-4 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Sovereign revocation compliant with GDPR & PDPB standards.</span>
          </div>
        </div>

      </div>

      {/* Tabs / Filter Controls */}
      <div className="flex justify-between items-center border-b border-slate-200 pt-2 text-xs font-bold">
        <div className="flex gap-2">
          <button 
            onClick={() => setActiveTab("ALL")}
            className={`py-2.5 px-4.5 border-b-2 transition-all ${
              activeTab === "ALL" ? "border-blue-700 text-blue-700 font-extrabold text-sm" : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            All Channels ({DEFAULT_SOURCES.length})
          </button>
          <button 
            onClick={() => setActiveTab("CONNECTED")}
            className={`py-2.5 px-4.5 border-b-2 transition-all ${
              activeTab === "CONNECTED" ? "border-blue-700 text-blue-700 font-extrabold text-sm" : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Linked ({connectedSourcesCount + pendingSourcesCount})
          </button>
          <button 
            onClick={() => setActiveTab("AVAILABLE")}
            className={`py-2.5 px-4.5 border-b-2 transition-all ${
              activeTab === "AVAILABLE" ? "border-blue-700 text-blue-700 font-extrabold text-sm" : "border-transparent text-slate-400 hover:text-slate-600"
            }`}
          >
            Unlinked ({DEFAULT_SOURCES.length - (connectedSourcesCount + pendingSourcesCount)})
          </button>
        </div>
      </div>

      {/* Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleSources.map(src => {
          const val = sourcesState[src.id] || { status: "Disconnected", lastSync: "Never", dataConfidence: "Not connected" };
          const isRefreshing = refreshingId === src.id;
          
          return (
            <div 
              key={src.id}
              className={`bg-white border rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 hover:shadow-md transition-all duration-300 relative ${
                val.status === "Connected" ? "border-emerald-200 bg-gradient-to-b from-white to-emerald-50/5" :
                val.status === "Pending" ? "border-amber-200 bg-gradient-to-b from-white to-amber-50/5" : "border-slate-200"
              }`}
            >
              <div>
                
                {/* Header section */}
                <div className="flex justify-between items-start gap-2.5">
                  <div className={`p-3 rounded-xl text-white bg-gradient-to-tr ${src.color} shrink-0 shadow-sm`}>
                    {renderSourceIcon(src.iconType)}
                  </div>

                  <div className="text-right">
                    {/* Status indicator badges */}
                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                      val.status === "Connected" 
                        ? "text-emerald-700 bg-emerald-50 border-emerald-100" 
                        : val.status === "Pending" 
                        ? "text-amber-700 bg-amber-50 border-amber-100 animate-pulse" 
                        : "text-slate-400 bg-slate-50 border-slate-200"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        val.status === "Connected" ? "bg-emerald-500 animate-ping" :
                        val.status === "Pending" ? "bg-amber-500 animate-pulse" : "bg-slate-300"
                      }`} />
                      {val.status}
                    </span>
                    <p className="text-[10px] text-blue-700 font-extrabold mt-1.5">
                      +{src.scoreWeight} Score Points
                    </p>
                  </div>
                </div>

                {/* Body Text */}
                <h3 className="font-extrabold text-slate-900 text-sm mt-4 tracking-tight">{src.name}</h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-3">
                  {src.description}
                </p>

                {/* Secondary Data Indicators requested on each card */}
                <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Data Confidence</span>
                    <span className={`text-[11px] font-extrabold mt-0.5 block ${
                      val.status === "Connected" ? "text-emerald-700" :
                      val.status === "Pending" ? "text-amber-700" : "text-slate-400"
                    }`}>
                      {val.status !== "Disconnected" ? val.dataConfidence : "Unavailable"}
                    </span>
                  </div>

                  <div className="p-2 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Last Sync</span>
                    <span className="text-[11px] font-bold text-slate-600 mt-0.5 truncate flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{val.lastSync}</span>
                    </span>
                  </div>
                </div>

              </div>

              {/* Action Toolbar requested: Connect / Refresh buttons */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2.5">
                
                {/* Connect / Disconnect button */}
                {val.status === "Disconnected" ? (
                  <button 
                    onClick={() => handleOpenConnectModal(src)}
                    className="flex-1 py-2 px-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-100 hover:shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Connect Channel</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => handleDisconnectSource(src.id)}
                    className="flex-1 py-2 px-3 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Disconnect</span>
                  </button>
                )}

                {/* Refresh Button on each card */}
                <button 
                  onClick={(e) => handleRefreshSource(src.id, e)}
                  disabled={val.status === "Disconnected" || isRefreshing}
                  className={`p-2 rounded-xl transition-all border ${
                    val.status === "Disconnected" 
                      ? "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                      : "border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300 shadow-xs"
                  }`}
                  title={val.status === "Disconnected" ? "Connect channel first to refresh" : "Sync live data"}
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-blue-700" : ""}`} />
                </button>

              </div>

            </div>
          );
        })}
      </div>

      {/* Connection & Sovereignty Consent Overlay Dialog */}
      <AnimatePresence>
        {activeConnectionSource && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative"
            >
              
              {/* Close Button */}
              <button 
                onClick={() => setActiveConnectionSource(null)}
                disabled={isVerifyingConnection}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title Section */}
              <div className="flex gap-4 items-start">
                <div className={`p-3 text-white rounded-2xl bg-gradient-to-tr ${activeConnectionSource.color} shrink-0 shadow-md`}>
                  {renderSourceIcon(activeConnectionSource.iconType)}
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">{activeConnectionSource.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Sovereign Financial API Credential Link</p>
                </div>
              </div>

              {/* Form Content simulating actual banking authentication systems */}
              <form onSubmit={handleConfirmConnect} className="mt-5 space-y-4">
                
                {/* Dynamically simulated fields depending on the channel id */}
                {activeConnectionSource.id === "gst" && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">GSTIN Number</label>
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. 27AAPCA1234M1Z5"
                        maxLength={15}
                        value={formData.gstin}
                        onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-blue-600 focus:bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Portal Username</label>
                        <input 
                          required
                          type="text" 
                          placeholder="GSTN Username"
                          value={formData.gstUsername}
                          onChange={(e) => setFormData({ ...formData, gstUsername: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">6-Digit Verification OTP</label>
                        <input 
                          required
                          type="text" 
                          placeholder="Enter OTP"
                          maxLength={6}
                          value={formData.gstOtp}
                          onChange={(e) => setFormData({ ...formData, gstOtp: e.target.value.replace(/\D/g, "") })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-center font-mono font-bold tracking-widest focus:outline-none focus:border-blue-600 focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeConnectionSource.id === "upi" && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Unified UPI Virtual Payment Address (VPA)</label>
                      <input 
                        required
                        type="text" 
                        placeholder="e.g. businessname@okaxis"
                        value={formData.upiId}
                        onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-blue-600 focus:bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Linked Mobile Number</label>
                      <input 
                        required
                        type="tel" 
                        placeholder="10-Digit Mobile"
                        maxLength={10}
                        value={formData.upiPhone}
                        onChange={(e) => setFormData({ ...formData, upiPhone: e.target.value.replace(/\D/g, "") })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white"
                      />
                    </div>
                  </div>
                )}

                {activeConnectionSource.id === "account_aggregator" && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Consent Manager</label>
                        <select 
                          value={formData.aaManager}
                          onChange={(e) => setFormData({ ...formData, aaManager: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-600"
                        >
                          <option value="OneMoney">OneMoney (Finsec)</option>
                          <option value="Anumati">Anumati AA</option>
                          <option value="Sahamati">Sahamati</option>
                          <option value="CAMS">CAMS Finserv</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Registered Phone</label>
                        <input 
                          required
                          type="tel" 
                          placeholder="Phone Number"
                          maxLength={10}
                          value={formData.aaPhone}
                          onChange={(e) => setFormData({ ...formData, aaPhone: e.target.value.replace(/\D/g, "") })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">One-Time-Password (OTP)</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Enter 6-Digit OTP"
                        maxLength={6}
                        value={formData.aaOtp}
                        onChange={(e) => setFormData({ ...formData, aaOtp: e.target.value.replace(/\D/g, "") })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-center font-mono font-bold tracking-widest focus:outline-none focus:border-blue-600 focus:bg-white"
                      />
                    </div>
                  </div>
                )}

                {activeConnectionSource.id === "epfo" && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Universal Account Number (UAN)</label>
                      <input 
                        required
                        type="text" 
                        placeholder="12-digit Employee UAN"
                        maxLength={12}
                        value={formData.epfoUan}
                        onChange={(e) => setFormData({ ...formData, epfoUan: e.target.value.replace(/\D/g, "") })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-blue-600 focus:bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Unified Member Password</label>
                        <div className="relative">
                          <input 
                            required
                            type={showPassword ? "text" : "password"} 
                            placeholder="Password"
                            value={formData.epfoPass}
                            onChange={(e) => setFormData({ ...formData, epfoPass: e.target.value })}
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white pr-9"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">6-Digit Auth OTP</label>
                        <input 
                          required
                          type="text" 
                          placeholder="Enter OTP"
                          maxLength={6}
                          value={formData.epfoOtp}
                          onChange={(e) => setFormData({ ...formData, epfoOtp: e.target.value.replace(/\D/g, "") })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-center font-mono font-bold tracking-widest focus:outline-none focus:border-blue-600 focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeConnectionSource.id === "utility" && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Utility Bill Sector</label>
                        <select 
                          value={formData.utilityType}
                          onChange={(e) => setFormData({ ...formData, utilityType: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-600"
                        >
                          <option value="Electricity">Electricity Power</option>
                          <option value="Broadband">Broadband Telecom</option>
                          <option value="Gas">Industrial Gas</option>
                          <option value="Water">Water Registry</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Board / Operator Name</label>
                        <input 
                          required
                          type="text" 
                          placeholder="e.g. MSEDCL, Airtel, Tata"
                          value={formData.utilityOperator}
                          onChange={(e) => setFormData({ ...formData, utilityOperator: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Customer Consumer Account ID</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Enter Bill Account Number"
                        value={formData.utilityConsumerId}
                        onChange={(e) => setFormData({ ...formData, utilityConsumerId: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-blue-600 focus:bg-white"
                      />
                    </div>
                  </div>
                )}

                {activeConnectionSource.id === "bank_statements" && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Institution Institution</label>
                        <select 
                          value={formData.bankName}
                          onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-blue-600"
                        >
                          <option value="HDFC Bank">HDFC Commercial Bank</option>
                          <option value="ICICI Bank">ICICI Bank Ltd</option>
                          <option value="SBI">State Bank of India</option>
                          <option value="Axis Bank">Axis Bank</option>
                          <option value="Kotak Mahindra">Kotak Mahindra</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Customer CustID / NetBanking ID</label>
                        <input 
                          required
                          type="text" 
                          placeholder="9-Digit Customer ID"
                          value={formData.bankCustomerId}
                          onChange={(e) => setFormData({ ...formData, bankCustomerId: e.target.value })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:border-blue-600 focus:bg-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">NetBanking Secure Gateway OTP</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Enter Secure Gateway OTP"
                        maxLength={6}
                        value={formData.bankOtp}
                        onChange={(e) => setFormData({ ...formData, bankOtp: e.target.value.replace(/\D/g, "") })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-center font-mono font-bold tracking-widest focus:outline-none focus:border-blue-600 focus:bg-white"
                      />
                    </div>
                  </div>
                )}

                {activeConnectionSource.id === "udyam" && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Udyam Registration Number</label>
                      <input 
                        required
                        type="text" 
                        placeholder="UDYAM-XX-00-0000000"
                        value={formData.udyamNumber}
                        onChange={(e) => setFormData({ ...formData, udyamNumber: e.target.value.toUpperCase() })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-blue-600 focus:bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Registered Phone</label>
                        <input 
                          required
                          type="tel" 
                          placeholder="Mobile Number"
                          maxLength={10}
                          value={formData.udyamPhone}
                          onChange={(e) => setFormData({ ...formData, udyamPhone: e.target.value.replace(/\D/g, "") })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Registrar OTP</label>
                        <input 
                          required
                          type="text" 
                          placeholder="Enter OTP"
                          maxLength={6}
                          value={formData.udyamOtp}
                          onChange={(e) => setFormData({ ...formData, udyamOtp: e.target.value.replace(/\D/g, "") })}
                          className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-center font-mono font-bold tracking-widest focus:outline-none focus:border-blue-600 focus:bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeConnectionSource.id === "pan" && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Permanent Account Number (PAN)</label>
                      <input 
                        required
                        type="text" 
                        placeholder="10-Character Alphanumeric PAN"
                        maxLength={10}
                        value={formData.panNumber}
                        onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold tracking-wider focus:outline-none focus:border-blue-600 focus:bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Date of Incorporation / Registration</label>
                      <input 
                        required
                        type="date" 
                        value={formData.panDob}
                        onChange={(e) => setFormData({ ...formData, panDob: e.target.value })}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-600 focus:bg-white"
                      />
                    </div>
                  </div>
                )}

                {/* Consent & sovereignty agreements */}
                <div className="mt-5 space-y-4 bg-slate-50 border border-slate-200 p-4 rounded-2xl text-[11px] text-slate-600 leading-normal">
                  <p>
                    By granting this API authorization, you explicitly permit the **MSME360 Credit Engine** to retrieve, analyze, and format read-only files from the corresponding database gateway.
                  </p>
                  
                  <div className="space-y-1.5 border-l-2 border-blue-500 pl-2.5">
                    <p className="font-extrabold text-slate-800">Our Sovereign Security Assurances:</p>
                    <ul className="space-y-1 text-slate-500">
                      <li>• Strictly **Read-Only** schema querying. No transactional access.</li>
                      <li>• Tokens are isolated inside AES-256 digital envelope containers.</li>
                      <li>• Sovereign absolute revocation instantly available via your dashboard.</li>
                    </ul>
                  </div>

                  <label className="flex items-start gap-2.5 pt-3 border-t border-slate-200 mt-2 font-bold text-slate-800 cursor-pointer select-none">
                    <input 
                      required
                      type="checkbox" 
                      checked={consentChecked}
                      onChange={(e) => setConsentChecked(e.target.checked)}
                      className="w-4.5 h-4.5 text-blue-700 border-slate-300 rounded-lg focus:ring-blue-600 mt-0.5 shrink-0"
                    />
                    <span>I authorize sovereign direct sync and accept all underlying terms of consent.</span>
                  </label>
                </div>

                {/* Submit Controls */}
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                  <button 
                    type="button"
                    onClick={() => setActiveConnectionSource(null)}
                    disabled={isVerifyingConnection}
                    className="px-4 py-2 border border-slate-200 text-slate-700 font-extrabold text-xs rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isVerifyingConnection}
                    className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-100 hover:shadow-lg transition-all flex items-center gap-1.5 disabled:opacity-60"
                  >
                    {isVerifyingConnection ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying Consent...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Authorize Secure Sync</span>
                      </>
                    )}
                  </button>
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
