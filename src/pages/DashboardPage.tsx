import React, { useState, useEffect } from 'react';
import { 
  calculateStats, 
  getStoredComplaints, 
  advanceComplaintStatus 
} from '../services/storageService';
import { Complaint } from '../types';
import { ComplaintDetailModal } from '../components/Modals/ComplaintDetailModal';
import { 
  LayoutDashboard, 
  Clock, 
  PlayCircle, 
  CheckCircle2, 
  AlertOctagon, 
  TrendingUp, 
  Building2, 
  Eye, 
  Search, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';

interface DashboardPageProps {
  onOpenReport: () => void;
  onNavigateToTracking: (id: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onOpenReport,
  onNavigateToTracking
}) => {
  const [stats, setStats] = useState(calculateStats());
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  const refreshStats = () => {
    setStats(calculateStats());
  };

  useEffect(() => {
    const handleUpdate = () => refreshStats();
    window.addEventListener('fixit_complaints_updated', handleUpdate);
    return () => window.removeEventListener('fixit_complaints_updated', handleUpdate);
  }, []);

  const handleAdvance = (id: string) => {
    advanceComplaintStatus(id);
    refreshStats();
    if (selectedComplaint && selectedComplaint.id === id) {
      const updated = getStoredComplaints().find(c => c.id === id);
      if (updated) setSelectedComplaint(updated);
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">HIGH</span>;
      case 'MEDIUM':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">MEDIUM</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">LOW</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RESOLVED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">RESOLVED</span>;
      case 'IN PROGRESS':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">IN PROGRESS</span>;
      case 'ASSIGNED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">ASSIGNED</span>;
      case 'UNDER REVIEW':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">UNDER REVIEW</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-700/60 text-slate-300 border border-slate-600">SUBMITTED</span>;
    }
  };

  const maxCategoryCount = Math.max(...Object.values(stats.categoryCounts), 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Page Title & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Institutional Grievance Dashboard
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time analytics, automated departmental queue metrics, and resolution progress.
          </p>
        </div>

        <button
          onClick={onOpenReport}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 flex items-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Lodge New Grievance</span>
        </button>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4 mb-8">
        
        {/* Total Complaints */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Filed</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">{stats.total}</div>
          <p className="text-[11px] text-emerald-400 font-medium mt-1">100% Verified by AI</p>
        </div>

        {/* Pending */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-300">{stats.pending}</div>
          <p className="text-[11px] text-slate-400 mt-1">Submitted & Reviewing</p>
        </div>

        {/* In Progress */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">In Progress</span>
            <PlayCircle className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-cyan-300">{stats.inProgress}</div>
          <p className="text-[11px] text-slate-400 mt-1">Crew On-Site / Dispatched</p>
        </div>

        {/* Resolved */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">{stats.resolved}</div>
          <p className="text-[11px] text-slate-400 mt-1">Audited & Verified</p>
        </div>

        {/* Critical Issues */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-rose-500/30 shadow-xl col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Critical</span>
            <AlertOctagon className="w-4 h-4 text-rose-500 animate-pulse" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-400">{stats.critical}</div>
          <p className="text-[11px] text-rose-300/80 mt-1">Urgent Safety Hazards</p>
        </div>

      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Category Breakdown (2 Cols) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Grievances by Category Distribution</span>
            </h3>
            <span className="text-xs text-slate-400">Real-time counts</span>
          </div>

          <div className="space-y-3.5">
            {Object.entries(stats.categoryCounts).map(([cat, count]) => {
              const pct = Math.round((count / maxCategoryCount) * 100);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{cat}</span>
                    <span className="text-emerald-400 font-bold">{count} case{count > 1 ? 's' : ''}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Breakdown (1 Col) */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Priority Urgency Breakdown
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between">
                <span className="text-xs font-bold text-rose-300">CRITICAL</span>
                <span className="text-lg font-extrabold text-rose-400">{stats.priorityCounts.CRITICAL}</span>
              </div>

              <div className="p-3 rounded-xl bg-orange-950/20 border border-orange-500/30 flex items-center justify-between">
                <span className="text-xs font-bold text-orange-300">HIGH</span>
                <span className="text-lg font-extrabold text-orange-400">{stats.priorityCounts.HIGH}</span>
              </div>

              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300">MEDIUM</span>
                <span className="text-lg font-extrabold text-amber-400">{stats.priorityCounts.MEDIUM}</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300">LOW</span>
                <span className="text-lg font-extrabold text-emerald-400">{stats.priorityCounts.LOW}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            Automated priority triage derived from safety keywords and location footfall analysis.
          </div>
        </div>

      </div>

      {/* Recent Complaints Table */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              Recent Institutional Complaints
            </h3>
            <p className="text-xs text-slate-400">
              Click any grievance to view details or advance simulated status for presentation.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="text-[11px] uppercase font-bold text-slate-400 bg-slate-800/40 border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Tracking ID</th>
                <th className="py-3 px-3">Subject / Issue</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Priority</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {stats.recent.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                    {c.id}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-white max-w-xs truncate">{c.subject}</div>
                    <div className="text-xs text-slate-400 truncate max-w-xs">{c.location.fullAddress}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-medium">
                    {c.category}
                  </td>
                  <td className="py-3 px-3">
                    {getPriorityBadge(c.priority)}
                  </td>
                  <td className="py-3 px-3">
                    {getStatusBadge(c.status)}
                  </td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <button
                      onClick={() => setSelectedComplaint(c)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onNavigateToTracking(c.id)}
                      className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"
                      title="Track Live"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    {c.status !== 'RESOLVED' && (
                      <button
                        onClick={() => handleAdvance(c.id)}
                        className="px-2 py-1 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 text-[10px] font-bold border border-teal-500/30"
                        title="Simulate advance status for symposium demo"
                      >
                        Advance +
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <ComplaintDetailModal
        complaint={selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        onAdvanceStatus={handleAdvance}
      />

    </div>
  );
};
