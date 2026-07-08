import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Layouts
import { AuthLayout } from "./layouts/AuthLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";

// Pages
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { BusinessProfile } from "./pages/BusinessProfile";
import { AlternateDataSources } from "./pages/AlternateDataSources";
import { MSMEHealthCard } from "./pages/MSMEHealthCard";
import { LoanEligibility } from "./pages/LoanEligibility";
import { GovernmentSchemes } from "./pages/GovernmentSchemes";
import { AIAdvisor } from "./pages/AIAdvisor";
import { Settings } from "./pages/Settings";
import { ExplainableAI } from "./pages/ExplainableAI";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { Unauthorized } from "./pages/Unauthorized";
import { NotFound } from "./pages/NotFound";
import { DemoPresentation } from "./pages/DemoPresentation";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          
          {/* Public Landing Page */}
          <Route path="/" element={<Landing />} />
          
          {/* Public Executive Demo & Pitch Presentation */}
          <Route path="/demo" element={<DemoPresentation />} />
          
          {/* Public Gateway Shell: AuthLayout */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* Secure Workspace Portals: ProtectedRoute + DashboardLayout */}
          <Route element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/msme-directory" element={<PlaceholderPage />} />
            <Route path="/health-cards" element={<PlaceholderPage />} />
            <Route path="/data-feeds" element={<PlaceholderPage />} />
            <Route path="/risk-assessment" element={<ExplainableAI />} />
            <Route path="/audit-logs" element={<PlaceholderPage />} />
            
            {/* MSME Owner Specific Pages */}
            <Route path="/profile" element={<BusinessProfile />} />
            <Route path="/data-sources" element={<AlternateDataSources />} />
            <Route path="/health-card" element={<MSMEHealthCard />} />
            <Route path="/loan-eligibility" element={<LoanEligibility />} />
            <Route path="/schemes" element={<GovernmentSchemes />} />
            <Route path="/ai-advisor" element={<AIAdvisor />} />
            
            {/* Common Pages */}
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Special Fallbacks and Security Gates */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
