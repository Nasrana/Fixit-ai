import { Category, Priority, ProblemAnalysis, ActionPlanStep, Complaint, LocationInfo } from '../types';

export interface DemoConversationState {
  problem?: string;
  category?: Category;
  priority?: Priority;
  location?: LocationInfo;
  department?: string;
  duration?: string;
  step: 'initial' | 'awaiting_location' | 'awaiting_evidence' | 'ready';
}

const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  Infrastructure: ['building', 'wall', 'roof', 'pillar', 'gate', 'door', 'window', 'bench', 'campus facility', 'hostel facility'],
  Water: ['tap', 'pipe', 'leak', 'leakage', 'drain', 'drainage', 'water', 'flood', 'sewage', 'tank', 'drinking water'],
  Electricity: ['streetlight', 'light', 'lamp', 'power', 'wire', 'fan', 'switch', 'spark', 'blackout', 'generator', 'fuse', 'ac', 'air conditioner'],
  Road: ['pothole', 'road', 'street', 'crack', 'pavement', 'asphalt', 'sidewalk', 'speed breaker', 'divider'],
  Transport: ['bus', 'parking', 'traffic', 'shuttle', 'vehicle', 'bicycle', 'transit'],
  Healthcare: ['hospital', 'clinic', 'first aid', 'ambulance', 'medic', 'doctor', 'nurse', 'waiting area', 'patient', 'emergency'],
  Education: ['classroom', 'projector', 'blackboard', 'lab', 'laboratory', 'library', 'desk', 'podium', 'speaker', 'exam hall'],
  Sanitation: ['garbage', 'trash', 'dustbin', 'waste', 'smell', 'odor', 'toilet', 'restroom', 'cleaning', 'litter'],
  Safety: ['hazard', 'security', 'cctv', 'theft', 'guard', 'fire', 'dark', 'harassment', 'threat', 'danger'],
  Environment: ['tree', 'branch', 'pollution', 'smoke', 'animal', 'garden', 'chemical', 'noise'],
  'Public Services': ['post', 'counter', 'queue', 'clerk', 'office', 'service desk', 'helpdesk', 'administrative'],
  Other: ['general', 'miscellaneous', 'other']
};

const DEPARTMENT_MAP: Record<Category, string> = {
  Infrastructure: 'Civil Works & Infrastructure Directorate',
  Water: 'Water Works & Plumbing Division',
  Electricity: 'Electrical Maintenance & Power Grid Unit',
  Road: 'Municipal Roadways & Civil Engineering Department',
  Transport: 'Campus Fleet & Transit Logistics',
  Healthcare: 'Health Services & Emergency Medical Unit',
  Education: 'Academic Facilities & Lab Support Unit',
  Sanitation: 'Sanitation, Waste & Hygiene Management',
  Safety: 'Campus Security & Disaster Management Office',
  Environment: 'Horticulture & Environmental Services',
  'Public Services': 'Citizen & Student Services Helpdesk',
  Other: 'General Administrative Services'
};

export function detectCategory(text: string): Category {
  const lower = text.toLowerCase();
  let bestMatch: Category = 'Other';
  let maxScore = 0;

  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS) as [Category, string[]][]) {
    let score = 0;
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        score += 2;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestMatch = cat;
    }
  }

  // Common contextual overrides
  if (lower.includes('streetlight') || lower.includes('street light')) {
    return 'Electricity';
  }
  if (lower.includes('pothole')) {
    return 'Road';
  }
  if (lower.includes('tap') || lower.includes('water')) {
    return 'Water';
  }
  if (lower.includes('fan') || lower.includes('ac ') || lower.includes('projector')) {
    return lower.includes('classroom') ? 'Education' : 'Electricity';
  }

  return bestMatch;
}

export function detectPriority(text: string, category: Category): Priority {
  const lower = text.toLowerCase();

  // Critical indicators: immediate physical threat or life safety
  if (
    lower.includes('spark') ||
    lower.includes('live wire') ||
    lower.includes('fire') ||
    lower.includes('short circuit') ||
    lower.includes('emergency') ||
    lower.includes('flood') ||
    lower.includes('gas leak') ||
    lower.includes('collapse') ||
    lower.includes('open manhole')
  ) {
    return 'CRITICAL';
  }

  // High priority indicators: safety hazard, long outage, darkness
  if (
    lower.includes('streetlight') ||
    lower.includes('dark') ||
    lower.includes('night') ||
    lower.includes('5 days') ||
    lower.includes('week') ||
    lower.includes('severe') ||
    lower.includes('danger') ||
    lower.includes('pothole') ||
    lower.includes('no water') ||
    category === 'Safety' ||
    category === 'Healthcare'
  ) {
    return 'HIGH';
  }

  // Medium priority: standard functional issues
  if (
    lower.includes('broken') ||
    lower.includes('leak') ||
    lower.includes('not working') ||
    lower.includes('damage') ||
    lower.includes('overflow')
  ) {
    return 'MEDIUM';
  }

  return 'LOW';
}

export function extractLocationFromText(text: string): LocationInfo | null {
  const lower = text.toLowerCase();
  
  // Patterns for hostels, blocks, roads, landmarks
  let area = '';
  let landmark = '';
  let building = '';
  let street = '';

  if (lower.includes('hostel')) {
    area = 'Hostel Zone';
    landmark = 'Near Student Residence';
    if (lower.includes('boys hostel')) area = 'Boys Hostel Complex';
    if (lower.includes('girls hostel')) area = 'Girls Hostel Complex';
  } else if (lower.includes('college') || lower.includes('campus')) {
    area = 'Main Campus';
  }

  if (lower.includes('block')) {
    const blockMatch = text.match(/block\s*([a-zA-Z0-9]+)/i);
    building = blockMatch ? `Block ${blockMatch[1]}` : 'Academic Block';
  }

  if (lower.includes('road')) {
    const roadMatch = text.match(/([a-zA-Z\s]+road)/i);
    street = roadMatch ? roadMatch[1].trim() : 'Campus Main Road';
  }

  if (lower.includes('gate')) {
    landmark = 'Near Main Entrance Gate';
  }

  if (area || building || street || landmark) {
    const parts = [building, street, landmark, area].filter(Boolean);
    return {
      area: area || 'Campus / City Area',
      street: street || undefined,
      building: building || undefined,
      landmark: landmark || undefined,
      fullAddress: parts.join(', ') || 'Reported Incident Location'
    };
  }

  return null;
}

export function generateActionPlan(
  problem: string,
  category: Category,
  priority: Priority,
  department: string,
  location: string
): ActionPlanStep[] {
  return [
    {
      step: 1,
      title: 'Geographic & Visual Verification',
      description: `Verify the exact location coordinates at ${location} and log site access conditions.`,
      status: 'completed'
    },
    {
      step: 2,
      title: 'Evidence & Severity Logging',
      description: `Document photographic evidence, hazard factors, and mark urgency level as ${priority}.`,
      status: 'completed'
    },
    {
      step: 3,
      title: 'Departmental Dispatch & Escalation',
      description: `Transmit official grievance ticket directly to the ${department} duty officer queue.`,
      status: 'in_progress'
    },
    {
      step: 4,
      title: 'On-Site Field Assessment & Repair',
      description: `Field technician dispatched with replacement components to inspect and resolve: "${problem}".`,
      status: 'pending'
    },
    {
      step: 5,
      title: 'Resolution Verification & Citizen Close-Out',
      description: 'Supervisory sign-off with photographic post-repair proof and automated notification to reporter.',
      status: 'pending'
    }
  ];
}

export function generateFormalComplaint(
  id: string,
  problem: string,
  category: Category,
  priority: Priority,
  location: LocationInfo,
  department: string,
  evidenceName?: string
): Complaint {
  const timestamp = new Date().toISOString();

  // Create subject & formal description
  const cleanProblem = problem.replace(/^(there is a|the|our)\s+/i, '').trim();
  const subject = `Urgent Resolution Required: ${cleanProblem.charAt(0).toUpperCase() + cleanProblem.slice(1)}`;
  
  const suggestedAction =
    category === 'Electricity'
      ? 'Inspect electrical lines, replace faulty lighting/fixtures, and restore illumination safely.'
      : category === 'Water'
      ? 'Shut off isolating valve, replace damaged gasket/piping, and restore uncompromised water supply.'
      : category === 'Road'
      ? 'Deploy road repair crew with cold mix asphalt compaction and place temporary safety barriers.'
      : category === 'Sanitation'
      ? 'Dispatch urgent sanitation team, clear debris/waste receptacles, and disinfect area.'
      : `Dispatch maintenance crew to inspect and repair ${cleanProblem}.`;

  const description = `This official grievance is filed regarding: "${problem}". The issue is located at ${location.fullAddress}. It is classified under ${category} with a ${priority} priority level requiring swift mitigation by the ${department}. Continuous non-resolution creates substantial inconvenience and safety hazards for occupants and pedestrians.`;

  return {
    id,
    subject,
    description,
    category,
    priority,
    status: 'SUBMITTED',
    location,
    department,
    suggestedAction,
    actionPlan: generateActionPlan(problem, category, priority, department, location.fullAddress),
    evidenceName,
    createdAt: timestamp,
    updatedAt: timestamp,
    timeline: [
      {
        id: `tl-1`,
        status: 'SUBMITTED',
        title: 'Grievance Registered',
        description: 'Problem successfully analyzed, verified, and assigned tracking ID.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actor: 'FIXIT AI Dispatch Engine'
      }
    ]
  };
}

// Intelligent conversational responder in Demo Mode
export function processDemoMessage(
  userText: string,
  historyCount: number,
  existingLocation?: LocationInfo,
  existingEvidence?: string
): {
  reply: string;
  analysis?: ProblemAnalysis;
  actionPlan?: ActionPlanStep[];
  complaintPreview?: Complaint;
  suggestedNextStep?: 'ask_location' | 'ask_details' | 'ask_evidence' | 'ready_to_generate' | 'completed';
  quickReplies?: string[];
} {
  const lower = userText.toLowerCase();

  // If user is just greeting
  if (/^(hi|hello|hey|start|help|good morning|good afternoon)/i.test(userText.trim()) && userText.length < 20) {
    return {
      reply: `Hello! I'm **FIXIT AI** — your intelligent civic and campus grievance assistant. Please describe the problem you're facing (e.g. broken streetlight, water leakage, damaged road, power cut, or facility issue), and I'll analyze it and turn it into an actionable solution.`,
      quickReplies: [
        'Broken streetlight near hostel for 5 days',
        'Water tap leaking in Academic Block 3',
        'Large pothole at campus main entrance',
        'Classroom projector and fan not working'
      ],
      suggestedNextStep: 'ask_details'
    };
  }

  // Detect category & priority
  const category = detectCategory(userText);
  const priority = detectPriority(userText, category);
  const department = DEPARTMENT_MAP[category];

  // Try extracting location from this or previous inputs
  const detectedLoc = extractLocationFromText(userText) || existingLocation;

  // Reason for priority
  let reason = '';
  if (priority === 'CRITICAL') {
    reason = 'The issue involves active hazards, electrical sparking, or severe safety risks requiring immediate intervention.';
  } else if (priority === 'HIGH') {
    reason = category === 'Electricity'
      ? 'The issue affects night-time visibility and public safety in high-footfall areas.'
      : category === 'Road'
      ? 'The road condition poses significant collision risk to two-wheelers and pedestrians.'
      : 'Prolonged breakdown significantly disrupts daily living conditions and sanitation.';
  } else if (priority === 'MEDIUM') {
    reason = 'Functional impairment causing ongoing inconvenience and potential resource wastage.';
  } else {
    reason = 'Non-critical maintenance request scheduled for standard routine inspection.';
  }

  // Step 1: User just described a problem without explicit location
  if (!detectedLoc && historyCount <= 1) {
    const analysis: ProblemAnalysis = {
      problem: userText,
      category,
      priority,
      location: 'Location not specified yet',
      department,
      reason
    };

    return {
      reply: `I have analyzed your report. I've classified this as a **${priority} priority** issue under **${category}**, which falls under the **${department}**.\n\nTo file an official complaint, what is the **exact location** (such as Hostel, Block, Street, or nearby landmark)?`,
      analysis,
      quickReplies: [
        'Hostel Road, near Block B',
        'Academic Block 3, 2nd Floor',
        'Main Gate Campus Entrance',
        'Use my GPS location'
      ],
      suggestedNextStep: 'ask_location'
    };
  }

  // Step 2: Location provided (or extracted)
  const finalLocation: LocationInfo = detectedLoc || {
    area: userText.length < 50 ? userText : 'Reported Campus / City Location',
    fullAddress: userText.length < 80 ? userText : 'Reported Location near incident site'
  };

  const idNumber = Math.floor(100000 + Math.random() * 900000);
  const complaintId = `FIX-2026-${idNumber}`;

  const analysis: ProblemAnalysis = {
    problem: userText.length > 50 ? userText : `Reported ${category.toLowerCase()} issue: ${userText}`,
    category,
    priority,
    location: finalLocation.fullAddress,
    department,
    reason
  };

  const actionPlan = generateActionPlan(
    userText,
    category,
    priority,
    department,
    finalLocation.fullAddress
  );

  const complaint = generateFormalComplaint(
    complaintId,
    userText,
    category,
    priority,
    finalLocation,
    department,
    existingEvidence
  );

  return {
    reply: `I've registered all key parameters! Here is the complete **Smart Problem Analysis**, the **5-Step Action Plan**, and your **Ready-to-Submit Official Complaint**. You can review the complaint below, copy or download it, or submit it to generate your unique tracking ID.`,
    analysis,
    actionPlan,
    complaintPreview: complaint,
    suggestedNextStep: 'ready_to_generate',
    quickReplies: [
      'Submit Complaint Now',
      'Download Complaint PDF',
      'Report another issue'
    ]
  };
}
