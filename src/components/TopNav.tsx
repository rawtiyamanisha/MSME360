import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { 
  Bell, 
  Search, 
  User, 
  LogOut, 
  Settings, 
  Building, 
  ChevronDown, 
  Clock, 
  Menu,
  X,
  CreditCard,
  ShieldAlert
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface TopNavProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    // Elegant clock initialization matching the system local time format
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  // Static mock notifications for layout purposes
  const notifications = [
    { id: 1, title: "New Assessment Pending", desc: "MSME Profile 'Aura Crafts' connected GSTN data.", time: "5 mins ago", unread: true },
    { id: 2, title: "Score Risk Alert", desc: "MSME Profile 'Nexa Logistics' utility bill paid late.", time: "1 hour ago", unread: true },
    { id: 3, title: "Database Sync Complete", desc: "Alternate data feeds updated with central registers.", time: "Yesterday", unread: false },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:px-6 shadow-xs">
      
      {/* Left side: Logo & Toggle */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button 
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:text-blue-900 hover:bg-slate-50 transition-colors"
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        )}
        
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-teal-600 rounded-lg flex flex-col items-center justify-center text-white font-extrabold shadow-md relative text-[10px] leading-none">
            <span>IDBI</span>
            <span className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-teal-800">
            MSME<span className="text-orange-500">360</span>
          </span>
        </Link>
      </div>

      {/* Center: Search (Desktop Only) */}
      <div className="hidden lg:flex items-center w-full max-w-md bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-100 transition-all">
        <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
        <input 
          type="text" 
          placeholder="Search by MSME profile, GSTIN, PAN or ID..." 
          className="bg-transparent text-sm text-slate-700 w-full focus:outline-hidden"
        />
      </div>

      {/* Right side: Actions, Time, Profile */}
      <div className="flex items-center gap-4">
        
        {/* Clock */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-200/60 rounded-full px-3 py-1.5">
          <Clock className="w-3.5 h-3.5 text-teal-600" />
          <span className="font-mono tracking-wide">{time}</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-600 rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-80 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                <span className="font-bold text-sm text-slate-800">Operational Logs</span>
                <span className="text-xs text-blue-600 hover:underline cursor-pointer">Clear All</span>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 ${notif.unread ? "bg-blue-50/20" : ""}`}>
                    <div className="flex justify-between items-start gap-2">
                      <span className={`font-semibold text-xs ${notif.unread ? "text-blue-900" : "text-slate-700"}`}>
                        {notif.title}
                      </span>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{notif.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{notif.desc}</p>
                  </div>
                ))}
              </div>
              <div className="text-center py-2 border-t border-slate-100">
                <span className="text-xs text-blue-600 hover:underline cursor-pointer font-medium">View System Console</span>
              </div>
            </div>
          )}
        </div>

        {/* User Context & Info */}
        <div className="hidden md:flex flex-col items-end border-l border-slate-200 pl-4 h-9 justify-center">
          <span className="text-sm font-semibold text-slate-800 leading-none">
            {profile?.name || user?.displayName || "System Officer"}
          </span>
          <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1 mt-1">
            <Building className="w-3 h-3 text-teal-600" />
            {profile?.company || "IDBI Central Office"}
          </span>
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-1.5 focus:outline-hidden group"
          >
            <div className="w-9 h-9 rounded-full bg-teal-50 border-2 border-teal-600 text-teal-900 font-bold flex items-center justify-center text-sm shadow-inner cursor-pointer hover:bg-teal-100 transition-colors">
              {(profile?.name || user?.displayName || "SO").substring(0, 2).toUpperCase()}
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2.5 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs text-slate-400">Signed in as</p>
                <p className="text-sm font-bold text-slate-800 truncate">{user?.email}</p>
                <p className="inline-block mt-1 text-[10px] font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-full px-2 py-0.5 capitalize">
                  {profile?.role?.replace("_", " ") || "Officer"}
                </p>
              </div>

              <Link 
                to="/profile" 
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>Account Profile</span>
              </Link>

              <Link 
                to="/settings" 
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Security Settings</span>
              </Link>

              <div className="border-t border-slate-100 my-1"></div>

              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
