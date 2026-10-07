import React from 'react';
import { ProblemAnalysis, Priority } from '../../types';
import { 
  Building2, 
  AlertTriangle, 
  MapPin, 
  ShieldCheck, 
  Info, 
  Sparkles,
  Zap,
  Tag
} from 'lucide-react';

interface AnalysisCardProps {
  analysis: ProblemAnalysis;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ analysis }) => {
  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 glow-rose">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>CRITICAL PRIORITY</span>
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30">
            <Zap className="w-3.5 h-3.5 text-orange-400" />
            <span>HIGH PRIORITY</span>
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>MEDIUM PRIORITY</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>LOW PRIORITY</span>
          </span>
        );
    }
  };

  return (
    <div className="mt-3 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900/95 to-slate-950/95 border border-slate-700/80 shadow-xl relative overflow-hidden">
      {/* Decorative gradient glow top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <h4 className="text-xs sm:text-sm font-bold tracking-wider text-slate-200 uppercase">
            Smart Problem Analysis
          </h4>
        </div>
        {getPriorityBadge(analysis.priority)}
      </div>

      {/* Grid Fields */}
      <div className="mt-3.5 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm">
        
        {/* Problem Identified */}
        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
          <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-medium mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Identified Issue</span>
          </div>
          <p className="font-semibold text-slate-100">{analysis.problem}</p>
        </div>

        {/* Category */}
        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
          <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-medium mb-1">
            <Tag className="w-3.5 h-3.5 text-cyan-400" />
            <span>Category</span>
          </div>
          <p className="font-semibold text-cyan-300">{analysis.category}</p>
        </div>

        {/* Responsible Department */}
        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 md:col-span-2">
          <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-medium mb-1">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Responsible Department</span>
          </div>
          <p className="font-semibold text-emerald-400">{analysis.department}</p>
        </div>

        {/* Location */}
        <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 md:col-span-2">
          <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-medium mb-1">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>Target Location</span>
          </div>
          <p className="font-medium text-slate-200">{analysis.location}</p>
        </div>

      </div>

      {/* Urgency Justification Reason */}
      {analysis.reason && (
        <div className="mt-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-start space-x-2 text-xs">
          <Info className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
          <p className="text-slate-300">
            <span className="font-semibold text-white">Priority Rationale: </span>
            {analysis.reason}
          </p>
        </div>
      )}

    </div>
  );
};
