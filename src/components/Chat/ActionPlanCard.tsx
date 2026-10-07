import React from 'react';
import { ActionPlanStep } from '../../types';
import { CheckCircle2, Clock, ListChecks, ArrowRight } from 'lucide-react';

interface ActionPlanCardProps {
  steps: ActionPlanStep[];
}

export const ActionPlanCard: React.FC<ActionPlanCardProps> = ({ steps }) => {
  return (
    <div className="mt-3.5 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900/95 to-slate-950/95 border border-slate-700/80 shadow-xl">
      <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
        <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400">
          <ListChecks className="w-4 h-4" />
        </div>
        <h4 className="text-xs sm:text-sm font-bold tracking-wider text-slate-200 uppercase">
          AI Action Plan & Resolution Roadmap
        </h4>
      </div>

      <div className="mt-4 space-y-3">
        {steps.map((step) => {
          const isDone = step.status === 'completed';
          const isInProgress = step.status === 'in_progress';

          return (
            <div
              key={step.step}
              className={`p-3 rounded-xl border transition-all flex items-start space-x-3 ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200'
                  : isInProgress
                  ? 'bg-cyan-950/30 border-cyan-500/40 text-white shadow-sm'
                  : 'bg-slate-800/30 border-slate-800/80 text-slate-400'
              }`}
            >
              {/* Step indicator */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                  isDone
                    ? 'bg-emerald-500 text-white'
                    : isInProgress
                    ? 'bg-cyan-500 text-slate-950 animate-pulse'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.step}
              </div>

              {/* Step details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h5 className={`text-xs sm:text-sm font-semibold ${isDone ? 'text-emerald-300' : isInProgress ? 'text-cyan-300' : 'text-slate-300'}`}>
                    {step.title}
                  </h5>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    isDone
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : isInProgress
                      ? 'bg-cyan-500/20 text-cyan-300 flex items-center space-x-1'
                      : 'bg-slate-800 text-slate-500'
                  }`}>
                    {isInProgress && <Clock className="w-2.5 h-2.5 inline mr-1" />}
                    {step.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
