import React from "react";
import { APP_NAME } from "../constants";
import { ShieldCheck, Cpu } from "lucide-react";

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-200 py-4 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-blue-900">{APP_NAME}</span>
          <span>© {currentYear} MSME360 Technologies. All rights reserved.</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Bank-Grade 256-Bit SSL</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600">
            <Cpu className="w-4 h-4 text-blue-600 animate-pulse" />
            <span>AI Risk Model v2.4.1</span>
          </div>
          <a href="#help" className="hover:text-blue-700 hover:underline">Support Helpdesk</a>
          <a href="#privacy" className="hover:text-blue-700 hover:underline">Privacy Policy</a>
          <a href="#terms" className="hover:text-blue-700 hover:underline">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};
