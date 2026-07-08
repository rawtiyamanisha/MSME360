import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  HelpCircle, 
  TrendingUp, 
  Info, 
  ArrowRight, 
  Activity, 
  Database,
  Brain,
  MessageSquare,
  Lock,
  User,
  Check,
  Award,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Zap,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  sender: "user" | "advisor";
  text: string;
  time: string;
  agent?: string;
}

interface AdvisorAgent {
  id: string;
  name: string;
  role: string;
  specialty: string;
  avatarColor: string;
  greeting: string;
}

export const AIAdvisor: React.FC = () => {
  const { profile } = useAuth();
  
  const agents: AdvisorAgent[] = [
    {
      id: "credit_builder",
      name: "FinCore Analyst",
      role: "Score Optimization Expert",
      specialty: "Credit profiling & non-traditional score enhancement",
      avatarColor: "bg-blue-600",
      greeting: "Greetings! I'm your FinCore Analyst. Let's analyze your connected datasets to find the fastest way to raise your current 742 score above the 750 Prime cutoff."
    },
    {
      id: "tax_optimizer",
      name: "Tax & GST Advisor",
      role: "Compliance Strategist",
      specialty: "GSTR filing alignment & working capital margins",
      avatarColor: "bg-teal-600",
      greeting: "Hello. I'm your Tax Optimizer. I evaluate your monthly GSTR sales registries against SIDBI guidelines to unlock interest subventions."
    },
    {
      id: "subsidy_guru",
      name: "Scheme Consultant",
      role: "State Incentive Expert",
      specialty: "CGTMSE guarantees, PMEGP, and tech subsidies",
      avatarColor: "bg-purple-600",
      greeting: "Welcome! I'm your Scheme Consultant. I map your physical metrics to available state subsidies to optimize your eligible rebates."
    }
  ];

  const [activeAgent, setActiveAgent] = useState<AdvisorAgent>(agents[0]);
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Record<string, Message[]>>({
    credit_builder: [
      {
        id: "1",
        sender: "advisor",
        text: agents[0].greeting,
        time: "10:30 AM"
      }
    ],
    tax_optimizer: [
      {
        id: "1",
        sender: "advisor",
        text: agents[1].greeting,
        time: "10:31 AM"
      }
    ],
    subsidy_guru: [
      {
        id: "1",
        sender: "advisor",
        text: agents[2].greeting,
        time: "10:32 AM"
      }
    ]
  });

  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to chat bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isTyping, activeAgent]);

  // Expert Predefined Answers to common queries
  const getPredefinedAnswer = (query: string, agentId: string): string => {
    const q = query.toLowerCase();
    if (agentId === "credit_builder") {
      if (q.includes("score") || q.includes("raise") || q.includes("improve")) {
        return `Your current alternative health score is **742 (Low Risk)**. To raise it past the **750 Prime Tier Cutoff** and unlock a **7.2% APR Line of Credit**, I recommend these steps:
1. **Link QuickBooks/Tally API**: This will add +140 score points and verify trade supplier compliance.
2. **Link Utility Bill Analyzer**: Toggling power and telecom feeds adds +80 points and verifies operating continuity.
3. **Daily Cash Reserves**: Try to maintain an average checking balance above $5,000 for 14 consecutive days to maximize liquidity indicators.`;
      }
      if (q.includes("loan") || q.includes("limit") || q.includes("eligibility")) {
        return `Based on your alternative underwriting score of **742**, you are pre-approved for **$120,000 in working capital credit** at 9.5% APR. Connecting your Accounting API will immediately boost your limit to **$180,000** and lower your rate to **8.5% APR** within 12 hours.`;
      }
      return `That's an excellent question regarding your alternative credit parameters. Our core underwriter parses transaction velocity and supplier compliance in real-time. Link more API channels to demonstrate robust resilience.`;
    }

    if (agentId === "tax_optimizer") {
      if (q.includes("gst") || q.includes("tax") || q.includes("compliance")) {
        return `Your GSTN Tax Filing compliance holds an exceptional rating of **85/100**. To maximize this score:
- **File GSTR-1 by the 11th of every month** consistently.
- Ensure your sales reporting variance against GSTR-3B tax payment records is less than **2.5%** over a rolling 6-month period. Consistent tax logs unlock a **2% Interest Subvention** program.`;
      }
      return `To optimize your operating margins under current tax guidelines, we can cross-reference your raw invoice feeds with GSTR filings. Link your Accounting API to automate credit matching.`;
    }

    if (agentId === "subsidy_guru") {
      if (q.includes("scheme") || q.includes("subsidy") || q.includes("guarantee")) {
        return `You hold strong eligibility metrics for these active Government Schemes:
1. **CGTMSE Collateral-Free Guarantee**: Eligible for up to **$300,000** in credit guarantees. Unlocked with your bank statements and GST tax logs.
2. **Credit Linked Capital Subsidy (CLCSS)**: Eligible for a **15% rebate** on machinery purchases. You can unlock your eligibility certificate instantly by linking your Accounting Ledger API.`;
      }
      return `State subsidy programs are mapped dynamically via your corporate location and industry codes. Keep your Udyam formalization sync active to ensure you receive priority rebates.`;
    }

    return "I've received your query. Analyzing your transaction records against the central risk ledger...";
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userInput.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: userInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Append user message
    setChatHistory(prev => ({
      ...prev,
      [activeAgent.id]: [...prev[activeAgent.id], userMsg]
    }));

    const queryText = userInput;
    setUserInput("");
    setIsTyping(true);

    // Simulate streaming AI reply after 1.5 seconds
    setTimeout(() => {
      const advisorReplyText = getPredefinedAnswer(queryText, activeAgent.id);
      const advisorMsg: Message = {
        id: Math.random().toString(),
        sender: "advisor",
        text: advisorReplyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agent: activeAgent.name
      };

      setChatHistory(prev => ({
        ...prev,
        [activeAgent.id]: [...prev[activeAgent.id], advisorMsg]
      }));
      setIsTyping(false);
    }, 1500);
  };

  const selectSuggestedPrompt = (prompt: string) => {
    setUserInput(prompt);
    setTimeout(() => {
      // Small timeout to allow input box setting before submit
    }, 50);
  };

  // Upgradation goals checklist
  const checklistItems = [
    { id: 1, action: "Link QuickBooks / Tally API", reward: "+140 Score Points", status: "PENDING", details: "Unlocks CLCSS capital subsidies and raises credit limit to $180,000." },
    { id: 2, action: "Link Utility Bill Analyzer", reward: "+80 Score Points", status: "PENDING", details: "Verifies factory operations and unlocks priority rebates." },
    { id: 3, action: "GSTN Tax logs connected", reward: "Verified +160 pts", status: "COMPLETED", details: "Filing punctuality is logged at 100% active." },
    { id: 4, action: "Primary Banking Feed active", reward: "Verified +210 pts", status: "COMPLETED", details: "Open banking checkings transaction analyzer live." }
  ];

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-bold text-blue-700 tracking-wider uppercase bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            Autonomous Advisory
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-2.5">
            AI Advisor
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Consult specialized credit agents, optimize your transactional underwriting rating, and review compliance checklists.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold">
          <Brain className="w-4 h-4 text-blue-400" />
          <span>Generative Credit Advisor Active</span>
        </div>
      </div>

      {/* Grid: Advisor Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Agents Selector & Score Checklist */}
        <div className="space-y-6">
          
          {/* Agent Selector Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-100 pb-2 mb-3">Specialized Advisors</h3>
            
            <div className="space-y-2">
              {agents.map((agent) => {
                const isActive = activeAgent.id === agent.id;
                return (
                  <button
                    key={agent.id}
                    onClick={() => setActiveAgent(agent)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex gap-3 ${
                      isActive 
                        ? "bg-blue-50 border-blue-300 shadow-xs" 
                        : "bg-white border-slate-150 hover:bg-slate-50"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-full ${agent.avatarColor} text-white font-black text-sm flex items-center justify-center shrink-0`}>
                      {agent.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-extrabold text-slate-800 text-xs truncate">{agent.name}</h4>
                        {isActive && <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>}
                      </div>
                      <p className="text-[10px] text-blue-600 font-bold truncate mt-0.5">{agent.role}</p>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5 leading-normal">{agent.specialty}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upgradation Goal Checklist */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h3 className="font-black text-slate-800 text-sm border-b border-slate-100 pb-2 mb-3">Goal Upgradation Checklist</h3>
            <p className="text-[11px] text-slate-400 leading-normal mb-4">Complete target integrations beneath to raise your rating beyond the Prime 750 score.</p>

            <div className="space-y-3.5">
              {checklistItems.map((item) => (
                <div key={item.id} className="flex gap-3 items-start">
                  {item.status === "COMPLETED" ? (
                    <div className="p-1 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-lg shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="p-1 bg-slate-50 border border-slate-200 rounded-lg shrink-0 mt-0.5 text-slate-400">
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300"></div>
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-center">
                      <h4 className={`text-xs font-bold leading-tight ${item.status === "COMPLETED" ? "text-slate-500 line-through" : "text-slate-800"}`}>
                        {item.action}
                      </h4>
                      <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded ${
                        item.status === "COMPLETED" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-700"
                      }`}>
                        {item.reward}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-normal">{item.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Side: Dynamic Chat Interface */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col h-[520px] justify-between">
          
          {/* Chat Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full ${activeAgent.avatarColor} text-white font-black text-xs flex items-center justify-center`}>
                {activeAgent.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">{activeAgent.name}</h3>
                <p className="text-[10px] text-emerald-600 font-extrabold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                  <span>{activeAgent.role}</span>
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[9px] text-slate-400 block uppercase tracking-widest">Active session</span>
              <span className="text-[10px] font-mono font-bold text-slate-700">AES-256 SECURED</span>
            </div>
          </div>

          {/* Chat Body messages area */}
          <div className="flex-1 overflow-y-auto px-1 space-y-4 pr-1 scrollbar-thin scrollbar-thumb-slate-200">
            {chatHistory[activeAgent.id].map((msg) => {
              const isAdvisor = msg.sender === "advisor";
              return (
                <div key={msg.id} className={`flex gap-3 max-w-[85%] ${isAdvisor ? "mr-auto" : "ml-auto flex-row-reverse"}`}>
                  <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-black ${
                    isAdvisor ? `${activeAgent.avatarColor} text-white` : "bg-slate-100 text-slate-600 border border-slate-200"
                  }`}>
                    {isAdvisor ? activeAgent.name.substring(0, 2).toUpperCase() : <User className="w-3.5 h-3.5" />}
                  </div>

                  <div className={`rounded-2xl p-3.5 text-xs leading-relaxed ${
                    isAdvisor 
                      ? "bg-slate-50 text-slate-700 border border-slate-100 rounded-tl-none whitespace-pre-line" 
                      : "bg-blue-700 text-white rounded-tr-none"
                  }`}>
                    {msg.text}
                    <span className={`text-[9px] block text-right mt-1.5 ${isAdvisor ? "text-slate-400" : "text-blue-200"}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 mr-auto max-w-[85%]">
                <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-black ${activeAgent.avatarColor} text-white`}>
                  {activeAgent.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="bg-slate-50 text-slate-700 border border-slate-100 rounded-2xl rounded-tl-none p-3.5 text-xs flex items-center gap-1 shrink-0">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-300"></span>
                </div>
              </div>
            )}

            <div ref={chatEndRef}></div>
          </div>

          {/* Suggested Prompts shrink-0 */}
          <div className="py-2.5 border-t border-slate-100 shrink-0 space-y-1.5">
            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black block">Suggested Prompts</span>
            <div className="flex flex-wrap gap-1.5">
              {activeAgent.id === "credit_builder" ? (
                <>
                  <button 
                    onClick={() => selectSuggestedPrompt("How do I raise my score above 750?")}
                    className="px-2.5 py-1 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 hover:text-blue-700 rounded-lg text-[10px] font-bold text-slate-600 transition-all text-left"
                  >
                    "How do I raise my score above 750?"
                  </button>
                  <button 
                    onClick={() => selectSuggestedPrompt("What is my current pre-approved loan limit?")}
                    className="px-2.5 py-1 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 hover:text-blue-700 rounded-lg text-[10px] font-bold text-slate-600 transition-all text-left"
                  >
                    "What is my pre-approved credit limit?"
                  </button>
                </>
              ) : activeAgent.id === "tax_optimizer" ? (
                <>
                  <button 
                    onClick={() => selectSuggestedPrompt("How do I maximize my GST compliance score?")}
                    className="px-2.5 py-1 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 hover:text-blue-700 rounded-lg text-[10px] font-bold text-slate-600 transition-all text-left"
                  >
                    "How do I optimize my GST compliance score?"
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => selectSuggestedPrompt("What government subsidies do I qualify for?")}
                    className="px-2.5 py-1 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 hover:text-blue-700 rounded-lg text-[10px] font-bold text-slate-600 transition-all text-left"
                  >
                    "What government subsidies do I qualify for?"
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Input Area shrink-0 */}
          <form onSubmit={handleSendMessage} className="flex gap-2 shrink-0 border-t border-slate-100 pt-3">
            <input 
              type="text" 
              placeholder={`Ask ${activeAgent.name} about your alternative credit score parameters...`}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 focus:outline-hidden focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
            />
            <button 
              type="submit"
              className="p-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl shadow-xs transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
};
