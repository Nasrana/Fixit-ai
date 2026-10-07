import React, { useState, useEffect } from 'react';
import { getStoredComplaints, advanceComplaintStatus } from '../services/storageService';
import { Complaint, Category, Priority, ComplaintStatus } from '../types';
import { ComplaintDetailModal } from '../components/Modals/ComplaintDetailModal';
import { generateComplaintPDF } from '../utils/pdfGenerator';
import { 
  History, 
  Search, 
  Filter, 
  Eye, 
  Download, 
  MapPin, 
  Calendar, 
  Sparkles,
  ArrowUpDown
} from 'lucide-react';

interface HistoryPageProps {
  onOpenReport: () => void;
  onNavigateToTracking: (id: string) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  onOpenReport,
  onNavigateToTracking
}) => {
  const [complaints, setComplaints] = useState<Complaint[]>(getStoredComplaints());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  const loadData = () => {
    setComplaints(getStoredComplaints());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('fixit_complaints_updated', handleUpdate);
    return () => window.removeEventListener('fixit_complaints_updated', handleUpdate);
  }, []);

  const handleAdvance = (id: string) => {
    advanceComplaintStatus(id);
    loadData();
    if (selectedComplaint && selectedComplaint.id === id) {
      const updated = getStoredComplaints().find(c => c.id === id);
      if (updated) setSelectedComplaint(updated);
    }
  };

  // Filter logic
  const filtered = complaints.filter((c) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      c.id.toLowerCase().includes(term) ||
      c.subject.toLowerCase().includes(term) ||
      c.description.toLowerCase().includes(term) ||
      c.location.fullAddress.toLowerCase().includes(term) ||
      c.department.toLowerCase().includes(term);

    const matchesCategory = selectedCategory === 'ALL' || c.category === selectedCategory;
    const matchesPriority = selectedPriority === 'ALL' || c.priority === selectedPriority;
    const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
  });

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
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">RESOLVED</span>;
      case 'IN PROGRESS':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">IN PROGRESS</span>;
      case 'ASSIGNED':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">ASSIGNED</span>;
      case 'UNDER REVIEW':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">UNDER REVIEW</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-700/60 text-slate-300 border border-slate-600">SUBMITTED</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center space-x-2">
            <History className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Institutional Grievance History
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Complete historical repository of logged problems, investigation notes, and resolution actions.
          </p>
        </div>

        <button
          onClick={onOpenReport}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 flex items-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>New Grievance</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID (e.g. FIX-2026-001247), keyword, location, or department..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center space-x-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Categories</option>
              <option value="Electricity">Electricity</option>
              <option value="Water">Water</option>
              <option value="Road">Road</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Education">Education</option>
              <option value="Safety">Safety</option>
            </select>

            {/* Priority Dropdown */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            {/* Status Dropdown */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER REVIEW">Under Review</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span>Showing {filtered.length} of {complaints.length} records</span>
          {(searchTerm || selectedCategory !== 'ALL' || selectedPriority !== 'ALL' || selectedStatus !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('ALL');
                setSelectedPriority('ALL');
                setSelectedStatus('ALL');
              }}
              className="text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              Reset Filters ✕
            </button>
          )}
        </div>
      </div>

      {/* Complaints Grid */}
      {filtered.length === 0 ? (
        <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center">
          <p className="text-slate-400 text-sm">No complaints found matching the criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between shadow-xl group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                    {c.id}
                  </span>
                  <div className="flex items-center space-x-1.5">
                    {getPriorityBadge(c.priority)}
                    {getStatusBadge(c.status)}
                  </div>
                </div>

                <h3 className="font-bold text-sm text-white line-clamp-1 group-hover:text-emerald-300 transition-colors">
                  {c.subject}
                </h3>

                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {c.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center space-x-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                    <span className="truncate">{c.location.fullAddress}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedComplaint(c)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center space-x-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  <span>View Details</span>
                </button>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => generateComplaintPDF(c)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                    title="Download Official PDF"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                  </button>

                  <button
                    onClick={() => onNavigateToTracking(c.id)}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold"
                  >
                    Track →
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <ComplaintDetailModal
        complaint={selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        onAdvanceStatus={handleAdvance}
      />

    </div>
  );
};
