import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Database, 
  Cpu, 
  Building2, 
  TrendingUp, 
  Lock, 
  FileText, 
  Check, 
  Network, 
  Clock, 
  Fingerprint, 
  Zap, 
  Users, 
  BadgePercent,
  Layers,
  ChevronRight,
  Menu,
  X,
  FileSpreadsheet
} from "lucide-react";

// Interactive Types for our simulator
type DataStreamSelection = "all_streams" | "gst_only" | "pos_only" | "utility_only";

interface SimulatorConfig {
  score: number;
  grade: "AAA" | "AA" | "B" | "D";
  risk: "EXCEPTIONAL" | "PRIME" | "MODERATE" | "HIGH RISK";
  riskColor: string;
  bgColor: string;
  dscr: string;
  reliability: string;
  activeStreams: string[];
}

const SIMULATOR_PRESETS: Record<DataStreamSelection, SimulatorConfig> = {
  all_streams: {
    score: 842,
    grade: "AAA",
    risk: "EXCEPTIONAL",
    riskColor: "text-emerald-600 bg-emerald-50 border-emerald-200",
    bgColor: "from-blue-600 to-blue-800",
    dscr: "2.8x",
    reliability: "99.4%",
    activeStreams: ["GST Filings", "POS Ledger Sync", "Utility Streams", "Rent Receipts"],
  },
  gst_only: {
    score: 710,
    grade: "AA",
    risk: "PRIME",
    riskColor: "text-blue-600 bg-blue-50 border-blue-200",
    bgColor: "from-blue-500 to-blue-700",
    dscr: "1.9x",
    reliability: "92.1%",
    activeStreams: ["GST Filings"],
  },
  pos_only: {
    score: 645,
    grade: "B",
    risk: "MODERATE",
    riskColor: "text-amber-600 bg-amber-50 border-amber-200",
    bgColor: "from-slate-600 to-slate-800",
    dscr: "1.4x",
    reliability: "84.5%",
    activeStreams: ["POS Ledger Sync"],
  },
  utility_only: {
    score: 420,
    grade: "D",
    risk: "HIGH RISK",
    riskColor: "text-rose-600 bg-rose-50 border-rose-200",
    bgColor: "from-slate-700 to-slate-900",
    dscr: "0.8x",
    reliability: "65.0%",
    activeStreams: ["Utility Streams"],
  },
};

export const Landing: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedStream, setSelectedStream] = useState<DataStreamSelection>("all_streams");
  const [activeBenefitsTab, setActiveBenefitsTab] = useState<"officer" | "owner">("officer");

  const currentPreset = SIMULATOR_PRESETS[selectedStream];

  // Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const navLinks = [
    { name: "Problem", href: "#problem" },
    { name: "Solution", href: "#solution" },
    { name: "Features", href: "#features" },
    { name: "Health Card", href: "#healthcard" },
    { name: "Machine Learning", href: "#ml" },
    { name: "Benefits", href: "#benefits" },
    { name: "Technology", href: "#technology" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased overflow-x-hidden selection:bg-blue-600 selection:text-white">
      
      {/* 1. Nav Bar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 flex flex-col items-center justify-center text-white font-extrabold shadow-md relative text-[11px] leading-none shrink-0">
                <span>IDBI</span>
                <span className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
              </div>
              <span className="text-xl font-black text-teal-800 tracking-tight">
                MSME<span className="text-orange-500">360</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-semibold text-slate-600 hover:text-teal-650 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              <Link
                to="/demo"
                className="flex items-center gap-1.5 px-4 py-2.5 bg-teal-50 border border-teal-200 hover:bg-teal-100 text-teal-700 rounded-xl font-extrabold text-xs transition-colors relative"
              >
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                </span>
                <span>3-Min Demo Video</span>
              </Link>
              <Link
                to="/login"
                className="text-sm font-bold text-slate-700 hover:text-teal-600 px-4 py-2 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-md shadow-teal-100 hover:shadow-lg active:scale-95 transition-all"
              >
                Access Portal
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 focus:outline-hidden"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden border-t border-slate-100 bg-white px-4 py-6 space-y-4 shadow-lg"
          >
            <div className="flex flex-col gap-4">
              <Link
                to="/demo"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-bold text-teal-700 flex items-center gap-2 animate-pulse"
              >
                <span>▶ 3-Min Demo Video</span>
              </Link>
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-base font-semibold text-slate-700 hover:text-teal-600 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
            <div className="border-t border-slate-100 pt-4 flex flex-col gap-3">
              <Link
                to="/login"
                className="w-full text-center py-2.5 font-bold text-slate-700 hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="w-full text-center py-2.5 font-bold bg-teal-700 text-white rounded-xl shadow-md"
              >
                Access Portal
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Adjust viewport for fixed nav */}
      <div className="pt-20"></div>

      {/* 2. Hero Section */}
      <section id="hero" className="relative py-20 lg:py-28 overflow-hidden bg-radial from-white via-slate-50 to-slate-100/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200/80 px-3 py-1.5 rounded-full text-teal-700 font-bold text-xs uppercase tracking-wider mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse"></span>
                IDBI Bank Digital Lending
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                Transforming Alternate Data into <span className="text-teal-700 block mt-2">Trusted Credit Intelligence</span>
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-medium">
                Unlock financing opportunities for New-to-Credit (NTC) and underserved enterprises. IDBI Bank MSME360 parses alternate data footprints like taxes, digital ledgers, and utilities to generate immediate, secure credit profiles.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  to="/demo"
                  className="w-full sm:w-auto px-8 py-4 bg-teal-700 hover:bg-teal-800 text-white font-bold text-base rounded-xl shadow-lg shadow-teal-200 hover:shadow-xl hover:shadow-teal-300 transition-all flex items-center justify-center gap-2.5 group relative overflow-hidden"
                >
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-300 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                  </span>
                  <span>Launch 3-Min Interactive Demo</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-bold text-base transition-all text-center"
                >
                  Access Portal Gateway
                </Link>
                <a
                  href="#healthcard"
                  className="w-full sm:w-auto px-8 py-4 bg-slate-100 hover:bg-slate-200/80 text-slate-600 rounded-xl font-bold text-base transition-all text-center"
                >
                  Explore Simulator
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-lg mx-auto lg:mx-0">
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-teal-700">99.8%</p>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1">Accuracy Index</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">10 Secs</p>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1">Underwriting Time</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">Zero</p>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1">Collateral Required</p>
                </div>
              </div>
            </div>

            {/* Hero Visual Block */}
            <div className="lg:col-span-5 relative">
              <div className="absolute inset-0 bg-blue-400/10 rounded-3xl blur-2xl transform scale-90 -z-10"></div>
              
              {/* Premium Dashboard Preview */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-white border border-slate-200/80 rounded-3xl shadow-xl shadow-slate-200/60 overflow-hidden"
              >
                {/* Header of Mock Screen */}
                <div className="bg-slate-900 text-white p-4 flex justify-between items-center border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    <span className="text-[10px] font-mono text-slate-400 ml-2">secure.msme360.net</span>
                  </div>
                  <div className="bg-slate-800 rounded-full px-2.5 py-0.5 text-[9px] font-bold text-blue-400 border border-blue-900/60 flex items-center gap-1.5">
                    <Lock className="w-2.5 h-2.5" /> SECURE GATEWAY
                  </div>
                </div>

                {/* Dashboard Details */}
                <div className="p-6 space-y-5 bg-slate-50/50">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target MSME</span>
                      <h4 className="font-extrabold text-slate-800 text-sm mt-0.5">Metec Crafts India Pvt Ltd</h4>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full uppercase tracking-wide">
                      Active Stream Sync
                    </span>
                  </div>

                  {/* Alternate Score Circle */}
                  <div className="bg-white border border-slate-200/60 rounded-2xl p-4 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-xs text-slate-400 font-semibold uppercase">Alternate Health Index</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-blue-700">824</span>
                        <span className="text-xs text-slate-400">/ 900</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block text-[10px] font-black bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1 rounded-lg">
                        GRADE AAA
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1.5 font-bold">Risk Assessment: Exceptional</p>
                    </div>
                  </div>

                  {/* Visual Data Streams */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alternate Underwriting Streams</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-white border border-slate-100 rounded-xl flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-800 leading-none">GST/Tax Streams</p>
                          <p className="text-[9px] text-slate-400 mt-0.5">Verified continuous</p>
                        </div>
                      </div>
                      <div className="p-2.5 bg-white border border-slate-100 rounded-xl flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-800 leading-none">POS Ledger Sync</p>
                          <p className="text-[9px] text-slate-400 mt-0.5">14 Months history</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Problem Statement Section */}
      <section id="problem" className="py-20 bg-white border-y border-slate-200/80 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-block text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full uppercase tracking-wider">
              The Underwriting Crisis
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Why Traditional Credit Rails Fail Underserved MSMEs
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Over 70% of emerging MSMEs lack extensive traditional collateral or vintage audited financial balance sheets. This creates an immediate systemic lockout.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            
            {/* Problem Card 1 */}
            <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl relative overflow-hidden group hover:border-blue-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-6">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Stale Audited Vintages</h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-3 leading-relaxed">
                Traditional banking relies heavily on historical, once-a-year taxation audits. This outdated retrospective view cannot reflect real-time enterprise performance.
              </p>
            </div>

            {/* Problem Card 2 */}
            <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl relative overflow-hidden group hover:border-blue-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-6">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Inflexible Collateral Demands</h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-3 leading-relaxed">
                Most banks lock down lines of credit without physical properties, missing millions of highly active digital-first services or technology-driven MSMEs.
              </p>
            </div>

            {/* Problem Card 3 */}
            <div className="p-8 bg-slate-50 border border-slate-200 rounded-2xl relative overflow-hidden group hover:border-blue-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-6">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">Exorbitant Review Bottlenecks</h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-3 leading-relaxed">
                Manual underwriters take days to verify disparate corporate entities. Underserved MSMEs need immediate operational liquidity, not month-long wait times.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Our Solution Section */}
      <section id="solution" className="py-20 bg-slate-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Col: Solution explanation */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-block text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full uppercase tracking-wider">
                The Platform Ecosystem
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Alternate Financial Footprints turned into Bankable Assets
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                MSME360 bridges the gap by building a state-of-the-art secure gateway that translates raw, high-frequency transactional data streams directly into real-time underwriter reports. 
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Automated Real-Time Ingestion</h4>
                    <p className="text-xs text-slate-500 mt-1">Connect API bridges directly into state tax boards, utilities, and commercial POS platforms.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Proprietary Risk Scoring Model</h4>
                    <p className="text-xs text-slate-500 mt-1">Evaluate continuous solvency and cashflow patterns rather than static retrospective statements.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Secure Multilateral Vaults</h4>
                    <p className="text-xs text-slate-500 mt-1">Underwriters access verifiable metrics instantly with cryptographic authorization keys.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Solution graphic */}
            <div className="lg:col-span-6 relative flex justify-center">
              <div className="absolute inset-0 bg-blue-500/5 rounded-3xl blur-3xl transform scale-75"></div>
              
              <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
                
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">The Structured Data flow</p>
                
                <div className="space-y-6 relative">
                  
                  {/* Step 1 */}
                  <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                      <Database className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-400 leading-none">STEP 01</p>
                      <p className="text-xs font-black text-slate-800 mt-1">Alternate Stream Authorization</p>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Secure</span>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-400 leading-none">STEP 02</p>
                      <p className="text-xs font-black text-slate-800 mt-1">MSME360 Underwriting Engine</p>
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">ML Model</span>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-center gap-4 bg-blue-700 text-white p-3.5 rounded-2xl shadow-lg shadow-blue-100">
                    <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center font-bold">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold text-blue-200 leading-none">STEP 03</p>
                      <p className="text-xs font-black mt-1">Financial Health Card Issued</p>
                    </div>
                    <span className="text-[10px] font-bold text-white bg-blue-600 px-2 py-0.5 rounded-full">99.4% Acc</span>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Features Section */}
      <section id="features" className="py-20 bg-white border-y border-slate-200/80 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-block text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full uppercase tracking-wider">
              System Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Enterprise Infrastructure for Credit Professionals
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              A comprehensive toolset engineered to minimize default risk while fast-tracking application processing pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            
            {/* Feature 1 */}
            <div className="p-8 border border-slate-100 rounded-2xl hover:border-slate-200 hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-6">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Tax Stream Integration</h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-3 leading-relaxed">
                Automated continuous verification of GST filings, direct excise reporting, and national corporate records without manual uploads.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 border border-slate-100 rounded-2xl hover:border-slate-200 hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-6">
                <Network className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">E-Commerce & POS Integration</h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-3 leading-relaxed">
                Connect payment systems (Stripe, Paypal, Shopify) directly to verify continuous transaction volumes, average basket size, and refunds.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 border border-slate-100 rounded-2xl hover:border-slate-200 hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-6">
                <Fingerprint className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Cryptographic Identity</h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-3 leading-relaxed">
                Each profile and data stream sync utilizes advanced, tamper-proof keys ensuring perfect tracking of applicant information.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 border border-slate-100 rounded-2xl hover:border-slate-200 hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-6">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Multi-Tenant Isolation</h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-3 leading-relaxed">
                Proprietary security rules enforce total containment of applicant records. Information is only exposed upon user consent.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 border border-slate-100 rounded-2xl hover:border-slate-200 hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-6">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Interactive Underwriting</h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-3 leading-relaxed">
                Credit officers analyze historical and alternate performance metrics instantly within a highly secure single console interface.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 border border-slate-100 rounded-2xl hover:border-slate-200 hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-6">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Dynamic Risk Banding</h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-3 leading-relaxed">
                Continuous risk adjustment ensures that underwriters are instantly notified of high cashflow deviations or utility default streams.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Financial Health Card Section (Interactive Simulator) */}
      <section id="healthcard" className="py-20 bg-slate-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-block text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full uppercase tracking-wider">
              Asset Showcase
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              The Financial Health Card
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Interactive sandbox. Select which alternate data streams the MSME is providing to see how the Financial Health Card dynamically calculates security and rating profiles.
            </p>
          </div>

          {/* Interactive Simulator Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-16 items-center">
            
            {/* Left: Input Selector */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-lg font-extrabold text-slate-800 uppercase tracking-tight mb-4">
                Select Alternate Streams
              </h3>

              {/* Stream Option 1 */}
              <button
                onClick={() => setSelectedStream("all_streams")}
                className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center gap-4 cursor-pointer ${
                  selectedStream === "all_streams"
                    ? "bg-blue-700 text-white border-blue-700 shadow-md shadow-blue-100"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  selectedStream === "all_streams" ? "bg-white/20 text-white" : "bg-blue-50 text-blue-700"
                }`}>
                  <Zap className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black">All Alternate Streams Active</p>
                  <p className={`text-xs mt-0.5 ${selectedStream === "all_streams" ? "text-blue-100" : "text-slate-400"}`}>
                    GST, POS, Utility footprint connected
                  </p>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Stream Option 2 */}
              <button
                onClick={() => setSelectedStream("gst_only")}
                className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center gap-4 cursor-pointer ${
                  selectedStream === "gst_only"
                    ? "bg-blue-700 text-white border-blue-700 shadow-md shadow-blue-100"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  selectedStream === "gst_only" ? "bg-white/20 text-white" : "bg-blue-50 text-blue-700"
                }`}>
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black">GST & Tax Sync Only</p>
                  <p className={`text-xs mt-0.5 ${selectedStream === "gst_only" ? "text-blue-100" : "text-slate-400"}`}>
                    Verified corporate ledger history
                  </p>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Stream Option 3 */}
              <button
                onClick={() => setSelectedStream("pos_only")}
                className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center gap-4 cursor-pointer ${
                  selectedStream === "pos_only"
                    ? "bg-blue-700 text-white border-blue-700 shadow-md shadow-blue-100"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  selectedStream === "pos_only" ? "bg-white/20 text-white" : "bg-blue-50 text-blue-700"
                }`}>
                  <Network className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black">POS & Digital Wallets Sync</p>
                  <p className={`text-xs mt-0.5 ${selectedStream === "pos_only" ? "text-blue-100" : "text-slate-400"}`}>
                    Real-time payment transaction streams
                  </p>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Stream Option 4 */}
              <button
                onClick={() => setSelectedStream("utility_only")}
                className={`w-full p-4 rounded-2xl text-left border transition-all flex items-center gap-4 cursor-pointer ${
                  selectedStream === "utility_only"
                    ? "bg-blue-700 text-white border-blue-700 shadow-md shadow-blue-100"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  selectedStream === "utility_only" ? "bg-white/20 text-white" : "bg-blue-50 text-blue-700"
                }`}>
                  <Layers className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black">Utility Footprints Only</p>
                  <p className={`text-xs mt-0.5 ${selectedStream === "utility_only" ? "text-blue-100" : "text-slate-400"}`}>
                    Basic energy and water payment logs
                  </p>
                </div>
                <ChevronRight className="w-4 h-4" />
              </button>

            </div>

            {/* Right: The Virtual Financial Health Card */}
            <div className="lg:col-span-7 flex justify-center">
              <motion.div 
                key={selectedStream}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-xl p-8 text-white relative overflow-hidden"
              >
                {/* Visual Glow */}
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl"></div>

                {/* Top Badge Row */}
                <div className="flex justify-between items-center pb-6 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <span className="font-extrabold text-sm tracking-tight text-white">MSME360 Credit Profile</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 border rounded-full uppercase tracking-wider ${currentPreset.riskColor}`}>
                    {currentPreset.risk}
                  </span>
                </div>

                {/* Main Index Score display */}
                <div className="py-8 grid grid-cols-2 gap-8 items-center border-b border-slate-800">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Health Score Index</p>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-5xl font-black text-white">{currentPreset.score}</span>
                      <span className="text-sm text-slate-500">/ 900</span>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Model Rating</p>
                    <p className="text-3xl font-black text-blue-400 tracking-tight">GRADE {currentPreset.grade}</p>
                  </div>
                </div>

                {/* Ingested metrics list */}
                <div className="py-6 space-y-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ingested Authorized Streams</p>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {["GST Filings", "POS Ledger Sync", "Utility Streams", "Rent Receipts"].map((stream) => {
                      const isActive = currentPreset.activeStreams.includes(stream);
                      return (
                        <div 
                          key={stream}
                          className={`p-3 border rounded-xl flex items-center gap-2.5 ${
                            isActive 
                              ? "bg-slate-800/60 border-slate-700 text-white" 
                              : "opacity-40 bg-slate-900/40 border-slate-800/80 text-slate-500"
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                            isActive ? "bg-emerald-950 text-emerald-400 border border-emerald-800" : "bg-slate-850 text-slate-700"
                          }`}>
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-semibold truncate">{stream}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Additional underwriting data tags */}
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 grid grid-cols-2 gap-4 text-xs text-center">
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase block">Debt Service Coverage (DSCR)</span>
                    <span className="font-extrabold text-white text-sm mt-0.5 inline-block">{currentPreset.dscr}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase block">Telemetry Reliability Ratio</span>
                    <span className="font-extrabold text-blue-400 text-sm mt-0.5 inline-block">{currentPreset.reliability}</span>
                  </div>
                </div>

              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Machine Learning Section */}
      <section id="ml" className="py-20 bg-white border-y border-slate-200/80 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual convergence of features */}
            <div className="lg:col-span-6 relative">
              <div className="absolute inset-0 bg-blue-500/5 rounded-3xl blur-3xl transform scale-90 -z-10"></div>
              
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-inner space-y-6">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Alternate Feature Weight Matrix</p>
                
                {/* Weight Bar 1 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>POS Volume Stability Stream</span>
                    <span>30% Allocation</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-700 rounded-full" style={{ width: "30%" }}></div>
                  </div>
                </div>

                {/* Weight Bar 2 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>GST Reporting Consistency Index</span>
                    <span>25% Allocation</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-700 rounded-full" style={{ width: "25%" }}></div>
                  </div>
                </div>

                {/* Weight Bar 3 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Rent & Utility Payment Timelines</span>
                    <span>25% Allocation</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-700 rounded-full" style={{ width: "25%" }}></div>
                  </div>
                </div>

                {/* Weight Bar 4 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Social & Digital Trust Signals</span>
                    <span>20% Allocation</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-700 rounded-full" style={{ width: "20%" }}></div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/60 text-[11px] text-slate-400 leading-relaxed font-semibold">
                  Model uses multi-layer feature extraction and neural convergence to map alternate parameters into standard banking underwriting risk coefficients.
                </div>
              </div>
            </div>

            {/* Description Text */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-block text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full uppercase tracking-wider">
                Proprietary Algorithms
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Self-Learning Machine Learning Underwriting
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Traditional credit scoring works on stale data and manual sheets. The MSME360 engine continuously runs telemetry checks, detecting changes in cashflow speeds and GST filings to keep credit assessments valid up to the second.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="p-4 border border-slate-100 rounded-xl">
                  <h4 className="font-extrabold text-slate-900 text-sm">Adaptive Risk Mapping</h4>
                  <p className="text-xs text-slate-500 mt-1">Our algorithms adjust threshold calculations depending on the specific industrial segment footprint.</p>
                </div>
                <div className="p-4 border border-slate-100 rounded-xl">
                  <h4 className="font-extrabold text-slate-900 text-sm">Fraud Sentinel Shield</h4>
                  <p className="text-xs text-slate-500 mt-1">Automated validation matches GST inputs directly to national records to eliminate forgery.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. Benefits Section */}
      <section id="benefits" className="py-20 bg-slate-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
            <div className="inline-block text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full uppercase tracking-wider">
              System Impact
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Tangible Value for the Financial Ecosystem
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              A dual-sided ecosystem engineered to simplify life for Credit Officers under pressure and MSME Owners looking for working capital.
            </p>

            {/* Toggle Switch */}
            <div className="flex justify-center pt-4">
              <div className="bg-white border border-slate-200 p-1 rounded-xl inline-flex shadow-sm">
                <button
                  onClick={() => setActiveBenefitsTab("officer")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeBenefitsTab === "officer"
                      ? "bg-blue-700 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  For Credit Officers
                </button>
                <button
                  onClick={() => setActiveBenefitsTab("owner")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeBenefitsTab === "owner"
                      ? "bg-blue-700 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  For MSME Owners
                </button>
              </div>
            </div>
          </div>

          {/* Tab Contents */}
          <div className="max-w-5xl mx-auto">
            {activeBenefitsTab === "officer" ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {/* Benefit 1 */}
                <div className="bg-white p-8 border border-slate-200 rounded-2xl shadow-sm text-center">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-6">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">Immediate Pre-Screening</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                    Reduce application processing duration from 2 weeks down to mere seconds via verified alternate credentials.
                  </p>
                </div>

                {/* Benefit 2 */}
                <div className="bg-white p-8 border border-slate-200 rounded-2xl shadow-sm text-center">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-6">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">Drastic Default Reduction</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                    Identify non-obvious default telemetry early via predictive e-commerce transaction frequency algorithms.
                  </p>
                </div>

                {/* Benefit 3 */}
                <div className="bg-white p-8 border border-slate-200 rounded-2xl shadow-sm text-center">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">Zero Compliance Hassle</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                    Immutable secure log audits confirm that all profile views are fully authorized by the enterprise applicant.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {/* Benefit 1 */}
                <div className="bg-white p-8 border border-slate-200 rounded-2xl shadow-sm text-center">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-6">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">Unlock Enterprise Value</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                    Unlock critical loans even without a conventional banking history or legacy land collateral properties.
                  </p>
                </div>

                {/* Benefit 2 */}
                <div className="bg-white p-8 border border-slate-200 rounded-2xl shadow-sm text-center">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-6">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">Absolute Data Sovereignty</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                    You have absolute control. Your secure streams are only accessed by financial institutions you explicitly approve.
                  </p>
                </div>

                {/* Benefit 3 */}
                <div className="bg-white p-8 border border-slate-200 rounded-2xl shadow-sm text-center">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mx-auto mb-6">
                    <BadgePercent className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">Optimal Interest Rates</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                    Prove your creditworthiness with real-time transactional excellence to bargain for better capital pricing structures.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* 9. Technology Section */}
      <section id="technology" className="py-20 bg-white border-y border-slate-200/80 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Stack description */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-block text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full uppercase tracking-wider">
                Platform Security
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Architected with Cryptographic Rigor
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Our secure design features strict multi-tenant Firestore security layouts alongside fully compliant Firebase Authentication schemes.
              </p>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex gap-3.5">
                  <Lock className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-extrabold text-slate-900">Role-Based Access Control (RBAC)</h4>
                    <p className="text-xs text-slate-500 mt-1">Granular controls isolate views based on verified roles: Credit Officer, MSME Owner, or Platform Admin.</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex gap-3.5">
                  <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-extrabold text-slate-900">Secure Firestore Security Layout</h4>
                    <p className="text-xs text-slate-500 mt-1">Multi-tenant isolation policies block cross-entity data queries unless cryptographic authorization exists.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Architectural mockup */}
            <div className="lg:col-span-6 relative flex justify-center">
              <div className="absolute inset-0 bg-blue-500/5 rounded-3xl blur-3xl transform scale-75"></div>
              
              <div className="w-full max-w-md bg-slate-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden font-mono text-[11px] leading-relaxed border border-slate-800">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
                
                <p className="text-blue-400 font-bold mb-4">// SECURITY PROTOCOL LAYOUT</p>
                
                <div className="space-y-4">
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                    <span className="text-emerald-400 font-bold">rules_version = '2';</span>
                    <p className="text-slate-500 mt-1">service cloud.firestore &#123;</p>
                    <p className="text-slate-500 ml-4">match /databases/&#123;database&#125;/documents &#123;</p>
                    <p className="text-blue-300 ml-8">match /users/&#123;userId&#125; &#123;</p>
                    <p className="text-slate-400 ml-12">allow read: if isAuthenticated();</p>
                    <p className="text-slate-400 ml-12">allow write: if isOwner(userId);</p>
                    <p className="text-blue-300 ml-8">&#125;</p>
                    <p className="text-slate-500 ml-4">&#125;</p>
                    <p className="text-slate-500">&#125;</p>
                  </div>

                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center text-[10px]">
                    <span className="text-slate-400 font-bold">TLS Cryptographic Protocol</span>
                    <span className="text-emerald-400 bg-emerald-950/80 px-2 py-0.5 border border-emerald-800 rounded-full font-black">ACTIVE</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 10. Call To Action Section */}
      <section className="py-20 bg-slate-50 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-blue-700 rounded-3xl p-8 sm:p-12 lg:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-200">
            {/* Geometric glow assets */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-600 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-blue-800 rounded-full blur-3xl opacity-50"></div>

            <div className="max-w-3xl mx-auto space-y-6 relative">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Unlock Capital Integrity Today
              </h2>
              <p className="text-blue-100 text-sm sm:text-base max-w-2xl mx-auto">
                Join financial institutions and emerging MSMEs leveraging modern transactional footprints to bypass old collateral constraints safely.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-blue-900 font-extrabold text-sm sm:text-base rounded-xl shadow-lg transition-all active:scale-95 text-center"
                >
                  Initiate Secure Registration
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-4 bg-blue-800 hover:bg-blue-900 text-white border border-blue-600/40 font-extrabold text-sm sm:text-base rounded-xl transition-all text-center"
                >
                  Access Secure Desk
                </Link>
              </div>

              <p className="text-[10px] text-blue-200 uppercase tracking-wider font-bold pt-4">
                Protected by National Encryption Standards and Multi-Tenant Isolation Rules
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Footer Section */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-900">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-base font-black text-white tracking-tight">
                  MSME<span className="text-blue-500">360</span>
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Transforming Alternate Data streams into secure, trusted credit indicators to support underrepresented enterprise profiles worldwide.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3">Enterprise Access</h4>
              <ul className="space-y-2">
                <li><Link to="/login" className="hover:text-white transition-colors">Underwriter Gateways</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">MSME Portals</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Developer Blueprints</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3">Technical Layers</h4>
              <ul className="space-y-2">
                <li><a href="#ml" className="hover:text-white transition-colors">Convergence Model</a></li>
                <li><a href="#technology" className="hover:text-white transition-colors">Security Schema</a></li>
                <li><a href="#healthcard" className="hover:text-white transition-colors">Financial Cards</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-3">Secure Standards</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                System operations conform fully with Firebase multi-tenant protection policies. Secure ledger handshakes require dynamic client approval before stream ingestion.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
            <span>&copy; 2026 MSME360 Credit Technologies Ltd. All Rights Reserved.</span>
            <div className="flex gap-6">
              <span className="cursor-pointer hover:text-white transition-colors">Privacy Shield</span>
              <span className="cursor-pointer hover:text-white transition-colors">Tenant Isolation Terms</span>
              <span className="cursor-pointer hover:text-white transition-colors">API Compliance</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};
