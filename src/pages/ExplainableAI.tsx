import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { MLService, PredictionResponse, ShapValue } from "../services/mlService";
import { 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Info, 
  ShieldCheck, 
  AlertTriangle, 
  Sliders, 
  Database, 
  Building2, 
  HelpCircle, 
  CheckCircle2, 
  Zap, 
  Gauge, 
  FileSpreadsheet, 
  RotateCcw, 
  FileText, 
  Check, 
  X,
  Target,
  Clock,
  ArrowUpRight,
  RefreshCw
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Cell 
} from "recharts";

export const ExplainableAI: React.FC = () => {
  const { profile } = useAuth();

  // Load baseline profile alternate sources
  const profileSources = profile?.alternateDataSources || {};
  const initialGst = profileSources["gst"]?.status === "Connected";
  const initialBank = profileSources["bank_statements"]?.status === "Connected";
  const initialAa = profileSources["account_aggregator"]?.status === "Connected";
  const initialUpi = profileSources["upi"]?.status === "Connected";
  const initialEpfo = profileSources["epfo"]?.status === "Connected";
  const initialUdyam = profileSources["udyam"]?.status === "Connected";
  const initialPan = profileSources["pan"]?.status === "Connected";
  const initialUtility = profileSources["utility"]?.status === "Connected";

  // Simulation Sandbox State
  const [sandboxMode, setSandboxMode] = useState<boolean>(false);
  const [simGst, setSimGst] = useState<boolean>(initialGst);
  const [simBank, setSimBank] = useState<boolean>(initialBank);
  const [simAa, setSimAa] = useState<boolean>(initialAa);
  const [simUpi, setSimUpi] = useState<boolean>(initialUpi);
  const [simEpfo, setSimEpfo] = useState<boolean>(initialEpfo);
  const [simUdyam, setSimUdyam] = useState<boolean>(initialUdyam);
  const [simPan, setSimPan] = useState<boolean>(initialPan);
  const [simUtility, setSimUtility] = useState<boolean>(initialUtility);

  const [stressFactor, setStressFactor] = useState<"NORMAL" | "COMMODITY_SPIKE" | "DEMAND_DROP" | "BOOM_SURGE">("NORMAL");
  const [loanRequested, setLoanRequested] = useState<number>(1500000);

  // Prediction Data State
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"SHAP_FLOW" | "FEATURE_IMPORTANCE" | "SANDBOX">("SHAP_FLOW");

  // Determine active sources based on sandbox vs profile
  const activeGst = sandboxMode ? simGst : initialGst;
  const activeBank = sandboxMode ? simBank : initialBank;
  const activeAa = sandboxMode ? simAa : initialAa;
  const activeUpi = sandboxMode ? simUpi : initialUpi;
  const activeEpfo = sandboxMode ? simEpfo : initialEpfo;
  const activeUdyam = sandboxMode ? simUdyam : initialUdyam;
  const activePan = sandboxMode ? simPan : initialPan;
  const activeUtility = sandboxMode ? simUtility : initialUtility;

  // Sync profile sources if profile updates and not in sandbox mode
  useEffect(() => {
    if (!sandboxMode) {
      setSimGst(initialGst);
      setSimBank(initialBank);
      setSimAa(initialAa);
      setSimUpi(initialUpi);
      setSimEpfo(initialEpfo);
      setSimUdyam(initialUdyam);
      setSimPan(initialPan);
      setSimUtility(initialUtility);
    }
  }, [profile, sandboxMode, initialGst, initialBank, initialAa, initialUpi, initialEpfo, initialUdyam, initialPan, initialUtility]);

  // Fetch ML predictions
  useEffect(() => {
    let active = true;
    const fetchPrediction = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const connectedSources: string[] = [];
        if (activeGst) connectedSources.push("gst");
        if (activeUpi) connectedSources.push("upi");
        if (activeAa) connectedSources.push("account_aggregator");
        if (activeEpfo) connectedSources.push("epfo");
        if (activeUtility) connectedSources.push("utility");
        if (activeBank) connectedSources.push("bank_statements");
        if (activeUdyam) connectedSources.push("udyam");
        if (activePan) connectedSources.push("pan");

        const data = await MLService.getPrediction({
          connectedSources,
          loanRequested,
          industryType: profile?.industryType || "Manufacturing",
          dateOfIncorporation: profile?.dateOfIncorporation || "2016-04-12",
          stressFactor
        });

        if (active) {
          setPrediction(data);
        }
      } catch (err: any) {
        if (active) {
          setError(err?.message || "Failed to load Explainable AI model outputs.");
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
    activeGst,
    activeUpi,
    activeAa,
    activeEpfo,
    activeUtility,
    activeBank,
    activeUdyam,
    activePan,
    stressFactor,
    loanRequested,
    profile?.industryType,
    profile?.dateOfIncorporation
  ]);

  const resetSandbox = () => {
    setSimGst(initialGst);
    setSimBank(initialBank);
    setSimAa(initialAa);
    setSimUpi(initialUpi);
    setSimEpfo(initialEpfo);
    setSimUdyam(initialUdyam);
    setSimPan(initialPan);
    setSimUtility(initialUtility);
    setStressFactor("NORMAL");
    setLoanRequested(1500000);
  };

  // Process SHAP values for display and sorting
  const baseValue = prediction?.baseValue ?? 520;
  const currentScore = prediction?.financialHealthScore ?? 520;
  const scoreDiff = currentScore - baseValue;

  const rawShapList = prediction?.shapValues || [];
  
  // Sort SHAP list by absolute impact for Feature Importance chart
  const shapChartData = [...rawShapList]
    .map(x => ({
      feature: x.feature,
      impact: x.shapValue,
      absoluteImpact: Math.abs(x.shapValue),
      category: x.category,
      value: x.value
    }))
    .sort((a, b) => b.absoluteImpact - a.absoluteImpact);

  // Positive vs Risk factors separation
  const positiveFactors = rawShapList.filter(x => x.shapValue > 0);
  const riskFactors = rawShapList.filter(x => x.shapValue < 0);
  const neutralFactors = rawShapList.filter(x => x.shapValue === 0);

  // High-contrast, banking-dashboard colors based on score
  const getScoreColorClass = (score: number) => {
    if (score >= 740) return { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" };
    if (score >= 600) return { text: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" };
    if (score >= 500) return { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" };
    return { text: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" };
  };

  const scoreColors = getScoreColorClass(currentScore);

  return (
    <div className="space-y-6 pb-12" id="explainable-ai-viewport">
      
      {/* 1. Dashboard Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-slate-900 text-white rounded-md text-[10px] font-bold tracking-wider uppercase font-mono">
              XAI ENGINE v3.14-SHAP
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Sovereign Node Secured
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
            Explainable AI Underwriting Console
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Sovereign risk modeling layer leveraging Kernel SHAP (Shapley Additive exPlanations) to decompose non-traditional alternate telemetry feeds into transparent credit health score contributions.
          </p>
        </div>
        
        <div className="flex items-center gap-3 self-stretch lg:self-auto">
          <button
            onClick={() => setSandboxMode(!sandboxMode)}
            className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
              sandboxMode 
                ? "bg-amber-500 text-white border-amber-500 hover:bg-amber-600" 
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{sandboxMode ? "Exit Simulation Sandbox" : "Activate Simulation Sandbox"}</span>
          </button>

          {sandboxMode && (
            <button
              onClick={resetSandbox}
              title="Reset sandbox values"
              className="p-2.5 border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Warning banner when sandbox mode is enabled */}
      {sandboxMode && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold">Sandbox Policy Mode Active:</span> You are currently editing active data links and macroeconomic variables in simulation mode. This does not affect your legal corporate record but lets you run "What-If" policy validations.
          </div>
        </div>
      )}

      {/* 2. Top-Level Enterprise Score Metrics */}
      {isLoading && !prediction ? (
        <div className="min-h-96 flex flex-col items-center justify-center space-y-4 bg-white rounded-3xl border border-slate-200/80 p-12">
          <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-700">Decomposing alternate credit risk weights via SHAP...</p>
        </div>
      ) : error ? (
        <div className="p-12 bg-rose-50 border border-rose-200 rounded-3xl text-center space-y-4 max-w-xl mx-auto my-6">
          <AlertTriangle className="w-10 h-10 text-rose-600 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">Quant Underwriting Exception</h3>
          <p className="text-xs text-slate-500">{error}</p>
          <button 
            onClick={() => { setIsLoading(true); setError(null); }}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all"
          >
            Re-Initialize Model Node
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Score & Shifts */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Model Output Value
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  scoreDiff >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                }`}>
                  {scoreDiff >= 0 ? `+${scoreDiff}` : scoreDiff} pts shift
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-800 tracking-tight">
                  {currentScore}
                </span>
                <span className="text-sm text-slate-400 font-medium">
                  / 900
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-xs text-slate-400 font-semibold">
                <span>Base Value (E[x]):</span>
                <span className="font-mono text-slate-700 font-bold">{baseValue}</span>
              </div>
            </div>

            {/* Card 2: Confidence Index */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Model Confidence (R²)
                </span>
                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center" title="Statistical confidence interval index based on linked telemetry feeds.">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div className="relative flex items-center justify-center">
                  {/* Custom radial svg progress bar */}
                  <svg className="w-14 h-14 transform -rotate-90">
                    <circle cx="28" cy="28" r="24" stroke="#f1f5f9" strokeWidth="4" fill="transparent" />
                    <circle 
                      cx="28" 
                      cy="28" 
                      r="24" 
                      stroke="#0f172a" 
                      strokeWidth="4" 
                      fill="transparent" 
                      strokeDasharray="150.7" 
                      strokeDashoffset={150.7 - (150.7 * (prediction?.confidenceScore ?? 75)) / 100} 
                    />
                  </svg>
                  <span className="absolute text-xs font-mono font-extrabold text-slate-800">
                    {prediction?.confidenceScore}%
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-700 block">Excellent Data Fit</span>
                  <span className="text-[10px] text-slate-400">Low sparse-file risk bounds</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-xs text-slate-400 font-semibold">
                <span>Data Completeness:</span>
                <span className="text-slate-700 font-mono font-bold">
                  {prediction?.connectedCount ?? 0} / 8 feeds
                </span>
              </div>
            </div>

            {/* Card 3: Probability of Default (PD) */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Prob. of Default (PD)
                </span>
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  Sigmoid Logit
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-black text-slate-800 tracking-tight">
                  {prediction ? (prediction.probabilityOfDefault * 100).toFixed(2) : "0.00"}
                </span>
                <span className="text-sm text-slate-400 font-bold">%</span>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-xs text-slate-400 font-semibold">
                <span>Regulatory Risk Tier:</span>
                <span className={`font-bold px-2 py-0.2 rounded-md ${
                  prediction?.riskCategory === "LOW" ? "bg-emerald-50 text-emerald-700" :
                  prediction?.riskCategory === "MEDIUM" ? "bg-blue-50 text-blue-700" :
                  prediction?.riskCategory === "HIGH" ? "bg-amber-50 text-amber-700" :
                  "bg-rose-50 text-rose-700 font-extrabold animate-pulse"
                }`}>
                  {prediction?.riskCategory ?? "MEDIUM"}
                </span>
              </div>
            </div>

            {/* Card 4: Pre-Approved Liquidity Limit */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                  Pre-Approved Limit
                </span>
                <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                  Collateral-Free
                </span>
              </div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-lg font-bold text-slate-400">₹</span>
                <span className="text-3xl font-black text-slate-800 tracking-tight">
                  {prediction ? (prediction.recommendedLoanAmount / 100000).toFixed(1) : "0.0"}
                </span>
                <span className="text-sm text-slate-500 font-bold">Lakh</span>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-xs text-slate-400 font-semibold">
                <span>Approved Status:</span>
                <span className="text-slate-700 truncate max-w-[150px] font-bold" title={prediction?.loanEligibility}>
                  {prediction?.loanEligibility.split(" (")[0]}
                </span>
              </div>
            </div>

          </div>

          {/* 3. SHAP Explainability Visualization Panels */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            
            {/* Visual Navigation Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50/50 p-2 gap-2">
              <button
                onClick={() => setActiveTab("SHAP_FLOW")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "SHAP_FLOW" 
                    ? "bg-slate-900 text-white shadow-xs" 
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/70"
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>SHAP Contribution Flow</span>
              </button>
              <button
                onClick={() => setActiveTab("FEATURE_IMPORTANCE")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "FEATURE_IMPORTANCE" 
                    ? "bg-slate-900 text-white shadow-xs" 
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/70"
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>Global Feature Importance</span>
              </button>
              {sandboxMode && (
                <button
                  onClick={() => setActiveTab("SANDBOX")}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "SANDBOX" 
                      ? "bg-slate-900 text-white shadow-xs" 
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/70"
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                  <span>Interactive Policy Sandbox</span>
                </button>
              )}
            </div>

            <div className="p-6">
              
              {/* TAB 1: SHAP FLOW (Force Plot style representation) */}
              {activeTab === "SHAP_FLOW" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Why this score? (SHAP Force Plot Decomposition)</h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Visual representation of SHAP values. Green bars indicate positive alternate feeds pushing the score up from the base expected value (<span className="font-mono font-bold">520</span>). Red bars represent downward risk vectors or macro stress events pulling the rating down.
                    </p>
                  </div>

                  {/* High-fidelity CSS Force Plot Component */}
                  <div className="space-y-4 pt-4">
                    <div className="relative bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                      
                      {/* Scale Indicators */}
                      <div className="flex justify-between text-[9px] font-mono font-bold text-slate-400 border-b border-slate-200 pb-2">
                        <span>300 (Min Score)</span>
                        <span>520 (Base Expected Value E[x])</span>
                        <span>700</span>
                        <span>900 (Max Score)</span>
                      </div>

                      {/* Cumulative Force Bar */}
                      <div className="relative h-12 bg-slate-200/60 rounded-lg overflow-hidden mt-4 flex">
                        
                        {/* Red pull (left of 520, or overall negatives) */}
                        {riskFactors.map((x, idx) => {
                          const widthPct = Math.min(15, (Math.abs(x.shapValue) / 600) * 100);
                          return (
                            <div 
                              key={idx}
                              className="h-full bg-rose-500 border-r border-rose-600/30 flex items-center justify-center text-[10px] text-white font-bold transition-all relative group"
                              style={{ width: `${widthPct}%` }}
                            >
                              <span className="truncate px-1">-</span>
                              {/* Hover Tooltip */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-950 text-white text-[9px] p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg min-w-[150px]">
                                <p className="font-bold">{x.feature}</p>
                                <p className="text-rose-400 font-mono font-extrabold mt-0.5">{x.shapValue} Points</p>
                                <p className="text-slate-400 mt-0.5 leading-tight">{x.value}</p>
                              </div>
                            </div>
                          );
                        })}

                        {/* Mid Point Spacer representing base value */}
                        <div className="h-full bg-slate-900 w-1 flex items-center justify-center relative group">
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-950 text-white text-[9px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 font-mono">
                            Base Value: 520
                          </div>
                        </div>

                        {/* Green push (right of 520, or overall positives) */}
                        {positiveFactors.map((x, idx) => {
                          const widthPct = Math.min(15, (x.shapValue / 600) * 100);
                          return (
                            <div 
                              key={idx}
                              className="h-full bg-emerald-500 border-r border-emerald-600/30 flex items-center justify-center text-[10px] text-white font-bold transition-all relative group"
                              style={{ width: `${widthPct}%` }}
                            >
                              <span className="truncate px-1">+</span>
                              {/* Hover Tooltip */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-950 text-white text-[9px] p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg min-w-[150px]">
                                <p className="font-bold">{x.feature}</p>
                                <p className="text-emerald-400 font-mono font-extrabold mt-0.5">+{x.shapValue} Points</p>
                                <p className="text-slate-400 mt-0.5 leading-tight">{x.value}</p>
                              </div>
                            </div>
                          );
                        })}

                        {/* Remainder space */}
                        <div className="flex-1 bg-slate-100" />
                      </div>

                      {/* Score pointers */}
                      <div className="flex justify-between items-center mt-3 text-[10px]">
                        <div className="flex items-center gap-1.5 font-bold text-slate-500">
                          <span className="w-2.5 h-2.5 bg-slate-900 rounded-full inline-block" />
                          <span>Expected Base (520)</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-bold text-emerald-600">
                          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block" />
                          <span>Positive Force Push</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-bold text-rose-600">
                          <span className="w-2.5 h-2.5 bg-rose-500 rounded-full inline-block" />
                          <span>Negative Force Pull</span>
                        </div>
                        <div className="flex items-center gap-1 font-black text-slate-800">
                          <span>Final Credit Score:</span>
                          <span className="font-mono text-xs px-2 py-0.5 bg-slate-100 rounded-md">{currentScore}</span>
                        </div>
                      </div>
                    </div>

                    {/* Sequential breakdown of force pushes */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                      
                      {/* Positive contributions list */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Positive SHAP Drivers (+ Pushes)
                          </h4>
                        </div>
                        <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                          {positiveFactors.map((x, idx) => (
                            <div key={idx} className="bg-emerald-50/30 border border-emerald-100/50 p-3 rounded-xl flex justify-between items-start gap-4">
                              <div className="min-w-0">
                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-md uppercase font-mono tracking-wider">
                                  {x.category}
                                </span>
                                <p className="text-xs font-bold text-slate-700 mt-1">{x.feature}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{x.description}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-xs font-mono font-black text-emerald-600">+{x.shapValue}</span>
                                <p className="text-[9px] font-semibold text-slate-400 mt-0.5">Linked</p>
                              </div>
                            </div>
                          ))}
                          {positiveFactors.length === 0 && (
                            <p className="text-xs text-slate-400 italic text-center py-6">No active positive features found. Connect alternative datasets to boost credit rating.</p>
                          )}
                        </div>
                      </div>

                      {/* Negative contributions list */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                          <TrendingDown className="w-4 h-4 text-rose-500" />
                          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                            Negative SHAP Anchors (- Pulls)
                          </h4>
                        </div>
                        <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                          {riskFactors.map((x, idx) => (
                            <div key={idx} className="bg-rose-50/30 border border-rose-100/50 p-3 rounded-xl flex justify-between items-start gap-4">
                              <div className="min-w-0">
                                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded-md uppercase font-mono tracking-wider">
                                  {x.category}
                                </span>
                                <p className="text-xs font-bold text-slate-700 mt-1">{x.feature}</p>
                                <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{x.description}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-xs font-mono font-black text-rose-600">{x.shapValue}</span>
                                <p className="text-[9px] font-bold text-rose-500 bg-rose-50 px-1 py-0.2 rounded mt-0.5 uppercase tracking-wide">Warning</p>
                              </div>
                            </div>
                          ))}
                          {riskFactors.length === 0 && (
                            <p className="text-xs text-slate-400 italic text-center py-6">No negative risk factors identified. Excellent baseline score balance.</p>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: GLOBAL FEATURE IMPORTANCE */}
              {activeTab === "FEATURE_IMPORTANCE" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Global Feature Contributions (Absolute SHAP)</h3>
                    <p className="text-[11px] text-slate-400 mt-1">
                      This chart displays the absolute impact (SHAP value magnitude) of each data parameter on the MSME financial health assessment model. This clarifies which integrations carry the highest mathematical weight under our alternate risk framework.
                    </p>
                  </div>

                  {/* Horizontal Bar Chart for SHAP Magnitudes */}
                  <div className="h-96 w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={shapChartData}
                        layout="vertical"
                        margin={{ top: 10, right: 30, left: 140, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                        <XAxis 
                          type="number" 
                          domain={[0, 120]} 
                          tick={{ fontSize: 10, fill: "#94a3b8", fontWeight: "bold" }}
                          stroke="#cbd5e1"
                        />
                        <YAxis 
                          type="category" 
                          dataKey="feature" 
                          tick={{ fontSize: 10, fill: "#475569", fontWeight: "bold" }}
                          width={150}
                          stroke="#cbd5e1"
                        />
                        <RechartsTooltip
                          cursor={{ fill: "rgba(148, 163, 184, 0.05)" }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-slate-900 text-white p-3 rounded-xl border border-slate-800 text-xs shadow-lg space-y-1">
                                  <p className="font-bold text-slate-200">{data.feature}</p>
                                  <p className="text-slate-400">Category: <span className="font-semibold text-slate-300">{data.category}</span></p>
                                  <p className="text-slate-400">Current Status: <span className="font-semibold text-slate-200">{data.value}</span></p>
                                  <p className="text-slate-400 font-mono">
                                    Impact: {" "}
                                    <span className={`font-black ${data.impact >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                                      {data.impact >= 0 ? `+${data.impact}` : data.impact} Points
                                    </span>
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="absoluteImpact" radius={[0, 4, 4, 0]} barSize={14}>
                          {shapChartData.map((entry, index) => {
                            const isPositive = entry.impact >= 0;
                            const isZero = entry.impact === 0;
                            let barColor = "#0f172a"; // dark neutral
                            if (isZero) barColor = "#e2e8f0";
                            else if (isPositive) barColor = "#10b981"; // emerald
                            else barColor = "#f43f5e"; // rose
                            
                            return <Cell key={`cell-${index}`} fill={barColor} />;
                          })}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-start gap-3 mt-4">
                    <Info className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                    <p className="text-[11px] text-slate-500 leading-normal">
                      <span className="font-bold">Model Policy Note:</span> Underwriting algorithms prioritize <span className="font-semibold">daily checking transaction ledgers</span> and <span className="font-semibold">GSTN tax compliance logs</span> above demographic registers. Connecting these two channels alone establishes an automated credit tier with high confidence limits.
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: INTERACTIVE POLICY SANDBOX */}
              {activeTab === "SANDBOX" && sandboxMode && (
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">What-If Simulation Sandbox</h3>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Dynamically toggle corporate alternate integrations, simulated loan caps, and macroeconomic stress markers. Review in real-time how the SHAP model recalculates corporate creditworthiness.
                      </p>
                    </div>
                    <button
                      onClick={resetSandbox}
                      className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Sandbox</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
                    
                    {/* Source Toggles column */}
                    <div className="lg:col-span-2 space-y-4">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest pb-1 border-b border-slate-100">
                        1. Simulated Alternate Data Channels
                      </h4>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        
                        {/* GST Toggle */}
                        <label className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                          simGst ? "bg-emerald-50/50 border-emerald-300" : "bg-slate-50 border-slate-200 hover:border-slate-300"
                        }`}>
                          <div className="flex items-center gap-3">
                            <Database className={`w-4 h-4 ${simGst ? "text-emerald-600" : "text-slate-400"}`} />
                            <div>
                              <span className="text-xs font-bold text-slate-700 block">GSTN Tax Registry</span>
                              <span className="text-[10px] text-slate-400">GSTR filing vectors</span>
                            </div>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={simGst} 
                            onChange={(e) => setSimGst(e.target.checked)}
                            className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-emerald-500" 
                          />
                        </label>

                        {/* Bank Statement Toggle */}
                        <label className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                          simBank ? "bg-emerald-50/50 border-emerald-300" : "bg-slate-50 border-slate-200 hover:border-slate-300"
                        }`}>
                          <div className="flex items-center gap-3">
                            <FileSpreadsheet className={`w-4 h-4 ${simBank ? "text-emerald-600" : "text-slate-400"}`} />
                            <div>
                              <span className="text-xs font-bold text-slate-700 block">Checking Ledgers (Bank)</span>
                              <span className="text-[10px] text-slate-400">Continuous cash flows</span>
                            </div>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={simBank} 
                            onChange={(e) => setSimBank(e.target.checked)}
                            className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-emerald-500" 
                          />
                        </label>

                        {/* Account Aggregator Toggle */}
                        <label className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                          simAa ? "bg-emerald-50/50 border-emerald-300" : "bg-slate-50 border-slate-200 hover:border-slate-300"
                        }`}>
                          <div className="flex items-center gap-3">
                            <ShieldCheck className={`w-4 h-4 ${simAa ? "text-emerald-600" : "text-slate-400"}`} />
                            <div>
                              <span className="text-xs font-bold text-slate-700 block">Account Aggregator</span>
                              <span className="text-[10px] text-slate-400">Consent-based cross-bank API</span>
                            </div>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={simAa} 
                            onChange={(e) => setSimAa(e.target.checked)}
                            className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-emerald-500" 
                          />
                        </label>

                        {/* UPI Toggles */}
                        <label className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                          simUpi ? "bg-emerald-50/50 border-emerald-300" : "bg-slate-50 border-slate-200 hover:border-slate-300"
                        }`}>
                          <div className="flex items-center gap-3">
                            <Zap className={`w-4 h-4 ${simUpi ? "text-emerald-600" : "text-slate-400"}`} />
                            <div>
                              <span className="text-xs font-bold text-slate-700 block">UPI Merchant Feed</span>
                              <span className="text-[10px] text-slate-400">Real-time terminal cash receipts</span>
                            </div>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={simUpi} 
                            onChange={(e) => setSimUpi(e.target.checked)}
                            className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-emerald-500" 
                          />
                        </label>

                        {/* EPFO Toggle */}
                        <label className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                          simEpfo ? "bg-emerald-50/50 border-emerald-300" : "bg-slate-50 border-slate-200 hover:border-slate-300"
                        }`}>
                          <div className="flex items-center gap-3">
                            <Building2 className={`w-4 h-4 ${simEpfo ? "text-emerald-600" : "text-slate-400"}`} />
                            <div>
                              <span className="text-xs font-bold text-slate-700 block">EPFO Payroll Log</span>
                              <span className="text-[10px] text-slate-400">Provident fund filings</span>
                            </div>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={simEpfo} 
                            onChange={(e) => setSimEpfo(e.target.checked)}
                            className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-emerald-500" 
                          />
                        </label>

                        {/* Udyam Certification Toggle */}
                        <label className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                          simUdyam ? "bg-emerald-50/50 border-emerald-300" : "bg-slate-50 border-slate-200 hover:border-slate-300"
                        }`}>
                          <div className="flex items-center gap-3">
                            <FileText className={`w-4 h-4 ${simUdyam ? "text-emerald-600" : "text-slate-400"}`} />
                            <div>
                              <span className="text-xs font-bold text-slate-700 block">Udyam MSME Certificate</span>
                              <span className="text-[10px] text-slate-400">Sovereign verification ID</span>
                            </div>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={simUdyam} 
                            onChange={(e) => setSimUdyam(e.target.checked)}
                            className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-emerald-500" 
                          />
                        </label>

                        {/* PAN Toggle */}
                        <label className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                          simPan ? "bg-emerald-50/50 border-emerald-300" : "bg-slate-50 border-slate-200 hover:border-slate-300"
                        }`}>
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className={`w-4 h-4 ${simPan ? "text-emerald-600" : "text-slate-400"}`} />
                            <div>
                              <span className="text-xs font-bold text-slate-700 block">Corporate PAN Card</span>
                              <span className="text-[10px] text-slate-400">Tax identification check</span>
                            </div>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={simPan} 
                            onChange={(e) => setSimPan(e.target.checked)}
                            className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-emerald-500" 
                          />
                        </label>

                        {/* Utility bill toggle */}
                        <label className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                          simUtility ? "bg-emerald-50/50 border-emerald-300" : "bg-slate-50 border-slate-200 hover:border-slate-300"
                        }`}>
                          <div className="flex items-center gap-3">
                            <Activity className={`w-4 h-4 ${simUtility ? "text-emerald-600" : "text-slate-400"}`} />
                            <div>
                              <span className="text-xs font-bold text-slate-700 block">Utility Bill History</span>
                              <span className="text-[10px] text-slate-400">Electricity/Telecom records</span>
                            </div>
                          </div>
                          <input 
                            type="checkbox" 
                            checked={simUtility} 
                            onChange={(e) => setSimUtility(e.target.checked)}
                            className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-emerald-500" 
                          />
                        </label>

                      </div>
                    </div>

                    {/* Macro Stress Toggles Column */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest pb-1 border-b border-slate-100">
                        2. Macro Stress Scenarios
                      </h4>

                      <div className="space-y-2">
                        {/* Normal / Baseline */}
                        <button
                          onClick={() => setStressFactor("NORMAL")}
                          className={`w-full text-left p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                            stressFactor === "NORMAL" 
                              ? "bg-slate-900 text-white border-slate-900" 
                              : "bg-slate-50 hover:bg-slate-100/50 border-slate-200 text-slate-700"
                          }`}
                        >
                          <div>
                            <span className="block font-bold">Stable Baseline (Normal)</span>
                            <span className={`text-[10px] ${stressFactor === "NORMAL" ? "text-slate-400" : "text-slate-400"} font-normal`}>Historical average operating parameters</span>
                          </div>
                          {stressFactor === "NORMAL" && <Check className="w-4 h-4 text-emerald-400" />}
                        </button>

                        {/* Raw Material Spike */}
                        <button
                          onClick={() => setStressFactor("COMMODITY_SPIKE")}
                          className={`w-full text-left p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                            stressFactor === "COMMODITY_SPIKE" 
                              ? "bg-slate-900 text-white border-slate-900" 
                              : "bg-slate-50 hover:bg-slate-100/50 border-slate-200 text-slate-700"
                          }`}
                        >
                          <div>
                            <span className="block font-bold">Raw Material Inflation (+30%)</span>
                            <span className={`text-[10px] ${stressFactor === "COMMODITY_SPIKE" ? "text-slate-400" : "text-slate-400"} font-normal`}>Steel/commodity prices rise (-115 pts SHAP)</span>
                          </div>
                          {stressFactor === "COMMODITY_SPIKE" && <Check className="w-4 h-4 text-amber-400" />}
                        </button>

                        {/* Consumer Demand Slowdown */}
                        <button
                          onClick={() => setStressFactor("DEMAND_DROP")}
                          className={`w-full text-left p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                            stressFactor === "DEMAND_DROP" 
                              ? "bg-slate-900 text-white border-slate-900" 
                              : "bg-slate-50 hover:bg-slate-100/50 border-slate-200 text-slate-700"
                          }`}
                        >
                          <div>
                            <span className="block font-bold">Market Demand Slowdown (-20%)</span>
                            <span className={`text-[10px] ${stressFactor === "DEMAND_DROP" ? "text-slate-400" : "text-slate-400"} font-normal`}>Longer inventory collections (-75 pts SHAP)</span>
                          </div>
                          {stressFactor === "DEMAND_DROP" && <Check className="w-4 h-4 text-amber-400" />}
                        </button>

                        {/* Regional Boom */}
                        <button
                          onClick={() => setStressFactor("BOOM_SURGE")}
                          className={`w-full text-left p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                            stressFactor === "BOOM_SURGE" 
                              ? "bg-slate-900 text-white border-slate-900" 
                              : "bg-slate-50 hover:bg-slate-100/50 border-slate-200 text-slate-700"
                          }`}
                        >
                          <div>
                            <span className="block font-bold">Infrastructure Boom (+15%)</span>
                            <span className={`text-[10px] ${stressFactor === "BOOM_SURGE" ? "text-slate-400" : "text-slate-400"} font-normal`}>Rapid cash velocities (+45 pts SHAP)</span>
                          </div>
                          {stressFactor === "BOOM_SURGE" && <Check className="w-4 h-4 text-emerald-400" />}
                        </button>
                      </div>

                      {/* Requested Loan Field */}
                      <div className="pt-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                          3. Loan Requested (₹ Amount)
                        </label>
                        <div className="relative rounded-xl border border-slate-200 bg-slate-50 p-3 flex justify-between items-center">
                          <span className="text-xs font-mono font-bold text-slate-500">₹</span>
                          <input 
                            type="number" 
                            min={100000} 
                            max={10000000} 
                            step={100000} 
                            value={loanRequested}
                            onChange={(e) => setLoanRequested(Number(e.target.value))}
                            className="bg-transparent text-right text-xs font-bold font-mono text-slate-700 w-full focus:outline-none pr-1"
                          />
                          <span className="text-[10px] text-slate-400 font-bold ml-1">INR</span>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
              )}

            </div>
          </div>

          {/* 4. Qualitative Breakdown of Positive & Risk Factors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Positive Drivers Column */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Credit Rating Catalysts (Positive Weights)</h3>
                  <p className="text-[10px] text-slate-400">Linked parameters currently augmenting your overall score.</p>
                </div>
              </div>

              <div className="space-y-3">
                {positiveFactors.map((x, idx) => (
                  <div key={idx} className="flex gap-3 items-start bg-slate-50/50 p-3.5 rounded-2xl border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700">{x.feature}</span>
                        <span className="text-[9px] font-mono font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                          +{x.shapValue} pts
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal mt-1">{x.description}</p>
                    </div>
                  </div>
                ))}
                {positiveFactors.length === 0 && (
                  <p className="text-xs text-slate-400 italic py-4 text-center">No active credit catalysts. Connect corporate portals to generate alternate score records.</p>
                )}
              </div>
            </div>

            {/* Risk Factors & Discrepancies Column */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg shrink-0">
                  <TrendingDown className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Underwriting Discrepancies & Macro Anchors</h3>
                  <p className="text-[10px] text-slate-400">Active factors exerting downward pressure on credit limits.</p>
                </div>
              </div>

              <div className="space-y-3">
                {riskFactors.map((x, idx) => (
                  <div key={idx} className="flex gap-3 items-start bg-slate-50/50 p-3.5 rounded-2xl border border-slate-100">
                    <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700">{x.feature}</span>
                        <span className="text-[9px] font-mono font-extrabold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded">
                          {x.shapValue} pts
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal mt-1">{x.description}</p>
                    </div>
                  </div>
                ))}
                
                {/* Highlight unlinked resources as future risk dampeners */}
                {neutralFactors.map((x, idx) => (
                  <div key={idx} className="flex gap-3 items-start bg-slate-50/30 p-3.5 rounded-2xl border border-slate-100/50 opacity-70">
                    <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-600">{x.feature}</span>
                        <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                          0 pts (Omitted)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal mt-1">{x.description}</p>
                    </div>
                  </div>
                ))}

                {riskFactors.length === 0 && neutralFactors.length === 0 && (
                  <p className="text-xs text-slate-400 italic py-4 text-center">No structural underwriting anchors identified. Outstanding risk mitigation.</p>
                )}
              </div>
            </div>

          </div>

          {/* 5. Business Recommendations & Future Improvements (Sovereign Advisory Grid) */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 lg:p-8 space-y-6">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-blue-600/30 text-blue-400 border border-blue-500/20 rounded-xl shrink-0">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </span>
                <div>
                  <h3 className="text-base font-bold tracking-tight">Sovereign Underwriting Advisory Notes</h3>
                  <p className="text-xs text-slate-400">Algorithmic business recommendations and custom policy path optimizations.</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>Computed: {new Date().toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Left Column: Model Narrative & Business Recommendations */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest font-mono">
                  I. Business Insights & Recommendations
                </h4>
                
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {prediction?.businessInsights}
                </p>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                    Credit Officer Underwriting Summary
                  </span>
                  <div className="text-xs leading-normal space-y-1.5 text-slate-300 mt-1">
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      <span>Approved Credit Cap: <span className="text-white font-mono font-bold">₹{(prediction?.recommendedLoanAmount ?? 600000).toLocaleString("en-IN")}</span></span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      <span>Interest Rate Premium: <span className="text-emerald-400 font-mono font-bold">{currentScore >= 740 ? "8.45% - 9.15%" : currentScore >= 600 ? "9.85% - 10.75%" : "11.5% + (Collateral Required)"}</span></span>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      <span>Manual Audit Overhead: <span className="text-white font-bold">{currentScore >= 600 ? "Zero (Auto-Disbursable)" : "High (Requires board review)"}</span></span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Future Improvements Checklist */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest font-mono">
                  II. Policy Target optimization checklist
                </h4>

                <div className="space-y-3">
                  
                  {/* Item 1: GST */}
                  <div className={`p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                    activeGst 
                      ? "bg-emerald-950/20 border-emerald-900/30 text-slate-300" 
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 cursor-pointer"
                  }`}
                  onClick={() => !activeGst && sandboxMode && setSimGst(true)}
                  >
                    <div className="mt-0.5 shrink-0">
                      {activeGst ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[9px] font-bold text-blue-400 bg-slate-900">+55</span>
                      )}
                    </div>
                    <div>
                      <span className={`text-xs font-bold ${activeGst ? "text-emerald-400" : "text-white"}`}>
                        Link Registered GSTR GSTN Portal
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                        {activeGst 
                          ? "Successfully synced GSTR-1 & GSTR-3B registers. Credit assessment models are validating actual turnover velocities." 
                          : "Integrate GST ledger feeds to immediately increase model transparency score by +55 points and decrease default premium."}
                      </p>
                    </div>
                  </div>

                  {/* Item 2: Banking Ledgers */}
                  <div className={`p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                    activeBank 
                      ? "bg-emerald-950/20 border-emerald-900/30 text-slate-300" 
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 cursor-pointer"
                  }`}
                  onClick={() => !activeBank && sandboxMode && setSimBank(true)}
                  >
                    <div className="mt-0.5 shrink-0">
                      {activeBank ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[9px] font-bold text-blue-400 bg-slate-900">+60</span>
                      )}
                    </div>
                    <div>
                      <span className={`text-xs font-bold ${activeBank ? "text-emerald-400" : "text-white"}`}>
                        Synchronize Principal Checking Accounts
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                        {activeBank 
                          ? "Secured checker statements verified. Monthly average balance checks align cleanly with corporate filing history." 
                          : "Connect statement PDF or API channels to boost alternative score index by +60 points instantly."}
                      </p>
                    </div>
                  </div>

                  {/* Item 3: Account Aggregator */}
                  <div className={`p-4 rounded-2xl border transition-all flex items-start gap-3 ${
                    activeAa 
                      ? "bg-emerald-950/20 border-emerald-900/30 text-slate-300" 
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 cursor-pointer"
                  }`}
                  onClick={() => !activeAa && sandboxMode && setSimAa(true)}
                  >
                    <div className="mt-0.5 shrink-0">
                      {activeAa ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[9px] font-bold text-blue-400 bg-slate-900">+45</span>
                      )}
                    </div>
                    <div>
                      <span className={`text-xs font-bold ${activeAa ? "text-emerald-400" : "text-white"}`}>
                        Activate Account Aggregator Consent (FIP)
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                        {activeAa 
                          ? "Sovereign FIP consent approved. Periodic automated balance checking acts as an active solvency cushion." 
                          : "Authorize consent-based cross-bank profiles under Account Aggregator framework to add +45 credit points."}
                      </p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </>
      )}

    </div>
  );
};
