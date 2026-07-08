import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { 
  BarChart3, 
  Users, 
  FileText, 
  Database, 
  ShieldCheck, 
  History, 
  Settings, 
  LayoutDashboard,
  LogOut,
  Building2,
  FileCheck2,
  Award,
  Sparkles,
  Percent,
  Briefcase
} from "lucide-react";
import { cn } from "../utils/cn";

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { profile, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Dynamic Navigation Items based on Enterprise Roles
  const isCreditOfficer = profile?.role === "credit_officer" || profile?.role === "administrator";

  const navItems = isCreditOfficer ? [
    {
      title: "Main Console",
      items: [
        { label: "Executive Dashboard", to: "/dashboard", icon: LayoutDashboard },
        { label: "MSME Directory", to: "/msme-directory", icon: Users, description: "NTC/NTB portfolios" },
        { label: "Financial Health Cards", to: "/health-cards", icon: FileText, description: "Alternative risk scores" },
      ]
    },
    {
      title: "Alternative Integrations",
      items: [
        { label: "Alternate Data Feeds", to: "/data-feeds", icon: Database, description: "GSTN, Telecom, Bank APIs" },
        { label: "Risk Assessments", to: "/risk-assessment", icon: ShieldCheck, description: "Score calculations" },
      ]
    },
    {
      title: "System Parameters",
      items: [
        { label: "System Security Audit", to: "/audit-logs", icon: History, description: "Tamper-proof logs" },
        { label: "Settings & Config", to: "/settings", icon: Settings, description: "API limits, threshold parameters" },
      ]
    }
  ] : [
    {
      title: "MSME Portal",
      items: [
        { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard, description: "Health & Loan console" },
        { label: "Business Profile", to: "/profile", icon: Briefcase, description: "Enterprise compliance details" },
        { label: "Alternate Data Sources", to: "/data-sources", icon: Database, description: "Authorize & sync feeds" },
        { label: "Financial Health Card", to: "/health-card", icon: FileText, description: "Interactive rating report" },
      ]
    },
    {
      title: "Credit Solutions",
      items: [
        { label: "Loan Eligibility", to: "/loan-eligibility", icon: Percent, description: "Pre-approved credit limits" },
        { label: "Government Schemes", to: "/schemes", icon: Award, description: "Eligible subsidy programs" },
      ]
    },
    {
      title: "Enterprise Advisor",
      items: [
        { label: "AI Advisor", to: "/ai-advisor", icon: Sparkles, description: "Autonomous cashflow advice" },
        { label: "Settings", to: "/settings", icon: Settings, description: "User & channel settings" },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 z-40 md:hidden backdrop-blur-xs transition-opacity duration-300"
        ></div>
      )}

      {/* Sidebar Container */}
      <aside className={cn(
        "fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-950 text-slate-300 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out md:transform-none h-full",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        
        {/* Header/Brand Section */}
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-900/40 gap-3">
          <div className="w-9 h-9 rounded-lg bg-teal-600 flex flex-col items-center justify-center text-white font-extrabold shadow-sm text-[10px] relative shrink-0 leading-none">
            <span>IDBI</span>
            <span className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
          </div>
          <div>
            <span className="font-extrabold text-sm text-white tracking-tight">IDBI Bank</span>
            <p className="text-[9px] text-teal-400 font-bold tracking-wider uppercase leading-none mt-0.5">MSME360 Portal</p>
          </div>
        </div>

        {/* Navigation Body */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-7 scrollbar-thin scrollbar-thumb-slate-800">
          {navItems.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-2">
              <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3">
                {group.title}
              </h4>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const IconComp = item.icon;
                  return (
                    <li key={item.label}>
                      <NavLink
                        to={item.to}
                        onClick={onClose}
                        className={({ isActive }) => cn(
                          "group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 border-l-2",
                          isActive 
                            ? "bg-teal-600/10 text-teal-400 border-teal-500 font-semibold" 
                            : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/60"
                        )}
                      >
                        <IconComp className="w-4.5 h-4.5 shrink-0 transition-colors" />
                        <div className="flex flex-col">
                          <span>{item.label}</span>
                          <span className="text-[10px] text-slate-500 font-normal leading-tight group-hover:text-slate-400 hidden lg:block">
                            {item.description}
                          </span>
                        </div>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer Account Section */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/20">
          <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800/80 rounded-xl p-3">
            <div className="w-9 h-9 rounded-full bg-teal-600/20 border border-teal-500/30 text-teal-400 font-bold flex items-center justify-center text-sm shadow-inner shrink-0">
              {profile?.name?.substring(0, 2).toUpperCase() || "OP"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate leading-none">
                {profile?.name || "System Operator"}
              </p>
              <p className="text-[10px] text-slate-400 truncate mt-1 flex items-center gap-1">
                <Award className="w-3 h-3 text-emerald-400 shrink-0" />
                <span className="capitalize">{profile?.role?.replace("_", " ") || "Officer"}</span>
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 mt-3 px-3 py-2 border border-slate-800/80 hover:border-rose-900/40 hover:bg-rose-950/10 hover:text-rose-400 rounded-lg text-xs font-semibold text-slate-400 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Terminate Session</span>
          </button>
        </div>

      </aside>
    </>
  );
};
