import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { INDUSTRY_TYPES, STATES_LIST } from "../constants";
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  User, 
  Building2, 
  Briefcase, 
  MapPin, 
  AlertCircle, 
  Loader2, 
  ArrowRight 
} from "lucide-react";

const registerSchema = z.object({
  fullName: z.string().min(3, { message: "Legal representative name is required (min 3 chars)" }),
  email: z.string().email({ message: "Invalid corporate email address" }),
  password: z.string().min(6, { message: "Security passwords must be at least 6 characters" }),
  role: z.enum(["credit_officer", "msme_owner", "administrator"], { message: "Select a valid profile authorization level" }),
  company: z.string().min(3, { message: "Corporate/Bank/Admin legal company/org name is required" }),
  industryType: z.string().optional(),
  stateLocation: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: "credit_officer",
      company: "",
      industryType: "",
      stateLocation: "",
    }
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterFormValues) => {
    setErrorMessage(null);
    try {
      await signup(
        data.email,
        data.password,
        data.fullName,
        data.role,
        data.company
      );
      setSuccess(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err: any) {
      console.error("Sign Up Error:", err);
      if (err.code === "auth/email-already-in-use") {
        setErrorMessage("Corporate email already enrolled in MSME360 directory.");
      } else if (err.code === "auth/invalid-email") {
        setErrorMessage("Invalid email format.");
      } else {
        setErrorMessage(err.message || "Enrollment failed due to database connection timeout.");
      }
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="space-y-2 text-center lg:text-left">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Enroll New Entity
        </h2>
        <p className="text-slate-500 text-sm">
          Register to establish secure alternate underwriting scores.
        </p>
      </div>

      {/* Success Notification */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3 text-sm">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold">Entity Enrolled Successfully</p>
            <p className="text-xs text-emerald-700/80 mt-0.5">Initializing decentralized ledger & schemas...</p>
          </div>
        </div>
      )}

      {/* Error Boundary Notice */}
      {errorMessage && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-start gap-3 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Enrollment Refused</p>
            <p className="text-xs text-rose-700/80 mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            Legal Representative Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              {...register("fullName")}
              placeholder="Sanjay Sharma"
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm transition-all focus:outline-hidden focus:ring-2 focus:bg-white ${
                errors.fullName ? "border-rose-300 focus:ring-rose-100 focus:border-rose-500" : "border-slate-200 focus:ring-teal-100 focus:border-teal-500"
              }`}
            />
          </div>
          {errors.fullName && (
            <p className="text-xs font-medium text-rose-600 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Grid: Email & Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Corporate Email */}
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
                placeholder="sanjay@myfirm.com"
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm transition-all focus:outline-hidden focus:ring-2 focus:bg-white ${
                  errors.email ? "border-rose-300 focus:ring-rose-100 focus:border-rose-500" : "border-slate-200 focus:ring-teal-100 focus:border-teal-500"
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-xs font-medium text-rose-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.email.message}
              </p>
            )}
          </div>

          {/* Security Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Security Key
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm transition-all focus:outline-hidden focus:ring-2 focus:bg-white ${
                  errors.password ? "border-rose-300 focus:ring-rose-100 focus:border-rose-500" : "border-slate-200 focus:ring-teal-100 focus:border-teal-500"
                }`}
              />
            </div>
            {errors.password && (
              <p className="text-xs font-medium text-rose-600 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" /> {errors.password.message}
              </p>
            )}
          </div>

        </div>

        {/* Portal Role Option Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            Portal Authorization Level
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className={`flex items-center gap-2.5 px-3 py-2.5 border rounded-xl cursor-pointer transition-all ${
              selectedRole === "credit_officer" 
                ? "border-teal-600 bg-teal-50/40 text-teal-900 font-bold" 
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}>
              <input 
                type="radio" 
                value="credit_officer" 
                {...register("role")} 
                className="accent-teal-700"
              />
              <div className="flex flex-col">
                <span className="text-xs">Credit Officer</span>
                <span className="text-[9px] text-slate-400 leading-none mt-0.5">Underwrites credit</span>
              </div>
            </label>

            <label className={`flex items-center gap-2.5 px-3 py-2.5 border rounded-xl cursor-pointer transition-all ${
              selectedRole === "msme_owner" 
                ? "border-teal-600 bg-teal-50/40 text-teal-900 font-bold" 
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}>
              <input 
                type="radio" 
                value="msme_owner" 
                {...register("role")} 
                className="accent-teal-700"
              />
              <div className="flex flex-col">
                <span className="text-xs">MSME Owner</span>
                <span className="text-[9px] text-slate-400 leading-none mt-0.5">Requests credit</span>
              </div>
            </label>

            <label className={`flex items-center gap-2.5 px-3 py-2.5 border rounded-xl cursor-pointer transition-all ${
              selectedRole === "administrator" 
                ? "border-teal-600 bg-teal-50/40 text-teal-900 font-bold" 
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}>
              <input 
                type="radio" 
                value="administrator" 
                {...register("role")} 
                className="accent-teal-700"
              />
              <div className="flex flex-col">
                <span className="text-xs">Administrator</span>
                <span className="text-[9px] text-slate-400 leading-none mt-0.5">Full console access</span>
              </div>
            </label>
          </div>
          {errors.role && (
            <p className="text-xs font-medium text-rose-600 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.role.message}
            </p>
          )}
        </div>

        {/* Corporate/Bank Legal Company */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            {selectedRole === "credit_officer" ? "Bank/Financial Institution Name" : selectedRole === "administrator" ? "Administrative/Employer Firm" : "MSME Corporate Legal Name"}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Building2 className="w-4 h-4" />
            </div>
            <input
              type="text"
              {...register("company")}
              placeholder={selectedRole === "credit_officer" ? "State Bank of India" : selectedRole === "administrator" ? "MSME360 HQ" : "Aura Metal Crafts Pvt Ltd"}
              className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-sm transition-all focus:outline-hidden focus:ring-2 focus:bg-white ${
                errors.company ? "border-rose-300 focus:ring-rose-100 focus:border-rose-500" : "border-slate-200 focus:ring-teal-100 focus:border-teal-500"
              }`}
            />
          </div>
          {errors.company && (
            <p className="text-xs font-medium text-rose-600 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.company.message}
            </p>
          )}
        </div>

        {/* Conditional Fields for MSME Owners: State and Industry */}
        {selectedRole === "msme_owner" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-150">
            
            {/* Industry Type Selector */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Industry Type
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <select
                  {...register("industryType")}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-100 focus:border-teal-500 focus:bg-white transition-all appearance-none"
                >
                  <option value="">Select industry classification</option>
                  {INDUSTRY_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* State Location Selector */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Corporate Headquarters State
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <select
                  {...register("stateLocation")}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-100 focus:border-teal-500 focus:bg-white transition-all appearance-none"
                >
                  <option value="">Select state jurisdiction</option>
                  {STATES_LIST.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>

          </div>
        )}

        {/* Submission */}
        <button
          type="submit"
          disabled={isSubmitting || success}
          className="w-full flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 rounded-xl text-sm shadow-md shadow-teal-100 hover:shadow-lg focus:ring-4 focus:ring-teal-100 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer mt-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4.5 h-4.5 animate-spin" />
              <span>Provisioning secure catalog...</span>
            </>
          ) : (
            <>
              <span>Initiate Secure Enrollment</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

      </form>

      {/* Alternative login route */}
      <div className="text-center text-xs text-slate-500 pt-4 border-t border-slate-200">
        Already enrolled in the credit database?{" "}
        <Link to="/login" className="font-semibold text-teal-600 hover:underline">
          Authorize secure access
        </Link>
      </div>

    </div>
  );
};
