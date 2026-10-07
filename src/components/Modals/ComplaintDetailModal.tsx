import React, { useState } from 'react';
import { Complaint } from '../../types';
import { generateComplaintPDF } from '../../utils/pdfGenerator';
import { 
  X, 
  MapPin, 
  Building2, 
  Clock, 
  CheckCircle, 
  Copy, 
  Check, 
  Download, 
  AlertTriangle,
  ShieldCheck,
  Zap,
  Tag,
  Camera
} from 'lucide-react';

interface ComplaintDetailModalProps {
  complaint: Complaint | null;
  onClose: () => void;
  onAdvanceStatus?: (id: string) => void;
}

export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({
  complaint,
  onClose,
  onAdvanceStatus
}) => {
  const [copied, setCopied] = useState(false);

  if (!complaint) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(complaint.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'RESOLVED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'IN PROGRESS':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
      case 'ASSIGNED':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      default:
        return 'bg-slate-700/50 text-slate-300 border-slate-600';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center space-x-3">
            <span className="font-mono text-sm sm:text-base font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/30">
              {complaint.id}
            </span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${getStatusStyle(complaint.status)}`}>
              {complaint.status}
            </span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${getPriorityStyle(complaint.priority)}`}>
              {complaint.priority}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          
          {/* Subject */}
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">
              {complaint.subject}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Registered on {new Date(complaint.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Description */}
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Grievance Narrative
            </h4>
            <p className="text-slate-200 leading-relaxed">
              {complaint.description}
            </p>
          </div>

          {/* Location & Department */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
              <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-semibold mb-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Location</span>
              </div>
              <p className="font-medium text-slate-200">{complaint.location.fullAddress}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800">
              <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-semibold mb-1">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Department</span>
              </div>
              <p className="font-medium text-emerald-300">{complaint.department}</p>
            </div>
          </div>

          {/* Attached Evidence Photo */}
          {(complaint.evidenceBase64 || complaint.evidenceName) && (
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
              <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-semibold mb-2">
                <Camera className="w-3.5 h-3.5 text-teal-400" />
                <span>Attached Photographic Evidence</span>
              </div>
              {complaint.evidenceBase64 ? (
                <img
                  src={complaint.evidenceBase64}
                  alt="Incident evidence"
                  className="max-h-56 rounded-xl border border-slate-700 object-cover"
                />
              ) : (
                <p className="text-xs text-slate-300">File: {complaint.evidenceName}</p>
              )}
            </div>
          )}

          {/* 5-Step Action Plan */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
              Action Plan Execution
            </h4>
            <div className="space-y-2">
              {complaint.actionPlan.map((step) => (
                <div
                  key={step.step}
                  className="p-2.5 rounded-lg bg-slate-800/30 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      step.status === 'completed' ? 'bg-emerald-500 text-white' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {step.step}
                    </span>
                    <span className="font-medium text-slate-200">{step.title}</span>
                  </div>
                  <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full ${
                    step.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {step.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 border-t border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyId}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium flex items-center space-x-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied ID' : 'Copy ID'}</span>
            </button>

            <button
              onClick={() => generateComplaintPDF(complaint)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Download PDF</span>
            </button>
          </div>

          {onAdvanceStatus && complaint.status !== 'RESOLVED' && (
            <button
              onClick={() => onAdvanceStatus(complaint.id)}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20"
            >
              Simulate Next Status Step →
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
