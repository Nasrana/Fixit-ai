import React from 'react';
import { Wrench, ShieldCheck, Heart, Sparkles, Terminal } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'landing' | 'chat' | 'dashboard' | 'history' | 'tracking') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#080C14] text-slate-400 text-xs py-10 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center shadow-md">
                <Wrench className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-white">
                FIXIT <span className="text-emerald-400">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              "From Problem to Action." An intelligent real-world grievance resolution system engineered to triage, prioritize, and dispatch civic & campus complaints with zero localhost dependency.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-emerald-400/90 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Production Ready • Vercel Serverless Ready • Gemini AI Enabled</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Navigation
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button onClick={() => onNavigate('landing')} className="hover:text-emerald-400 transition-colors">
                  Overview & Pipeline
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('chat')} className="hover:text-emerald-400 transition-colors">
                  AI Reporter Intake
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-emerald-400 transition-colors">
                  Institutional Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('history')} className="hover:text-emerald-400 transition-colors">
                  Complaint History
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('tracking')} className="hover:text-emerald-400 transition-colors">
                  Live Ticket Tracking
                </button>
              </li>
            </ul>
          </div>

          {/* Symposium Edition Info */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Symposium Showcase
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Demonstrates natural language extraction, priority detection, 5-step action plan generation, PDF document creation, and simulated status advancement.
            </p>
            <div className="pt-2 text-[10px] text-slate-500 font-mono">
              Build: v1.0.0 (Production)
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <div>
            © 2026 FIXIT AI. Developed for College Symposium Demonstration.
          </div>
          <div className="flex items-center space-x-1">
            <span>Built with precision for real-world impact</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
