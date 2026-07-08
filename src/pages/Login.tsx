import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ShieldCheck, Mail, Lock, AlertCircle, ArrowRight, Loader2, User, KeyRound, CheckCircle2 } from "lucide-react";

// Form Schema Validation using Zod
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid corporate email address" }),
  password: z.string().min(6, { message: "Security passwords must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { login, logout } = useAuth();
  const context = useAuth(); // contains resetPassword from our context
  const resetPassword = (context as any).resetPassword; // Safely obtain resetPassword
  
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Remember Me state
  const [rememberMe, setRememberMe] = useState(false);
  
  // Forgot Password state
  const [isResetMode, setIsResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetLoading, setResetLoading] = useState(false);

  // Determine post-login redirect path
  const from = (location.state as any)?.from?.pathname || "/dashboard";

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  // Remember Me: Load saved email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("remembered_email");
    if (savedEmail) {
      setValue("email", savedEmail);
      setRememberMe(true);
    }
  }, [setValue]);

  const onSubmit = async (data: LoginFormValues) => {
    setErrorMessage(null);
    try {
      await login(data.email, data.password);
      
      // Handle Remember Me preservation
      if (rememberMe) {
        localStorage.setItem("remembered_email", data.email);
      } else {
        localStorage.removeItem("remembered_email");
      }
      
      setSuccess(true);
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
    } catch (err: any) {
      console.error("Login Error:", err);
      // Clean up common Firebase authentication messages
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        setErrorMessage("Invalid credentials. Please verify your email and security key.");
      } else if (err.code === "auth/invalid-credential") {
        setErrorMessage("Invalid credentials. Please verify and retry.");
      } else if (err.code === "auth/too-many-requests") {
        setErrorMessage("Access blocked due to excessive attempts. Please reset your security key or try later.");
      } else {
        setErrorMessage(err.message || "An authentication error occurred. Please contact the secure desk.");
      }
    }
  };

  // Forgot Password email dispatch handler
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError(null);
    setResetSuccess(null);
    
    if (!resetEmail || !resetEmail.includes("@")) {
      setResetError("Please provide a valid corporate email address.");
      return;
    }

    setResetLoading(true);
    try {
      if (resetPassword) {
        await resetPassword(resetEmail);
        setResetSuccess("A security key reset link has been dispatched to your corporate email. Please check your mail gateway.");
        setResetEmail("");
      } else {
        throw new Error("Password reset service is currently unavailable.");
      }
    } catch (err: any) {
      console.error("Reset Password Error:", err);
      if (err.code === "auth/user-not-found") {
        setResetError("The corporate email provided is not registered in our directories.");
      } else {
        setResetError(err.message || "Unable to dispatch reset link. Please check network connectivity.");
      }
    } finally {
      setResetLoading(false);
    }
  };

  // Helper: Autofill credentials for instant design test & exploration
  const autofill = (role: "credit" | "msme") => {
    if (role === "credit") {
      setValue("email", "officer@msme360.com");
      setValue("password", "bank1234");
    } else {
      setValue("email", "owner@msme360.com");
      setValue("password", "msme1234");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Forgot Password Mode View */}
      {isResetMode ? (
        <div className="space-y-6">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <KeyRound className="w-6 h-6 text-teal-700" />
              <span>Reset Security Key</span>
            </h2>
            <p className="text-slate-500 text-sm">
              Enter your corporate email address to receive a secure, tamper-proof recovery token.
            </p>
          </div>

          {/* Reset Status Alertboxes */}
          {resetSuccess && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-start gap-3 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Dispatch Complete</p>
                <p className="text-xs text-emerald-700/80 mt-0.5">{resetSuccess}</p>
              </div>
            </div>
          )}

          {resetError && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Dispatch Blocked</p>
                <p className="text-xs text-rose-700/80 mt-0.5">{resetError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Corporate Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="officer@statebank.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-100 focus:border-teal-500 focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={resetLoading}
              className="w-full flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 rounded-xl text-sm shadow-md shadow-teal-100 hover:shadow-lg focus:ring-4 focus:ring-teal-100 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
            >
              {resetLoading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  <span>Dispatching secure token...</span>
                </>
              ) : (
                <>
                  <span>Dispatch Reset Credentials</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-4 border-t border-slate-100">
            <button
              onClick={() => {
                setIsResetMode(false);
                setResetSuccess(null);
                setResetError(null);
              }}
              className="text-xs font-bold text-teal-700 hover:underline hover:text-teal-800"
            >
              Return to Standard Gateway Verification
            </button>
          </div>
        </div>
      ) : (
        /* 2. Standard Login Mode View */
        <>
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              System Verification
            </h2>
            <p className="text-slate-500 text-sm">
              Enter your registered corporate credentials to access your console.
            </p>
          </div>

          {/* Success Notification */}
          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3 text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">Credential Authorized</p>
                <p className="text-xs text-emerald-700/80 mt-0.5">Redirecting to protected secure workspace...</p>
              </div>
            </div>
          )}

          {/* Error Boundary Notice */}
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Authentication Refused</p>
                <p className="text-xs text-rose-700/80 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Main Authentication Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Corporate Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  {...register("email")}
                  placeholder="officer@statebank.com"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm transition-all focus:outline-hidden focus:ring-2 focus:bg-white ${
                    errors.email 
                      ? "border-rose-300 focus:ring-rose-100 focus:border-rose-500" 
                      : "border-slate-200 focus:ring-teal-100 focus:border-teal-500"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs font-medium text-rose-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Security Key
                </label>
                <button
                  type="button"
                  onClick={() => setIsResetMode(true)}
                  className="text-xs font-semibold text-teal-600 hover:underline cursor-pointer"
                >
                  Forgot security key?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  {...register("password")}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm transition-all focus:outline-hidden focus:ring-2 focus:bg-white ${
                    errors.password 
                      ? "border-rose-300 focus:ring-rose-100 focus:border-rose-500" 
                      : "border-slate-200 focus:ring-teal-100 focus:border-teal-500"
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-xs font-medium text-rose-600 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5" /> {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me Option */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none font-semibold">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-4 h-4 accent-teal-700 cursor-pointer"
                />
                <span>Remember Me</span>
              </label>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting || success}
              className="w-full flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 rounded-xl text-sm shadow-md shadow-teal-100 hover:shadow-lg focus:ring-4 focus:ring-teal-100 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  <span>Verifying secure token...</span>
                </>
              ) : (
                <>
                  <span>Authorize Gateway Access</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

          </form>

          {/* Alternative Options / Quick Actions */}
          <div className="space-y-4 pt-6 border-t border-slate-200">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 text-center uppercase tracking-wider mb-2.5">
                Architectural Quick Access (Auto-fill Demo accounts)
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => autofill("credit")}
                  className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-teal-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>Credit Officer</span>
                </button>
                <button
                  type="button"
                  onClick={() => autofill("msme")}
                  className="px-3 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-slate-600" />
                  <span>MSME Owner</span>
                </button>
              </div>
            </div>

            <div className="text-center text-xs text-slate-500">
              Not registered in the credit platform?{" "}
              <Link to="/register" className="font-semibold text-teal-600 hover:underline">
                Initiate Corporate Registration
              </Link>
            </div>
          </div>
        </>
      )}

    </div>
  );
};
