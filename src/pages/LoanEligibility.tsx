import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { 
  Percent, 
  DollarSign, 
  Briefcase, 
  CheckCircle2, 
  ArrowUpRight, 
  Info, 
  ArrowRight, 
  RefreshCw,
  Building,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  Award,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LoanProduct {
  id: string;
  name: string;
  maxAmount: number;
  rate: string;
  period: string;
  type: string;
  minHealthScore: number;
  requiredFeeds: string[];
  description: string;
}

export const LoanEligibility: React.FC = () => {
  const { profile } = useAuth();
  
  // Simulated Loan Products based on alternate underwriting credit metrics
  const products: LoanProduct[] = [
    {
      id: "cf_advance",
      name: "Cash Flow Advance",
      maxAmount: 25000,
      rate: "11.8% APR",
      period: "12 Months",
      type: "Unsecured Revenue Advance",
      minHealthScore: 500,
      requiredFeeds: ["Primary Bank Statement Feed"],
      description: "Immediate short-term liquidity backed by recurring merchant checking credit inflows. No asset collateral required.",
    },
    {
      id: "inv_factor",
      name: "Invoice Factoring Bridge",
      maxAmount: 85000,
      rate: "9.5% APR",
      period: "18 Months",
      type: "Supply-Chain Invoice Credit",
      minHealthScore: 620,
      requiredFeeds: ["Primary Bank Statement Feed", "Accounting Ledger (Tally/QB)"],
      description: "Trade receivable financing backed by supplier aging schedules. Convert outstanding client bills into quick cashflow.",
    },
    {
      id: "working_cap",
      name: "Working Capital Expansion Line",
      maxAmount: 150000,
      rate: "7.8% APR (Prime)",
      period: "24 Months",
      type: "Unsecured Line of Credit",
      minHealthScore: 710,
      requiredFeeds: ["Primary Bank Statement Feed", "GSTN Tax Filing API"],
      description: "Pre-approved corporate working capital lines triggered by healthy transactional tax logs and cash stability index.",
    },
    {
      id: "term_machinery",
      name: "Machinery Term Credit",
      maxAmount: 300000,
      rate: "6.9% APR",
      period: "36 Months",
      type: "Collateralized Equipment Loan",
      minHealthScore: 780,
      requiredFeeds: ["Primary Bank Statement Feed", "GSTN Tax Filing API", "Accounting Ledger (Tally/QB)"],
      description: "Low-interest long-term equipment credit backed by overall combined rating of trade compliance and asset health indicators.",
    }
  ];

  // User health score is assumed 742 (matching dashboard default)
  const userScore = 742;

  // EMI Slider calculator state
  const [requestedAmount, setRequestedAmount] = useState(80000);
  const [repaymentMonths, setRepaymentMonths] = useState(18);
  const [selectedProduct, setSelectedProduct] = useState<LoanProduct | null>(null);

  // Application flow state
  const [applyModalProduct, setApplyModalProduct] = useState<LoanProduct | null>(null);
  const [disbursementBank, setDisbursementBank] = useState("HDFC Bank **** 9081");
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);
  const [appStep, setAppStep] = useState<"IDLE" | "ANALYZING" | "CONTRACT_SIGN" | "SUCCESS">("IDLE");

  // Calculate dynamic EMI based on slider values
  const yearlyInterestRate = 0.095; // 9.5% average
  const monthlyRate = yearlyInterestRate / 12;
  const emi = Math.round(
    (requestedAmount * monthlyRate * Math.pow(1 + monthlyRate, repaymentMonths)) /
    (Math.pow(1 + monthlyRate, repaymentMonths) - 1)
  );

  const triggerApplication = (prod: LoanProduct) => {
    setApplyModalProduct(prod);
    setAppStep("IDLE");
  };

  const handleApplySubmit = () => {
    setAppStep("ANALYZING");
    setIsSubmittingApp(true);
    
    // Step 1: Simulated AI underwriting score re-assessment
    setTimeout(() => {
      setAppStep("CONTRACT_SIGN");
    }, 1800);
  };

  const confirmSignContract = () => {
    setAppStep("SUCCESS");
    setTimeout(() => {
      // Done
    }, 500);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-bold text-blue-700 tracking-wider uppercase bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            Capital Solutions
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-2.5">
            Loan Eligibility
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse corporate loan programs pre-approved based on your alternative credit score. No physical application files required.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">My Verified Score</span>
          <span className="text-2xl font-black text-blue-700 font-mono">742 / 900</span>
        </div>
      </div>

      {/* Grid: Pre-approved Products vs EMI Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Loan Products List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-2">Pre-Approved Banking Products</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((prod) => {
              const isEligible = userScore >= prod.minHealthScore;
              return (
                <div 
                  key={prod.id}
                  className={`bg-white border rounded-2xl p-5 flex flex-col justify-between hover:border-blue-400 transition-all ${
                    isEligible ? "border-slate-200" : "border-slate-100 bg-slate-50/40 opacity-70"
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded-md px-2 py-0.5">
                        {prod.type}
                      </span>
                      
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isEligible 
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100" 
                          : "bg-rose-50 text-rose-700 border border-rose-100"
                      }`}>
                        {isEligible ? "Pre-Approved" : `Requires ${prod.minHealthScore} Score`}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-slate-900 text-sm mt-3.5">{prod.name}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-3">{prod.description}</p>

                    <div className="mt-4 pt-3 border-t border-slate-100/80 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-slate-400">Limit Capacity:</p>
                        <p className="font-extrabold text-slate-800 mt-0.5">${prod.maxAmount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Fixed rate:</p>
                        <p className="font-extrabold text-emerald-600 mt-0.5">{prod.rate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Period: {prod.period}</span>
                    {isEligible ? (
                      <button 
                        onClick={() => triggerApplication(prod)}
                        className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-black text-[11px] rounded-xl flex items-center gap-1 transition-all"
                      >
                        <span>Apply Instant</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button 
                        disabled
                        className="px-3 py-1.5 bg-slate-100 text-slate-400 font-bold text-[11px] rounded-xl cursor-not-allowed"
                      >
                        Locked
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* EMI Slider Calculator */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-black text-slate-800 text-sm border-b border-slate-100 pb-2">EMI Estimator</h3>
            
            <div className="mt-5 space-y-6">
              {/* Requested Amount Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Requested Loan Capital:</span>
                  <span className="text-blue-700 font-extrabold font-mono text-sm">${requestedAmount.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min={10000} 
                  max={250000} 
                  step={5000}
                  value={requestedAmount}
                  onChange={(e) => setRequestedAmount(Number(e.target.value))}
                  className="w-full accent-blue-700 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>$10,000</span>
                  <span>$250,000</span>
                </div>
              </div>

              {/* Months Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Repayment Tenure:</span>
                  <span className="text-blue-700 font-extrabold font-mono text-sm">{repaymentMonths} Months</span>
                </div>
                <input 
                  type="range" 
                  min={6} 
                  max={36} 
                  step={6}
                  value={repaymentMonths}
                  onChange={(e) => setRepaymentMonths(Number(e.target.value))}
                  className="w-full accent-blue-700 cursor-pointer h-1.5 bg-slate-100 rounded-lg appearance-none"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>6 Months</span>
                  <span>36 Months</span>
                </div>
              </div>
            </div>

            {/* Calculations outputs */}
            <div className="mt-8 bg-slate-50 border border-slate-200/80 p-4 rounded-xl space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 font-semibold">Estimated Monthly EMI:</span>
                <span className="font-extrabold text-blue-700 text-base font-mono">${emi.toLocaleString()} / mo</span>
              </div>
              <div className="flex justify-between text-xs border-t border-slate-200/60 pt-2 text-[11px]">
                <span className="text-slate-400">Computed Base Interest:</span>
                <span className="text-slate-700 font-bold">9.5% Fixed APR</span>
              </div>
              <div className="flex justify-between text-xs text-[11px]">
                <span className="text-slate-400">Total Contract Value:</span>
                <span className="text-slate-700 font-bold">${(emi * repaymentMonths).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-black text-xs rounded-xl shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-1.5">
              <span>Initiate Estimator Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-2">
              EMI estimates do not constitute official bank contract templates.
            </p>
          </div>
        </div>

      </div>

      {/* Partner Banks Acceptance */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5">
        <h4 className="font-black text-slate-800 text-sm border-b border-slate-200 pb-2 mb-3">Partner Banking Catalogs</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center text-xs text-slate-600 font-bold">
          <div className="p-3 bg-white border border-slate-200 rounded-xl flex flex-col justify-center items-center gap-1">
            <span className="w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-black flex items-center justify-center text-[10px]">FB</span>
            <span>Federal Bank</span>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-xl flex flex-col justify-center items-center gap-1">
            <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 font-black flex items-center justify-center text-[10px]">HD</span>
            <span>HDFC Bank Limited</span>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-xl flex flex-col justify-center items-center gap-1">
            <span className="w-8 h-8 rounded-full bg-sky-50 text-sky-700 font-black flex items-center justify-center text-[10px]">IC</span>
            <span>ICICI Underwriting</span>
          </div>
          <div className="p-3 bg-white border border-slate-200 rounded-xl flex flex-col justify-center items-center gap-1">
            <span className="w-8 h-8 rounded-full bg-teal-50 text-teal-700 font-black flex items-center justify-center text-[10px]">SB</span>
            <span>State Bank alternative</span>
          </div>
        </div>
      </div>

      {/* Application Flow Dialog */}
      <AnimatePresence>
        {applyModalProduct && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative"
            >
              {/* Close */}
              <button 
                onClick={() => setApplyModalProduct(null)}
                className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>

              {appStep === "IDLE" && (
                <div className="space-y-4">
                  <div className="flex gap-3 items-center">
                    <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg">
                      <Percent className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900">Configure Disbursement</h3>
                      <p className="text-xs text-slate-400">Disburse capital instantly without physical audits</p>
                    </div>
                  </div>

                  <div className="space-y-3.5 pt-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Disbursement Destination Bank</label>
                      <select 
                        value={disbursementBank}
                        onChange={(e) => setDisbursementBank(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden"
                      >
                        <option value="HDFC Bank **** 9081">HDFC Checking account (***9081)</option>
                        <option value="Federal Savings **** 1022">Federal Bank Savings (***1022)</option>
                        <option value="ICICI Overdraft **** 4492">ICICI Overdraft Ledger (***4492)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Disbursement Amount</label>
                      <input 
                        type="text" 
                        disabled
                        value={`$${applyModalProduct.maxAmount.toLocaleString()}`}
                        className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-700"
                      />
                    </div>

                    {/* Disclaimer */}
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-[11px] text-blue-900 leading-relaxed flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                      <span>
                        Underwriting models check your linked APIs (GST & Bank) dynamically during approval. Keep feeds active.
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2.5 pt-5">
                    <button 
                      onClick={() => setApplyModalProduct(null)}
                      className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 text-slate-700"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleApplySubmit}
                      className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-black text-xs rounded-xl shadow-md shadow-blue-200"
                    >
                      Process Capital Application
                    </button>
                  </div>
                </div>
              )}

              {appStep === "ANALYZING" && (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                  <RefreshCw className="w-12 h-12 text-blue-700 animate-spin" />
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Underwriting Score Assessment</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm">
                      Executing central AI ledger query. Validating linked bank balance history and tax filing integrity vectors...
                    </p>
                  </div>
                </div>
              )}

              {appStep === "CONTRACT_SIGN" && (
                <div className="space-y-4">
                  <div className="flex gap-3 items-center">
                    <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900">Approved! Sign Contract</h3>
                      <p className="text-xs text-slate-400">Approved rate: {applyModalProduct.rate}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl max-h-[160px] overflow-y-auto text-[11px] text-slate-600 leading-relaxed space-y-2">
                    <p className="font-extrabold text-slate-800">PARTIES & LOAN TERMS</p>
                    <p>Borrower: APEX METAL CRAFTS PVT LTD</p>
                    <p>Lender: MSME360 Underwriting Syndicates Partner</p>
                    <p>Principal: ${applyModalProduct.maxAmount.toLocaleString()}</p>
                    <p>Repayment Period: {applyModalProduct.period}</p>
                    <p>The borrower agrees to keep connected API streams authenticated for the entire loan duration. Revocation of active feeds during amortization triggers immediate default audit schedules.</p>
                  </div>

                  <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => setApplyModalProduct(null)}
                      className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 text-slate-700"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={confirmSignContract}
                      className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-black text-xs rounded-xl shadow-md shadow-blue-200"
                    >
                      Sign & Disburse Capital
                    </button>
                  </div>
                </div>
              )}

              {appStep === "SUCCESS" && (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">Capital Disbursed!</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm">
                      Congratulations! Your capital transfer of <strong>${applyModalProduct.maxAmount.toLocaleString()}</strong> has been initiated and will arrive in <strong>{disbursementBank}</strong> within minutes.
                    </p>
                  </div>
                  <button 
                    onClick={() => setApplyModalProduct(null)}
                    className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-all"
                  >
                    Close Dashboard
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
