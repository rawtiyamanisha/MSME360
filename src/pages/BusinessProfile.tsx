import React, { useState, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { 
  Briefcase, 
  Building, 
  MapPin, 
  Users, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  FileText, 
  CheckCircle2, 
  Upload, 
  Plus, 
  Trash2, 
  Save, 
  ShieldCheck,
  Info,
  X
} from "lucide-react";

interface Director {
  id: string;
  name: string;
  din: string;
  shareholding: string;
}

export const BusinessProfile: React.FC = () => {
  const { profile } = useAuth();
  
  const [isSaved, setIsSaved] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string; status: string }[]>([
    { name: "Udyam_Registration_Certificate.pdf", size: "1.2 MB", status: "Verified" },
    { name: "GSTR_3B_Last_6_Months.pdf", size: "4.8 MB", status: "Verified" }
  ]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Corporate Directors list
  const [directors, setDirectors] = useState<Director[]>([
    { id: "1", name: "Rajesh Sharma", din: "DIN-08492019", shareholding: "60%" },
    { id: "2", name: "Sunita Sharma", din: "DIN-09102834", shareholding: "40%" }
  ]);

  const [newDirectorName, setNewDirectorName] = useState("");
  const [newDirectorDin, setNewDirectorDin] = useState("");
  const [newDirectorShare, setNewDirectorShare] = useState("");

  const handleAddDirector = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDirectorName || !newDirectorDin) return;
    setDirectors([
      ...directors,
      {
        id: Math.random().toString(),
        name: newDirectorName,
        din: newDirectorDin,
        shareholding: newDirectorShare || "0%"
      }
    ]);
    setNewDirectorName("");
    setNewDirectorDin("");
    setNewDirectorShare("");
  };

  const handleDeleteDirector = (id: string) => {
    setDirectors(directors.filter(d => d.id !== id));
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    const newFiles = Array.from(files).map(file => ({
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      status: "Analyzing..."
    }));

    setUploadedFiles([...uploadedFiles, ...newFiles]);

    // Simulate verification
    setTimeout(() => {
      setUploadedFiles(prev => 
        prev.map(f => f.status === "Analyzing..." ? { ...f, status: "Verified" } : f)
      );
    }, 2000);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleProfileSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-bold text-blue-700 tracking-wider uppercase bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            Company Master
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-2.5">
            Business Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Maintain your physical registry information, director logs, and upload certified statutory documents securely.
          </p>
        </div>

        <button 
          onClick={handleProfileSave}
          className="flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-blue-200"
        >
          <Save className="w-4 h-4" />
          <span>Save Profile</span>
        </button>
      </div>

      {isSaved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Enterprise profile attributes successfully saved to the encrypted ledger.</span>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Core Profile and Directors list */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* General Enterprise Details */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
              <Building className="w-4.5 h-4.5 text-blue-700" />
              <span>General Enterprise Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Official Trade Name</label>
                <input 
                  type="text" 
                  defaultValue="APEX METAL CRAFTS PVT LTD"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Registered Corporate Address</label>
                <input 
                  type="text" 
                  defaultValue="Plot 149-D, MIDC Industrial Area, Thane, Maharashtra - 400604"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">NIC Classification (Industry Code)</label>
                <input 
                  type="text" 
                  defaultValue="25920 - Machining; treatment and coating of metals"
                  className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 font-semibold cursor-not-allowed"
                  disabled
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Year of Incorporation</label>
                <input 
                  type="text" 
                  defaultValue="2016"
                  className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 font-semibold cursor-not-allowed"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Directors list */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-2 mb-4 flex items-center gap-2">
              <Users className="w-4.5 h-4.5 text-blue-700" />
              <span>Directors & Authorized Signatories</span>
            </h3>

            {/* List */}
            <div className="space-y-3">
              {directors.map((dir) => (
                <div key={dir.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                      {dir.name.substring(0, 1)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{dir.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{dir.din} | Equity: {dir.shareholding}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDeleteDirector(dir.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add form */}
            <form onSubmit={handleAddDirector} className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase block">Director Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Ramesh K"
                  value={newDirectorName}
                  onChange={(e) => setNewDirectorName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase block">Director DIN</label>
                <input 
                  type="text" 
                  placeholder="DIN-XXXXXXXX"
                  value={newDirectorDin}
                  onChange={(e) => setNewDirectorDin(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-hidden"
                />
              </div>
              <div className="space-y-1 flex gap-2">
                <div className="flex-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block">Shareholding %</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 50%"
                    value={newDirectorShare}
                    onChange={(e) => setNewDirectorShare(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden"
                  />
                </div>
                <button 
                  type="submit"
                  className="p-2.5 bg-slate-900 text-white hover:bg-slate-800 font-bold rounded-xl text-xs flex items-center justify-center shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Right Side Column: File Upload (Drag & Drop + Select) */}
        <div className="space-y-6">
          
          {/* Statutory Filing Upload Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-2 mb-3 flex items-center gap-2">
              <Upload className="w-4.5 h-4.5 text-blue-700" />
              <span>Statutory Documents</span>
            </h3>
            <p className="text-[11px] text-slate-400 leading-normal mb-4">
              Upload copies of your GSTR filing reports, PAN, or Udyam certificates for verification.
            </p>

            {/* Drag & Drop Zone */}
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={triggerFileSelect}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                dragActive 
                  ? "border-blue-500 bg-blue-50/50" 
                  : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                className="hidden"
                multiple
                accept=".pdf,.png,.jpg"
              />
              <Upload className="w-7 h-7 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">Drag & drop files here</p>
              <p className="text-[10px] text-slate-400 mt-0.5">or click to browse from device</p>
              <p className="text-[9px] text-slate-400 mt-1.5">Supports PDF, PNG, JPG up to 10MB</p>
            </div>

            {/* Uploaded files status tracker */}
            <div className="mt-5 space-y-2.5">
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black block">Uploaded Documents ({uploadedFiles.length})</span>
              
              {uploadedFiles.map((f, i) => (
                <div key={i} className="p-2.5 bg-slate-50 border border-slate-200/60 rounded-xl flex justify-between items-center text-xs">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-800 truncate">{f.name}</p>
                    <p className="text-[9px] text-slate-400 font-mono mt-0.5">{f.size} | Status: <span className={
                      f.status === "Verified" ? "text-emerald-600 font-bold" : "text-blue-600 font-semibold animate-pulse"
                    }>{f.status}</span></p>
                  </div>

                  <button 
                    onClick={() => removeUploadedFile(i)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-lg ml-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Underwriting security notes */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-xs text-slate-600 leading-normal space-y-2">
            <h4 className="font-black text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wide">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <span>Data Protection</span>
            </h4>
            <p>
              Uploaded documents are locked with AES-256 digital envelope wrapping and stored in sandbox storage.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
