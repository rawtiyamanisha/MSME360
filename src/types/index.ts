export interface DataSourceStatus {
  status: "Connected" | "Pending" | "Disconnected";
  lastSync: string;
  dataConfidence: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: "credit_officer" | "msme_owner" | "administrator";
  company: string;
  phoneNumber?: string;
  createdAt: string;
  lastLoginAt?: string;
  alternateDataSources?: Record<string, DataSourceStatus>;
}

export type RiskRating = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type AssessmentStatus = "PENDING" | "GENERATED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";

export interface ScoreBreakdown {
  gstReliability: number;        // GST filing accuracy & consistency
  bankStatementHealth: number;   // Cashflow adequacy & transactional health
  utilityReliability: number;    // Prompt utility & telecom payment history
  tradeCreditReliability: number;// Trade creditor payout schedules
}

export interface FinancialHealthCard {
  id: string;
  msmeId: string;
  msmeName: string;
  overallScore: number;          // 300 to 900 custom scale
  riskRating: RiskRating;
  assessmentDate: string;
  status: AssessmentStatus;
  scores: ScoreBreakdown;
  alternateDataConnected: string[]; // e.g. ["GSTN", "Bank Statement Utility", "Telecom", "E-commerce"]
  assessedBy?: string;            // Bank officer UID
  comments?: string;
}

export interface MSMEProfile {
  id: string;
  businessName: string;
  registrationNumber: string;    // GSTIN/Udyam/PAN
  industryType: string;          // Manufacturing, Services, Retail, etc.
  dateOfIncorporation: string;
  ownerName: string;
  email: string;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  action: string;
  description: string;
  category: "AUTH" | "DATA_CONNECTION" | "ASSESSMENT" | "SYSTEM";
  ipAddress?: string;
}

export interface MSMEApplication {
  id: string;
  businessName: string;
  registrationNumber: string; // GSTIN/Udyam/PAN
  industryType: string;
  state: string;
  connectedSources: string[]; // e.g., ["GSTN", "BANK", "TRADE", "UTILITY"]
  score: number; // 300 to 900 scale
  riskRating: RiskRating;
  status: AssessmentStatus;
  dateOfIncorporation: string;
  ownerName: string;
  email: string;
  phoneNumber: string;
  loanRequested: number;
  scores: ScoreBreakdown;
  strengths: string[];
  weaknesses: string[];
  businessInsights: string;
  comments?: string;
  updatedAt: string;
}

