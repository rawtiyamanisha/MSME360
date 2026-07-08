import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { MSMEOwnerDashboard } from "./MSMEOwnerDashboard";
import { ApplicationDetail } from "../components/ApplicationDetail";
import { MSMEApplication, AssessmentStatus, RiskRating } from "../types";
import { doc, getDocs, collection, setDoc, writeBatch } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { 
  Building2, 
  ShieldCheck, 
  Database, 
  Activity, 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Sparkles,
  RefreshCw,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Briefcase
} from "lucide-react";
import { RISK_RATING_STYLES, STATUS_STYLES, INDUSTRY_TYPES } from "../constants";

// Default seeding data in case local storage or Firestore are uninitialized
const DEFAULT_APPLICATIONS: MSMEApplication[] = [
  {
    id: "M360-8492",
    businessName: "Aura Metal Crafts Pvt Ltd",
    registrationNumber: "27AAACA9342R1Z8",
    industryType: "Manufacturing",
    state: "Maharashtra",
    connectedSources: ["GSTN", "BANK", "TRADE"],
    score: 742,
    riskRating: "LOW",
    status: "APPROVED",
    dateOfIncorporation: "2016-04-12",
    ownerName: "Abhishek Sharma",
    email: "abhishek@aurametals.com",
    phoneNumber: "+91 98230 45123",
    loanRequested: 1500000,
    scores: {
      gstReliability: 88,
      bankStatementHealth: 78,
      utilityReliability: 92,
      tradeCreditReliability: 82
    },
    strengths: [
      "Sovereign GST records synced: Demonstrates exceptional tax compliance history.",
      "Strong Cashflow stability: Continuous operating balance over 180 days with zero bounces.",
      "High transaction velocity: High-frequency merchant ledger events showing liquid trade coverage."
    ],
    weaknesses: [
      "Utility payment delays: Flagged minor regional power grid billing mismatch in Q1.",
      "Input commodity vulnerability: Direct steel raw material index sensitivity."
    ],
    businessInsights: "Aura Metal Crafts Pvt Ltd displays a robust risk profile with a Financial Health Score of 742/900. Having synchronized GST, Bank Statements, and Trade Ledgers, underwriting models have high data transparency. The correlation between GST filing revenue and average daily bank ledger balances is highly consistent (96% alignment index). Current cash velocity is in top SME deciles.",
    comments: "Verified tax files match checked statement deposits. Excellent transaction volume with active regional dealers.",
    updatedAt: "2026-07-07T11:20:00Z"
  },
  {
    id: "M360-2391",
    businessName: "Kalyan Grocery Hub",
    registrationNumber: "29AADCK2319K2ZA",
    industryType: "Retail Trade",
    state: "Karnataka",
    connectedSources: ["BANK", "UTILITY"],
    score: 620,
    riskRating: "MEDIUM",
    status: "UNDER_REVIEW",
    dateOfIncorporation: "2019-11-05",
    ownerName: "Karthik Gowda",
    email: "karthik@kalyangrocery.com",
    phoneNumber: "+91 80234 99182",
    loanRequested: 800000,
    scores: {
      gstReliability: 0,
      bankStatementHealth: 68,
      utilityReliability: 85,
      tradeCreditReliability: 0
    },
    strengths: [
      "Steady retail cashflow: Daily merchant banking deposits indicate high retail coverage index.",
      "Punctual utility filings: Telecom and electricity payouts match localized averages."
    ],
    weaknesses: [
      "Missing GST connection: Underwriting relies on self-reported operational invoices.",
      "Thin files: No trade ledger synchronization restricts commercial credit profile."
    ],
    businessInsights: "Kalyan Grocery Hub is a standard retail trader. Linking GSTN return filings is highly recommended to clarify real top-line revenues and raise the alternative score into prime boundaries. Cash flow remains stable across standard checking history.",
    comments: "Required direct GST filings to unlock higher credit brackets.",
    updatedAt: "2026-07-06T15:40:00Z"
  },
  {
    id: "M360-1120",
    businessName: "Nexa Logistics Enterprises",
    registrationNumber: "07AAACN4921C2ZB",
    industryType: "Logistics & Transportation",
    state: "Delhi",
    connectedSources: ["GSTN", "BANK", "UTILITY", "TRADE"],
    score: 510,
    riskRating: "HIGH",
    status: "GENERATED",
    dateOfIncorporation: "2021-08-20",
    ownerName: "Rajesh Kumar",
    email: "rajesh@nexalogistics.in",
    phoneNumber: "+91 11452 38102",
    loanRequested: 2500000,
    scores: {
      gstReliability: 52,
      bankStatementHealth: 45,
      utilityReliability: 60,
      tradeCreditReliability: 55
    },
    strengths: [
      "Synced sovereign GST return filings: Over 24 months of consistent tax records.",
      "Trade network linked: Actively maps supplier liabilities across commercial nodes."
    ],
    weaknesses: [
      "Cashflow deficit: Frequent overdraft usage and bank check bounce history in last 90 days.",
      "High leverage: Total trade debt exceeds average monthly sales collections."
    ],
    businessInsights: "Nexa Logistics displays high tax filing consistency but significant transactional cash stress. Checking statements report multiple overdraft penalties, reducing cashflow adequacy index. Recommend a collateralized facility or manual business model audit.",
    comments: "Awaiting explanation on recent bank balance drop and overdraft usage.",
    updatedAt: "2026-07-05T09:15:00Z"
  },
  {
    id: "M360-7730",
    businessName: "Zenith Services Group",
    registrationNumber: "33AABZ1102A1Z9",
    industryType: "Information Technology",
    state: "Tamil Nadu",
    connectedSources: ["GSTN", "BANK"],
    score: 810,
    riskRating: "LOW",
    status: "APPROVED",
    dateOfIncorporation: "2015-02-14",
    ownerName: "Meenakshi Sundaram",
    email: "meenakshi@zenithservices.com",
    phoneNumber: "+91 44253 98110",
    loanRequested: 3000000,
    scores: {
      gstReliability: 96,
      bankStatementHealth: 92,
      utilityReliability: 0,
      tradeCreditReliability: 0
    },
    strengths: [
      "Prime alternative score: Pristine corporate tax filing matches high checked ledger averages.",
      "Excellent liquidity indicators: Monthly net cash balances exceed fixed debt service multiple of 3.5x."
    ],
    weaknesses: [
      "Missing utility connections: Minimal local energy bills due to cloud-native remote footprint."
    ],
    businessInsights: "Zenith Services Group ranks in the top decile of alternative credit profiles. High cash reserves, exceptional tax compliance, and stable high-value corporate contracts support immediate unsecured limit expansion.",
    comments: "Highly approved. Perfect record of direct GST invoices matching checked statements.",
    updatedAt: "2026-07-08T00:05:00Z"
  },
  {
    id: "M360-5491",
    businessName: "Vedic Organic Farm Sourcing",
    registrationNumber: "08AABCV1192M1ZO",
    industryType: "Agriculture & Allied Activities",
    state: "Rajasthan",
    connectedSources: ["TRADE", "UTILITY"],
    score: 430,
    riskRating: "CRITICAL",
    status: "REJECTED",
    dateOfIncorporation: "2022-05-18",
    ownerName: "Gajendra Singh",
    email: "gajendra@vedicorganics.com",
    phoneNumber: "+91 29124 38291",
    loanRequested: 600000,
    scores: {
      gstReliability: 0,
      bankStatementHealth: 0,
      utilityReliability: 58,
      tradeCreditReliability: 42
    },
    strengths: [
      "Verified local trade linkages with wholesale mandi associations."
    ],
    weaknesses: [
      "Highly unverified profiles: No bank statements, no GSTN direct API connections.",
      "Delayed supplier settlements: Outstanding trade payments exceed 120 days average."
    ],
    businessInsights: "Vedic Organic is classified as a Critical Risk profile due to a complete lack of checked banking and tax datasets combined with poor credit velocity. Requires manual board audit or extensive physical asset collaterals.",
    comments: "Rejected due to zero bank feeds and high trade payment delays. Advised to connect bank statement portal.",
    updatedAt: "2026-07-04T11:22:00Z"
  },
  {
    id: "M360-6640",
    businessName: "Aroma Hospitality & Dining",
    industryType: "Food & Hospitality",
    registrationNumber: "24AADCA1192H1ZY",
    state: "Gujarat",
    connectedSources: ["BANK"],
    score: 590,
    riskRating: "MEDIUM",
    status: "PENDING",
    dateOfIncorporation: "2020-03-15",
    ownerName: "Neha Patel",
    email: "neha@aromadining.in",
    phoneNumber: "+91 79264 12389",
    loanRequested: 1200000,
    scores: {
      gstReliability: 0,
      bankStatementHealth: 65,
      utilityReliability: 0,
      tradeCreditReliability: 0
    },
    strengths: [
      "Active UPI-focused restaurant terminal receipts: Continuous high daily sales count."
    ],
    weaknesses: [
      "Unregistered GST profile: Operates beneath tax limit threshold, missing tax verification indicators.",
      "High seasonal volatility: Sales revenue contracted by 40% in monsoon months."
    ],
    businessInsights: "Aroma Hospitality displays moderate cash reserves but high seasonal sales volatility. Syncing UPI data feeds or electric utility bills would immediately verify cashflow consistency and could lift the score into the good tier.",
    comments: "Awaiting operational receipts upload or GST declaration.",
    updatedAt: "2026-07-07T18:12:00Z"
  }
];

export const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  
  // Dashboard states
  const [applications, setApplications] = useState<MSMEApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<MSMEApplication | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [riskFilter, setRiskFilter] = useState("ALL");
  const [industryFilter, setIndustryFilter] = useState("ALL");

  // Notifications
  const [notification, setNotification] = useState<{ message: string; type: "success" | "info" } | null>(null);

  const isBankOfficer = profile?.role === "credit_officer" || profile?.role === "administrator";

  // Load applications (hybrid Firestore & localStorage fallback)
  useEffect(() => {
    if (!isBankOfficer) return;

    const loadData = async () => {
      setLoading(true);
      try {
        // Attempt loading from Firestore first
        const querySnapshot = await getDocs(collection(db, "health_cards"));
        const fbCards: MSMEApplication[] = [];
        
        querySnapshot.forEach((docSnap) => {
          fbCards.push(docSnap.data() as MSMEApplication);
        });

        if (fbCards.length > 0) {
          // Sort by updatedAt descending
          fbCards.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
          setApplications(fbCards);
          localStorage.setItem("msme_applications", JSON.stringify(fbCards));
        } else {
          // Check local storage
          const localData = localStorage.getItem("msme_applications");
          if (localData) {
            setApplications(JSON.parse(localData));
          } else {
            // Seed with DEFAULT_APPLICATIONS
            setApplications(DEFAULT_APPLICATIONS);
            localStorage.setItem("msme_applications", JSON.stringify(DEFAULT_APPLICATIONS));
            
            // Proactively save to Firestore to establish baseline records
            try {
              const batch = writeBatch(db);
              DEFAULT_APPLICATIONS.forEach(app => {
                const docRef = doc(db, "health_cards", app.id);
                batch.set(docRef, app);
              });
              await batch.commit();
            } catch (fsErr) {
              console.warn("Could not write initial seed batch to Firestore, continuing with local cache:", fsErr);
            }
          }
        }
      } catch (error) {
        console.warn("Firestore collection load failed or denied, loading local storage cache:", error);
        const localData = localStorage.getItem("msme_applications");
        if (localData) {
          setApplications(JSON.parse(localData));
        } else {
          setApplications(DEFAULT_APPLICATIONS);
          localStorage.setItem("msme_applications", JSON.stringify(DEFAULT_APPLICATIONS));
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isBankOfficer]);

  // Handle status update
  const handleUpdateStatus = async (
    id: string, 
    status: AssessmentStatus, 
    comments: string, 
    approvedAmount?: number
  ) => {
    const updatedApps = applications.map(app => {
      if (app.id === id) {
        return {
          ...app,
          status,
          comments,
          // If approved, update approved sizing, else retain original sizing
          loanRequested: approvedAmount !== undefined ? approvedAmount : app.loanRequested,
          updatedAt: new Date().toISOString()
        };
      }
      return app;
    });

    setApplications(updatedApps);
    localStorage.setItem("msme_applications", JSON.stringify(updatedApps));

    // Save selected app context
    const updatedApp = updatedApps.find(a => a.id === id);
    if (updatedApp) {
      setSelectedApp(updatedApp);
    }

    // Persist to Firestore
    try {
      if (updatedApp) {
        await setDoc(doc(db, "health_cards", id), updatedApp);
        
        // Log transaction inside audit_logs
        const logId = `LOG-${Date.now()}`;
        const newLog = {
          id: logId,
          timestamp: new Date().toISOString(),
          userId: auth.currentUser?.uid || "anonymous-officer",
          userEmail: auth.currentUser?.email || profile?.email || "officer@msme360.com",
          action: `DECISION_${status}`,
          description: `Credit Officer updated application ${id} status to ${status}. Notes: ${comments.substring(0, 50)}`,
          category: "ASSESSMENT"
        };
        await setDoc(doc(db, "audit_logs", logId), newLog);
      }
    } catch (fsErr) {
      console.warn("Firestore update omitted or denied, decision persisted in local cache:", fsErr);
    }

    // Trigger Notification
    setNotification({
      message: `Application ${id} successfully marked as ${status.replace("_", " ")}!`,
      type: "success"
    });
    setTimeout(() => setNotification(null), 4000);
  };

  // Re-run cohort analysis simulator
  const handleReevaluateCohort = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setNotification({
        message: "Dynamic cohort score calibration matching checked tax ledgers completed successfully.",
        type: "info"
      });
      setTimeout(() => setNotification(null), 4000);
    }, 1500);
  };

  // Guard Clause for MSME Owner
  if (!isBankOfficer) {
    return <MSMEOwnerDashboard />;
  }

  // Underwriting KPIs & Portfolio Analytics Calculations
  const totalAppsCount = applications.length;
  const approvedApps = applications.filter(a => a.status === "APPROVED");
  const approvedRate = totalAppsCount > 0 ? Math.round((approvedApps.length / totalAppsCount) * 100) : 0;
  
  // Risk metrics counts
  const lowRiskApps = applications.filter(a => a.riskRating === "LOW");
  const mediumRiskApps = applications.filter(a => a.riskRating === "MEDIUM");
  const highRiskApps = applications.filter(a => a.riskRating === "HIGH" || a.riskRating === "CRITICAL");

  // Sum of recommended pre-approved loan amounts (approx Lakhs)
  const totalAllocatedSizing = applications
    .filter(a => a.status === "APPROVED")
    .reduce((sum, a) => sum + a.loanRequested, 0);

  // Average Score
  const avgAlternativeScore = totalAppsCount > 0 
    ? Math.round(applications.reduce((sum, a) => sum + a.score, 0) / totalAppsCount) 
    : 0;

  // Chart Data: Score Tiers Curve representation
  const scoreDistributionData = [
    { scoreRange: "300-450", count: applications.filter(a => a.score >= 300 && a.score < 450).length, label: "Critical" },
    { scoreRange: "450-550", count: applications.filter(a => a.score >= 450 && a.score < 550).length, label: "High" },
    { scoreRange: "550-650", count: applications.filter(a => a.score >= 550 && a.score < 650).length, label: "Sub-prime" },
    { scoreRange: "650-750", count: applications.filter(a => a.score >= 650 && a.score < 750).length, label: "Fair" },
    { scoreRange: "750-850", count: applications.filter(a => a.score >= 750 && a.score < 850).length, label: "Good" },
    { scoreRange: "850-900", count: applications.filter(a => a.score >= 850 && a.score <= 900).length, label: "Excellent" },
  ];

  // Chart Data: Risk Rating Breakdown
  const riskBreakdownChartData = [
    { name: "Low Risk", value: lowRiskApps.length, color: "#10b981" },
    { name: "Medium Risk", value: mediumRiskApps.length, color: "#3b82f6" },
    { name: "High & Critical", value: highRiskApps.length, color: "#ef4444" }
  ];

  // Chart Data: Sync Channels Integrations across cohort
  const channelsIntegrationsCount = {
    GST: applications.filter(a => a.connectedSources.includes("GSTN")).length,
    BANK: applications.filter(a => a.connectedSources.includes("BANK")).length,
    TRADE: applications.filter(a => a.connectedSources.includes("TRADE")).length,
    UTILITY: applications.filter(a => a.connectedSources.includes("UTILITY")).length
  };

  const channelDistributionData = [
    { name: "GSTR Filings API", value: channelsIntegrationsCount.GST, color: "#1d4ed8" },
    { name: "Statement Analyzers", value: channelsIntegrationsCount.BANK, color: "#3b82f6" },
    { name: "Trade Ledgers", value: channelsIntegrationsCount.TRADE, color: "#60a5fa" },
    { name: "Utility Payments", value: channelsIntegrationsCount.UTILITY, color: "#93c5fd" }
  ];

  // Filtering Logic
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.businessName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;
    const matchesRisk = riskFilter === "ALL" || app.riskRating === riskFilter;
    const matchesIndustry = industryFilter === "ALL" || app.industryType === industryFilter;

    return matchesSearch && matchesStatus && matchesRisk && matchesIndustry;
  });

  return (
    <div className="space-y-6" id="credit-officer-dashboard-root">
      
      {/* Top Notification Banner */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg border flex items-center gap-2.5 animate-in slide-in-from-right-5 duration-300 ${
          notification.type === "success" 
            ? "bg-emerald-50 border-emerald-200 text-emerald-900" 
            : "bg-blue-50 border-blue-200 text-blue-900"
        }`}>
          {notification.type === "success" ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <Sparkles className="w-5 h-5 text-blue-600" />}
          <span className="text-xs font-bold">{notification.message}</span>
        </div>
      )}

      {/* If an application is selected, render deep-dive inspection console */}
      {selectedApp ? (
        <ApplicationDetail 
          application={selectedApp} 
          onClose={() => setSelectedApp(null)} 
          onUpdateStatus={handleUpdateStatus} 
        />
      ) : (
        <>
          {/* Executive Dashboard View (Default) */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5">
            <div>
              <span className="text-[10px] font-bold text-blue-700 tracking-wider uppercase bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                Underwriting Console
              </span>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-2.5" id="dashboard-title">
                MSME Portfolio Analytics
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Assess alternative risk scores, cashflows, and issue pre-approved capital limits for New-to-Bank (NTB) corporate borrowers.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={handleReevaluateCohort}
                disabled={syncing}
                className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 bg-white hover:bg-slate-50 disabled:bg-slate-50 rounded-xl text-xs font-semibold text-slate-700 transition-colors shadow-xs cursor-pointer"
                id="cohort-reeval-btn"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin text-blue-600" : ""}`} />
                <span>{syncing ? "Calibrating..." : "Re-evaluate Cohort"}</span>
              </button>
            </div>
          </div>

          {/* Underwriting KPIs Statistics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="portfolio-kpi-grid">
            
            {/* KPI 1: Total Portfolios */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
                  NTB Core
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                  {loading ? "..." : totalAppsCount}
                </h3>
                <p className="text-xs font-bold text-slate-700 mt-2">NTC/NTB Active Portfolios</p>
                <p className="text-[10px] text-slate-400 mt-1">MSMEs without standard historic ratings.</p>
              </div>
            </div>

            {/* KPI 2: Alternative Scoring Index */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-700 shrink-0">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                  Avg Score
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none font-mono">
                  {loading ? "..." : `${avgAlternativeScore} / 900`}
                </h3>
                <p className="text-xs font-bold text-slate-700 mt-2">Aggregate Alternative Score</p>
                <p className="text-[10px] text-slate-400 mt-1">Reflects general tax & banking discipline.</p>
              </div>
            </div>

            {/* KPI 3: Pre-Approved Capital limits */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                  {approvedRate}% Approved
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-none font-mono">
                  {loading ? "..." : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(totalAllocatedSizing)}
                </h3>
                <p className="text-xs font-bold text-slate-700 mt-2">Total Pre-approved Capital</p>
                <p className="text-[10px] text-slate-400 mt-1">Active capital limits issued under review.</p>
              </div>
            </div>

            {/* KPI 4: Portfolio Underwriting Risk */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-xl text-rose-700 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded-full">
                  Risk Level
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-black text-rose-700 tracking-tight leading-none">
                  {highRiskApps.length > lowRiskApps.length ? "Medium-High" : "Medium-Low"}
                </h3>
                <p className="text-xs font-bold text-slate-700 mt-2">Aggregate Underwriting Risk</p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Low: {lowRiskApps.length} | Med: {mediumRiskApps.length} | High: {highRiskApps.length}
                </p>
              </div>
            </div>

          </div>

          {/* Charts Row: Interactive Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="dashboard-charts-grid">
            
            {/* Alternative Credit Scoring Curve AreaChart */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs lg:col-span-2 flex flex-col">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">Alternative Scoring Curve</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Statistical distribution of active MSME credit ratings (300-900)</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-blue-700 font-semibold bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Gaussian Fit</span>
                </div>
              </div>
              
              <div className="h-64 flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={scoreDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1d4ed8" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#1d4ed8" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="scoreRange" stroke="#94a3b8" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#0f172a", borderRadius: "8px", border: "none" }}
                      labelStyle={{ color: "#ffffff", fontWeight: "bold", fontSize: "12px" }}
                      itemStyle={{ color: "#38bdf8", fontSize: "12px" }}
                    />
                    <Area type="monotone" dataKey="count" name="MSMEs Count" stroke="#1d4ed8" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreColor)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Portfolio Risk and Connections Pie Chart */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">Portfolio Risk Distribution</h3>
                  <p className="text-xs text-slate-400 mt-0.5">MSMEs categorized by dynamic alternate risk factors</p>
                </div>
                <HelpCircle className="w-4 h-4 text-slate-400 cursor-pointer hover:text-slate-600 transition-colors" />
              </div>
              
              <div className="h-44 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskBreakdownChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {riskBreakdownChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Center text of Donut */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-2xl font-black text-slate-800">{totalAppsCount}</span>
                  <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Cohort Size</span>
                </div>
              </div>

              {/* Custom Legend detailing categories */}
              <div className="border-t border-slate-100 pt-3 mt-2 grid grid-cols-3 gap-2 text-[10px] font-bold text-center">
                {riskBreakdownChartData.map((risk) => (
                  <div key={risk.name} className="flex flex-col items-center">
                    <span className="w-2 h-2 rounded-full mb-1" style={{ backgroundColor: risk.color }}></span>
                    <span className="text-slate-500 truncate block max-w-full">{risk.name}</span>
                    <span className="text-slate-800 mt-0.5 font-mono">{risk.value} App{risk.value !== 1 ? "s" : ""}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Interactive MSME Applications Directory Grid */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs" id="directory-panel">
            
            {/* Header with Filters */}
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm">SME Underwriting & Application Registry</h3>
                <p className="text-xs text-slate-400 mt-0.5">Filter, search, and deep-assess MSME alternative profiles for dynamic financing approvals.</p>
              </div>

              {/* Filters Box */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                
                {/* Search field */}
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                  <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                  <input 
                    type="text" 
                    placeholder="Search by business name, registration, state..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent text-xs text-slate-700 focus:outline-hidden w-44 md:w-56"
                  />
                </div>

                {/* Filter Industry */}
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-600">
                  <Filter className="w-3 h-3 text-slate-400" />
                  <select 
                    value={industryFilter} 
                    onChange={(e) => setIndustryFilter(e.target.value)}
                    className="bg-transparent focus:outline-hidden font-semibold cursor-pointer text-xs"
                  >
                    <option value="ALL">All Industries</option>
                    {INDUSTRY_TYPES.map(ind => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>

                {/* Filter Status */}
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-600">
                  <Briefcase className="w-3 h-3 text-slate-400" />
                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-transparent focus:outline-hidden font-semibold cursor-pointer text-xs"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="APPROVED">Approved</option>
                    <option value="PENDING">Pending</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="GENERATED">Generated</option>
                  </select>
                </div>

                {/* Filter Risk */}
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-600">
                  <AlertTriangle className="w-3 h-3 text-slate-400" />
                  <select 
                    value={riskFilter} 
                    onChange={(e) => setRiskFilter(e.target.value)}
                    className="bg-transparent focus:outline-hidden font-semibold cursor-pointer text-xs"
                  >
                    <option value="ALL">All Risks</option>
                    <option value="LOW">Low Risk</option>
                    <option value="MEDIUM">Medium Risk</option>
                    <option value="HIGH">High Risk</option>
                    <option value="CRITICAL">Critical Risk</option>
                  </select>
                </div>

              </div>
            </div>

            {/* Applications Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse" id="msme-applications-table">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200 text-[10px]">
                    <th className="py-3 px-4">Borrower Entity</th>
                    <th className="py-3 px-4">Sector / Jurisdiction</th>
                    <th className="py-3 px-4">Sovereign Data Connections</th>
                    <th className="py-3 px-4 text-center">Health score</th>
                    <th className="py-3 px-4 text-center">Risk rating</th>
                    <th className="py-3 px-4">Underwriting status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-400 font-medium">
                        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
                        <span>Querying core database records...</span>
                      </td>
                    </tr>
                  ) : filteredApplications.length > 0 ? (
                    filteredApplications.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/50 transition-colors group">
                        
                        {/* ID & Name */}
                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-slate-800 group-hover:text-blue-700 transition-colors">
                            {app.businessName}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex flex-wrap items-center gap-1.5">
                            <span className="font-semibold text-slate-500">{app.id}</span>
                            <span>•</span>
                            <span>GSTIN: {app.registrationNumber}</span>
                          </div>
                        </td>

                        {/* Industry & State */}
                        <td className="py-3.5 px-4 text-slate-600">
                          <div className="font-semibold">{app.industryType}</div>
                          <div className="text-[10px] text-slate-400">{app.state}</div>
                        </td>

                        {/* Connected alternate channels */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {app.connectedSources.map(source => (
                              <span key={source} className="text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded-md px-1.5 py-0.5 tracking-wide">
                                {source}
                              </span>
                            ))}
                            {app.connectedSources.length === 0 && (
                              <span className="text-[9px] font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded-md px-1.5 py-0.5 tracking-wide">
                                No Connections
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Alternative Credit Score */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-block px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-100 font-mono font-bold text-slate-800 text-sm">
                            {app.score}
                          </div>
                          <p className="text-[9px] text-slate-400 mt-0.5">out of 900</p>
                        </td>

                        {/* Underwriting Risk rating */}
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-block px-2.5 py-0.5 border text-[10px] font-bold rounded-full ${RISK_RATING_STYLES[app.riskRating].text}`}>
                            {RISK_RATING_STYLES[app.riskRating].label}
                          </span>
                        </td>

                        {/* Evaluation Status */}
                        <td className="py-3.5 px-4">
                          <span className={`inline-block px-2.5 py-0.5 border text-[9px] font-bold tracking-wider rounded-md uppercase ${STATUS_STYLES[app.status]}`}>
                            {app.status.replace("_", " ")}
                          </span>
                        </td>

                        {/* Action Inspect Button */}
                        <td className="py-3.5 px-4 text-right">
                          <button 
                            onClick={() => setSelectedApp(app)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-xl cursor-pointer"
                            id={`analyze-app-${app.id}`}
                          >
                            <span>Analyze Card</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-400 font-medium bg-slate-50/20">
                        <AlertTriangle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <span className="block text-sm font-bold text-slate-600">No active MSME entities matched.</span>
                        <span className="text-xs text-slate-400 mt-1">Adjust search parameters or status/risk category filters.</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </>
      )}

    </div>
  );
};
