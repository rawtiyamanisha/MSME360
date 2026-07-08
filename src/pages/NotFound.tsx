import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 text-center">
      <div className="w-20 h-20 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl flex items-center justify-center shadow-md shadow-rose-100 mb-6 animate-bounce">
        <ShieldAlert className="w-10 h-10" />
      </div>

      <span className="text-xs font-bold text-rose-700 uppercase tracking-widest bg-rose-50 border border-rose-100 px-3.5 py-1 rounded-full">
        Exception: 404 Not Found
      </span>

      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-4">
        Resource Out of Scope
      </h1>
      
      <p className="text-slate-500 text-sm max-w-sm mt-2 leading-relaxed">
        The requested secure node or gateway path does not exist, or you lack the direct routing context.
      </p>

      <div className="flex items-center gap-3 mt-8">
        <Link 
          to="/" 
          className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl transition-colors shadow-xs"
        >
          <Home className="w-4 h-4" />
          <span>Home Shell</span>
        </Link>
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
