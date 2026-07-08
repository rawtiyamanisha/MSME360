import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import {
  Activity,
  ShieldCheck,
  Database,
  Briefcase,
  Award,
  Sparkles,
  Settings,
  ArrowUpRight,
  TrendingUp,
  FileCheck2,
  FileText,
  AlertCircle,
  RefreshCw,
  Plus,
  ArrowRight,
  CheckCircle2,
  Info,
  Building,
  DollarSign,
  Upload,
  Calendar,
  Clock,
  ExternalLink,
  Lock,
  MessageSquare,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Types for Alternate Data Sources
interface DataSource {
  id: string;
  name: string;
  category: "Tax" | "Banking" | "Utility" | "Operations" | "Accounting";
  scoreContribution: number;
  integrityWeight: number;
  icon: any;
  status: "connected" | "disconnected" | "syncing";
  description: string;
}

export const MSMEOwnerDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Core Interactive State: Synced alternate data feeds
  const [sources, setSources] = useState<DataSource[]>([
    {
      id: "gst",
      name: "GSTN Tax Portal",
      category: "Tax",
      scoreContribution: 160,
      integrityWeight: 25,
      icon: FileText,
      status: "connected",
      description: "Direct transactional tax compliance logs and e-Way bills."
    },
    {
      id: "bank",
      name: "Corporate Bank Feed (Primary)",
      category: "Banking",
      scoreContribution: 210,
      integrityWeight: 30,
      icon: Database,
      status: "connected",
      description: "Daily automated checking and savings cash balance analyzer."
    },
    {
      id: "accounting",
      name: "Tally / QuickBooks API",
      category: "Accounting",
      scoreContribution: 140,
      integrityWeight: 20,
      icon: Briefcase,
      status: "disconnected",
      description: "Supplier invoices, age analysis, and trade ledger integrations."
    },
    {
      id: "utility",
      name: "Telecom & Electricity Feeds",
      category: "Utility",
      scoreContribution: 80,
      integrityWeight: 15,
      icon: Activity,
      status: "disconnected",
      description: "Recurring operational bill payment consistency scorecard."
    },
    {
      id: "shipping",
      name: "E-Commerce / Shipping API",
      category: "Operations",
      scoreContribution: 90,
      integrityWeight: 10,
      icon: Award,
      status: "disconnected",
      description: "Order dispatch metrics and customer fulfillment score."
    }
  ]);

  // Toast auto-clear
  useEffect(() => {
    if (successToast) {
      const timer = setTimeout(() => setSuccessToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successToast]);

  // Trigger simulated sync
  const handleConnectSource = (id: string) => {
    setSources(prev => prev.map(src => {
      if (src.id === id) {
        return { ...src, status: "syncing" };
      }
      return src;
    }));

    // Complete simulated sync in 1.5 seconds
    setTimeout(() => {
      setSources(prev => prev.map(src => {
        if (src.id === id) {
          const updatedSrc = { ...src, status: "connected" as const };
          setSuccessToast(`Successfully authorized and synchronized ${updatedSrc.name}! Your credit scorecard has been updated in real-time.`);
          // Log simulated activity
          addActivity({
            id: Math.random().toString(),
            time: "Just now",
            event: `Linked API channel: ${updatedSrc.name}`,
            type: "success"
          });
          return updatedSrc;
        }
        return src;
      }));
    }, 1500);
  };

  const handleDisconnectSource = (id: string) => {
    setSources(prev => prev.map(src => {
      if (src.id === id) {
        const updatedSrc = { ...src, status: "disconnected" as const };
        setSuccessToast(`Disconnected ${updatedSrc.name}. Alternate score recalculated.`);
        addActivity({
          id: Math.random().toString(),
          time: "Just now",
          event: `Removed API channel: ${updatedSrc.name}`,
          type: "warning"
        });
        return updatedSrc;
      }
      return src;
    }));
  };

  // Simulated Activities State
  const [activities, setActivities] = useState([
    { id: "1", time: "2 hours ago", event: "Automated GSTN filing compliance verified", type: "success" },
    { id: "2", time: "1 day ago", event: "Daily bank statement analyzer batch run", type: "neutral" },
    { id: "3", time: "3 days ago", event: "Underwriting model v2 assessed Grade: Low Risk", type: "info" },
    { id: "4", time: "1 week ago", event: "Stripe merchant payment channel synced", type: "success" }
  ]);

  const addActivity = (act: { id: string; time: string; event: string; type: string }) => {
    setActivities(prev => [act, ...prev].slice(0, 6));
  };

  // Re-calculate MSME Owner Core KPI Metrics dynamically based on synced sources
  const baseScore = 320; // Worst case scenario
  const activeSources = sources.filter(s => s.status === "connected");
  
  // 1. Financial Health Score (Range: 300 to 900)
  const healthScore = Math.min(
    900,
    baseScore + activeSources.reduce((acc, curr) => acc + curr.scoreContribution, 0)
  );

  // 2. Trust Index (Weighted connection integrity)
  const maxIntegrity = sources.reduce((acc, curr) => acc + curr.integrityWeight, 0);
  const currentIntegritySum = activeSources.reduce((acc, curr) => acc + curr.integrityWeight, 0);
  const trustIndex = Math.round((currentIntegritySum / maxIntegrity) * 100);

  // 3. Risk Category determination
  let riskCategory = "High Risk";
  let riskStyle = "text-rose-600 bg-rose-50 border-rose-200";
  let riskGrade = "Grade D";
  if (healthScore >= 750) {
    riskCategory = "Very Low Risk";
    riskStyle = "text-emerald-600 bg-emerald-50 border-emerald-200";
    riskGrade = "Grade AA+";
  } else if (healthScore >= 680) {
    riskCategory = "Low Risk";
    riskStyle = "text-teal-600 bg-teal-50 border-teal-200";
    riskGrade = "Grade A";
  } else if (healthScore >= 560) {
    riskCategory = "Moderate Risk";
    riskStyle = "text-amber-600 bg-amber-50 border-amber-200";
    riskGrade = "Grade B";
  }

  // 4. Recommended Loan dynamic calculation
  let recommendedLoanAmount = "$20,000";
  let interestRate = "14.5% APR";
  let repaymentPeriod = "12 Months";
  let loanProduct = "Micro-Retail Cash Flow Advance";

  if (healthScore >= 750) {
    recommendedLoanAmount = "$250,000";
    interestRate = "7.2% APR (Prime)";
    repaymentPeriod = "36 Months";
    loanProduct = "Premium Corporate Line of Credit";
  } else if (healthScore >= 680) {
    recommendedLoanAmount = "$120,000";
    interestRate = "9.5% APR";
    repaymentPeriod = "24 Months";
    loanProduct = "Working Capital Expansion Loan";
  } else if (healthScore >= 560) {
    recommendedLoanAmount = "$45,000";
    interestRate = "11.8% APR";
    repaymentPeriod = "18 Months";
    loanProduct = "Invoice Factoring Bridge Loan";
  }

  // 5. Pending Documents calculation
  const disconnectedSources = sources.filter(s => s.status === "disconnected");
  
  // Refresh simulation
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setSuccessToast("All external compliance endpoints successfully synced in real-time. Alternative credit model updated.");
      addActivity({
        id: Math.random().toString(),
        time: "Just now",
        event: "Manual workspace score refresh executed",
        type: "neutral"
      });
    }, 1200);
  };

  // Chart Data: Cash Flow trend (Recharts AreaChart)
  const cashFlowData = [
    { month: "Jan", Inflow: 42000, Outflow: 31000, TaxReserve: 4000 },
    { month: "Feb", Inflow: 48000, Outflow: 33000, TaxReserve: 4500 },
    { month: "Mar", Inflow: 51000, Outflow: 36000, TaxReserve: 5000 },
    { month: "Apr", Inflow: 49000, Outflow: 34000, TaxReserve: 4800 },
    { month: "May", Inflow: 58000, Outflow: 39000, TaxReserve: 5200 },
    { month: "Jun", Inflow: 64000, Outflow: 42000, TaxReserve: 6000 },
  ];

  // Chart Data: Score History progression showing impact of connections
  const scoreHistoryData = [
    { month: "Jan (Base)", score: 480, sourcesConnected: 1 },
    { month: "Feb (+Bank)", score: 530, sourcesConnected: 2 },
    { month: "Mar (No Change)", score: 530, sourcesConnected: 2 },
    { month: "Apr (+GSTN)", score: 690, sourcesConnected: 3 },
    { month: "May (Stable)", score: 710, sourcesConnected: 3 },
    { month: "Jun (Current)", score: healthScore, sourcesConnected: activeSources.length },
  ];

  // Donut chart: Scoring components contribution
  const scoringBreakdownData = sources.map(s => ({
    name: s.name.split(" ")[0], // short name
    value: s.status === "connected" ? s.scoreContribution : 20, // greyed weight
    status: s.status,
    color: s.status === "connected" ? "#1d4ed8" : "#cbd5e1"
  }));

  return (
    <div className="space-y-6">
      
      {/* Toast Notification Container */}
      <AnimatePresence>
        {successToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 max-w-md bg-slate-900 border-l-4 border-emerald-500 text-white rounded-r-xl shadow-2xl p-4 flex gap-3 items-start"
            id="toast-notification"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-extrabold text-xs block text-slate-200">Alternative Credit Engine Sync</span>
              <p className="text-xs text-slate-300 mt-1">{successToast}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Welcome & Interactive Calibration Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-bold text-blue-700 tracking-wider uppercase bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            MSME Corporate Client Area
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-2.5">
            Welcome, {profile?.name || "Apex Manufacturing"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Build and optimize your alternative credit credentials. Connect real-time endpoints to lower capital cost.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 rounded-xl text-xs font-bold text-slate-700 transition-all shadow-xs"
            id="refresh-scorecard-btn"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-blue-600" : ""}`} />
            <span>{isRefreshing ? "Calculating..." : "Sync Live Channels"}</span>
          </button>
          
          <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-blue-200">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Optimize Health Score</span>
          </button>
        </div>
      </div>

      {/* Core KPI Matrix Grid (6 Cards Requested) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* CARD 1: Financial Health Score */}
        <div className="bg-gradient-to-br from-blue-950 to-slate-900 text-white border border-blue-900/40 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-300" id="card-financial-health-score">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest bg-blue-900/40 px-2.5 py-1 rounded-lg border border-blue-800/60">
              Health Score Card
            </span>
            <span className="text-xs text-slate-300 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 border border-emerald-500/20 rounded-md font-bold font-mono">
              +14% MoM
            </span>
          </div>

          <div className="mt-8 flex items-baseline gap-1.5">
            <span className="text-5xl font-black tracking-tight text-white font-mono">{healthScore}</span>
            <span className="text-slate-400 text-sm font-semibold">/ 900</span>
          </div>

          <p className="text-xs text-slate-300 font-bold mt-2">Financial Health Score</p>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-800/80 rounded-full h-1.5 mt-4 overflow-hidden border border-slate-700/40">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-400 h-1.5 rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${(healthScore / 900) * 100}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-800/80 text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-blue-400" />
              Dynamic Alternative Score
            </span>
            <span className="font-bold text-white hover:underline cursor-pointer flex items-center gap-0.5">
              Full breakdown <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* CARD 2: Trust Index */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden group hover:-translate-y-1 transition-all duration-300" id="card-trust-index">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
              {activeSources.length} of {sources.length} Active
            </span>
          </div>

          <div className="mt-6">
            <span className="text-3xl font-black text-slate-900 font-mono tracking-tight">{trustIndex}%</span>
            <p className="text-xs font-bold text-slate-700 mt-1">Alternative Trust Index</p>
            <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
              Integrity metric calculated from continuous real-time compliance feed stability.
            </p>
          </div>

          <div className="flex gap-1.5 mt-4">
            {sources.map(s => (
              <span 
                key={s.id} 
                className={`w-2.5 h-1.5 rounded-full ${
                  s.status === "connected" ? "bg-blue-600" : s.status === "syncing" ? "bg-amber-400 animate-pulse" : "bg-slate-200"
                }`}
                title={`${s.name}: ${s.status}`}
              ></span>
            ))}
          </div>
        </div>

        {/* CARD 3: Risk Category */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden group hover:-translate-y-1 transition-all duration-300" id="card-risk-category">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 border rounded-full ${riskStyle}`}>
              {riskGrade}
            </span>
          </div>

          <div className="mt-6">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{riskCategory}</span>
            <p className="text-xs font-bold text-slate-700 mt-1">Underwriting Risk Rating</p>
            <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
              AI-driven risk classification mapping business stability to prime banking tiers.
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-semibold">Model calibration</span>
            <span className="text-slate-700 font-black">Central AI Risk Core v2.4</span>
          </div>
        </div>

        {/* CARD 4: Recommended Loan */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden group hover:-translate-y-1 transition-all duration-300" id="card-recommended-loan">
          <div className="flex justify-between items-start">
            <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
              Pre-Approved
            </span>
          </div>

          <div className="mt-4">
            <span className="text-2xl font-black text-slate-900 tracking-tight">{recommendedLoanAmount}</span>
            <p className="text-xs font-bold text-slate-700 mt-1">Recommended Credit Limit</p>
            <p className="text-[11px] text-blue-600 font-extrabold mt-1">
              {loanProduct}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              Interest Rate: <strong className="text-slate-700 font-bold">{interestRate}</strong> | Period: <strong className="text-slate-700 font-bold">{repaymentPeriod}</strong>
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400">Synced to 4 partners</span>
            <button className="text-blue-700 font-black hover:underline inline-flex items-center gap-0.5">
              Apply Now <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* CARD 5: Pending Documents / Quick Actions */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden group hover:-translate-y-1 transition-all duration-300" id="card-pending-documents">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Pending Credential Actions</h4>
            <span className="text-[10px] bg-amber-50 border border-amber-200 text-amber-700 font-bold px-2 py-0.5 rounded-full">
              {disconnectedSources.length} Pending Integration
            </span>
          </div>

          <div className="space-y-3 max-h-[140px] overflow-y-auto pr-1">
            {disconnectedSources.length > 0 ? (
              disconnectedSources.map(s => (
                <div key={s.id} className="p-2 border border-slate-100 rounded-xl hover:border-blue-200 hover:bg-slate-50/50 transition-all flex items-center justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 truncate">{s.name}</p>
                    <p className="text-[9px] text-slate-400 truncate mt-0.5">Worth: +{s.scoreContribution} Score points</p>
                  </div>
                  <button 
                    onClick={() => handleConnectSource(s.id)}
                    disabled={s.status === "syncing"}
                    className="px-2.5 py-1 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg text-[10px] transition-all whitespace-nowrap"
                  >
                    {s.status === "syncing" ? "Connecting..." : "Connect API"}
                  </button>
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-slate-400 flex flex-col items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
                <p className="text-xs font-bold">All Alternate Feeds Connected!</p>
                <p className="text-[10px] text-slate-400 mt-0.5">You have unlocked maximum score weighting.</p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 mt-3 flex justify-between items-center text-[10px] text-slate-400">
            <span>Security: 256-bit AES Encryption</span>
            <span className="font-bold text-slate-700">Manage all</span>
          </div>
        </div>

        {/* CARD 6: Recent Activity */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden group hover:-translate-y-1 transition-all duration-300" id="card-recent-activity">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Credential Ledger Logs</h4>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>

          <div className="space-y-3.5 max-h-[140px] overflow-y-auto pr-1 text-xs">
            {activities.map(act => (
              <div key={act.id} className="flex gap-2.5 items-start">
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                  act.type === "success" ? "bg-emerald-500" : act.type === "warning" ? "bg-rose-500" : act.type === "info" ? "bg-blue-500" : "bg-slate-400"
                }`}></span>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-700 font-semibold leading-tight text-[11px]">{act.event}</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Interactive Play Area: Sync Alternate Data Channels section */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 pb-4 mb-4">
          <div>
            <h3 className="font-black text-slate-800 text-sm flex items-center gap-1.5">
              <Database className="w-4.5 h-4.5 text-blue-700" />
              <span>Interactive Underwriting Sandbox & Data Channels</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Toggle authorization states for your enterprise channels to see how your banking parameters adjust.
            </p>
          </div>
          <span className="text-[10px] font-bold text-blue-700 bg-blue-100 border border-blue-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            256-Bit Secure Consent Flow
          </span>
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {sources.map(s => {
            const IconComp = s.icon;
            const isConnected = s.status === "connected";
            const isSyncing = s.status === "syncing";
            return (
              <div 
                key={s.id} 
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isConnected 
                    ? "bg-white border-blue-300 shadow-sm" 
                    : isSyncing 
                    ? "bg-blue-50/20 border-blue-400/40 animate-pulse" 
                    : "bg-white/40 border-slate-200 opacity-75 hover:opacity-100"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <div className={`p-2 rounded-lg ${isConnected ? "bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-400"}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                      isConnected ? "bg-emerald-50 text-emerald-700" : isSyncing ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-400"
                    }`}>
                      {s.status}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-xs mt-3">{s.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{s.description}</p>
                </div>

                <div className="border-t border-slate-100/80 pt-3 mt-4 flex flex-col gap-1.5">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400">Score value:</span>
                    <span className="font-extrabold text-blue-700 font-mono">+{s.scoreContribution} pts</span>
                  </div>
                  {isConnected ? (
                    <button 
                      onClick={() => handleDisconnectSource(s.id)}
                      className="w-full mt-1.5 py-1 border border-rose-200 text-rose-600 bg-rose-50/50 hover:bg-rose-50 hover:text-rose-700 font-semibold rounded-lg text-[10px] transition-all"
                    >
                      Revoke Consent
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleConnectSource(s.id)}
                      disabled={isSyncing}
                      className="w-full mt-1.5 py-1.5 bg-blue-700 hover:bg-blue-800 disabled:bg-slate-100 disabled:text-slate-400 text-white font-extrabold rounded-lg text-[10px] transition-all"
                    >
                      {isSyncing ? "Syncing..." : "Authorize Channel"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Charts & Deep Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Dynamic Area Chart: Monthly Cash Flow Analytics (GST + Banking data combined) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs lg:col-span-2 flex flex-col">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
            <div>
              <h3 className="font-black text-slate-800 text-sm">Monthly Cash Flow Analytics</h3>
              <p className="text-xs text-slate-400 mt-0.5">Combined trade and transaction streams computed via alternate channels</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-blue-700 font-extrabold bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Real-Time Sync Active</span>
            </div>
          </div>

          <div className="h-72 flex-1 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cashFlowData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="inflowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="outflowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.08}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "none" }}
                  labelStyle={{ color: "#ffffff", fontWeight: "bold", fontSize: "12px" }}
                  itemStyle={{ fontSize: "12px" }}
                />
                <Area type="monotone" dataKey="Inflow" name="Cash Inflow" stroke="#1d4ed8" strokeWidth={2.5} fillOpacity={1} fill="url(#inflowGrad)" />
                <Area type="monotone" dataKey="Outflow" name="Cash Outflow" stroke="#ef4444" strokeWidth={1.5} strokeDasharray="4 4" fillOpacity={1} fill="url(#outflowGrad)" />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dynamic Line Chart: Credit Score History Progression */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
            <div>
              <h3 className="font-black text-slate-800 text-sm">Credit Score Progression</h3>
              <p className="text-xs text-slate-400 mt-0.5">Historical impact of linking alternate credentials</p>
            </div>
            <Award className="w-4 h-4 text-blue-700" />
          </div>

          <div className="h-72 flex-1 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreHistoryData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[300, 900]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "none" }}
                  labelStyle={{ color: "#ffffff", fontWeight: "bold", fontSize: "12px" }}
                  itemStyle={{ color: "#60a5fa", fontSize: "12px" }}
                />
                <Line type="monotone" dataKey="score" name="Financial Health Score" stroke="#1d4ed8" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Bottom Educational Banner: How Alternative Scoring Works */}
      <div className="bg-slate-900 text-slate-300 rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row gap-5 items-center justify-between">
        <div className="space-y-1.5 text-center md:text-left">
          <h4 className="text-white font-extrabold text-sm flex items-center justify-center md:justify-start gap-1.5">
            <Lock className="w-4 h-4 text-blue-400" />
            <span>GDPR-Compliant Banking Consent Architecture</span>
          </h4>
          <p className="text-xs text-slate-400 max-w-2xl">
            You hold absolute sovereignty over your company data. Direct channels authenticate via secure OAuth. You can revoke access at any second, immediately scrubbing cached credit card hashes from centralized bank catalogs.
          </p>
        </div>
        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all shrink-0">
          Security Audit Ledger
        </button>
      </div>

    </div>
  );
};
