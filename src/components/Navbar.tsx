import React, { useState } from 'react';
import { 
  Home,
  Sparkles, 
  LayoutDashboard, 
  MessageSquarePlus, 
  History, 
  Search, 
  Menu, 
  X, 
  Wrench
} from 'lucide-react';

interface NavbarProps {
  currentView: 'landing' | 'chat' | 'dashboard' | 'history' | 'tracking';
  setCurrentView: (view: 'landing' | 'chat' | 'dashboard' | 'history' | 'tracking') => void;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
}

interface NavItem {
  id: 'landing' | 'chat' | 'dashboard' | 'history' | 'tracking';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  isDemoMode,
  setIsDemoMode
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    { id: 'landing', label: 'Home', icon: Home },
    { id: 'chat', label: 'AI Reporter', icon: MessageSquarePlus, badge: 'Live AI' },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'history', label: 'Grievance History', icon: History },
    { id: 'tracking', label: 'Track Status', icon: Search },
  ];

  const handleNavClick = (view: typeof currentView) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div 
            onClick={() => handleNavClick('landing')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <Wrench className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  FIXIT <span className="text-emerald-400">AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  v1.0
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 font-medium tracking-wide hidden sm:block">
                From Problem to Action
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3 py-2 rounded-lg text-xs lg:text-sm font-medium transition-all flex items-center space-x-1.5 ${
                    isActive
                      ? 'text-white bg-slate-800/90 shadow-inner border border-slate-700/50'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Demo Toggle & Report Button */}
          <div className="hidden sm:flex items-center space-x-3">
            {/* Demo Mode Toggle Switch */}
            <div 
              onClick={() => setIsDemoMode(!isDemoMode)}
              className={`cursor-pointer px-3 py-1.5 rounded-full flex items-center space-x-2 border transition-all text-xs font-medium ${
                isDemoMode
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-sm'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
              }`}
              title="Toggle Demo Simulation Engine"
            >
              <div className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-amber-400 animate-pulse' : 'bg-slate-500'}`} />
              <span>Demo Mode:</span>
              <span className={`font-semibold ${isDemoMode ? 'text-amber-300' : 'text-slate-400'}`}>
                {isDemoMode ? 'ON' : 'OFF'}
              </span>
            </div>

            {/* Quick Report CTA */}
            {currentView !== 'chat' && (
              <button
                onClick={() => handleNavClick('chat')}
                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-medium text-xs shadow-md shadow-emerald-900/30 flex items-center space-x-1.5 transition-all hover:scale-102"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>New Complaint</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setIsDemoMode(!isDemoMode)}
              className={`p-1.5 rounded-lg text-xs border ${
                isDemoMode
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
            >
              Demo: {isDemoMode ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0B0F19]/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4 text-emerald-400" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-800 flex flex-col space-y-2">
            <button
              onClick={() => handleNavClick('chat')}
              className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-sm flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Report a Problem Now</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
