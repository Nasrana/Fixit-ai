import React, { useState, useEffect } from 'react';
import { getStoredComplaints, getComplaintById, advanceComplaintStatus } from '../services/storageService';
import { Complaint, ComplaintStatus } from '../types';
import { generateComplaintPDF } from '../utils/pdfGenerator';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Building2, 
  ShieldAlert, 
  ArrowRight, 
  Download, 
  Sparkles,
  Zap,
  Play,
  RotateCcw,
  Check
} from 'lucide-react';

interface TrackingPageProps {
  initialComplaintId?: string;
  onOpenReport: () => void;
}

const STAGES: { status: ComplaintStatus; title: string; desc: string }[] = [
  { status: 'SUBMITTED', title: 'Submitted', desc: 'Problem registered in system' },
  { status: 'UNDER REVIEW', title: 'Under Review', desc: 'Triaged by central safety desk' },
  { status: 'ASSIGNED', title: 'Assigned', desc: 'Dispatched to departmental crew' },
  { status: 'IN PROGRESS', title: 'In Progress', desc: 'Technician on-site repairing' },
  { status: 'RESOLVED', title: 'Resolved', desc: 'Repaired and audited with proof' },
];

export const TrackingPage: React.FC<TrackingPageProps> = ({
  initialComplaintId,
  onOpenReport
}) => {
  const [searchId, setSearchId] = useState(initialComplaintId || '');
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);

  useEffect(() => {
    const all = getStoredComplaints();
    setRecentComplaints(all.slice(0, 4));

    if (initialComplaintId) {
      const found = getComplaintById(initialComplaintId);
      if (found) {
        setComplaint(found);
        setHasSearched(true);
      }
    } else if (all.length > 0) {
      // Default to first active complaint
      setComplaint(all[0]);
      setSearchId(all[0].id);
      setHasSearched(true);
    }
  }, [initialComplaintId]);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchId.trim()) return;

    const found = getComplaintById(searchId.trim());
    setComplaint(found || null);
    setHasSearched(true);
  };

  const handleSelectRecent = (id: string) => {
    setSearchId(id);
    const found = getComplaintById(id);
    setComplaint(found || null);
    setHasSearched(true);
  };

  const handleAdvance = () => {
    if (!complaint) return;
    const updated = advanceComplaintStatus(complaint.id);
    if (updated) {
      setComplaint(updated);
    }
  };

  const getStageIndex = (status: ComplaintStatus) => {
    return STAGES.findIndex(s => s.status === status);
  };

  const currentStageIndex = complaint ? getStageIndex(complaint.status) : -1;

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">MEDIUM</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">LOW</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Live Grievance Tracking System
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-lg mx-auto">
          Enter your unique Tracking ID to inspect real-time departmental progression, timeline audit logs, and repair status.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="max-w-2xl mx-auto mb-6">
        <form onSubmit={handleSearch} className="relative flex items-center shadow-2xl">
          <Search className="w-5 h-5 text-slate-400 absolute left-4" />
          <input
            type="text"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Enter Complaint Tracking ID (e.g. FIX-2026-001247)..."
            className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-slate-900 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-inner"
          />
          <button
            type="submit"
            className="absolute right-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 transition-all"
          >
            Track Status
          </button>
        </form>

        {/* Quick Sample IDs Pills */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-slate-500 text-[11px] font-medium">Quick Demo Tickets:</span>
          {recentComplaints.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelectRecent(c.id)}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 font-mono text-[11px] transition-colors"
            >
              {c.id}
            </button>
          ))}
        </div>
      </div>

      {/* Main Result Card */}
      {complaint ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-8">
          
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-base sm:text-lg font-extrabold text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-xl border border-emerald-500/30">
                  {complaint.id}
                </span>
                {getPriorityBadge(complaint.priority)}
                <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                  {complaint.category}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-2">
                {complaint.subject}
              </h2>
            </div>

            {/* Symposium Demo Advance Status CTA */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => generateComplaintPDF(complaint)}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center space-x-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>PDF Dossier</span>
              </button>

              {complaint.status !== 'RESOLVED' ? (
                <button
                  onClick={handleAdvance}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 flex items-center space-x-1.5 transition-all hover:scale-102"
                  title="Advance status to next stage for live demonstration"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Advance Status Step →</span>
                </button>
              ) : (
                <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Fully Resolved & Signed Off</span>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Status Stepper */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Real-Time Grievance Progression Pipeline
            </h3>

            <div className="relative">
              {/* Stepper Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {STAGES.map((st, idx) => {
                  const isPassed = idx < currentStageIndex;
                  const isCurrent = idx === currentStageIndex;
                  const isPending = idx > currentStageIndex;

                  return (
                    <div
                      key={st.status}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'bg-emerald-950/30 border-emerald-500/50 shadow-lg glow-emerald'
                          : isPassed
                          ? 'bg-slate-800/40 border-slate-700/60 text-slate-300'
                          : 'bg-slate-900/40 border-slate-800/80 text-slate-500'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isCurrent
                              ? 'bg-emerald-400 text-slate-950 animate-pulse'
                              : isPassed
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-800 text-slate-500'
                          }`}
                        >
                          {isPassed ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                        </div>
                        <span className={`text-xs font-bold ${isCurrent ? 'text-emerald-300' : isPassed ? 'text-slate-200' : 'text-slate-500'}`}>
                          {st.title}
                        </span>
                      </div>
                      <p className="text-[11px] leading-tight text-slate-400">
                        {st.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Details Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Location & Department */}
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Departmental Allocation
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-start space-x-2">
                  <Building2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">Primary Authority:</span>
                    <span className="text-emerald-300 font-semibold">{complaint.department}</span>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">Verified Location:</span>
                    <span className="text-slate-200 font-medium">{complaint.location.fullAddress}</span>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Clock className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">Created Timestamp:</span>
                    <span className="text-slate-300 font-medium">{new Date(complaint.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description & Action Plan Progress */}
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Suggested Remedial Action
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {complaint.suggestedAction}
              </p>
              <div className="pt-2 border-t border-slate-700/60 text-xs">
                <span className="text-slate-400 block text-[11px] mb-1">Action Plan Roadmap Status:</span>
                <div className="space-y-1">
                  {complaint.actionPlan.map(step => (
                    <div key={step.step} className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-300 truncate max-w-[220px]">
                        {step.step}. {step.title}
                      </span>
                      <span className={`font-semibold ${step.status === 'completed' ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {step.status === 'completed' ? 'Done ✓' : 'In Queue'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Audit Timeline */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Institutional Action Audit Log
            </h3>
            <div className="space-y-3">
              {complaint.timeline.map((event) => (
                <div
                  key={event.id}
                  className="p-3.5 rounded-xl bg-slate-800/30 border border-slate-800 flex items-start space-x-3 text-xs"
                >
                  <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{event.title}</span>
                      <span className="text-[11px] text-slate-400">{event.timestamp}</span>
                    </div>
                    <p className="text-slate-300 mt-0.5">{event.description}</p>
                    <span className="text-[10px] text-emerald-400/80 font-medium mt-1 inline-block">
                      Actioned by: {event.actor}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : hasSearched ? (
        <div className="p-12 rounded-3xl bg-slate-900/60 border border-slate-800 text-center">
          <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">Tracking ID Not Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            No grievance was found matching "{searchId}". Please verify the format (e.g. FIX-2026-001247) or file a new complaint.
          </p>
          <button
            onClick={onOpenReport}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
          >
            File New Complaint Now
          </button>
        </div>
      ) : null}

    </div>
  );
};
