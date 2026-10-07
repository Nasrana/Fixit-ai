import React, { useState } from 'react';
import { Complaint } from '../../types';
import { generateComplaintPDF } from '../../utils/pdfGenerator';
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  SendHorizontal, 
  RefreshCw,
  Building,
  MapPin,
  AlertCircle,
  Lightbulb
} from 'lucide-react';

interface ComplaintCardProps {
  complaint: Complaint;
  onSubmit: (complaint: Complaint) => void;
  onReset: () => void;
  isSubmitted?: boolean;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({
  complaint,
  onSubmit,
  onReset,
  isSubmitted = false
}) => {
  const [copied, setCopied] = useState(false);

  const formattedComplaintText = `OFFICIAL COMPLAINT (FIXIT AI)
=========================================
Subject: ${complaint.subject}
Category: ${complaint.category}
Priority: ${complaint.priority}
Responsible Department: ${complaint.department}
Location: ${complaint.location.fullAddress}

Description:
${complaint.description}

Suggested Immediate Action:
${complaint.suggestedAction}

Reference ID: ${complaint.id}
Date: ${new Date(complaint.createdAt).toLocaleString()}
=========================================`;

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedComplaintText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleDownload = () => {
    generateComplaintPDF(complaint);
  };

  return (
    <div className="mt-4 p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-[#0d1424] border border-emerald-500/30 shadow-2xl relative">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
              Official Grievance Document
            </h3>
            <p className="text-xs text-slate-400">
              Generated automatically by FIXIT AI Intake Engine
            </p>
          </div>
        </div>

        {/* Status Tag */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-800 text-emerald-400 border border-slate-700">
            {complaint.id}
          </span>
          {isSubmitted && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1">
              <Check className="w-3.5 h-3.5" />
              <span>SUBMITTED</span>
            </span>
          )}
        </div>
      </div>

      {/* Main Content Body */}
      <div className="mt-5 space-y-4 text-xs sm:text-sm">
        
        {/* Subject */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Subject
          </span>
          <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-800 text-slate-100 font-semibold">
            {complaint.subject}
          </div>
        </div>

        {/* Narrative Description */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Formal Grievance Description
          </span>
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 text-slate-200 leading-relaxed">
            {complaint.description}
          </div>
        </div>

        {/* Location & Department Duo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-semibold mb-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>Location</span>
            </div>
            <p className="font-medium text-slate-200">{complaint.location.fullAddress}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800">
            <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-semibold mb-1">
              <Building className="w-3.5 h-3.5 text-emerald-400" />
              <span>Responsible Department</span>
            </div>
            <p className="font-medium text-emerald-300">{complaint.department}</p>
          </div>
        </div>

        {/* Suggested Action */}
        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-start space-x-2.5">
          <Lightbulb className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
          <div>
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider block">
              Suggested Immediate Action
            </span>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              {complaint.suggestedAction}
            </p>
          </div>
        </div>

      </div>

      {/* Action Buttons Toolbar */}
      <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
        
        <div className="flex items-center space-x-2">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center space-x-1.5 transition-all"
            title="Copy Complaint Text"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Download PDF Button */}
          <button
            onClick={handleDownload}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center space-x-1.5 transition-all"
            title="Download Official Complaint PDF"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Download PDF</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {/* Start New Button */}
          <button
            onClick={onReset}
            className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white text-xs font-medium flex items-center space-x-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>New Complaint</span>
          </button>

          {/* Submit Complaint Button */}
          {!isSubmitted && (
            <button
              onClick={() => onSubmit(complaint)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-950/40 flex items-center space-x-2 transition-all hover:scale-102"
            >
              <SendHorizontal className="w-4 h-4" />
              <span>Submit Complaint</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
