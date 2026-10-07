import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

interface TypingIndicatorProps {
  statusText?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  statusText = 'FIXIT AI is analyzing your problem...'
}) => {
  return (
    <div className="flex items-start space-x-3 mb-4 animate-fade-in">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-500/20">
        <Bot className="w-4 h-4" />
      </div>

      <div className="p-3.5 rounded-2xl rounded-tl-sm bg-slate-900 border border-slate-800 text-slate-300 shadow-md flex items-center space-x-3">
        <div className="flex space-x-1.5 items-center">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
        </div>
        <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
          <span>{statusText}</span>
        </div>
      </div>
    </div>
  );
};
