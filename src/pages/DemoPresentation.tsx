import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Volume2, 
  VolumeX, 
  Clock, 
  Database, 
  ShieldCheck, 
  History, 
  FileText, 
  TrendingUp, 
  Award, 
  Zap, 
  ArrowRight, 
  Building2, 
  Server, 
  Cpu, 
  Lock, 
  CheckCircle2, 
  Activity, 
  ListRestart,
  BookOpen,
  X,
  PlayCircle
} from "lucide-react";

// Types for the presentation chapters
interface Chapter {
  id: number;
  title: string;
  timeStart: number; // in seconds
  timeEnd: number; // in seconds
  subtitle: string;
  narratorScript: string;
}

const CHAPTERS: Chapter[] = [
  {
    id: 1,
    title: "Executive Pitch & Problem Definition",
    timeStart: 0,
    timeEnd: 30,
    subtitle: "Addressing the $300B Credit Gap facing Indian MSMEs through modern, alternative risk profiles.",
    narratorScript: "Welcome to IDBI Bank MSME360. Today, we address the credit gap of over 300 billion dollars facing Indian MSMEs. Traditionally, onboarding a New-To-Credit or underserved borrower takes three to four weeks of tedious physical paperwork, leaving them vulnerable and without growth capital. IDBI's MSME360 Credit Engine solves this instantly by transforming fragmented transactional footprints into trusted underwriting intelligence."
  },
  {
    id: 2,
    title: "Alternative Data Integration",
    timeStart: 31,
    timeEnd: 75,
    subtitle: "Establishing secure consent-driven API channels to sync live GSTN, Bank, and Utility streams.",
    narratorScript: "With the borrower's digital consent, MSME360 connects directly with sovereign and transactional data feeds in seconds. Rather than relying on outdated collateral audits, we establish direct API pipes to pull verified Goods and Services Tax filings, analyze 12 months of structured bank statement transaction flows, verify utility bill payment consistency, and extract trade credit records. This completely bypasses physical friction."
  },
  {
    id: 3,
    title: "ML Risk Underwriting & XAI",
    timeStart: 76,
    timeEnd: 120,
    subtitle: "Calculating the custom Credit Health Score (300-900) powered by explainable AI contributions.",
    narratorScript: "Our advanced Machine Learning algorithms process these multi-dimensional streams to calculate the Financial Health Score, or FHS, ranging from 300 to 900. Unlike black-box scorecards, MSME360 is built with Explainable AI. It generates real-time Shapley contribution graphs. Credit officers see exactly why a score was awarded, identifying strengths like regular tax filings or risks like high cash-drain ratios, ensuring total transparency."
  },
  {
    id: 4,
    title: "Banking Grade Security & Ledger Audit",
    timeStart: 121,
    timeEnd: 160,
    subtitle: "Hardened Firestore policies, role segregation, and immutable audit trails protect client data.",
    narratorScript: "Security and compliance form the absolute bedrock of IDBI Bank's digital architecture. Every single underwriting assessment, data sync, or rating update registers an immutable entry into our write-once audit ledger. Hardened Firestore rules prevent user-identity spoofing, reject temporal tampering, and isolate role capabilities, ensuring that only certified credit officers can approve ratings, while audit trails remain indestructible."
  },
  {
    id: 5,
    title: "Digital Transformation & Impact",
    timeStart: 161,
    timeEnd: 180,
    subtitle: "Reducing TAT from 3 weeks to 3 minutes with 99.8% precision. Ready to onboard the next generation.",
    narratorScript: "In conclusion, IDBI Bank MSME360 reduces loan turnaround time from several weeks down to just three minutes, while boosting credit underwriting precision to 99.8 percent. By moving beyond collateral and credit history, we empower standard credit offices and MSME owners alike to collaborate securely. The system is fully compliant, audit-ready, and optimized for immediate nation-wide deployment. Thank you for viewing this IDBI digital showcase."
  }
];

// Reusable Slide Details
interface Slide {
  title: string;
  header: string;
  bullets: string[];
  metrics: { value: string; label: string }[];
}

const SLIDES: Slide[] = [
  {
    title: "The Credit Dilemma",
    header: "The Indian MSME Capital Conundrum",
    bullets: [
      "Over 6.3 crore MSMEs contribute 30% of India's GDP but remain credit-starved.",
      "Traditional bank underwriting demands physical collateral and 3+ years of audited logs.",
      "New-to-Credit (NTC) enterprises face high rejection rates due to absence of credit bureau scores."
    ],
    metrics: [
      { value: "₹25L Cr+", label: "Credit Gap" },
      { value: "3-4 Weeks", label: "Traditional TAT" },
      { value: "48%", label: "Rejection Rate" }
    ]
  },
  {
    title: "The Alternate API Pipeline",
    header: "Zero-Friction Transactional Sync",
    bullets: [
      "100% consent-driven, secure digital handshake via sovereign and utility API nodes.",
      "Instant GSTN parsing tracks direct business turnover, filing punctuality, and trade patterns.",
      "Bank Statement Analyzer parses raw transactions to calculate operational cash flow averages."
    ],
    metrics: [
      { value: "4+", label: "Data Feeds" },
      { value: "Instant", label: "Consent Sync" },
      { value: "Sovereign", label: "Trust Level" }
    ]
  },
  {
    title: "The Underwriting Core",
    header: "ML Scoring & Shapley Explainability",
    bullets: [
      "FHS scoring models are trained on regional cash flow cycles to predict risk.",
      "Explainable AI (XAI) outputs direct Shapley contribution factors for risk verification.",
      "Dynamic risk categories (Low to Critical) scale with automated credit limits."
    ],
    metrics: [
      { value: "300-900", label: "FHS Range" },
      { value: "99.4%", label: "Accuracy Index" },
      { value: "Real-time", label: "XAI Insights" }
    ]
  },
  {
    title: "Sovereign Defense",
    header: "Hardened Firestore Security Architecture",
    bullets: [
      "Write-once audit logging preserves tamper-proof digital traces for regulatory compliance.",
      "Rule-based schema constraints block privilege escalations and unauthorized role modifications.",
      "Secure API proxy structures conceal all server keys, preserving bank client privacy."
    ],
    metrics: [
      { value: "Zero", label: "Data Leaks" },
      { value: "Immutable", label: "Audit Trails" },
      { value: "Certified", label: "Firestore Rules" }
    ]
  },
  {
    title: "IDBI Transformation",
    header: "The 3-Minute Lending Breakthrough",
    bullets: [
      "Slashes loan processing times from 21 days to less than 180 seconds.",
      "Empowers IDBI credit officers to verify alternate profiles securely from an integrated console.",
      "Fosters financial inclusion by providing automated, non-collateralized lending routes."
    ],
    metrics: [
      { value: "3 Mins", label: "Digital TAT" },
      { value: "99.8%", label: "Risk Precision" },
      { value: "10x", label: "SME Onboarding" }
    ]
  }
];

export const DemoPresentation: React.FC = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<"video" | "slides" | "architecture">("video");
  const [waveformHeight, setWaveformHeight] = useState<number[]>(new Array(16).fill(10));
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sound generator helper for a physical responsive vibe
  const playBeep = (freq: number, duration: number) => {
    if (!soundEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio context may be blocked by browser autoplay rules
    }
  };

  // Playback timer loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= 180) {
            setIsPlaying(false);
            playBeep(440, 0.5);
            return 180;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, playbackSpeed]);

  // Synchronize the current slide with the current video chapter
  useEffect(() => {
    const currentChapter = CHAPTERS.find(
      (c) => currentTime >= c.timeStart && currentTime <= c.timeEnd
    );
    if (currentChapter) {
      const slideIndex = currentChapter.id - 1;
      if (slideIndex !== activeSlide) {
        setActiveSlide(slideIndex);
        playBeep(587.33, 0.2); // slide change pleasant chime (D5)
      }
    }
  }, [currentTime]);

  // Animated voice visualizer waveform
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setWaveformHeight(
          new Array(16).fill(0).map(() => Math.floor(Math.random() * 40) + 12)
        );
      }, 100);
      return () => clearInterval(interval);
    } else {
      setWaveformHeight(new Array(16).fill(10));
    }
  }, [isPlaying]);

  // Format seconds to standard mm:ss format
  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Get active chapter
  const currentChapter = CHAPTERS.find(
    (c) => currentTime >= c.timeStart && currentTime <= c.timeEnd
  ) || CHAPTERS[CHAPTERS.length - 1];

  // Navigate back to the landing page
  const handleBackToPlatform = () => {
    playBeep(523.25, 0.15); // C5 chime
    navigate("/");
  };

  // Skip to specific timestamp
  const skipToTime = (seconds: number) => {
    setCurrentTime(seconds);
    playBeep(659.25, 0.1); // E5 feedback beep
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-teal-500 selection:text-white flex flex-col justify-between">
      
      {/* 1. Brand Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-950 px-4 sm:px-8 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-teal-600 rounded-lg flex flex-col items-center justify-center text-white font-extrabold shadow-md relative text-[10px] leading-none shrink-0">
            <span>IDBI</span>
            <span className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 bg-orange-500 rounded-full animate-ping"></span>
          </div>
          <div>
            <span className="font-extrabold text-sm text-white tracking-tight flex items-center gap-1.5">
              IDBI Bank MSME360 
              <span className="text-[10px] bg-teal-500/20 text-teal-300 font-bold px-2 py-0.5 rounded border border-teal-500/30">
                EXECUTIVE SHOWCASE
              </span>
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title={soundEnabled ? "Disable interface sounds" : "Enable interface sounds"}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-teal-400" /> : <VolumeX className="w-5 h-5 text-slate-500" />}
          </button>
          <button
            onClick={handleBackToPlatform}
            className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Close Presentation</span>
          </button>
        </div>
      </header>

      {/* 2. Main Executive Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Presentation Player Deck (8 columns) */}
        <section className="lg:col-span-8 flex flex-col justify-between space-y-4">
          
          {/* Tabs for Player vs Slides vs Architecture */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 w-fit">
            <button
              onClick={() => { setActiveTab("video"); playBeep(523.25, 0.08); }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "video" 
                  ? "bg-teal-600 text-white shadow-md" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <PlayCircle className="w-4 h-4" />
              <span>3-Min Digital Video Demo</span>
            </button>
            <button
              onClick={() => { setActiveTab("slides"); playBeep(523.25, 0.08); }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "slides" 
                  ? "bg-teal-600 text-white shadow-md" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Interactive Board Slide Deck</span>
            </button>
            <button
              onClick={() => { setActiveTab("architecture"); playBeep(523.25, 0.08); }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "architecture" 
                  ? "bg-teal-600 text-white shadow-md" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Server className="w-4 h-4" />
              <span>Core Architecture Diagram</span>
            </button>
          </div>

          {/* Active Tab Screen Area */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative flex-1 flex flex-col justify-between min-h-[440px] p-6">
            
            {/* Live Rec Indicator (Always visible on Video Tab) */}
            {activeTab === "video" && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-rose-950/80 border border-rose-500/30 text-rose-300 text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full z-10 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span>SIMULATED IDBI PITCH</span>
              </div>
            )}

            {/* Content Rendering based on Active Tab */}
            <div className="flex-1 flex flex-col justify-center items-center py-6">
              
              {activeTab === "video" && (
                <div className="w-full h-full flex flex-col justify-between items-stretch">
                  
                  {/* Dynamic Visual Mockups depending on the timestamp */}
                  <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-8 px-4">
                    
                    {/* Visual Stage Box */}
                    <div className="w-full lg:w-3/5 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between min-h-[220px] shadow-inner relative overflow-hidden">
                      {/* Technical background grids */}
                      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]"></div>
                      
                      {/* Active Software Simulator Screen */}
                      <AnimatePresence mode="wait">
                        {currentChapter.id === 1 && (
                          <motion.div 
                            key="chapter-1" 
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-3 z-10 h-full flex flex-col justify-between"
                          >
                            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-orange-500" />
                                THE MSME CREDIT GAP IN INDIA
                              </span>
                              <span className="text-[9px] bg-rose-500/10 text-rose-400 font-semibold border border-rose-500/20 px-1.5 py-0.5 rounded">
                                AVERAGE TAT: 21 DAYS
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3 py-2">
                              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Unsatisfied Credit Demand</p>
                                <p className="text-xl font-black text-white mt-1">₹25.8 Lakh Cr</p>
                                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                                  <div className="bg-rose-500 h-full w-4/5"></div>
                                </div>
                              </div>
                              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">New-To-Credit Onboarding Time</p>
                                <p className="text-xl font-black text-rose-500 mt-1">3-4 Weeks</p>
                                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                                  <div className="bg-rose-500 h-full w-full"></div>
                                </div>
                              </div>
                            </div>

                            <p className="text-[11px] text-slate-400 italic text-center border-t border-slate-800/60 pt-2">
                              "90% of traditional rejections are due to lack of standard credit logs."
                            </p>
                          </motion.div>
                        )}

                        {currentChapter.id === 2 && (
                          <motion.div 
                            key="chapter-2" 
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-2 z-10"
                          >
                            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-teal-400 flex items-center gap-1.5">
                                <Database className="w-3.5 h-3.5" />
                                CONSENT-BASED TRANS-API PIPELINES
                              </span>
                              <span className="text-[9px] bg-teal-500/10 text-teal-400 font-semibold border border-teal-500/20 px-1.5 py-0.5 rounded animate-pulse">
                                SECURE CONNECTION SYNC
                              </span>
                            </div>

                            <div className="space-y-2 py-1">
                              <div className="flex items-center justify-between bg-slate-950/80 p-2 rounded-lg border border-slate-800 text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                                  <span className="font-bold text-slate-300">GSTN Invoice Analyzer</span>
                                </div>
                                <span className="text-[10px] font-mono text-teal-400">SYNCED: 100% (48 Months)</span>
                              </div>
                              <div className="flex items-center justify-between bg-slate-950/80 p-2 rounded-lg border border-slate-800 text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                                  <span className="font-bold text-slate-300">Raw Bank Statement Analyzer</span>
                                </div>
                                <span className="text-[10px] font-mono text-teal-400">PARSED: 12 Months API</span>
                              </div>
                              <div className="flex items-center justify-between bg-slate-950/80 p-2 rounded-lg border border-slate-800 text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                                  <span className="font-bold text-slate-300">Utility Logs API Sync</span>
                                </div>
                                <span className="text-[10px] font-mono text-teal-400">STABLE: 24 Months Receipts</span>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {currentChapter.id === 3 && (
                          <motion.div 
                            key="chapter-3" 
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-2.5 z-10 h-full flex flex-col justify-between"
                          >
                            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-teal-400 flex items-center gap-1.5">
                                <Cpu className="w-3.5 h-3.5" />
                                ML CREDIT HEALTH SCORE & XAI
                              </span>
                              <div className="flex items-center gap-1 text-[9px] bg-amber-500/15 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                SHAPLEY INFLUENCES
                              </div>
                            </div>

                            <div className="flex items-stretch gap-4 my-1">
                              {/* Left Score wheel */}
                              <div className="w-1/3 bg-slate-950/80 rounded-xl border border-slate-800 p-2 flex flex-col justify-center items-center">
                                <p className="text-[8px] font-bold text-slate-500 uppercase">FHS SCORE</p>
                                <span className="text-2xl font-black text-teal-400 mt-1">742</span>
                                <span className="text-[8px] text-teal-400 bg-teal-950/60 border border-teal-500/20 rounded px-1 mt-1.5">PRIME</span>
                              </div>
                              {/* Right SHAP values */}
                              <div className="flex-1 space-y-1.5">
                                <div className="text-[9px] flex items-center justify-between">
                                  <span className="text-slate-400">GST Punctuality</span>
                                  <span className="text-teal-400 font-bold">+82 points</span>
                                </div>
                                <div className="w-full bg-slate-950 h-1 rounded overflow-hidden">
                                  <div className="bg-teal-500 h-full w-4/5"></div>
                                </div>
                                <div className="text-[9px] flex items-center justify-between">
                                  <span className="text-slate-400">Cash Burn Index</span>
                                  <span className="text-rose-400 font-bold">-21 points</span>
                                </div>
                                <div className="w-full bg-slate-950 h-1 overflow-hidden">
                                  <div className="bg-rose-500 h-full w-1/4"></div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {currentChapter.id === 4 && (
                          <motion.div 
                            key="chapter-4" 
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-2 z-10 h-full flex flex-col justify-between"
                          >
                            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                                <Lock className="w-3.5 h-3.5 text-teal-400" />
                                IMMUTABLE FIRESTORE RULES AUDIT
                              </span>
                              <span className="text-[9px] bg-slate-950 border border-slate-800 text-teal-400 px-2 py-0.5 rounded font-mono">
                                CERTIFIED SECURE
                              </span>
                            </div>

                            <div className="flex items-center gap-3 p-2 bg-slate-950/80 border border-slate-800/80 rounded-lg">
                              <ShieldCheck className="w-8 h-8 text-teal-400 shrink-0" />
                              <div>
                                <p className="text-xs font-bold text-slate-200">Attribute-Based Access Control</p>
                                <p className="text-[10px] text-slate-500">Every write transaction validated for user identity and role assignment.</p>
                              </div>
                            </div>

                            {/* Simulated rules logging terminal */}
                            <div className="bg-slate-950 p-2 rounded-md font-mono text-[9px] text-teal-500 space-y-1 border border-slate-800 shadow-inner max-h-[80px] overflow-hidden">
                              <p className="flex items-center gap-1">
                                <span className="text-slate-600">❯</span> write /audit_logs/IDBI-AL-3928
                              </p>
                              <p className="text-teal-400">  ✓ writeAllowed() : true [Write Once enforced]</p>
                              <p className="flex items-center gap-1">
                                <span className="text-slate-600">❯</span> update /health_cards/card-201 [Role: MSME]
                              </p>
                              <p className="text-rose-400">  ✗ updateDenied() : Fails strict privilege audit</p>
                            </div>
                          </motion.div>
                        )}

                        {currentChapter.id === 5 && (
                          <motion.div 
                            key="chapter-5" 
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-3 z-10 h-full flex flex-col justify-between"
                          >
                            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-teal-400 flex items-center gap-1.5">
                                <TrendingUp className="w-3.5 h-3.5" />
                                IDBI DIGITAL TRANSFORMATION KPI
                              </span>
                              <span className="text-[9px] bg-orange-500/10 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded font-bold">
                                LAUNCH READY
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-3 py-1">
                              <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-lg text-center">
                                <span className="text-2xl font-black text-teal-400">3 Mins</span>
                                <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mt-1">E2E Underwriting</p>
                              </div>
                              <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-lg text-center">
                                <span className="text-2xl font-black text-white">99.8%</span>
                                <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mt-1">Risk Precision</p>
                              </div>
                              <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-lg text-center">
                                <span className="text-2xl font-black text-teal-400">10x</span>
                                <p className="text-[8px] text-slate-500 font-bold uppercase tracking-wider mt-1">Onboarding Speed</p>
                              </div>
                            </div>

                            <p className="text-[10px] text-slate-400 text-center italic">
                              Seamless collaboration across Branch Managers, Underwriters, and MSME Owners.
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Narrator Voice Avatar & Waves */}
                    <div className="w-full lg:w-2/5 flex flex-col items-center justify-center space-y-4">
                      
                      {/* Avatar Shield */}
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-teal-400 shadow-lg relative">
                          <Activity className="w-8 h-8 text-teal-400 animate-pulse" />
                          <div className="absolute -inset-1 rounded-full border border-teal-500/20 animate-ping"></div>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-xs font-bold text-slate-300">IDBI AI Spokesperson</p>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono mt-0.5">Narrator Wave</p>
                      </div>

                      {/* Waveform Visualizer */}
                      <div className="flex items-end justify-center gap-1 h-12 w-full max-w-[180px] bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/40">
                        {waveformHeight.map((h, i) => (
                          <motion.div
                            key={i}
                            animate={{ height: isPlaying ? h : 4 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="w-1.5 bg-gradient-to-t from-teal-600 to-teal-400 rounded-full"
                            style={{ height: "4px" }}
                          ></motion.div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Synchronized Script Subtitle Footer inside Player */}
                  <div className="bg-slate-900 border-t border-slate-800/80 p-4 min-h-[90px] flex items-center justify-center">
                    <p className="text-sm font-medium text-slate-200 text-center max-w-2xl leading-relaxed">
                      {currentChapter.subtitle}
                    </p>
                  </div>

                </div>
              )}

              {activeTab === "slides" && (
                <div className="w-full h-full flex flex-col justify-between">
                  {/* Slides view wrapper */}
                  <div className="flex-1 flex flex-col justify-center max-w-xl mx-auto space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-teal-400 bg-teal-950 border border-teal-800 px-2 py-0.5 rounded">
                        BOARDROOM PRESENTATION - SLIDE {activeSlide + 1} OF 5
                      </span>
                      <span className="text-xs text-slate-500">IDBI DIGITAL CREDIT SHOWCASE</span>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
                      <h3 className="text-xl font-bold text-white tracking-tight">
                        {SLIDES[activeSlide].header}
                      </h3>
                      <ul className="space-y-3">
                        {SLIDES[activeSlide].bullets.map((bullet, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                            <span className="p-1 rounded bg-teal-900/40 text-teal-400 shrink-0 font-bold text-[9px] w-5 h-5 flex items-center justify-center">
                              0{idx + 1}
                            </span>
                            <span className="leading-relaxed">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Metrics row */}
                    <div className="grid grid-cols-3 gap-3">
                      {SLIDES[activeSlide].metrics.map((metric, idx) => (
                        <div key={idx} className="bg-slate-900 border border-slate-800/80 p-3 rounded-lg text-center">
                          <span className="text-lg font-black text-teal-400">{metric.value}</span>
                          <p className="text-[9px] text-slate-500 uppercase mt-0.5 tracking-wider font-semibold">{metric.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Manual Slide Controls */}
                  <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-slate-800/50">
                    <button
                      onClick={() => {
                        setActiveSlide((prev) => (prev > 0 ? prev - 1 : SLIDES.length - 1));
                        playBeep(440, 0.1);
                      }}
                      className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-xs font-mono text-slate-400">
                      Slide {activeSlide + 1} of {SLIDES.length}
                    </span>
                    <button
                      onClick={() => {
                        setActiveSlide((prev) => (prev < SLIDES.length - 1 ? prev + 1 : 0));
                        playBeep(440, 0.1);
                      }}
                      className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "architecture" && (
                <div className="w-full h-full flex flex-col justify-center items-center py-4">
                  <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Server className="w-4 h-4" />
                        Platform Architecture Spec
                      </span>
                      <span className="text-[10px] text-slate-500">IDBI BANK CENTRAL DEPLOYMENT</span>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                        <Database className="w-6 h-6 mx-auto text-orange-500" />
                        <span className="block text-xs font-bold text-white mt-2">Data Ingestion</span>
                        <p className="text-[9px] text-slate-500 mt-1">Direct integration with GSTN, Bank APIs, and corporate registries.</p>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                        <Cpu className="w-6 h-6 mx-auto text-teal-400" />
                        <span className="block text-xs font-bold text-white mt-2">XAI Score Engine</span>
                        <p className="text-[9px] text-slate-500 mt-1">XGBoost & SHAP engines map risk indicators to FHS credit ranges.</p>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                        <ShieldCheck className="w-6 h-6 mx-auto text-teal-400" />
                        <span className="block text-xs font-bold text-white mt-2">Sovereign Rules</span>
                        <p className="text-[9px] text-slate-500 mt-1">Role-isolated, tamper-proof audit trails and credential masking.</p>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 font-mono text-[9px] text-slate-400 space-y-1">
                      <p className="text-slate-200 font-bold">DEPLOYMENT METRIC SUMMARIES:</p>
                      <p>• Data Processing TAT: &lt; 2.5 seconds</p>
                      <p>• Write-Once Log Ledger Security: SHA-256 integrity validations</p>
                      <p>• Identity isolation policy: Firebase Security Rules (Version 2)</p>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* 3. Integrated Video Player Seeking Controls Bar */}
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Play / Pause / Reset Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setIsPlaying(!isPlaying);
                    playBeep(523.25, 0.1);
                  }}
                  className="w-10 h-10 rounded-full bg-teal-600 hover:bg-teal-500 text-white flex items-center justify-center shadow-lg transition-colors cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
                </button>
                <button
                  onClick={() => {
                    setCurrentTime(0);
                    setIsPlaying(true);
                    playBeep(329.63, 0.15); // E4 beep
                  }}
                  className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Restart Presentation"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
                
                {/* Time indicators */}
                <div className="text-xs text-slate-400 font-mono flex items-center gap-1 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
                  <Clock className="w-3.5 h-3.5 text-teal-500" />
                  <span className="font-bold text-white">{formatTime(currentTime)}</span>
                  <span className="text-slate-600">/</span>
                  <span>3:00</span>
                </div>
              </div>

              {/* Scrubber Seeking Bar */}
              <div className="flex-1 w-full mx-2 flex items-center gap-3">
                <div className="relative flex-1 h-2 bg-slate-800 rounded-full overflow-hidden cursor-pointer">
                  {/* Chapter boundaries as visual notches */}
                  {CHAPTERS.map((c, idx) => (
                    <div 
                      key={idx} 
                      className="absolute top-0 bottom-0 w-0.5 bg-slate-950 z-10"
                      style={{ left: `${(c.timeStart / 180) * 100}%` }}
                    ></div>
                  ))}
                  
                  {/* Current Active Scrubber Progress */}
                  <div 
                    className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-teal-600 to-teal-400 transition-all duration-300"
                    style={{ width: `${(currentTime / 180) * 100}%` }}
                  ></div>
                  
                  {/* Invisible slider input for actual timeline scrubbing */}
                  <input
                    type="range"
                    min="0"
                    max="180"
                    value={currentTime}
                    onChange={(e) => skipToTime(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* Playback Speed selector */}
              <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
                <span className="text-slate-500 px-1 font-semibold">Speed:</span>
                {[1, 1.5, 2].map((speed) => (
                  <button
                    key={speed}
                    onClick={() => {
                      setPlaybackSpeed(speed);
                      playBeep(523.25, 0.05);
                    }}
                    className={`px-2 py-1 rounded-md font-bold transition-all cursor-pointer ${
                      playbackSpeed === speed 
                        ? "bg-teal-600 text-white" 
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

            </div>

          </div>

          {/* Subtitles & Narration Transcript Script under Player */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-teal-400" />
              Narration Speech Transcript
            </h4>
            <div className="max-h-[100px] overflow-y-auto text-xs text-slate-300 leading-relaxed pr-2 font-medium">
              <span className="text-teal-400 font-bold">Narrator: </span>
              {currentChapter.narratorScript}
            </div>
          </div>

        </section>

        {/* Right Side: Showcase Chapters & Sandbox Access (4 columns) */}
        <section className="lg:col-span-4 flex flex-col justify-between space-y-6">
          
          {/* Timeline Chapters Checklist */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-teal-400" />
              Presentation Agenda
            </h3>
            
            <div className="space-y-3">
              {CHAPTERS.map((ch, idx) => {
                const isActive = currentTime >= ch.timeStart && currentTime <= ch.timeEnd;
                const isCompleted = currentTime > ch.timeEnd;
                
                return (
                  <button
                    key={ch.id}
                    onClick={() => skipToTime(ch.timeStart)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${
                      isActive 
                        ? "bg-teal-950/40 border-teal-500/80 text-white ring-2 ring-teal-500/10" 
                        : isCompleted
                        ? "bg-slate-900/40 border-slate-800 text-slate-400"
                        : "bg-slate-950 border-slate-900 text-slate-500 hover:bg-slate-900/30 hover:border-slate-800"
                    }`}
                  >
                    <div className="mt-0.5">
                      {isCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                      ) : isActive ? (
                        <span className="w-4 h-4 rounded-full border-2 border-teal-400 flex items-center justify-center text-[8px] font-bold text-teal-400 animate-pulse shrink-0">
                          ▶
                        </span>
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[9px] font-bold shrink-0">
                          0{idx + 1}
                        </span>
                      )}
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs font-bold leading-tight truncate ${isActive ? "text-white" : ""}`}>
                          {ch.title}
                        </p>
                        <span className="text-[10px] font-mono shrink-0 ml-1.5 text-slate-500">
                          {formatTime(ch.timeStart)}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 leading-snug truncate-2-lines">
                        {ch.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sandbox Launch Fast-pass Buttons */}
          <div className="bg-gradient-to-br from-teal-950 to-slate-950 border border-teal-800/40 rounded-2xl p-5 space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-teal-400 bg-teal-950/80 px-2.5 py-1 rounded-full border border-teal-900">
                STAKEHOLDER GATEWAYS
              </span>
              <h3 className="text-lg font-black text-white tracking-tight mt-2.5">
                Immediate Sandbox Fast-Pass
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mt-1">
                Log into the live, fully functional software client pre-configured with sovereign mock data and secure credentials.
              </p>
            </div>

            <div className="space-y-2.5">
              {/* Login as Credit Officer */}
              <Link
                to="/login"
                className="group w-full bg-slate-900 hover:bg-slate-850 border border-slate-850 rounded-xl p-3 flex items-center justify-between text-xs font-bold text-white transition-all cursor-pointer hover:border-teal-500/40"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded bg-teal-950 border border-teal-900 text-teal-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span>Enter as IDBI Credit Officer</span>
                    <span className="block text-[10px] text-slate-500 font-medium">Auto-assess non-collateral alternate cards</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Login as MSME Owner */}
              <Link
                to="/login"
                className="group w-full bg-slate-900 hover:bg-slate-850 border border-slate-850 rounded-xl p-3 flex items-center justify-between text-xs font-bold text-white transition-all cursor-pointer hover:border-teal-500/40"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded bg-orange-950 border border-orange-900 text-orange-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span>Enter as MSME Business Owner</span>
                    <span className="block text-[10px] text-slate-500 font-medium">Verify GST, connect data feeds, view rating report</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <p className="text-[10px] text-slate-500 text-center">
              No registration needed. Press "Credit Officer" on the login screen.
            </p>
          </div>

        </section>

      </main>

      {/* 3. Executive Footer */}
      <footer className="h-14 border-t border-slate-800 bg-slate-950 px-4 sm:px-8 flex items-center justify-between text-[11px] text-slate-500">
        <div>
          <span>IDBI Bank Credit Intelligence Division &copy; 2026. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="#compliance" className="hover:text-slate-300 transition-colors">RBI Digital Lending Guidelines Compliant</a>
          <span>•</span>
          <a href="#security" className="hover:text-slate-300 transition-colors">ISO 27001 Certified Infrastructure</a>
        </div>
      </footer>

    </div>
  );
};
