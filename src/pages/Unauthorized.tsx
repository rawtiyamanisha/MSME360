import React from "react";
import { Link } from "react-router-dom";
import { Lock, ArrowLeft } from "lucide-react";

export const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 text-center">
      <div className="w-20 h-20 bg-amber-50 border border-amber-200 text-amber-600 rounded-2xl flex items-center justify-center shadow-md shadow-amber-100 mb-6">
        <Lock className="w-10 h-10" />
      </div>

      <span className="text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-50 border border-amber-100 px-3.5 py-1 rounded-full">
        Access Denied
      </span>

      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-4">
        Insufficient Permissions
      </h1>
      
      <p className="text-slate-500 text-sm max-w-sm mt-2 leading-relaxed">
        Your current credentials role level does not authorize access to this specific ledger or underwriting sandbox.
      </p>

      <div className="flex items-center gap-3 mt-8">
        <Link 
          to="/dashboard" 
          className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-blue-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Console</span>
        </Link>
      </div>
    </div>
  );
};
