import React from "react";
import { Outlet, Navigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { CreditCard, ShieldCheck, Database, Award, ArrowUpRight } from "lucide-react";
import { APP_NAME } from "../constants";

export const AuthLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // If already authenticated, bypass login and redirect to main application console
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-stretch font-sans">
      
      {/* Split Left Panel: Enterprise Branding & Statistics (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-teal-950 p-12 text-white flex-col justify-between relative overflow-hidden border-r border-teal-900/40">
        
        {/* Ambient Tech Grid Background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-600 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600 rounded-full filter blur-3xl opacity-20"></div>

        {/* Header Branding */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-11 h-11 bg-teal-600 rounded-xl flex flex-col items-center justify-center text-white font-black shadow-lg shadow-teal-950/40 relative text-xs leading-none">
            <span>IDBI</span>
            <span className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
          </div>
          <div>
            <span className="font-extrabold text-2xl tracking-tight">IDBI Bank <span className="text-teal-400">MSME360</span></span>
            <span className="block text-[10px] text-teal-300 font-bold uppercase tracking-widest mt-0.5">Credit Assessment Platform</span>
          </div>
        </div>

        {/* Marketing/Product Content */}
        <div className="my-auto max-w-md relative z-10 space-y-8">
          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-400 bg-teal-900/40 border border-teal-800 rounded-full px-3.5 py-1">
              Alternative Risk Engine
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-white">
              Smarter Credit for New-To-Bank MSMEs
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Enable instant credit eligibility scoring. Gather multi-dimensional compliance, cashflow, and transaction health signals to assess risk accurately without tax declarations.
            </p>
          </div>

          {/* Key Value Highlights */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-teal-900/30 border border-teal-800 text-teal-400">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white">Multi-Source Alternate Data</h4>
                <p className="text-xs text-slate-400">Direct integration with GSTN, Banking aggregators, utilities, and commercial ledgers.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-teal-900/30 border border-teal-800 text-teal-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white">Non-Repudiation Audit Logs</h4>
                <p className="text-xs text-slate-400">System records are logged with tamper-evident digital footprints.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-teal-900/30 border border-teal-800 text-teal-400">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white">Frictionless Loan Onboarding</h4>
                <p className="text-xs text-slate-400">Underwrite high-performing MSMEs within hours instead of weeks.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-900 pt-6 relative z-10">
          <span>Enterprise Banking Suite</span>
          <a href="#" className="hover:text-white flex items-center gap-1 transition-colors">
            Read underwriting model documentation <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>

      {/* Right Panel: Content Form View (Full width on mobile, half on desktop) */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 lg:p-20 relative bg-slate-50">
        
        {/* Tiny responsive logo for mobile layout */}
        <div className="lg:hidden absolute top-8 left-8 flex items-center gap-2">
          <div className="w-9 h-9 bg-teal-600 rounded-lg flex flex-col items-center justify-center text-white font-extrabold shadow-sm relative text-[10px] leading-none shrink-0">
            <span>IDBI</span>
            <span className="absolute bottom-0.5 right-0.5 w-1 h-1 bg-orange-500 rounded-full"></span>
          </div>
          <span className="font-bold text-lg text-slate-900">{APP_NAME}</span>
        </div>

        {/* Subroute Outlet container */}
        <div className="w-full max-w-md bg-white border border-slate-200 shadow-xl rounded-2xl p-8 transition-all hover:shadow-2xl hover:border-slate-300/80">
          <Outlet />
        </div>

        {/* Bottom Terms helper */}
        <div className="text-center mt-8 text-[11px] text-slate-400 max-w-sm">
          Protected by MSME360 Enterprise-Grade Cyber Security. Access attempts are subject to routine multi-factor validation and IP screening.
        </div>

      </div>
    </div>
  );
};
