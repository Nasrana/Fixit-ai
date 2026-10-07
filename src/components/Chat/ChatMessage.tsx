import React from 'react';
import { ChatMessage as ChatMessageType, Complaint } from '../../types';
import { AnalysisCard } from './AnalysisCard';
import { ActionPlanCard } from './ActionPlanCard';
import { ComplaintCard } from './ComplaintCard';
import { Bot, User, Sparkles, AlertCircle } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
  onQuickReplyClick: (reply: string) => void;
  onSubmitComplaint: (complaint: Complaint) => void;
  onResetChat: () => void;
  submittedComplaintIds: Set<string>;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onQuickReplyClick,
  onSubmitComplaint,
  onResetChat,
  submittedComplaintIds
}) => {
  const isUser = message.sender === 'user';
  const isSystem = message.sender === 'system';

  // Format simple markdown: **bold** and bullet points
  const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="text-emerald-300 font-semibold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const isComplaintSubmitted = message.complaintPreview 
    ? submittedComplaintIds.has(message.complaintPreview.id) 
    : false;

  return (
    <div className={`flex flex-col mb-5 ${isUser ? 'items-end' : 'items-start'} animate-fade-in`}>
      
      {/* Sender Header & Avatar */}
      <div className={`flex items-center space-x-2 mb-1.5 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div
          className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs shadow-md ${
            isUser
              ? 'bg-gradient-to-tr from-cyan-600 to-blue-500 text-white'
              : 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white'
          }`}
        >
          {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
        </div>
        <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-medium">
          <span>{isUser ? 'You' : 'FIXIT AI Assistant'}</span>
          <span>•</span>
          <span>{message.timestamp}</span>
          {message.isDemo && (
            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Demo
            </span>
          )}
        </div>
      </div>

      {/* Message Bubble */}
      <div
        className={`max-w-[92%] sm:max-w-[85%] rounded-2xl p-4 sm:p-4.5 text-xs sm:text-sm leading-relaxed shadow-lg ${
          isUser
            ? 'rounded-tr-sm bg-gradient-to-r from-cyan-900/60 to-blue-900/60 border border-cyan-500/30 text-white'
            : isSystem
            ? 'bg-amber-950/20 border border-amber-500/30 text-amber-200'
            : 'rounded-tl-sm bg-slate-900/90 border border-slate-800 text-slate-200'
        }`}
      >
        <div className="whitespace-pre-line">
          {formatText(message.text)}
        </div>

        {/* Embedded Analysis Card */}
        {message.analysis && (
          <AnalysisCard analysis={message.analysis} />
        )}

        {/* Embedded Action Plan Card */}
        {message.actionPlan && message.actionPlan.length > 0 && (
          <ActionPlanCard steps={message.actionPlan} />
        )}

        {/* Embedded Complaint Card */}
        {message.complaintPreview && (
          <ComplaintCard
            complaint={message.complaintPreview}
            onSubmit={onSubmitComplaint}
            onReset={onResetChat}
            isSubmitted={isComplaintSubmitted}
          />
        )}
      </div>

      {/* Quick Suggestion Reply Pills */}
      {message.quickReplies && message.quickReplies.length > 0 && !isComplaintSubmitted && (
        <div className="mt-2.5 flex flex-wrap gap-2 max-w-full">
          {message.quickReplies.map((reply, idx) => (
            <button
              key={idx}
              onClick={() => onQuickReplyClick(reply)}
              className="px-3 py-1.5 rounded-full bg-slate-800/80 hover:bg-emerald-950/60 border border-slate-700 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-300 text-xs font-medium transition-all shadow-sm flex items-center space-x-1.5"
            >
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>{reply}</span>
            </button>
          ))}
        </div>
      )}

    </div>
  );
};
