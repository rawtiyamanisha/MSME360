import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("credit_officer" | "msme_owner" | "administrator")[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 flex-col gap-4">
        {/* Modern Enterprise Loading Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100"></div>
          <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
        </div>
        <div className="text-center">
          <h3 className="font-semibold text-slate-800 text-lg">MSME360 Secure Gateway</h3>
          <p className="text-sm text-slate-500 mt-1">Verifying credentials and security tokens...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the location they were trying to access to redirect back later
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check roles if specified
  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    // If not authorized for this view, redirect to dashboard root or show permission denied
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
