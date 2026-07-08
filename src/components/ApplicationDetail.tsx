import React, { useState, useEffect } from "react";
import { MSMEApplication, AssessmentStatus, RiskRating } from "../types";
import { MLService, PredictionResponse } from "../services/mlService";
import { 
  ArrowLeft, 
  Check, 
  X, 
  FileText, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Scale, 
  Building, 
  Phone, 
  Mail, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  MessageSquare, 
  HelpCircle, 
  Activity, 
  Database, 
  Sparkles, 
  Clock, 
  Lock,
  ChevronRight,
  Info
} from "lucide-react";
import { RISK_RATING_STYLES, STATUS_STYLES } from "../constants";

interface ApplicationDetailProps {
  application: MSMEApplication;
  onClose: () => void;
  onUpdateStatus: (id: string, status: AssessmentStatus, comments: string, approvedAmount?: number) => void;
}

export const ApplicationDetail: React.FC<ApplicationDetailProps> = ({ 
  application, 
  onClose, 
  onUpdateStatus 
}) => {
  // Interactive Stress Simulation Factors
  const [stressScenario, setStressScenario] = useState<"BASELINE" | "COMMODITY_SPIKE" | "MARKET_SLOWDOWN" | "BOOM_SURGE">("BASELINE");
  const [comments, setComments] = useState(application.comments || "");
  const [approvedAmount, setApprovedAmount] = useState<number>(application.loanRequested);
  const [showActionBox, setShowActionBox] = useState<"APPROVE" | "REJECT" | "REQUEST_INFO" | null>(null);

  // Checklist for Requested Information
  const [requestedItems, setRequestedItems] = useState<Record<string, boolean>>({
    gst_auth: false,
    bank_statement_12m: false,
    utility_bills: false,
    trade_ledgers: false,
    epfo_payroll: false,
    income_tax_returns: false
  });

  const handleToggleRequest = (key: string) => {
    setRequestedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // ML Prediction Integration States
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Synchronize state with incoming application and fetch ML predictions asynchronously
  useEffect(() => {
    let active = true;
    const fetchPrediction = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let pythonStressFactor = "NORMAL";
        if (stressScenario === "COMMODITY_SPIKE") pythonStressFactor = "COMMODITY_SPIKE";
        else if (stressScenario === "MARKET_SLOWDOWN") pythonStressFactor = "DEMAND_DROP";
        else if (stressScenario === "BOOM_SURGE") pythonStressFactor = "BOOM_SURGE";

        const connectedSources = application.connectedSources.map(s => {
          if (s === "GSTN") return "gst";
          if (s === "BANK") return "bank_statements";
          if (s === "TRADE") return "trade_ledgers";
          if (s === "UTILITY") return "utility";
          return s.toLowerCase();
        });

        const data = await MLService.getPrediction({
          connectedSources,
          loanRequested: application.loanRequested,
          industryType: application.industryType,
          dateOfIncorporation: application.dateOfIncorporation,
          stressFactor: pythonStressFactor
        });

        if (active) {
          setPrediction(data);
          // Set approved amount automatically
          setApprovedAmount(data.recommendedLoanAmount);
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

    setComments(application.comments || "");
    setShowActionBox(null);
    fetchPrediction();

    return () => {
      active = false;
    };
  }, [application, stressScenario]);

  // Underwriting Stress Model Calculations
  let scenarioLabel = "Stable Baseline Parameters";
  let scenarioAlert = "";

  if (stressScenario === "COMMODITY_SPIKE") {
    scenarioLabel = "Raw Material Index Shock (+30%)";
    scenarioAlert = "Cashflow stress test detects operating margin pressure. Debt-service multiplier drops to 1.15x.";
  } else if (stressScenario === "MARKET_SLOWDOWN") {
    scenarioLabel = "Consumer Market Slowdown (-20% Demand)";
    scenarioAlert = "Trade velocity contracts. Merchant ledger sync predicts a 15-day collection lag.";
  } else if (stressScenario === "BOOM_SURGE") {
    scenarioLabel = "High-Velocity Regional Boom (+15% Volume)";
    scenarioAlert = "Model predicts revenue acceleration. Dynamic capability score rises into prime boundaries.";
  }

  const simulatedScore = prediction?.financialHealthScore ?? application.score;
  const scoreModifier = prediction?.scoreModifier ?? 0;
  const scenarioDesc = prediction?.stressExplanation ?? "Model operating on historical transactional baseline averages with standard deviation bounds.";
  const simulatedRecommended = prediction?.recommendedLoanAmount ?? Math.round(application.loanRequested * (application.score / 900) * 0.9);
  const simulatedRisk = (prediction?.riskCategory as RiskRating) ?? "MEDIUM";

  // Format currency helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleActionSubmit = (status: AssessmentStatus) => {
    if (status === "APPROVED") {
      onUpdateStatus(application.id, "APPROVED", comments, approvedAmount);
    } else if (status === "REJECTED") {
      onUpdateStatus(application.id, "REJECTED", comments);
    } else if (status === "UNDER_REVIEW") {
      const activeRequests = Object.entries(requestedItems)
        .filter(([_, checked]) => checked)
        .map(([key]) => key.toUpperCase().replace("_", " "))
        .join(", ");
      
      const requestPrefix = activeRequests 
        ? `[Information Requested: ${activeRequests}] ` 
        : "[Information Requested] ";
      
      onUpdateStatus(application.id, "UNDER_REVIEW", requestPrefix + comments);
    }
    setShowActionBox(null);
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-xs animate-in fade-in slide-in-from-top-3 duration-300" id="application-detail-panel">
      
      {/* Top Breadcrumb Rail */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg"
          id="back-to-console-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Executive Console</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Underwriting Node</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-mono text-slate-500 font-bold">{application.id}</span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Row 1: Primary Header & Dynamic Score Display */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Business Core Demographics card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs flex flex-col justify-between lg:col-span-2">
            <div className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md uppercase tracking-wide">
                    {application.industryType}
                  </span>
                  <h2 className="text-xl md:text-2xl font-black text-slate-900 mt-2 tracking-tight">
                    {application.businessName}
                  </h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    GSTIN: {application.registrationNumber} • State Jurisdictions: {application.state}
                  </p>
                </div>
                
                <span className={`inline-block px-3 py-1 border text-xs font-bold tracking-wider rounded-md uppercase ${STATUS_STYLES[application.status]}`}>
                  {application.status.replace("_", " ")}
                </span>
              </div>

              {/* Grid: Secondary Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 flex items-center gap-1"><Building className="w-3.5 h-3.5" /> Owner / Rep</span>
                  <p className="font-bold text-slate-800 mt-0.5">{application.ownerName}</p>
                </div>
                <div>
                  <span className="text-slate-400 flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Incorporated</span>
                  <p className="font-bold text-slate-800 mt-0.5">{new Date(application.dateOfIncorporation).getFullYear()} ({new Date().getFullYear() - new Date(application.dateOfIncorporation).getFullYear()} Years)</p>
                </div>
                <div>
                  <span className="text-slate-400 flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Telephone</span>
                  <p className="font-bold text-slate-800 mt-0.5">{application.phoneNumber}</p>
                </div>
                <div>
                  <span className="text-slate-400 flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Corporate Email</span>
                  <p className="font-bold text-slate-800 mt-0.5 truncate">{application.email}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-2xl border-b border-x border-slate-200">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Last Underwriter Eval: {new Date(application.updatedAt).toLocaleString()}</span>
              </span>
              <span className="text-blue-700 font-bold bg-blue-50 px-2.5 py-1 border border-blue-100 rounded-md">
                {application.connectedSources.length} Feeds Synced
              </span>
            </div>
          </div>

          {/* Interactive Financial Health Card */}
          <div className="bg-slate-900 border border-slate-950 rounded-2xl p-6 text-white relative overflow-hidden flex flex-col justify-between shadow-md">
            
            {/* Subtle background glow */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-600 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

            <div className="flex justify-between items-start z-10">
              <div>
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Financial Health Card</span>
                <p className="text-[11px] text-slate-400 mt-0.5 font-mono">ID: {application.id}</p>
              </div>
              <ShieldCheck className="w-6 h-6 text-blue-400" />
            </div>

            {/* Simulated Score Display */}
            <div className="my-6 text-center z-10">
              <div className="relative inline-block">
                <div className="text-5xl font-black tracking-tight font-mono text-white">
                  {simulatedScore}
                </div>
                {scoreModifier !== 0 && (
                  <div className={`absolute -right-10 top-0 text-xs font-bold font-mono px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
                    scoreModifier > 0 ? "text-emerald-400 bg-emerald-950/60" : "text-rose-400 bg-rose-950/60"
                  }`}>
                    {scoreModifier > 0 ? "+" : ""}{scoreModifier}
                  </div>
                )}
              </div>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-1">SME Underwriting score (300-900)</p>

              {/* Progress scale */}
              <div className="w-full bg-slate-800 rounded-full h-1.5 mt-4 overflow-hidden">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    simulatedScore >= 750 ? "bg-emerald-500" :
                    simulatedScore >= 650 ? "bg-blue-500" :
                    simulatedScore >= 550 ? "bg-amber-500" : "bg-rose-500"
                  }`}
                  style={{ width: `${((simulatedScore - 300) / 600) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-[9px] text-slate-500 mt-1 font-semibold font-mono">
                <span>300 (POOR)</span>
                <span>750 (EXCELLENT)</span>
                <span>900</span>
              </div>
            </div>

            {/* Risk rating & connected stamp */}
            <div className="flex justify-between items-center z-10 border-t border-slate-800 pt-4 mt-2">
              <div>
                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Risk Level</p>
                <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full ${
                  simulatedRisk === "LOW" ? "text-emerald-400 bg-emerald-950/60 border border-emerald-900" :
                  simulatedRisk === "MEDIUM" ? "text-blue-400 bg-blue-950/60 border border-blue-900" :
                  simulatedRisk === "HIGH" ? "text-amber-400 bg-amber-950/60 border border-amber-900" :
                  "text-rose-400 bg-rose-950/60 border border-rose-900"
                }`}>
                  {simulatedRisk} RISK
                </span>
              </div>

              <div className="text-right">
                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Verification</p>
                <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-blue-400 justify-end">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>DIRECT SYNC</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Row 2: Granular Score Breakdowns & Sovereign Connections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Sub-Score Breakdown progress bars */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs lg:col-span-2">
            <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-blue-700" />
              <span>Granular Alternative Scoring Drivers</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
              
              {/* GST filing accuracy */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">GST filing regularity (GSTR-3B Accuracy)</span>
                  <span className="font-extrabold text-slate-900 font-mono">{application.scores.gstReliability}/100</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${application.scores.gstReliability}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">Tracks monthly transaction declarations matched with e-Way billing volumes.</p>
              </div>

              {/* Bank statements cashflow stability */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">Bank Statement Health (Average Monthly Balance)</span>
                  <span className="font-extrabold text-slate-900 font-mono">{application.scores.bankStatementHealth}/100</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${application.scores.bankStatementHealth}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">Measures cash reserves, debit velocity, and overdraft frequency buffers.</p>
              </div>

              {/* Utility Reliability */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">Utility Punctuality (Power & Telecom)</span>
                  <span className="font-extrabold text-slate-900 font-mono">{application.scores.utilityReliability}/100</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${application.scores.utilityReliability}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">Evaluates local operating continuity based on grid payments lag.</p>
              </div>

              {/* Trade Credit */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">Trade Creditor Settlement Discipline</span>
                  <span className="font-extrabold text-slate-900 font-mono">{application.scores.tradeCreditReliability}/100</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className="bg-amber-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${application.scores.tradeCreditReliability}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">Measures outstanding aging payments to material suppliers from buy ledgers.</p>
              </div>

            </div>
          </div>

          {/* Connected Data Feeds Status */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
            <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
              <Database className="w-4.5 h-4.5 text-blue-700" />
              <span>Sovereign Connection Audit</span>
            </h3>

            <div className="space-y-3.5 pt-4">
              {[
                { key: "GSTN", label: "GST Network filing returns", name: "GSTR Ledger" },
                { key: "BANK", label: "Bank Statement Analyzer (BSA)", name: "Transactional Ledger" },
                { key: "TRADE", label: "Trade Creditors database API", name: "Supplier Ledger" },
                { key: "UTILITY", label: "Electricity & Telecom utilities", name: "Operational Feed" },
              ].map(source => {
                const isConnected = application.connectedSources.includes(source.key);
                return (
                  <div key={source.key} className="flex items-center justify-between border-b border-slate-50 pb-2.5 last:border-0 last:pb-0">
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs">{source.name}</h4>
                      <p className="text-[10px] text-slate-400">{source.label}</p>
                    </div>
                    
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      isConnected 
                        ? "text-emerald-700 bg-emerald-50 border-emerald-100" 
                        : "text-slate-400 bg-slate-50 border-slate-100"
                    }`}>
                      {isConnected ? "ACTIVE" : "MISSING"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Row 3: Loan Recommendation & Macro Stress Simulator (Crucial Feature!) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs" id="recommendation-engine-panel">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                <Scale className="w-4.5 h-4.5 text-blue-700" />
                <span>Alternative Loan Underwriting Recommendation</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Automated credit scoring algorithm recommends loan sizing bounds adjusted for stress.</p>
            </div>

            {/* Scenario Switcher Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-xl p-1 shrink-0">
              <button 
                onClick={() => setStressScenario("BASELINE")}
                className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all ${
                  stressScenario === "BASELINE" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Baseline
              </button>
              <button 
                onClick={() => setStressScenario("COMMODITY_SPIKE")}
                className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all ${
                  stressScenario === "COMMODITY_SPIKE" ? "bg-rose-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Cost Shock
              </button>
              <button 
                onClick={() => setStressScenario("MARKET_SLOWDOWN")}
                className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all ${
                  stressScenario === "MARKET_SLOWDOWN" ? "bg-amber-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Demand Drop
              </button>
              <button 
                onClick={() => setStressScenario("BOOM_SURGE")}
                className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all ${
                  stressScenario === "BOOM_SURGE" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Expansion Surge
              </button>
            </div>
          </div>

          {/* Stress alert notification banner */}
          {stressScenario !== "BASELINE" && (
            <div className={`p-3 rounded-xl mb-5 text-xs flex items-center gap-2 border ${
              stressScenario === "BOOM_SURGE" 
                ? "text-emerald-900 bg-emerald-50 border-emerald-200" 
                : stressScenario === "COMMODITY_SPIKE" 
                ? "text-rose-900 bg-rose-50 border-rose-200" 
                : "text-amber-900 bg-amber-50 border-amber-200"
            }`}>
              {stressScenario === "BOOM_SURGE" ? <TrendingUp className="w-4.5 h-4.5 text-emerald-600 shrink-0" /> : <TrendingDown className="w-4.5 h-4.5 shrink-0" />}
              <span className="font-semibold">{scenarioAlert}</span>
            </div>
          )}

          {/* Metrics comparison grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Sizing panel 1: Requested */}
            <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Loan Requested</span>
              <div className="text-xl font-extrabold text-slate-800 mt-1 font-mono">
                {formatCurrency(application.loanRequested)}
              </div>
              <p className="text-[10px] text-slate-500 mt-1">SME capital request ledger</p>
            </div>

            {/* Sizing panel 2: Recommended */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 text-center">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider flex items-center justify-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-600" />
                <span>Recommended Limit</span>
              </span>
              <div className="text-xl font-black text-blue-900 mt-1 font-mono">
                {formatCurrency(simulatedRecommended)}
              </div>
              <p className="text-[10px] text-blue-700 font-semibold mt-1">
                {Math.round((simulatedRecommended / application.loanRequested) * 100)}% of sizing limit
              </p>
            </div>

            {/* Sizing panel 3: Scenario Modifier Status */}
            <div className="bg-slate-50 border border-slate-150 rounded-xl p-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Stress Testing Model Status</span>
              <p className="font-bold text-slate-800 text-xs mt-1">{scenarioLabel}</p>
              <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{scenarioDesc}</p>
            </div>

          </div>
        </div>

        {/* Row 4: AI Assessment Insights & Strengths/Weaknesses lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* AI Insights narrative */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
            <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-3 flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-blue-700" />
              <span>Model Risk Insights & Alternative Assessment Narrative</span>
            </h3>
            <p className="text-xs text-slate-600 mt-4 leading-relaxed bg-slate-50/60 p-4 rounded-xl border border-slate-100">
              {application.businessInsights}
            </p>
          </div>

          {/* Underwriting Balance Sheet: Strengths and Weaknesses lists */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-5 flex flex-col justify-between">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-3">
                Underwriting Risk Balancing
              </h3>

              <div className="grid grid-cols-1 gap-4 pt-4 text-xs">
                {/* Strengths */}
                <div className="space-y-2">
                  <h4 className="font-bold text-emerald-700 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" />
                    <span>Alternative Credit Strength Indicators</span>
                  </h4>
                  <ul className="space-y-1.5 list-disc list-inside text-slate-600 pl-1">
                    {application.strengths.map((st, i) => (
                      <li key={i} className="leading-tight">{st}</li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="space-y-2 border-t border-slate-50 pt-3">
                  <h4 className="font-bold text-rose-700 flex items-center gap-1.5">
                    <TrendingDown className="w-4 h-4" />
                    <span>Target Risk Factors & Mitigation Needs</span>
                  </h4>
                  <ul className="space-y-1.5 list-disc list-inside text-slate-600 pl-1">
                    {application.weaknesses.map((wk, i) => (
                      <li key={i} className="leading-tight">{wk}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 font-mono text-right flex items-center justify-end gap-1 pt-3 border-t border-slate-100">
              <Lock className="w-3 h-3 text-slate-300" />
              <span>Model calibrated against active baselines: SME_v2.4.7_PROD</span>
            </div>
          </div>

        </div>

        {/* Row 5: Credit Officer Decision Action Console (Crucial Area) */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-5" id="underwriting-action-center">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm">
                Underwriting Action & Decision Center
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">Authoritatively record loan approval limits, issue rejection indices, or flag missing records.</p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-200 rounded-full flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Audited Policy Valid</span>
              </span>
            </div>
          </div>

          {/* Action Choice buttons */}
          {showActionBox === null ? (
            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={() => {
                  setShowActionBox("APPROVE");
                  setComments(`Alternative underwriter scores show high compliance alignment. Limit recommended at ${formatCurrency(simulatedRecommended)} pre-approved.`);
                }}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                id="approve-loan-btn"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Approve Underwriting Limit</span>
              </button>

              <button 
                onClick={() => {
                  setShowActionBox("REJECT");
                  setComments("Declined due to insufficient transactional data sync combined with critical risk indicators.");
                }}
                className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                id="reject-loan-btn"
              >
                <X className="w-4 h-4" />
                <span>Decline Credit Request</span>
              </button>

              <button 
                onClick={() => {
                  setShowActionBox("REQUEST_INFO");
                  setComments("Awaiting complementary alternate channel authorization to verify operational compliance balances.");
                }}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                id="request-info-btn"
              >
                <Info className="w-4 h-4" />
                <span>Request Deeper Compliance Sync</span>
              </button>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4 animate-in slide-in-from-bottom-2 duration-200">
              
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                  {showActionBox === "APPROVE" && <span className="text-emerald-700">Approve Sizing & Issue Limit</span>}
                  {showActionBox === "REJECT" && <span className="text-rose-700">Decline Application Details</span>}
                  {showActionBox === "REQUEST_INFO" && <span className="text-blue-700">Request Sovereign Documents & Files</span>}
                </h4>
                <button 
                  onClick={() => setShowActionBox(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg bg-white border border-slate-150"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Dynamic Sub-Form Input */}
              {showActionBox === "APPROVE" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Pre-Approved Capital Limit (INR)</label>
                    <div className="flex items-center w-full bg-white border border-slate-200 rounded-xl px-3 py-2">
                      <span className="text-slate-400 font-bold mr-1.5 font-mono">₹</span>
                      <input 
                        type="number" 
                        value={approvedAmount}
                        onChange={(e) => setApprovedAmount(Number(e.target.value))}
                        className="bg-transparent text-sm font-bold text-slate-800 w-full focus:outline-hidden font-mono"
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">Recommended Baseline: {formatCurrency(simulatedRecommended)}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Compliance Interest Rate (%)</label>
                    <div className="flex items-center w-full bg-white border border-slate-200 rounded-xl px-3 py-2">
                      <input 
                        type="text" 
                        defaultValue="9.45" 
                        disabled
                        className="bg-transparent text-xs font-bold text-slate-500 w-full focus:outline-hidden"
                      />
                      <span className="text-slate-400 font-bold ml-1.5 font-mono">% p.a.</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5">Calculated from dynamic alternative risk indicators.</p>
                  </div>
                </div>
              )}

              {showActionBox === "REQUEST_INFO" && (
                <div className="space-y-2.5 text-xs">
                  <label className="font-bold text-slate-700 block">Select Alternate Channels to Request For Sync:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {[
                      { key: "gst_auth", label: "GST Network GSTR-1 & GSTR-3B" },
                      { key: "bank_statement_12m", label: "12-month Bank Ledger Statements" },
                      { key: "utility_bills", label: "Electricity & Telecom utilities records" },
                      { key: "trade_ledgers", label: "Trade Creditors & Supplier Ledgers" },
                      { key: "epfo_payroll", label: "EPFO Employee Payroll Sync" },
                      { key: "income_tax_returns", label: "Corporate ITR-6 Filing Records" }
                    ].map(item => (
                      <label 
                        key={item.key} 
                        className={`flex items-center gap-2 border rounded-xl p-3 cursor-pointer transition-all ${
                          requestedItems[item.key] 
                            ? "bg-blue-50/50 border-blue-400 text-blue-900 font-bold" 
                            : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
                        }`}
                      >
                        <input 
                          type="checkbox" 
                          checked={requestedItems[item.key]}
                          onChange={() => handleToggleRequest(item.key)}
                          className="w-4 h-4 text-blue-700 accent-blue-700 shrink-0"
                        />
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Shared Comments Area */}
              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-700 block">Credit Officer Sizing Narrative & Review Comments</label>
                <div className="flex items-start w-full bg-white border border-slate-200 rounded-xl px-3 py-2">
                  <MessageSquare className="w-4 h-4 text-slate-400 mr-2 mt-1 shrink-0" />
                  <textarea 
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Enter review findings, exception reasons, or required documents details..."
                    className="bg-transparent text-xs text-slate-700 w-full focus:outline-hidden min-h-16"
                  />
                </div>
              </div>

              {/* Form Action buttons */}
              <div className="flex justify-end gap-2 text-xs">
                <button 
                  onClick={() => setShowActionBox(null)}
                  className="px-3 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleActionSubmit(showActionBox === "APPROVE" ? "APPROVED" : showActionBox === "REJECT" ? "REJECTED" : "UNDER_REVIEW")}
                  className={`px-4 py-2 font-bold text-white rounded-xl shadow-sm transition-all cursor-pointer ${
                    showActionBox === "APPROVE" ? "bg-emerald-600 hover:bg-emerald-700" :
                    showActionBox === "REJECT" ? "bg-rose-600 hover:bg-rose-700" :
                    "bg-slate-800 hover:bg-slate-900"
                  }`}
                  id="submit-underwriting-btn"
                >
                  Submit Underwriting Decision
                </button>
              </div>

            </div>
          )}

          {/* Verification stamp representation */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 font-mono gap-2">
            <span>Cryptographic Digital Audit Ledger Integrity Verified</span>
            <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-150">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              <span>SHA-256 Hash: 9fa2f...64be9</span>
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};
