import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { 
  Award, 
  Search, 
  Filter, 
  CheckCircle2, 
  HelpCircle, 
  ArrowUpRight, 
  Info, 
  Plus, 
  Sparkles,
  Download,
  Building,
  Check,
  ChevronRight,
  ShieldCheck,
  FileCheck2,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Scheme {
  id: string;
  name: string;
  category: "Subsidy" | "Guarantee" | "Subvention";
  provider: string;
  maxBenefit: string;
  eligibilityScore: number;
  unlockedWith: string[];
  missingFeeds: string[];
  description: string;
}

export const GovernmentSchemes: React.FC = () => {
  const { profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"ALL" | "Subsidy" | "Guarantee" | "Subvention">("ALL");
  const [activeCertificateScheme, setActiveCertificateScheme] = useState<Scheme | null>(null);
  const [isGeneratingCert, setIsGeneratingCert] = useState(false);

  const schemes: Scheme[] = [
    {
      id: "cgtmse",
      name: "Credit Guarantee Trust for Micro & Small Enterprises (CGTMSE)",
      category: "Guarantee",
      provider: "Ministry of MSME, Govt of India",
      maxBenefit: "Collateral-free credit guarantee up to $300,000",
      eligibilityScore: 92,
      unlockedWith: ["Primary Bank Statement Feed", "GSTN Tax Filing API"],
      missingFeeds: [],
      description: "Direct credit guarantees provided to lender banks supporting micro and small enterprises. Unsecured underwriting is fully activated via our platform index.",
    },
    {
      id: "clcss",
      name: "Credit Linked Capital Subsidy Scheme (CLCSS)",
      category: "Subsidy",
      provider: "SIDBI & Ministry of MSME",
      maxBenefit: "15% Capital subsidy on machinery purchases up to $20,000",
      eligibilityScore: 84,
      unlockedWith: ["Primary Bank Statement Feed"],
      missingFeeds: ["Accounting Ledger (Tally/QB)"],
      description: "Technology upgradation program providing upfront capital subsidies for modern machinery induction. Boosts factory output metrics.",
    },
    {
      id: "interest_subvention",
      name: "Interest Subvention Scheme for MSME Borrowers",
      category: "Subvention",
      provider: "Reserve Bank alternative incentives",
      maxBenefit: "2% Interest subvention on active working capital credits",
      eligibilityScore: 96,
      unlockedWith: ["Primary Bank Statement Feed", "GSTN Tax Filing API"],
      missingFeeds: [],
      description: "Incentive scheme providing direct interest discounts for MSMEs demonstrating high tax filing compliance and stable digital cash balances.",
    },
    {
      id: "udyam_registration",
      name: "Udyam Assist Portal Certificate Scheme",
      category: "Subsidy",
      provider: "Ministry of MSME Digital Portal",
      maxBenefit: "Priority Sector Lending (PSL) eligibility and tax rebates",
      eligibilityScore: 68,
      unlockedWith: ["GSTN Tax Filing API"],
      missingFeeds: ["Accounting Ledger (Tally/QB", "Utility Bill Analyzer"],
      description: "Formalizes unregistered micro-businesses. Syncing utility payment records speeds up automatic regional certificate allocation.",
    }
  ];

  // Filtering Logic
  const filteredSchemes = schemes.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.provider.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "ALL" || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const generateCertificate = (scheme: Scheme) => {
    setIsGeneratingCert(true);
    setActiveCertificateScheme(scheme);
    
    setTimeout(() => {
      setIsGeneratingCert(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-bold text-blue-700 tracking-wider uppercase bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            State Incentives
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-2.5">
            Government Schemes
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse state-sponsored financial subsidies, interest subventions, and collateral guarantees calculated instantly using your connected ledger.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-extrabold text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Compliant with Udyam & SIDBI guidelines</span>
        </div>
      </div>

      {/* Directory Filters & Search bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          
          {/* Search */}
          <div className="flex items-center flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input 
              type="text" 
              placeholder="Search scheme name, provider, or state ministry incentives..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-xs text-slate-700 w-full focus:outline-hidden"
            />
          </div>

          {/* Filter Categories */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-semibold gap-1 shrink-0">
            {(["ALL", "Subsidy", "Guarantee", "Subvention"] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedCategory === cat 
                    ? "bg-white text-blue-700 font-extrabold shadow-sm" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {cat === "ALL" ? "All Schemes" : cat}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredSchemes.map((scheme) => (
          <div 
            key={scheme.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-blue-400 transition-all shadow-xs"
          >
            <div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-100 rounded-md px-2 py-0.5 uppercase tracking-wide">
                  {scheme.category}
                </span>

                {/* Eligibility Meter */}
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-semibold block">Eligibility Match:</span>
                  <span className={`text-sm font-black font-mono ${
                    scheme.eligibilityScore >= 90 ? "text-emerald-600" : scheme.eligibilityScore >= 75 ? "text-blue-600" : "text-amber-600"
                  }`}>
                    {scheme.eligibilityScore}%
                  </span>
                </div>
              </div>

              <h3 className="font-extrabold text-slate-900 text-sm mt-3 leading-tight">{scheme.name}</h3>
              <p className="text-[10px] text-slate-400 font-bold mt-0.5">{scheme.provider}</p>

              <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
                {scheme.description}
              </p>

              {/* Benefit Box */}
              <div className="mt-4 p-3 bg-slate-50 border border-slate-200/60 rounded-xl">
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block">Incentive Limit Benefit</span>
                <p className="text-xs font-bold text-slate-800 mt-1 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>{scheme.maxBenefit}</span>
                </p>
              </div>

              {/* Feed Status Sync lists */}
              <div className="mt-4 space-y-2">
                {scheme.unlockedWith.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[9px] text-emerald-600 font-bold uppercase shrink-0">Verified Feeds:</span>
                    {scheme.unlockedWith.map(f => (
                      <span key={f} className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 font-semibold px-2 py-0.5 rounded-md truncate max-w-[150px]">
                        {f.split(" ")[0]} Synced
                      </span>
                    ))}
                  </div>
                )}

                {scheme.missingFeeds.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[9px] text-amber-600 font-bold uppercase shrink-0">Boost with:</span>
                    {scheme.missingFeeds.map(f => (
                      <span key={f} className="text-[9px] bg-amber-50 text-amber-700 border border-amber-100 font-semibold px-2 py-0.5 rounded-md truncate max-w-[150px]">
                        Link {f.split(" ")[0]}
                      </span>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Action buttons */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 hover:underline cursor-pointer flex items-center gap-0.5">
                SIDBI guidelines <ChevronRight className="w-3 h-3" />
              </span>
              
              <button 
                onClick={() => generateCertificate(scheme)}
                className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-1"
              >
                <span>Evaluate Eligibility Cert</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Certificate modal */}
      <AnimatePresence>
        {activeCertificateScheme && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative"
            >
              <button 
                onClick={() => setActiveCertificateScheme(null)}
                className="absolute top-4 right-4 p-1 rounded-lg hover:bg-slate-50 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>

              {isGeneratingCert ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-10 h-10 border-4 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">Compiling Cryptographic Ledger Signatures</h4>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                      Matching live corporate GST logs and checking transaction averages with SIDBI guidelines...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex gap-3 items-center">
                    <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg">
                      <FileCheck2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900">Eligibility Certificate</h3>
                      <p className="text-xs text-slate-400 font-mono">ID: CERT-{activeCertificateScheme.id.toUpperCase()}-MH</p>
                    </div>
                  </div>

                  {/* Visual certificate mockup */}
                  <div className="border border-slate-200 rounded-xl bg-slate-50 p-5 space-y-3 relative overflow-hidden">
                    {/* Security background patterns */}
                    <div className="absolute inset-0 opacity-5 border-4 border-double border-slate-400 m-2 pointer-events-none"></div>
                    <div className="text-center pb-2 border-b border-slate-200/80">
                      <span className="text-[9px] font-black tracking-widest text-blue-900 uppercase block">Ministry of Micro, Small & Medium Enterprises</span>
                      <span className="text-[8px] text-slate-400 uppercase tracking-widest mt-0.5 block">Government of India Assist Scheme</span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-600 leading-normal text-center pt-2">
                      <p>This certifies that</p>
                      <p className="font-extrabold text-slate-900 text-sm">APEX METAL CRAFTS PVT LTD</p>
                      <p>holds verified transactional alternate credit rating index of</p>
                      <p className="font-black text-blue-700 font-mono text-base">742 Points (Grade A - Low Risk)</p>
                      <p className="text-[10px] text-slate-400 leading-relaxed pt-2 max-w-xs mx-auto">
                        This digital eligibility certificate qualifies the entity for priority sector lending under active CGTMSE collateral guarantees.
                      </p>
                    </div>

                    <div className="flex justify-between items-end pt-4 border-t border-slate-200/80 text-[9px] text-slate-400 font-mono">
                      <div>
                        <p>ISSUED: 07/08/2026</p>
                        <p>EXPIRES: 10/08/2026</p>
                      </div>
                      <div className="text-right">
                        <p>SIGNATURE: VERIFIED</p>
                        <p>SHA-256 SECURED</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => setActiveCertificateScheme(null)}
                      className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 text-slate-700"
                    >
                      Close Preview
                    </button>
                    <button 
                      onClick={() => {
                        alert("Certificate downloaded as PDF (Simulated)");
                        setActiveCertificateScheme(null);
                      }}
                      className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white font-black text-xs rounded-xl shadow-md shadow-blue-200 transition-all flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
