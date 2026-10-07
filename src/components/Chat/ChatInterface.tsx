import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  ChatMessage as ChatMessageType, 
  Complaint, 
  LocationInfo, 
  ProblemAnalysis 
} from '../../types';
import { sendChatMessage } from '../../services/apiClient';
import { saveComplaint } from '../../services/storageService';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { EvidenceUploader } from './EvidenceUploader';
import { LocationPicker } from './LocationPicker';
import { 
  Send, 
  Trash2, 
  RotateCcw, 
  MapPin, 
  Camera, 
  Sparkles, 
  AlertCircle,
  HelpCircle,
  CheckCircle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface ChatInterfaceProps {
  isDemoMode: boolean;
  onNavigateToTracking?: (id: string) => void;
}

const STARTER_PROMPTS = [
  'The streetlight near my hostel has been broken for 5 days.',
  'The water tap in our college block is not working.',
  'There is a large pothole near my house.',
  'The classroom fan is not working and making sparks.'
];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  isDemoMode,
  onNavigateToTracking
}) => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Attachment states
  const [currentLocation, setCurrentLocation] = useState<LocationInfo | undefined>();
  const [evidenceBase64, setEvidenceBase64] = useState<string | undefined>();
  const [evidenceName, setEvidenceName] = useState<string | undefined>();
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showEvidencePicker, setShowEvidencePicker] = useState(false);

  // Submitted IDs tracking
  const [submittedIds, setSubmittedIds] = useState<Set<string>>(new Set());
  const [justSubmittedComplaint, setJustSubmittedComplaint] = useState<Complaint | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-1',
          sender: 'ai',
          text: `Welcome to **FIXIT AI** ("From Problem to Action").\n\nI turn real-world civic and campus grievances into prioritized action plans and official trackable complaints.\n\nDescribe any issue you're facing, or click one of the suggested prompts below:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickReplies: STARTER_PROMPTS,
          isDemo: isDemoMode
        }
      ]);
    }
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    setErrorNotice(null);
    setInputText('');

    const userMessage: ChatMessageType = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Build conversation history for context
      const history = messages
        .filter((m) => m.sender !== 'system')
        .map((m) => ({
          role: m.sender === 'user' ? ('user' as const) : ('model' as const),
          parts: [{ text: m.text }]
        }));

      const res = await sendChatMessage(
        text,
        history,
        currentLocation,
        evidenceName,
        isDemoMode
      );

      // If response generated complaint preview and we have evidence, attach it
      if (res.complaintPreview) {
        if (evidenceBase64) {
          res.complaintPreview.evidenceBase64 = evidenceBase64;
          res.complaintPreview.evidenceName = evidenceName;
        }
        if (currentLocation) {
          res.complaintPreview.location = currentLocation;
        }
      }

      const aiMessage: ChatMessageType = {
        id: `msg-ai-${Date.now()}`,
        sender: 'ai',
        text: res.reply || 'I have analyzed your problem.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        analysis: res.analysis,
        actionPlan: res.actionPlan,
        complaintPreview: res.complaintPreview,
        quickReplies: res.quickReplies,
        isDemo: res.isDemo
      };

      setMessages((prev) => [...prev, aiMessage]);

      // If location is requested, prompt location picker
      if (res.suggestedNextStep === 'ask_location' && !currentLocation) {
        setShowLocationPicker(true);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setErrorNotice(
        'Communication with AI server encountered an issue. Automatically switching to Intelligent Offline Mode for uninterrupted operation.'
      );

      // Graceful fallback response
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'ai',
          text: `I've switched to the **Intelligent Offline Engine** so your complaint isn't interrupted. Please provide the exact location or choose a suggested action.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickReplies: ['Hostel Zone, Block B', 'Academic Quadrangle', 'Main Campus Gate'],
          isDemo: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    if (confirm('Clear the current conversation and start fresh?')) {
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          sender: 'ai',
          text: `Conversation cleared. Describe a real-world problem to begin:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickReplies: STARTER_PROMPTS,
          isDemo: isDemoMode
        }
      ]);
      setCurrentLocation(undefined);
      setEvidenceBase64(undefined);
      setEvidenceName(undefined);
      setShowLocationPicker(false);
      setShowEvidencePicker(false);
    }
  };

  const handleSubmitComplaint = (complaint: Complaint) => {
    // Save to storage
    saveComplaint(complaint);
    setSubmittedIds((prev) => new Set([...prev, complaint.id]));
    setJustSubmittedComplaint(complaint);

    // Fire celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {
      // ignore
    }

    // Add confirmation message to chat
    const confirmMsg: ChatMessageType = {
      id: `submit-confirm-${Date.now()}`,
      sender: 'ai',
      text: `🎉 **Complaint Submitted Successfully!**\n\nYour grievance has been officially registered with Tracking ID: \`${complaint.id}\`.\nIt has been dispatched to **${complaint.department}** with **${complaint.priority} priority**.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickReplies: ['Track this Complaint Now', 'Report another issue']
    };

    setMessages((prev) => [...prev, confirmMsg]);
  };

  const handleQuickReply = (reply: string) => {
    if (reply === 'Track this Complaint Now' && justSubmittedComplaint && onNavigateToTracking) {
      onNavigateToTracking(justSubmittedComplaint.id);
      return;
    }
    if (reply === 'Report another issue' || reply === 'Start a New Complaint') {
      handleClearChat();
      return;
    }
    if (reply === 'Submit Complaint Now') {
      // Find latest complaint in messages
      const latestMsgWithComplaint = [...messages].reverse().find((m) => m.complaintPreview);
      if (latestMsgWithComplaint && latestMsgWithComplaint.complaintPreview) {
        handleSubmitComplaint(latestMsgWithComplaint.complaintPreview);
        return;
      }
    }
    if (reply === 'Use my GPS location') {
      setShowLocationPicker(true);
      return;
    }
    handleSendMessage(reply);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
      
      {/* Top Header / Mode Banner */}
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-300">Intelligent Grievance Intake</span>
          {isDemoMode ? (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Demo Simulation Mode
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Gemini AI Connected
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {currentLocation && (
            <span className="hidden sm:inline-flex items-center space-x-1 text-slate-400">
              <MapPin className="w-3 h-3 text-rose-400" />
              <span className="truncate max-w-[150px]">{currentLocation.area}</span>
            </span>
          )}
          {evidenceName && (
            <span className="hidden sm:inline-flex items-center space-x-1 text-slate-400">
              <Camera className="w-3 h-3 text-teal-400" />
              <span className="truncate max-w-[120px]">{evidenceName}</span>
            </span>
          )}
          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Reset Conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Error alert if any */}
      {errorNotice && (
        <div className="mb-2 p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{errorNotice}</span>
          </div>
          <button
            onClick={() => setErrorNotice(null)}
            className="text-amber-400 hover:text-white font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto pr-1 sm:pr-2 space-y-1">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            onQuickReplyClick={handleQuickReply}
            onSubmitComplaint={handleSubmitComplaint}
            onResetChat={handleClearChat}
            submittedComplaintIds={submittedIds}
          />
        ))}

        {isLoading && <TypingIndicator />}

        {/* Location Picker Inline Modal */}
        {showLocationPicker && (
          <div className="animate-fade-in my-2">
            <LocationPicker
              initialLocation={currentLocation}
              onLocationSelected={(loc) => {
                setCurrentLocation(loc);
                setShowLocationPicker(false);
                handleSendMessage(`Location confirmed: ${loc.fullAddress}`);
              }}
            />
          </div>
        )}

        {/* Evidence Uploader Inline */}
        {showEvidencePicker && (
          <div className="animate-fade-in my-2 p-4 rounded-2xl bg-slate-900 border border-slate-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300">
                Attach Photographic Proof / Incident Evidence
              </span>
              <button
                onClick={() => setShowEvidencePicker(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close ✕
              </button>
            </div>
            <EvidenceUploader
              evidenceBase64={evidenceBase64}
              evidenceName={evidenceName}
              onImageSelected={(b64, name) => {
                setEvidenceBase64(b64);
                setEvidenceName(name);
                setShowEvidencePicker(false);
                handleSendMessage(`I have attached incident photo evidence: "${name}".`);
              }}
              onClear={() => {
                setEvidenceBase64(undefined);
                setEvidenceName(undefined);
              }}
            />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar & Controls */}
      <div className="mt-2 pt-2 border-t border-slate-800">
        
        {/* Attachment Pill Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <button
            type="button"
            onClick={() => setShowLocationPicker(!showLocationPicker)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all border ${
              currentLocation
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>{currentLocation ? `Location: ${currentLocation.area}` : 'Add Location'}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowEvidencePicker(!showEvidencePicker)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all border ${
              evidenceBase64
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-300'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-teal-400" />
            <span>{evidenceName ? `Photo: ${evidenceName}` : 'Add Photo'}</span>
          </button>

          <span className="text-[11px] text-slate-500 hidden sm:inline ml-auto">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400 font-mono">Enter ↵</kbd> to send
          </span>
        </div>

        {/* Text Input Row */}
        <div className="relative flex items-end rounded-2xl bg-slate-900 border border-slate-700/80 focus-within:border-emerald-500 shadow-xl transition-all">
          <textarea
            ref={inputRef}
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe the issue (e.g. Broken streetlight near hostel for 5 days, water tap leakage...)"
            className="w-full py-3.5 pl-4 pr-14 rounded-2xl bg-transparent text-sm text-slate-100 placeholder-slate-500 resize-none focus:outline-none max-h-32 min-h-[48px]"
          />

          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            className={`absolute right-2 bottom-2 p-2.5 rounded-xl transition-all ${
              inputText.trim() && !isLoading
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/30'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed'
            }`}
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Success Modal upon Submitting */}
      {justSubmittedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="p-6 max-w-md w-full rounded-2xl bg-slate-900 border border-emerald-500/40 shadow-2xl relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-bold text-center text-white">
              Grievance Registered Successfully!
            </h3>
            <p className="text-xs text-slate-400 text-center mt-1">
              Your issue has been logged into the live institutional complaint ledger.
            </p>

            <div className="mt-4 p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Official Tracking ID
              </span>
              <span className="text-xl font-mono font-extrabold text-emerald-400 tracking-wider">
                {justSubmittedComplaint.id}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setJustSubmittedComplaint(null)}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
              >
                Close & Continue
              </button>

              <button
                onClick={() => {
                  const id = justSubmittedComplaint.id;
                  setJustSubmittedComplaint(null);
                  if (onNavigateToTracking) {
                    onNavigateToTracking(id);
                  }
                }}
                className="py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-500/20 transition-all"
              >
                <span>Track Live</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
