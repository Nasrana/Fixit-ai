export type Category =
  | 'Infrastructure'
  | 'Water'
  | 'Electricity'
  | 'Road'
  | 'Transport'
  | 'Healthcare'
  | 'Education'
  | 'Sanitation'
  | 'Safety'
  | 'Environment'
  | 'Public Services'
  | 'Other';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ComplaintStatus =
  | 'SUBMITTED'
  | 'UNDER REVIEW'
  | 'ASSIGNED'
  | 'IN PROGRESS'
  | 'RESOLVED';

export interface LocationInfo {
  area: string;
  street?: string;
  building?: string;
  block?: string;
  landmark?: string;
  fullAddress: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface ProblemAnalysis {
  problem: string;
  category: Category;
  priority: Priority;
  location: string;
  department: string;
  reason: string;
  urgencyScore?: number;
  extractedDetails?: {
    duration?: string;
    hazardPresent?: boolean;
    impactLevel?: string;
  };
}

export interface ActionPlanStep {
  step: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface TimelineEvent {
  id: string;
  status: ComplaintStatus;
  title: string;
  description: string;
  timestamp: string;
  actor: string;
}

export interface Complaint {
  id: string;
  subject: string;
  description: string;
  category: Category;
  priority: Priority;
  status: ComplaintStatus;
  location: LocationInfo;
  department: string;
  suggestedAction: string;
  actionPlan: ActionPlanStep[];
  evidenceName?: string;
  evidenceBase64?: string;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEvent[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: string;
  analysis?: ProblemAnalysis;
  actionPlan?: ActionPlanStep[];
  complaintPreview?: Complaint;
  quickReplies?: string[];
  requiresInput?: 'none' | 'location' | 'evidence' | 'confirm';
  isDemo?: boolean;
}

export interface AIAnalysisRequest {
  message: string;
  conversationHistory: { role: 'user' | 'model'; parts: { text: string }[] }[];
  currentLocation?: Partial<LocationInfo>;
  evidenceName?: string;
  isDemo?: boolean;
}

export interface AIAnalysisResponse {
  reply: string;
  analysis?: ProblemAnalysis;
  actionPlan?: ActionPlanStep[];
  complaintPreview?: Complaint;
  suggestedNextStep?: 'ask_location' | 'ask_details' | 'ask_evidence' | 'ready_to_generate' | 'completed';
  quickReplies?: string[];
  isDemo?: boolean;
}
