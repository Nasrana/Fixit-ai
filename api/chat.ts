import { detectCategory, detectPriority, extractLocationFromText, generateActionPlan, generateFormalComplaint } from '../src/services/demoEngine';

interface RequestLike {
  method?: string;
  body?: any;
  headers?: Record<string, string | string[] | undefined>;
}

interface ResponseLike {
  status: (code: number) => ResponseLike;
  json: (body: any) => void;
  setHeader: (name: string, value: string) => void;
}

export default async function handler(req: RequestLike, res: ResponseLike) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const {
      message = '',
      conversationHistory = [],
      currentLocation,
      evidenceName,
      isDemo = false
    } = req.body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

    // If Demo Mode requested OR no Gemini API key configured -> fallback to intelligent demo engine
    if (isDemo || !apiKey || apiKey === 'your_gemini_api_key_here') {
      const demoResult = runIntelligentOfflineEngine(message, conversationHistory, currentLocation, evidenceName);
      return res.status(200).json({
        ...demoResult,
        isDemo: true,
        aiEngine: 'FIXIT Intelligent Offline Engine'
      });
    }

    // Call Real Gemini API server-side
    try {
      const geminiResponse = await callGeminiAPI(apiKey, model, message, conversationHistory, currentLocation, evidenceName);
      return res.status(200).json({
        ...geminiResponse,
        isDemo: false,
        aiEngine: `Google Gemini (${model})`
      });
    } catch (geminiError: any) {
      console.warn('Gemini API call failed, gracefully falling back to Demo Mode:', geminiError?.message || geminiError);
      
      const fallbackResult = runIntelligentOfflineEngine(message, conversationHistory, currentLocation, evidenceName);
      return res.status(200).json({
        ...fallbackResult,
        isDemo: true,
        fallbackTriggered: true,
        aiEngine: 'FIXIT Intelligent Fallback Engine',
        notice: 'Live Gemini API was unavailable (fallback activated seamlessly).'
      });
    }

  } catch (error: any) {
    console.error('API Chat Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: error?.message || 'Unexpected server error'
    });
  }
}

async function callGeminiAPI(
  apiKey: string,
  model: string,
  message: string,
  history: any[],
  currentLocation?: any,
  evidenceName?: string
) {
  const systemPrompt = `You are FIXIT AI, an expert civic and campus grievance intelligence officer.
Your mission is "From Problem to Action":
1. Understand the real-world problem described by the user.
2. Classify it into one of these exact Categories:
   - Infrastructure, Water, Electricity, Road, Transport, Healthcare, Education, Sanitation, Safety, Environment, Public Services, Other
3. Detect Priority: LOW, MEDIUM, HIGH, CRITICAL.
   (CRITICAL: Life safety risks, active fire, live electric wire, chemical/gas leak, deep open trench. HIGH: Broken streetlight in dark area, water outage, large pothole on main road. MEDIUM: Standard leak, broken furniture. LOW: Cosmetic issue).
4. Identify the Responsible Department (e.g., Electrical Maintenance & Power Grid Unit, Water Works & Plumbing Division, Municipal Roadways & Civil Engineering Department, Campus Security & Disaster Management Office, Sanitation, Waste & Hygiene Management, Academic Facilities & Lab Support Unit, etc.).
5. Check if key info is missing. If location is missing, ask for it conversationally (ONE question at a time).
6. If location is known or provided, construct a 5-step practical Action Plan and a ready-to-submit official Complaint.

You MUST respond strictly in valid JSON with this format:
{
  "reply": "Conversational, polite, empathetic markdown text explaining your analysis or asking for the missing detail.",
  "analysis": {
    "problem": "Clear problem statement",
    "category": "CategoryName",
    "priority": "LOW|MEDIUM|HIGH|CRITICAL",
    "location": "Location string",
    "department": "Responsible department name",
    "reason": "Clear explanation why this priority was assigned"
  },
  "suggestedNextStep": "ask_location" | "ready_to_generate",
  "quickReplies": ["Quick suggestion 1", "Quick suggestion 2"],
  "complaintPreview": {
    "id": "FIX-2026-XXXXXX",
    "subject": "Official Subject",
    "description": "Formal complaint narrative",
    "suggestedAction": "Immediate recommended remedial step"
  }
}`;

  const contents: any[] = [
    ...(Array.isArray(history) ? history.map(h => ({
      role: h.role === 'model' ? 'model' : 'user',
      parts: h.parts || [{ text: '' }]
    })) : []),
    {
      role: 'user',
      parts: [
        { text: `${systemPrompt}\n\nContext:\nCurrent Location: ${JSON.stringify(currentLocation || 'None provided yet')}\nEvidence: ${evidenceName || 'None'}\n\nUser Message: ${message}` }
      ]
    }
  ];

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents,
      generationConfig: {
        temperature: 0.2,
        topP: 0.95,
        responseMimeType: 'application/json'
      }
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API HTTP ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) throw new Error('Empty response from Gemini API');

  const parsed = JSON.parse(rawText);

  // Ensure complaint preview has necessary complete structure
  if (parsed.analysis && parsed.analysis.location && !parsed.analysis.location.includes('not specified')) {
    const idNumber = Math.floor(100000 + Math.random() * 900000);
    const complaintId = `FIX-2026-${idNumber}`;
    const category = parsed.analysis.category;
    const priority = parsed.analysis.priority;
    const dept = parsed.analysis.department;

    parsed.actionPlan = generateActionPlan(
      parsed.analysis.problem,
      category,
      priority,
      dept,
      parsed.analysis.location
    );

    parsed.complaintPreview = {
      id: complaintId,
      subject: parsed.complaintPreview?.subject || `Urgent Resolution: ${parsed.analysis.problem}`,
      description: parsed.complaintPreview?.description || `Official grievance lodged regarding ${parsed.analysis.problem} at ${parsed.analysis.location}.`,
      category,
      priority,
      status: 'SUBMITTED',
      location: {
        area: parsed.analysis.location,
        fullAddress: parsed.analysis.location
      },
      department: dept,
      suggestedAction: parsed.complaintPreview?.suggestedAction || 'Deploy maintenance crew for immediate field inspection.',
      actionPlan: parsed.actionPlan,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeline: [
        {
          id: 'tl-1',
          status: 'SUBMITTED',
          title: 'Grievance Registered',
          description: 'Problem analyzed and verified via Gemini AI',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          actor: 'Gemini AI Dispatcher'
        }
      ]
    };
  }

  return parsed;
}

function runIntelligentOfflineEngine(
  message: string,
  history: any[],
  currentLocation?: any,
  evidenceName?: string
) {
  const historyCount = history.length;
  const category = detectCategory(message);
  const priority = detectPriority(message, category);
  const detectedLoc = extractLocationFromText(message) || currentLocation;

  const departmentMap: Record<string, string> = {
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

  const department = departmentMap[category] || 'General Maintenance Directorate';

  // If user is just greeting or vague
  if (/^(hi|hello|hey|start|help|greetings)/i.test(message.trim()) && message.length < 15) {
    return {
      reply: "Hello! I am **FIXIT AI** — your intelligent civic and campus problem solver.\n\nDescribe any issue you see (e.g. broken streetlight, leaking tap, deep pothole, classroom fan issue), and I will prioritize it, plan the fix, and generate an official grievance.",
      quickReplies: [
        "The streetlight near my hostel has been broken for 5 days.",
        "Water tap in college block is not working.",
        "There is a large pothole near my house.",
        "Classroom fan is not working."
      ],
      suggestedNextStep: 'ask_details'
    };
  }

  let reason = '';
  if (priority === 'CRITICAL') {
    reason = 'The issue involves active hazard, risk of short-circuit, or immediate safety danger.';
  } else if (priority === 'HIGH') {
    reason = category === 'Electricity'
      ? 'The issue affects night-time visibility and public safety in high-footfall areas.'
      : 'Prolonged breakdown causes severe inconvenience or road transit risk.';
  } else if (priority === 'MEDIUM') {
    reason = 'Standard utility defect impacting daily campus operations.';
  } else {
    reason = 'Low-risk operational maintenance request.';
  }

  if (!detectedLoc && historyCount <= 1) {
    return {
      reply: `I have analyzed your report. I've classified this as a **${priority} priority** issue under **${category}**, managed by the **${department}**.\n\nTo file an official complaint, what is the **exact location** (e.g. Hostel, Block number, Street, or nearby landmark)?`,
      analysis: {
        problem: message,
        category,
        priority,
        location: 'Awaiting location input...',
        department,
        reason
      },
      suggestedNextStep: 'ask_location',
      quickReplies: [
        'Hostel Road, near Block B',
        'Academic Block 3, 1st Floor',
        'Main College Entrance Gate',
        'Use my GPS location'
      ]
    };
  }

  const finalLoc = detectedLoc || {
    area: message.length < 50 ? message : 'Reported Campus / City Location',
    fullAddress: message.length < 80 ? message : 'Reported Location near incident site'
  };

  const idNumber = Math.floor(100000 + Math.random() * 900000);
  const complaintId = `FIX-2026-${idNumber}`;

  const analysis = {
    problem: message,
    category,
    priority,
    location: finalLoc.fullAddress,
    department,
    reason
  };

  const actionPlan = generateActionPlan(
    message,
    category,
    priority,
    department,
    finalLoc.fullAddress
  );

  const complaintPreview = generateFormalComplaint(
    complaintId,
    message,
    category,
    priority,
    finalLoc,
    department,
    evidenceName
  );

  return {
    reply: `I have gathered all the necessary details! Here is the complete **Smart Problem Analysis**, the **5-Step Action Plan**, and the **Ready-to-Submit Complaint**. You can submit this complaint immediately to receive your official Tracking ID.`,
    analysis,
    actionPlan,
    complaintPreview,
    suggestedNextStep: 'ready_to_generate',
    quickReplies: [
      'Submit Complaint Now',
      'Download Complaint PDF',
      'Start a New Complaint'
    ]
  };
}
