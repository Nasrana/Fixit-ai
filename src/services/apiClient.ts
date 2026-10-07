import { AIAnalysisResponse, LocationInfo } from '../types';
import { processDemoMessage } from './demoEngine';

// Base API URL:
// In production or standard Vercel deployments, defaults to empty string so relative '/api/...' is used.
// If VITE_API_URL is configured (e.g., https://fixit-backend.vercel.app), it prefixes it.
// NO LOCALHOST IS EVER HARDCODED.
const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export async function checkBackendHealth(): Promise<{
  status: string;
  hasGeminiKey: boolean;
  mode: string;
}> {
  try {
    const res = await fetch(`${API_BASE}/api/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Health check returned non-200');
    const data = await res.json();
    return {
      status: data.status || 'online',
      hasGeminiKey: Boolean(data.ai?.hasGeminiKey),
      mode: data.ai?.mode || 'Intelligent Demo Mode'
    };
  } catch (err) {
    // If backend endpoint is unavailable, gracefully report demo readiness
    return {
      status: 'offline_fallback',
      hasGeminiKey: false,
      mode: 'Client Intelligent Offline Engine'
    };
  }
}

export async function sendChatMessage(
  message: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  location?: LocationInfo,
  evidenceName?: string,
  forceDemo: boolean = false
): Promise<AIAnalysisResponse> {
  // If user activated Demo Mode explicitly, run client-side engine with zero latency
  if (forceDemo) {
    // Short simulated delay to feel natural
    await new Promise(r => setTimeout(r, 650));
    const demo = processDemoMessage(message, history.length, location, evidenceName);
    return {
      ...demo,
      isDemo: true
    };
  }

  try {
    const response = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        conversationHistory: history,
        currentLocation: location,
        evidenceName,
        isDemo: forceDemo
      })
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data: AIAnalysisResponse = await response.json();
    return data;
  } catch (err: any) {
    console.warn('API request failed or offline, falling back seamlessly to demo engine:', err);
    // Automatic graceful fallback so the application never breaks or freezes
    const fallback = processDemoMessage(message, history.length, location, evidenceName);
    return {
      ...fallback,
      isDemo: true
    };
  }
}
