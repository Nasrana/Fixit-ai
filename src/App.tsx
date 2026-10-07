import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { ChatInterface } from './components/Chat/ChatInterface';
import { DashboardPage } from './pages/DashboardPage';
import { HistoryPage } from './pages/HistoryPage';
import { TrackingPage } from './pages/TrackingPage';
import { checkBackendHealth } from './services/apiClient';

export type ViewType = 'landing' | 'chat' | 'dashboard' | 'history' | 'tracking';

export function App() {
  const [currentView, setCurrentView] = useState<ViewType>('landing');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true); // Default to Demo Mode on for instant symposium reliability
  const [trackingTargetId, setTrackingTargetId] = useState<string | undefined>();
  const [backendHealth, setBackendHealth] = useState<{
    hasGeminiKey: boolean;
    mode: string;
  }>({ hasGeminiKey: false, mode: 'Checking...' });

  // Sync with browser URL hash for direct links and refresh support
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['landing', 'chat', 'dashboard', 'history', 'tracking'].includes(hash)) {
        setCurrentView(hash as ViewType);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const changeView = (view: ViewType) => {
    setCurrentView(view);
    window.location.hash = view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check health on mount to detect Gemini key presence
  useEffect(() => {
    checkBackendHealth().then((health) => {
      setBackendHealth({
        hasGeminiKey: health.hasGeminiKey,
        mode: health.mode
      });
      // If live Gemini key is present, default demo mode to false; otherwise keep demo mode active
      if (health.hasGeminiKey) {
        setIsDemoMode(false);
      } else {
        setIsDemoMode(true);
      }
    });
  }, []);

  const handleStartReporting = () => {
    changeView('chat');
  };

  const handleTryDemo = () => {
    setIsDemoMode(true);
    changeView('chat');
  };

  const handleNavigateToTracking = (id: string) => {
    setTrackingTargetId(id);
    changeView('tracking');
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col font-sans">
      
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={changeView}
        isDemoMode={isDemoMode}
        setIsDemoMode={setIsDemoMode}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onStartReporting={handleStartReporting}
            onTryDemo={handleTryDemo}
            onViewDashboard={() => changeView('dashboard')}
            onTrackComplaint={() => changeView('tracking')}
          />
        )}

        {currentView === 'chat' && (
          <ChatInterface
            isDemoMode={isDemoMode}
            onNavigateToTracking={handleNavigateToTracking}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardPage
            onOpenReport={() => changeView('chat')}
            onNavigateToTracking={handleNavigateToTracking}
          />
        )}

        {currentView === 'history' && (
          <HistoryPage
            onOpenReport={() => changeView('chat')}
            onNavigateToTracking={handleNavigateToTracking}
          />
        )}

        {currentView === 'tracking' && (
          <TrackingPage
            initialComplaintId={trackingTargetId}
            onOpenReport={() => changeView('chat')}
          />
        )}
      </main>

      {/* Footer */}
      {currentView !== 'chat' && (
        <Footer onNavigate={changeView} />
      )}

    </div>
  );
}

export default App;
