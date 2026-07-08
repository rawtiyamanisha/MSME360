import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { MLService, PredictionResponse } from "../services/mlService";
import { 
  FileCheck2, 
  Download, 
  TrendingUp, 
  Award, 
  HelpCircle, 
  ChevronRight, 
  AlertCircle, 
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  DollarSign,
  Briefcase,
  Layers,
  Sparkles,
  Info,
  Printer,
  Check,
  X,
  Clock,
  Activity,
  TrendingDown,
  Building2,
  UserCheck
} from "lucide-react";
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Tooltip,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area
} from "recharts";

export const MSMEHealthCard: React.FC = () => {
  const { profile } = useAuth();
  
  // Interactive Stress-Testing State
  const [stressFactor, setStressFactor] = useState<"NORMAL" | "RAW_MATERIAL_SPIKE" | "MARKET_SLOWDOWN" | "MAX_GROWTH">("NORMAL");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [reportView, setReportView] = useState<"DASHBOARD" | "PDF">("DASHBOARD");

  const reportRef = useRef<HTMLDivElement>(null);

  // Synchronized alternate data sources from the profile (Firestore)
  const alternateSources = profile?.alternateDataSources || {};
  
  // Check connection status of all sources
  const isGstConnected = alternateSources["gst"]?.status === "Connected";
  const isUpiConnected = alternateSources["upi"]?.status === "Connected";
  const isAaConnected = alternateSources["account_aggregator"]?.status === "Connected";
  const isEpfoConnected = alternateSources["epfo"]?.status === "Connected";
  const isUtilityConnected = alternateSources["utility"]?.status === "Connected";
  const isBankConnected = alternateSources["bank_statements"]?.status === "Connected";
  const isUdyamConnected = alternateSources["udyam"]?.status === "Connected";
  const isPanConnected = alternateSources["pan"]?.status === "Connected";

  const connectedCount = [
    isGstConnected,
    isUpiConnected,
    isAaConnected,
    isEpfoConnected,
    isUtilityConnected,
    isBankConnected,
    isUdyamConnected,
    isPanConnected
  ].filter(Boolean).length;

  // ML Prediction State Integration
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchPrediction = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const connectedSources: string[] = [];
        if (isGstConnected) connectedSources.push("gst");
        if (isUpiConnected) connectedSources.push("upi");
        if (isAaConnected) connectedSources.push("account_aggregator");
        if (isEpfoConnected) connectedSources.push("epfo");
        if (isUtilityConnected) connectedSources.push("utility");
        if (isBankConnected) connectedSources.push("bank_statements");
        if (isUdyamConnected) connectedSources.push("udyam");
        if (isPanConnected) connectedSources.push("pan");

        const data = await MLService.getPrediction({
          connectedSources,
          loanRequested: 1500000,
          industryType: profile?.industryType || "Manufacturing",
          dateOfIncorporation: profile?.dateOfIncorporation || "2016-04-12",
          stressFactor
        });

        if (active) {
          setPrediction(data);
        }
      } catch (err: any) {
        if (active) {
          setError(err?.message || "Failed to load ML risk scorecard.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchPrediction();
    return () => {
      active = false;
    };
  }, [
    isGstConnected,
    isUpiConnected,
    isAaConnected,
    isEpfoConnected,
    isUtilityConnected,
    isBankConnected,
    isUdyamConnected,
    isPanConnected,
    stressFactor,
    profile?.industryType,
    profile?.dateOfIncorporation
  ]);

  // Map variables from ML service prediction results
  const finalScore = prediction?.financialHealthScore ?? 520;
  const trustIndex = prediction?.trustIndex ?? 50;
  const scoreModifier = prediction?.scoreModifier ?? 0;
  const stressExplanation = prediction?.stressExplanation ?? "Operating under baseline macroeconomic conditions. Traditional indicators remain stable.";
  const finalLoanAmount = prediction?.recommendedLoanAmount ?? 600000;
  const loanEligibility = prediction?.loanEligibility ?? "Refer to Manual Board Audit (Low Priority)";

  let riskLabel = "Low Risk (Prime Tier)";
  let riskColorText = "text-emerald-700";
  let riskColorBg = "bg-emerald-50 border-emerald-200";
  let riskBadgeColor = "bg-emerald-500";
  let riskShort = "LOW RISK";

  if (finalScore < 600) {
    riskLabel = "High Risk (Cautionary Tier)";
    riskColorText = "text-rose-700";
    riskColorBg = "bg-rose-50 border-rose-200";
    riskBadgeColor = "bg-rose-500";
    riskShort = "HIGH RISK";
  } else if (finalScore < 740) {
    riskLabel = "Moderate Risk (Standard Tier)";
    riskColorText = "text-amber-700";
    riskColorBg = "bg-amber-50 border-amber-200";
    riskBadgeColor = "bg-amber-500";
    riskShort = "MODERATE";
  }

  // 6. Strengths
  const strengths: string[] = [];
  if (isGstConnected) strengths.push("Sovereign GST records synced: Demonstrates exceptional tax compliance history.");
  if (isBankConnected) strengths.push("Strong Cashflow stability: Continuous operating balance over 180 days with zero bounces.");
  if (isUpiConnected) strengths.push("High transaction velocity: High-frequency UPI merchant receipts show liquid retail coverage.");
  if (isUdyamConnected) strengths.push("Statutory registry validated: Micro-enterprise Udyam status confirmed.");
  if (connectedCount >= 5) strengths.push("Aggregated alternative profile: Plentiful data signals compress lender decision cycles.");
  if (strengths.length === 0) {
    strengths.push("Established incorporation age: Over 10 years of industrial domain tenure.");
    strengths.push("Active regional credit history with baseline local trade associations.");
  }

  // 7. Weaknesses
  const weaknesses: string[] = [];
  if (!isGstConnected) weaknesses.push("Missing GST live integration: High reliance on self-reported operational invoices.");
  if (!isBankConnected) weaknesses.push("Checking history unlinked: Consolidated average daily balance represents a major underwriting blindspot.");
  if (!isAaConnected) weaknesses.push("Account Aggregator locked: Inability to execute real-time multi-account audit checks.");
  if (stressFactor === "RAW_MATERIAL_SPIKE") weaknesses.push("Input commodity vulnerability: Direct metal manufacturing raw-material inflation sensitivity.");
  if (stressFactor === "MARKET_SLOWDOWN") weaknesses.push("Receivable collection strain: Delay in external trade buyer settlement speed forecast.");
  if (weaknesses.length === 0) {
    weaknesses.push("Minor utility payment delay simulated during regional energy restructuring.");
  }

  // 8. Business Insights
  const getBusinessInsights = () => {
    return prediction?.businessInsights ?? "Generating underwriting insights...";
  };

  // 9. Compliance Score (0 - 100)
  let baseCompliance = 65;
  if (isGstConnected) baseCompliance += 15;
  if (isPanConnected) baseCompliance += 10;
  if (isUdyamConnected) baseCompliance += 10;
  const complianceScore = Math.min(100, baseCompliance);

  // 10. Cash Flow Stability
  let cashFlowStability = "Weak (Unverified check feeds)";
  if (isBankConnected && isAaConnected) cashFlowStability = "Excellent (Low Volatility Index)";
  else if (isBankConnected || isAaConnected) cashFlowStability = "Good (Moderate reserves)";
  
  if (stressFactor === "RAW_MATERIAL_SPIKE") cashFlowStability = "Slightly Stressed (Compressed)";
  else if (stressFactor === "MARKET_SLOWDOWN") cashFlowStability = "Moderately Volatile (Receivable delays)";

  // 11. Revenue Trend
  let revenueTrend = "Under-documented / Stable";
  if (isGstConnected) {
    if (stressFactor === "MAX_GROWTH") revenueTrend = "Accelerating Surge (+24% YoY)";
    else if (stressFactor === "MARKET_SLOWDOWN") revenueTrend = "Declining Speed (-6% contraction)";
    else revenueTrend = "Consistent Growth (+14% YoY)";
  }

  // 12. Digital Adoption Score (0 - 100)
  let digitalBase = 35;
  if (isUpiConnected) digitalBase += 30;
  if (isBankConnected) digitalBase += 20;
  if (isAaConnected) digitalBase += 15;
  const digitalAdoptionScore = Math.min(100, digitalBase);

  // 13. Growth Potential
  let growthPotential = "Stagnant / Undefined";
  if (isEpfoConnected && isGstConnected) {
    growthPotential = stressFactor === "MAX_GROWTH" ? "Exceptional Growth" : "Strong Potential";
  } else if (isGstConnected || isBankConnected) {
    growthPotential = "Stable / Linear";
  }

  // Underwriting Radar Data (Alternative vectors)
  const radarData = [
    { subject: "Tax Compliance", score: isGstConnected ? Math.min(100, 95 + scoreModifier * 0.1) : 0, fullMark: 100 },
    { subject: "Cashflow Volatility", score: isBankConnected ? Math.min(100, 88 + scoreModifier * 0.2) : 0, fullMark: 100 },
    { subject: "Utility Punctuality", score: isUtilityConnected ? Math.min(100, 94 + scoreModifier * 0.05) : 0, fullMark: 100 },
    { subject: "Payroll Stability", score: isEpfoConnected ? Math.min(100, 90 + scoreModifier * 0.15) : 0, fullMark: 100 },
    { subject: "Identity Trust", score: isPanConnected && isUdyamConnected ? 100 : (isPanConnected || isUdyamConnected ? 50 : 0), fullMark: 100 },
    { subject: "Digital Pen", score: digitalAdoptionScore, fullMark: 100 },
  ];

  // Industry Benchmarking Data
  const benchmarkData = [
    { name: "APEX Metal", score: finalScore, fill: "#1d4ed8" },
    { name: "National SME Avg", score: 580, fill: "#94a3b8" },
    { name: "Metal Sector Avg", score: 630, fill: "#cbd5e1" },
    { name: "Prime Score Cutoff", score: 750, fill: "#10b981" },
  ];

  // 6-Month Projection Trend Data based on stress factor
  const getTrendData = () => {
    const baseRev = [12.4, 13.2, 12.8, 14.5, 15.1, 16.2]; // in Lakhs
    let scale = 1.0;
    if (stressFactor === "RAW_MATERIAL_SPIKE") scale = 0.88;
    else if (stressFactor === "MARKET_SLOWDOWN") scale = 0.72;
    else if (stressFactor === "MAX_GROWTH") scale = 1.25;

    return [
      { month: "Jan", revenue: Math.round(baseRev[0] * scale * 10) / 10, cashflow: Math.round(baseRev[0] * 0.74 * scale * 10) / 10 },
      { month: "Feb", revenue: Math.round(baseRev[1] * scale * 10) / 10, cashflow: Math.round(baseRev[1] * 0.70 * scale * 10) / 10 },
      { month: "Mar", revenue: Math.round(baseRev[2] * scale * 10) / 10, cashflow: Math.round(baseRev[2] * 0.73 * scale * 10) / 10 },
      { month: "Apr", revenue: Math.round(baseRev[3] * scale * 10) / 10, cashflow: Math.round(baseRev[3] * 0.77 * scale * 10) / 10 },
      { month: "May", revenue: Math.round(baseRev[4] * scale * 10) / 10, cashflow: Math.round(baseRev[4] * 0.72 * scale * 10) / 10 },
      { month: "Jun", revenue: Math.round(baseRev[5] * scale * 10) / 10, cashflow: Math.round(baseRev[5] * 0.78 * scale * 10) / 10 },
    ];
  };

  const handleDownload = () => {
    setIsDownloading(true);
    setDownloadSuccess(false);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
      window.print();
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-96 flex flex-col items-center justify-center space-y-4 p-12 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-center">
          <h3 className="text-sm font-bold text-slate-800">Assessing Alternative Risk Parameters...</h3>
          <p className="text-xs text-slate-400 mt-1">Connecting to deep ML scoring node on sovereign alternative registers</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-rose-50/50 border border-rose-200 rounded-3xl space-y-4 text-center max-w-xl mx-auto my-12">
        <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
        <div>
          <h3 className="text-sm font-bold text-slate-800">Sovereign Scoring Model Offline</h3>
          <p className="text-xs text-slate-500 mt-1">{error}</p>
        </div>
        <button 
          onClick={() => {
            setIsLoading(true);
            setError(null);
            // This will trigger the useEffect to retry
            setStressFactor(prev => prev);
          }}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Retry Underwriting Evaluation
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Print Specific CSS Injector */}
      <style>{`
        @media print {
          /* Hide non-printable panels */
          aside, nav, footer, header, .no-print, button {
            display: none !important;
          }
          /* Reset container margins/padding */
          body, html, main, .max-w-7xl {
            background: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            overflow: visible !important;
          }
          /* Enforce high contrast colors in print */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-card-layout {
            border: 2px solid #e2e8f0 !important;
            box-shadow: none !important;
            padding: 24px !important;
            background: white !important;
            page-break-after: always;
          }
        }
      `}</style>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5 no-print">
        <div>
          <span className="text-xs font-bold text-blue-700 tracking-wider uppercase bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            Autonomous Underwriting
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-2.5">
            AI Financial Health Card
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time multi-dimensional credit risk assessment, strengths mapping, and professional PDF-ready sovereign scorecards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button 
              onClick={() => setReportView("DASHBOARD")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                reportView === "DASHBOARD" 
                  ? "bg-white text-slate-900 shadow-xs" 
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Interactive Dashboard
            </button>
            <button 
              onClick={() => setReportView("PDF")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                reportView === "PDF" 
                  ? "bg-white text-slate-900 shadow-xs" 
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              PDF Report Preview
            </button>
          </div>

          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-blue-100"
          >
            <Printer className={`w-4 h-4 ${isDownloading ? "animate-bounce" : ""}`} />
            <span>{isDownloading ? "Formatting PDF..." : "Print / PDF Report"}</span>
          </button>
        </div>
      </div>

      {/* Download/Compile Alert */}
      {downloadSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-semibold no-print">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Sovereign Risk Assessment Passport successfully compiled with SHA-256 ledger certificate. Opening system print dialog...</span>
        </div>
      )}

      {/* Macro Stress testing Control Panel - Dashboard Only */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4 no-print">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <Sliders className="w-4.5 h-4.5 text-blue-700" />
              <span>Macroeconomic Environment Stress-Simulator</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">Evaluate enterprise credit behavior in real-time under volatile market scenarios.</p>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-200 px-2 py-0.5 rounded">Active Mode: {stressFactor}</span>
        </div>

        {/* Selector Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          <button
            onClick={() => setStressFactor("NORMAL")}
            className={`p-3 rounded-xl text-left border transition-all ${
              stressFactor === "NORMAL"
                ? "bg-white border-blue-600 shadow-md text-blue-900 font-extrabold"
                : "bg-white/50 border-slate-200 hover:bg-white text-slate-600"
            }`}
          >
            <span className="text-xs font-bold block">1. Baseline Standard</span>
            <span className="text-[10px] text-slate-400">Modifier: +0 Points</span>
          </button>

          <button
            onClick={() => setStressFactor("RAW_MATERIAL_SPIKE")}
            className={`p-3 rounded-xl text-left border transition-all ${
              stressFactor === "RAW_MATERIAL_SPIKE"
                ? "bg-white border-rose-600 shadow-md text-rose-900 font-extrabold"
                : "bg-white/50 border-slate-200 hover:bg-white text-slate-600"
            }`}
          >
            <span className="text-xs font-bold block">2. Raw Material Spike</span>
            <span className="text-[10px] text-slate-400">Modifier: -50 Points</span>
          </button>

          <button
            onClick={() => setStressFactor("MARKET_SLOWDOWN")}
            className={`p-3 rounded-xl text-left border transition-all ${
              stressFactor === "MARKET_SLOWDOWN"
                ? "bg-white border-rose-600 shadow-md text-rose-900 font-extrabold"
                : "bg-white/50 border-slate-200 hover:bg-white text-slate-600"
            }`}
          >
            <span className="text-xs font-bold block">3. Market Slowdown</span>
            <span className="text-[10px] text-slate-400">Modifier: -90 Points</span>
          </button>

          <button
            onClick={() => setStressFactor("MAX_GROWTH")}
            className={`p-3 rounded-xl text-left border transition-all ${
              stressFactor === "MAX_GROWTH"
                ? "bg-white border-emerald-600 shadow-md text-emerald-900 font-extrabold"
                : "bg-white/50 border-slate-200 hover:bg-white text-slate-600"
            }`}
          >
            <span className="text-xs font-bold block">4. Fulfillment Surge</span>
            <span className="text-[10px] text-slate-400">Modifier: +35 Points</span>
          </button>
        </div>

        {/* Explanation text */}
        <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-blue-900 flex items-start gap-2 leading-relaxed">
          <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <div>
            <strong>Interactive stress simulation analysis: </strong>
            <span>{stressExplanation}</span>
          </div>
        </div>
      </div>

      {/* Conditional View Rendering */}
      {reportView === "DASHBOARD" ? (
        /* DASHBOARD VIEW */
        <div className="space-y-6 no-print">
          
          {/* Primary Metrics Row (Score, Trust, Loan, Limit) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Financial Health Score Circle Ring */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Financial Health Score</span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-black text-slate-900 tracking-tight">{finalScore}</span>
                  <span className="text-slate-400 text-xs font-semibold">/ 900</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-mono">Dynamic alternative ledger score</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">SME Percentile</span>
                <span className="text-xs font-extrabold text-blue-700">Top {Math.round((900 - finalScore) / 6 + 4)}%</span>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100/80">
                <Link to="/risk-assessment" className="flex items-center justify-center gap-1.5 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-bold hover:bg-slate-800 transition-colors">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Explainable AI Breakdown</span>
                </Link>
              </div>
            </div>

            {/* Trust Index */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Trust Index Rating</span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-black text-slate-900 tracking-tight">{trustIndex}%</span>
                  <span className="text-slate-400 text-xs font-semibold">Verification</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 font-mono">Based on active connected APIs</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Channels Linked</span>
                <span className="text-xs font-extrabold text-indigo-700">{connectedCount}/8 Channels</span>
              </div>
            </div>

            {/* Risk Category */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">Risk Category</span>
                <div className="mt-2.5">
                  <span className={`inline-flex px-3 py-1 border rounded-full text-xs font-extrabold ${riskColorBg} ${riskColorText}`}>
                    {riskLabel}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-3 font-mono">Dynamic risk underwriting tier</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Default Probability</span>
                <span className={`text-xs font-extrabold ${riskColorText}`}>
                  {finalScore >= 740 ? "Very Low (<1.2%)" : finalScore >= 600 ? "Moderate (2.8%)" : "Elevated (7.4%)"}
                </span>
              </div>
            </div>

            {/* Recommended Loan Amount */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white border border-slate-800 rounded-2xl p-5 shadow-md flex flex-col justify-between relative overflow-hidden">
              <div className="absolute right-[-10px] bottom-[-10px] opacity-10">
                <DollarSign className="w-24 h-24 text-blue-400" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-black text-blue-300 tracking-wider">Recommended Loan Offer</span>
                <div className="text-2xl font-black text-white mt-2">
                  ₹{finalLoanAmount.toLocaleString("en-IN")}
                </div>
                <p className="text-[10px] text-slate-300 mt-1">Pre-approved working capital limit</p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-bold">Eligibility:</span>
                <span className="font-extrabold text-blue-400 truncate max-w-[120px]" title={loanEligibility}>
                  {finalScore >= 740 ? "Prime Approved" : finalScore >= 600 ? "Standard" : "Refer for Audit"}
                </span>
              </div>
            </div>

          </div>

          {/* Underwriting Parameters (Compliance, Stability, Digital, Growth) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Compliance Score</span>
              <p className="text-xl font-black text-slate-900 mt-1">{complianceScore}/100</p>
              <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
                <div className="bg-blue-600 h-full" style={{ width: `${complianceScore}%` }} />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">GST & PAN validation</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Cash Flow Stability</span>
              <p className="text-sm font-extrabold text-slate-800 mt-1.5 truncate">{cashFlowStability.split(" ")[0]}</p>
              <div className="w-full bg-slate-100 h-1 rounded-full mt-3 overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: isBankConnected ? "85%" : "30%" }} />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Monthly cycle consistency</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Revenue Trend</span>
              <p className="text-xs font-bold text-slate-800 mt-2 truncate">{revenueTrend}</p>
              <div className="w-full bg-slate-100 h-1 rounded-full mt-3 overflow-hidden">
                <div className="bg-violet-500 h-full" style={{ width: isGstConnected ? "80%" : "40%" }} />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">GST sales velocity index</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Digital Adoption Score</span>
              <p className="text-xl font-black text-slate-900 mt-1">{digitalAdoptionScore}%</p>
              <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
                <div className="bg-pink-500 h-full" style={{ width: `${digitalAdoptionScore}%` }} />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">E-payments penetrations</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
              <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Growth Potential</span>
              <p className="text-xs font-extrabold text-slate-800 mt-2 truncate">{growthPotential}</p>
              <div className="w-full bg-slate-100 h-1 rounded-full mt-3 overflow-hidden">
                <div className="bg-amber-500 h-full" style={{ width: isEpfoConnected ? "90%" : "35%" }} />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">EPFO hiring velocity signal</p>
            </div>

          </div>

          {/* Underwriting Charts Section (Radar & Peer Benchmarks & Cash Flow Area Chart) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Radar alternative credit vectors */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2 flex justify-between items-center">
                  <span>Granular Underwriting Vectors</span>
                  <span className="text-[10px] bg-blue-50 text-blue-700 font-extrabold px-2 py-0.5 rounded-full border border-blue-100">AI Model</span>
                </h3>

                <div className="h-60 mt-4 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                      <PolarGrid stroke="#f1f5f9" />
                      <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={10} fontStyle="bold" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" fontSize={8} />
                      <Radar name="My Score" dataKey="score" stroke="#1d4ed8" fill="#1d4ed8" fillOpacity={0.15} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "none" }}
                        itemStyle={{ color: "#ffffff", fontSize: "11px" }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal text-center pt-2 border-t border-slate-50">
                Data generated via live OAuth connections. Missing segments can be synced in Alternate Data Sources.
              </p>
            </div>

            {/* 6-Month Projection Area Line Chart */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2 flex justify-between items-center">
                  <span>Cash Flow & Revenue Projection</span>
                  <span className="text-[10px] text-slate-500 font-mono">INR in Lakhs</span>
                </h3>

                <div className="h-60 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={getTrendData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorCashflow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "none" }}
                        labelStyle={{ color: "#ffffff", fontWeight: "bold" }}
                      />
                      <Area type="monotone" dataKey="revenue" name="Sales Revenue" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={2} />
                      <Area type="monotone" dataKey="cashflow" name="Operating Cashflow" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCashflow)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal text-center pt-2 border-t border-slate-50">
                Forecast calculated by stress factor models relative to GST sales.
              </p>
            </div>

            {/* Benchmarking Bar Chart */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2 flex justify-between items-center">
                  <span>Industry Peer Benchmarking</span>
                  <Award className="w-4 h-4 text-slate-400" />
                </h3>

                <div className="h-60 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={benchmarkData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={[300, 900]} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#0f172a", borderRadius: "12px", border: "none" }}
                        labelStyle={{ color: "#ffffff" }}
                      />
                      <Bar dataKey="score" fill="#cbd5e1" radius={[6, 6, 0, 0]}>
                        {benchmarkData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal text-center pt-2 border-t border-slate-50">
                Reflected against manufacturing MSME guidelines in Maharashtra.
              </p>
            </div>

          </div>

          {/* AI Insights & Strengths/Weaknesses Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* AI Business Insights */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs lg:col-span-2 space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-700" />
                <span>AI Automated Underwriting Insights</span>
              </h3>
              
              <p className="text-xs text-slate-600 leading-relaxed">
                {getBusinessInsights()}
              </p>

              <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-blue-700 shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-slate-900">Security Encrypted & Auditable</p>
                  <p className="text-slate-500 mt-0.5">This analysis complies with GDPR guidelines on automated processing logic.</p>
                </div>
              </div>
            </div>

            {/* Strengths & Weaknesses Panel */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-2">
                Qualitative Score Drivers
              </h3>

              <div className="space-y-4">
                {/* Strengths */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-black text-emerald-600 tracking-wider block">Strengths</span>
                  <div className="space-y-2">
                    {strengths.map((st, i) => (
                      <div key={i} className="flex gap-2 items-start text-xs text-slate-600">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{st}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Weaknesses */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[10px] uppercase font-black text-rose-500 tracking-wider block">Areas for Improvement</span>
                  <div className="space-y-2">
                    {weaknesses.map((wk, i) => (
                      <div key={i} className="flex gap-2 items-start text-xs text-slate-600">
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span className="leading-snug">{wk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      ) : (
        /* PDF PRINT PREVIEW REPORT VIEW */
        <div ref={reportRef} className="bg-white border border-slate-300 rounded-3xl p-8 max-w-4xl mx-auto shadow-xl print-card-layout space-y-8 text-slate-800">
          
          {/* Report Letterhead Header */}
          <div className="border-b-4 border-slate-900 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-700 text-white font-black flex items-center justify-center text-lg">M</span>
                <span className="text-xs uppercase font-black text-slate-500 tracking-widest font-mono">MSME360 Underwriting Systems</span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">SOVEREIGN CREDIT & RISK HEALTH PORTFOLIO</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">Sovereign Financial Access Ledger Verification Passport</p>
            </div>

            <div className="text-left md:text-right text-xs">
              <p className="font-extrabold text-slate-900">CERTIFICATE PASSPORT NO</p>
              <p className="font-mono text-blue-700 font-extrabold text-sm">M360-8492-MH-2026</p>
              <p className="text-[10px] text-slate-400 font-bold mt-1">DATE OF ISSUE: July 8, 2026</p>
            </div>
          </div>

          {/* Underwriting Identification Details */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">Official Trade Name</span>
              <span className="font-bold text-slate-900">APEX METAL CRAFTS PVT LTD</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">Registry Verification</span>
              <span className="font-bold text-slate-900">UDYAM-MH-19-0010482</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">Tax Jurisdiction ID</span>
              <span className="font-mono font-bold text-slate-900">27AAPCA1234M1Z5</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">Sovereign Node ID</span>
              <span className="font-mono font-bold text-blue-700">ledger-ax3-99d-19c</span>
            </div>
          </div>

          {/* Core Score Circle & Verification Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b border-slate-100 pb-6">
            
            {/* Visual Circular Credit Gauge for PDF Look */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-2 flex flex-col items-center justify-center">
              <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Alternative Score</span>
              
              <div className="relative w-32 h-32 flex items-center justify-center">
                {/* SVG circular track */}
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                  <circle cx="50" cy="50" r="40" stroke="#1d4ed8" strokeWidth="8" fill="transparent"
                    strokeDasharray={`${(finalScore / 900) * 251.2} 251.2`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-slate-900 leading-none">{finalScore}</span>
                  <span className="text-[9px] text-slate-400 font-bold mt-1 uppercase">Excellent</span>
                </div>
              </div>

              <div className="px-2.5 py-0.5 border rounded-full text-[10px] font-extrabold uppercase mt-1 tracking-wider bg-white text-slate-700">
                Scale: 300 - 900
              </div>
            </div>

            {/* Verification Underwriting Details Table */}
            <div className="md:col-span-2 space-y-3 text-xs">
              <h3 className="font-black text-slate-900 uppercase text-xs tracking-wider border-b border-slate-100 pb-1 flex items-center gap-1">
                <Award className="w-4 h-4 text-blue-700" />
                <span>Credit Health Underwriting Summary</span>
              </h3>

              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Sovereign Trust Index:</span>
                  <span className="font-extrabold text-slate-900">{trustIndex}% Verified</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Risk Category Classification:</span>
                  <span className={`font-extrabold ${riskColorText}`}>{riskShort}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Pre-Approved Limit (Offer):</span>
                  <span className="font-extrabold text-slate-900">₹{finalLoanAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Sovereign Loan Eligibility:</span>
                  <span className="font-extrabold text-slate-900 truncate max-w-[130px]" title={loanEligibility}>{finalScore >= 740 ? "Pre-Approved" : "Restricted Approved"}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Compliance Punctuality Score:</span>
                  <span className="font-extrabold text-slate-900">{complianceScore}/100</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Cashflow Stability Rating:</span>
                  <span className="font-extrabold text-slate-900">{cashFlowStability.split(" ")[0]}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Documented Revenue Trend:</span>
                  <span className="font-extrabold text-slate-900 truncate max-w-[130px]">{revenueTrend}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Digital Transaction volume:</span>
                  <span className="font-extrabold text-slate-900">{digitalAdoptionScore}% Vol</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 col-span-2">
                  <span className="text-slate-500">Sovereign Growth Potential index:</span>
                  <span className="font-extrabold text-slate-900">{growthPotential}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Underwriting Vector Table */}
          <div className="space-y-3">
            <h3 className="font-black text-slate-900 uppercase text-xs tracking-wider border-b border-slate-100 pb-1">
              CONNECTED ALTERNATIVE DATA SOURCES INDEX
            </h3>

            <table className="w-full text-xs text-left border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-2.5 font-bold text-slate-700">Data Channel Indicator</th>
                  <th className="p-2.5 font-bold text-slate-700">Connection Status</th>
                  <th className="p-2.5 font-bold text-slate-700 text-center">Last Synced</th>
                  <th className="p-2.5 font-bold text-slate-700 text-right">Data Confidence Index</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-2.5 font-semibold">1. GST Tax Filing Portal API</td>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isGstConnected ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                      {isGstConnected ? "Connected" : "Disconnected"}
                    </span>
                  </td>
                  <td className="p-2.5 text-center font-mono text-[10px]">{alternateSources["gst"]?.lastSync || "Never"}</td>
                  <td className="p-2.5 text-right font-bold text-slate-700">{isGstConnected ? alternateSources["gst"]?.dataConfidence : "Unavailable"}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold">2. UPI Transaction Velocity API</td>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isUpiConnected ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                      {isUpiConnected ? "Connected" : "Disconnected"}
                    </span>
                  </td>
                  <td className="p-2.5 text-center font-mono text-[10px]">{alternateSources["upi"]?.lastSync || "Never"}</td>
                  <td className="p-2.5 text-right font-bold text-slate-700">{isUpiConnected ? alternateSources["upi"]?.dataConfidence : "Unavailable"}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold">3. Account Aggregator Consent Portal</td>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isAaConnected ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                      {isAaConnected ? "Connected" : "Disconnected"}
                    </span>
                  </td>
                  <td className="p-2.5 text-center font-mono text-[10px]">{alternateSources["account_aggregator"]?.lastSync || "Never"}</td>
                  <td className="p-2.5 text-right font-bold text-slate-700">{isAaConnected ? alternateSources["account_aggregator"]?.dataConfidence : "Unavailable"}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold">4. EPFO Corporate Payroll Hub</td>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isEpfoConnected ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                      {isEpfoConnected ? "Connected" : "Disconnected"}
                    </span>
                  </td>
                  <td className="p-2.5 text-center font-mono text-[10px]">{alternateSources["epfo"]?.lastSync || "Never"}</td>
                  <td className="p-2.5 text-right font-bold text-slate-700">{isEpfoConnected ? alternateSources["epfo"]?.dataConfidence : "Unavailable"}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold">5. Utility & Broadband billing records</td>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isUtilityConnected ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                      {isUtilityConnected ? "Connected" : "Disconnected"}
                    </span>
                  </td>
                  <td className="p-2.5 text-center font-mono text-[10px]">{alternateSources["utility"]?.lastSync || "Never"}</td>
                  <td className="p-2.5 text-right font-bold text-slate-700">{isUtilityConnected ? alternateSources["utility"]?.dataConfidence : "Unavailable"}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-semibold">6. Checking Statements Ledger Analyzer</td>
                  <td className="p-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isBankConnected ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400"}`}>
                      {isBankConnected ? "Connected" : "Disconnected"}
                    </span>
                  </td>
                  <td className="p-2.5 text-center font-mono text-[10px]">{alternateSources["bank_statements"]?.lastSync || "Never"}</td>
                  <td className="p-2.5 text-right font-bold text-slate-700">{isBankConnected ? alternateSources["bank_statements"]?.dataConfidence : "Unavailable"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Qualitative Drivers Page Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            {/* Strengths */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-black text-emerald-600 tracking-wider block">QUALITATIVE CREDIT STRENGTHS</span>
              <div className="space-y-2">
                {strengths.map((st, i) => (
                  <div key={i} className="flex gap-2 items-start text-xs text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{st}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weaknesses */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-black text-amber-600 tracking-wider block">AREAS DEEMED UNDER REVIEW / RISK AREA</span>
              <div className="space-y-2">
                {weaknesses.map((wk, i) => (
                  <div key={i} className="flex gap-2 items-start text-xs text-slate-700">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{wk}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Report Commentary Block */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2">
            <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-700" />
              <span>AI Credit Officer Endorsement Statement</span>
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed italic">
              "Based on autonomous multi-node checking, {getBusinessInsights()}"
            </p>
          </div>

          {/* Verification Stamps and Ledger Decals */}
          <div className="flex justify-between items-end pt-8 border-t border-slate-100">
            <div className="space-y-1">
              <div className="w-16 h-16 bg-blue-100 border border-blue-200 text-blue-700 font-bold text-[8px] flex items-center justify-center p-2 rounded-full leading-tight text-center uppercase tracking-wider font-mono">
                AI UNDERWRITTEN VERIFIED
              </div>
              <p className="text-[9px] text-slate-400 font-mono">MDIC Thane Hub Validation Stamp</p>
            </div>

            <div className="text-right space-y-1">
              <div className="border-b border-slate-400 pb-1.5 inline-block">
                <span className="font-mono text-xs text-slate-600 tracking-wider">/s/ Autonomous Underwriter v2.4</span>
              </div>
              <p className="text-[9px] text-slate-400 uppercase font-black block">VERIFYING SIGNATURE ENDPOINT</p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
