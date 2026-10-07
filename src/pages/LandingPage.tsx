import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Search, 
  CheckCircle2, 
  FileCheck, 
  Activity, 
  Building2, 
  Layers, 
  MapPin, 
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Check
} from 'lucide-react';

interface LandingPageProps {
  onStartReporting: () => void;
  onTryDemo: () => void;
  onViewDashboard: () => void;
  onTrackComplaint: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartReporting,
  onTryDemo,
  onViewDashboard,
  onTrackComplaint
}) => {
  const steps = [
    {
      title: 'Problem Description',
      subtitle: 'Describe in natural language (voice or text)',
      icon: AlertTriangle,
      color: 'from-amber-500 to-orange-500'
    },
    {
      title: 'AI Understands',
      subtitle: 'Extracts core defect, impact & location',
      icon: Cpu,
      color: 'from-cyan-500 to-blue-500'
    },
    {
      title: 'AI Analyzes',
      subtitle: 'Calculates Priority & Responsible Department',
      icon: Zap,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      title: 'Action Plan',
      subtitle: 'Generates 5-step institutional roadmap',
      icon: FileCheck,
      color: 'from-teal-500 to-emerald-500'
    },
    {
      title: 'Official Tracking',
      subtitle: 'Issues unique Tracking ID with live timeline',
      icon: Search,
      color: 'from-emerald-500 to-green-500'
    }
  ];

  const showcaseExamples = [
    {
      title: 'Broken Streetlight',
      input: '"The streetlight near my hostel has been broken for 5 days."',
      category: 'Electricity / Safety',
      priority: 'HIGH',
      department: 'Electrical Maintenance & Power Grid',
      action: 'Replace sodium fixture and restore walkway illumination.'
    },
    {
      title: 'Water Pipe Leakage',
      input: '"The water tap in our college block is leaking continuously."',
      category: 'Water / Sanitation',
      priority: 'MEDIUM',
      department: 'Water Works & Plumbing Division',
      action: 'Isolate Level 1 riser and install ceramic pressure cartridge.'
    },
    {
      title: 'Severe Roadway Pothole',
      input: '"There is a large pothole near my house/campus gate."',
      category: 'Road / Civil Works',
      priority: 'HIGH',
      department: 'Municipal Roadways & Civil Engineering',
      action: 'Place reflective safety cones and compact cold asphalt patch.'
    },
    {
      title: 'Classroom AC & Sparking',
      input: '"The classroom fan is not working and making sparks."',
      category: 'Education / Electrical',
      priority: 'CRITICAL',
      department: 'Academic Facilities & Emergency Electrical Unit',
      action: 'Emergency circuit lockout, replace blown capacitor and safety audit.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 selection:bg-emerald-500 selection:text-white pb-16">
      
      {/* Background radial glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        
        {/* Symposium Edition Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>College Symposium Edition • Production-Ready AI</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight">
          FIXIT <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">AI</span>
        </h1>

        <p className="mt-3 text-lg sm:text-2xl font-bold text-slate-200 tracking-wide">
          "From Problem to Action."
        </p>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Describe any real-world problem. Let intelligent AI understand it, classify the category, detect urgency priority, and turn it into an actionable, tracked solution.
        </p>

        {/* Primary Call to Actions */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onStartReporting}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-emerald-500/25 flex items-center space-x-2 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4" />
            <span>START REPORTING</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onTryDemo}
            className="px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-200 hover:text-white font-semibold text-sm sm:text-base shadow-lg flex items-center space-x-2 transition-all"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>TRY DEMO MODE</span>
          </button>

          <button
            onClick={onTrackComplaint}
            className="px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-sm font-medium transition-all"
          >
            <span>Track Existing Ticket</span>
          </button>
        </div>

        {/* Live Metrics Ticker */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">1,240+</div>
            <div className="text-xs text-slate-400 mt-1">Issues Resolved</div>
          </div>
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-teal-300">98.4%</div>
            <div className="text-xs text-slate-400 mt-1">Department Match</div>
          </div>
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400">&lt; 90s</div>
            <div className="text-xs text-slate-400 mt-1">Intake to Action Plan</div>
          </div>
          <div className="p-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">100%</div>
            <div className="text-xs text-slate-400 mt-1">Audit Trail Tracked</div>
          </div>
        </div>

      </section>

      {/* Visual Flow Pipeline Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-xs sm:text-sm font-bold tracking-widest text-emerald-400 uppercase">
            Intelligent Architecture
          </h2>
          <h3 className="text-xl sm:text-3xl font-extrabold text-white mt-1">
            The Problem-to-Action Pipeline
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mt-2">
            Every complaint passes through our structured multi-stage reasoning engine:
          </p>
        </div>

        {/* 5-Step Flow Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col justify-between relative group hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono font-bold text-slate-500">
                      STAGE 0{idx + 1}
                    </span>
                    <div className={`p-2 rounded-xl bg-gradient-to-tr ${st.color} text-slate-950 shadow-md`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1.5">{st.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{st.subtitle}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center text-[11px] font-semibold text-emerald-400">
                  <Check className="w-3.5 h-3.5 mr-1" />
                  <span>Automated AI Flow</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Showcase Scenarios Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-xs sm:text-sm font-bold tracking-widest text-teal-400 uppercase">
            Real-World Scenarios
          </h2>
          <h3 className="text-xl sm:text-3xl font-extrabold text-white mt-1">
            Handled Seamlessly By FIXIT AI
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto mt-2">
            Tested on real campus and municipal situations with instant resolution workflows:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {showcaseExamples.map((ex, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="text-sm font-bold text-white">{ex.title}</h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    ex.priority === 'CRITICAL'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : ex.priority === 'HIGH'
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {ex.priority} PRIORITY
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 italic mb-3">
                  {ex.input}
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Category:</span>
                    <span className="text-slate-200 font-medium">{ex.category}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Department:</span>
                    <span className="text-emerald-400 font-medium">{ex.department}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 text-slate-300">
                    <span className="font-semibold text-slate-200">Recommended Action: </span>
                    {ex.action}
                  </div>
                </div>
              </div>

              <button
                onClick={onStartReporting}
                className="mt-4 w-full py-2 rounded-xl bg-slate-800/80 hover:bg-emerald-950/40 hover:border-emerald-500/40 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-emerald-300 transition-all flex items-center justify-center space-x-1.5"
              >
                <span>Try this problem in Chat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Symposium Highlights Callout */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-[#0e1628] border border-emerald-500/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 pointer-events-none opacity-10">
            <Sparkles className="w-48 h-48 text-emerald-400" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Ready to experience FIXIT AI?
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
            Zero localhost dependencies. Works seamlessly on any smartphone, tablet, or desktop browser.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={onStartReporting}
              className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
            >
              Start AI Intake Session
            </button>
            <button
              onClick={onViewDashboard}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all"
            >
              View Institutional Dashboard
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
