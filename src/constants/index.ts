export const APP_NAME = "IDBI Bank MSME360";
export const APP_DESCRIPTION = "IDBI Bank Digital Lending - Enterprise AI Credit Health & Alternative Score Underwriting Platform";

export const SCORE_TIERS = {
  EXCELLENT: { min: 750, max: 900, rating: "LOW" as const, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  GOOD: { min: 650, max: 749, rating: "MEDIUM" as const, color: "text-blue-600 bg-blue-50 border-blue-200" },
  FAIR: { min: 550, max: 649, rating: "HIGH" as const, color: "text-amber-600 bg-amber-50 border-amber-200" },
  POOR: { min: 300, max: 549, rating: "CRITICAL" as const, color: "text-rose-600 bg-rose-50 border-rose-200" },
};

export const RISK_RATING_STYLES = {
  LOW: { text: "text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100", label: "Low Risk" },
  MEDIUM: { text: "text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100", label: "Medium Risk" },
  HIGH: { text: "text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100", label: "High Risk" },
  CRITICAL: { text: "text-rose-700 bg-rose-50 border-rose-200 hover:bg-rose-100", label: "Critical Risk" },
};

export const STATUS_STYLES = {
  PENDING: "text-slate-600 bg-slate-50 border-slate-200",
  GENERATED: "text-indigo-600 bg-indigo-50 border-indigo-200",
  UNDER_REVIEW: "text-cyan-600 bg-cyan-50 border-cyan-200",
  APPROVED: "text-emerald-600 bg-emerald-50 border-emerald-200",
  REJECTED: "text-rose-600 bg-rose-50 border-rose-200",
};

export const INDUSTRY_TYPES = [
  "Manufacturing",
  "Retail Trade",
  "Wholesale Trade",
  "Professional Services",
  "Logistics & Transportation",
  "Healthcare Services",
  "Food & Hospitality",
  "Construction & Real Estate",
  "Information Technology",
  "Agriculture & Allied Activities",
];

export const ALTERNATE_DATA_SOURCES = [
  { id: "GSTN", name: "GST filing & Returns (GSTR-1, GSTR-3B)", category: "Tax Compliance", scoreWeight: "30%" },
  { id: "BANK", name: "Bank Statements Analyzer (e-Stamping & Cashflow)", category: "Cashflow Analysis", scoreWeight: "35%" },
  { id: "UTILITY", name: "Electricity & Telecom Utility Payments", category: "Operational Reliability", scoreWeight: "15%" },
  { id: "TRADE", name: "Trade Creditors & Supplier Ledgers", category: "Commercial Discipline", scoreWeight: "20%" },
];

export const STATES_LIST = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal", "Delhi"
];
