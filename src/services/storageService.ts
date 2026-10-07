import { Complaint, ComplaintStatus, Category, Priority } from '../types';

const STORAGE_KEY = 'fixit_ai_complaints_v1';

const SEED_COMPLAINTS: Complaint[] = [
  {
    id: 'FIX-2026-001247',
    subject: 'Broken Streetlight Near Hostel 4 Road',
    description: 'The primary sodium streetlight on the walkway connecting Hostel 4 and the dining hall has been dark for 5 consecutive days, causing severe visibility hazard at night.',
    category: 'Electricity',
    priority: 'HIGH',
    status: 'IN PROGRESS',
    location: {
      area: 'North Hostel Complex',
      street: 'Hostel 4 Ring Road',
      building: 'Hostel 4 Perimeter',
      landmark: 'Near Dining Hall Archway',
      fullAddress: 'Hostel 4 Ring Road, North Hostel Complex, Campus Gate 3',
      coordinates: { lat: 13.0827, lng: 80.2707 }
    },
    department: 'Electrical Maintenance & Power Grid Unit',
    suggestedAction: 'Inspect underground cable conduit and replace 70W LED luminaire assembly.',
    actionPlan: [
      { step: 1, title: 'Geographic Verification', description: 'Verified pole #NL-14 on perimeter path.', status: 'completed' },
      { step: 2, title: 'Severity Logging', description: 'Assessed high night-footfall safety hazard.', status: 'completed' },
      { step: 3, title: 'Work Order Dispatched', description: 'Assigned to Senior Lineman S. Kumar.', status: 'completed' },
      { step: 4, title: 'Luminaire Replacement', description: 'Technician on-site testing transformer tap.', status: 'in_progress' },
      { step: 5, title: 'Supervisory Verification', description: 'Awaiting night test sign-off.', status: 'pending' }
    ],
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    timeline: [
      { id: '1', status: 'SUBMITTED', title: 'Complaint Registered', description: 'Citizen complaint filed via FIXIT AI', timestamp: '2 days ago, 08:30 PM', actor: 'Citizen Portal' },
      { id: '2', status: 'UNDER REVIEW', title: 'Triaged by Central Desk', description: 'Urgency confirmed as HIGH due to dark footpath', timestamp: '1 day ago, 09:15 AM', actor: 'Officer V. Ramesh' },
      { id: '3', status: 'ASSIGNED', title: 'Work Order Issued', description: 'Dispatched to North Zone Electrical Crew', timestamp: 'Yesterday, 02:00 PM', actor: 'Dispatch Supervisor' },
      { id: '4', status: 'IN PROGRESS', title: 'Technician On-Site', description: 'Replacing ballast and inspecting feeder pillar', timestamp: 'Today, 10:45 AM', actor: 'Technician S. Kumar' }
    ]
  },
  {
    id: 'FIX-2026-001248',
    subject: 'Continuous Water Tap Leakage in Engineering Block 2',
    description: 'Major flush cock and washbasin tap failure resulting in high-volume water wastage on 1st-floor sanitary block.',
    category: 'Water',
    priority: 'MEDIUM',
    status: 'ASSIGNED',
    location: {
      area: 'South Academic Zone',
      building: 'Engineering Block 2',
      block: '1st Floor Washroom Wing B',
      landmark: 'Opposite CAD Lab',
      fullAddress: 'Floor 1, Block 2, Engineering Complex',
      coordinates: { lat: 13.0841, lng: 80.2721 }
    },
    department: 'Water Works & Plumbing Division',
    suggestedAction: 'Isolate supply valve and replace worn pressure cartridge and rubber washers.',
    actionPlan: [
      { step: 1, title: 'Location Verified', description: 'Plumbing manifold checked on Level 1.', status: 'completed' },
      { step: 2, title: 'Wastage Assessed', description: 'Estimated leak rate 4 Liters/hour.', status: 'completed' },
      { step: 3, title: 'Plumbing Dispatch', description: 'Assigned to Block 2 Maintenance Plumber.', status: 'in_progress' },
      { step: 4, title: 'Valve & Seal Replacement', description: 'Procure spare ceramic cartridge.', status: 'pending' },
      { step: 5, title: 'Pressure Testing', description: 'Confirm zero seepages after restore.', status: 'pending' }
    ],
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    timeline: [
      { id: '1', status: 'SUBMITTED', title: 'Incident Lodged', description: 'Filed by Student Council Representative', timestamp: 'Yesterday, 11:20 AM', actor: 'Portal Reporter' },
      { id: '2', status: 'ASSIGNED', title: 'Plumbing Crew Assigned', description: 'Allocated to Plumber M. Arumugam with ticket #WT-89', timestamp: 'Today, 08:30 AM', actor: 'Civil Works Desk' }
    ]
  },
  {
    id: 'FIX-2026-001249',
    subject: 'Deep Dangerous Pothole at Main College Gate Approach',
    description: 'Substantial asphalt depression measuring 1.2m diameter and 15cm depth immediately before the main entrance speed bump. High risk of two-wheeler skid and vehicular damage.',
    category: 'Road',
    priority: 'HIGH',
    status: 'UNDER REVIEW',
    location: {
      area: 'Campus Perimeter',
      street: 'College Boulevard Road',
      landmark: '50m before Security Main Arch',
      fullAddress: 'Main College Boulevard, North Approach Road',
      coordinates: { lat: 13.0815, lng: 80.2690 }
    },
    department: 'Municipal Roadways & Civil Engineering Department',
    suggestedAction: 'Erect reflective warning cones immediately, clean crater, and lay bitumen cold-patch compaction.',
    actionPlan: [
      { step: 1, title: 'Safety Barrier Setup', description: 'Position hazard cones to divert heavy vehicles.', status: 'completed' },
      { step: 2, title: 'Depth & Traffic Analysis', description: 'Logged HIGH priority due to monsoon puddle risk.', status: 'in_progress' },
      { step: 3, title: 'Asphalt Crew Requisition', description: 'Requisition asphalt truck for quick-patch.', status: 'pending' },
      { step: 4, title: 'Cold-Mix Compaction', description: 'Roll and level asphalt to match road profile.', status: 'pending' },
      { step: 5, title: 'Roadway Re-opening', description: 'Inspect smooth traffic transition.', status: 'pending' }
    ],
    createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    timeline: [
      { id: '1', status: 'SUBMITTED', title: 'Citizen Report Logged', description: 'Detected with high collision risk indicator', timestamp: 'Yesterday, 06:15 PM', actor: 'Automated AI Intake' },
      { id: '2', status: 'UNDER REVIEW', title: 'Inspection Queue', description: 'Forwarded to PWD Road Safety Inspector', timestamp: 'Today, 07:00 AM', actor: 'Central Dispatch' }
    ]
  },
  {
    id: 'FIX-2026-001250',
    subject: 'Classroom 402 AC Unit Sparking & Main Circuit Trip',
    description: 'Split air conditioner blower emitting visible electrical sparks accompanied by burnt plastic odor, tripping the room sub-MCB breaker.',
    category: 'Electricity',
    priority: 'CRITICAL',
    status: 'RESOLVED',
    location: {
      area: 'Academic Quadrangle',
      building: 'Technology Tower',
      block: '4th Floor, Lecture Hall 402',
      landmark: 'Beside Smart Seminar Hall',
      fullAddress: 'Room 402, 4th Floor, Technology Tower',
      coordinates: { lat: 13.0838, lng: 80.2715 }
    },
    department: 'Electrical Maintenance & Power Grid Unit',
    suggestedAction: 'Emergency power cutoff, replace shorted fan motor capacitor, and re-certify fire insulation.',
    actionPlan: [
      { step: 1, title: 'Emergency Breaker Cutoff', description: 'Sub-MCB locked out for safety.', status: 'completed' },
      { step: 2, title: 'Hazard Containment', description: 'Room ventilated and thermal scanner applied.', status: 'completed' },
      { step: 3, title: 'Motor & Wiring Replacement', description: 'Burnt terminal block replaced with ceramic connector.', status: 'completed' },
      { step: 4, title: 'Load & Insulation Testing', description: 'Dielectric strength tested OK.', status: 'completed' },
      { step: 5, title: 'Full Safety Sign-Off', description: 'Lecture Hall certified safe for classes.', status: 'completed' }
    ],
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    timeline: [
      { id: '1', status: 'SUBMITTED', title: 'Critical Hazard Alert', description: 'Flagged with CRITICAL urgency', timestamp: '3 days ago, 09:10 AM', actor: 'Faculty In-Charge' },
      { id: '2', status: 'ASSIGNED', title: 'Emergency Response Squad', description: 'Dispatched in 12 minutes to isolate circuit', timestamp: '3 days ago, 09:22 AM', actor: 'Campus Security & Electrical' },
      { id: '3', status: 'IN PROGRESS', title: 'Component Overhaul', description: 'Capacitor and terminal connector replaced', timestamp: '3 days ago, 11:30 AM', actor: 'Chief Electrician' },
      { id: '4', status: 'RESOLVED', title: 'Closed with Proof', description: 'Inspected and certified compliant with safety norms', timestamp: 'Yesterday, 04:00 PM', actor: 'Safety Inspector' }
    ]
  },
  {
    id: 'FIX-2026-001251',
    subject: 'Waste Receptacle Overflow near Student Food Court',
    description: 'Multiple recycling and wet-waste bins overflowing with food packaging and plastic bottles, attracting stray animals and generating foul odors.',
    category: 'Sanitation',
    priority: 'MEDIUM',
    status: 'SUBMITTED',
    location: {
      area: 'Student Amenities Zone',
      building: 'Central Cafeteria / Food Court',
      landmark: 'North Outdoor Seating Lawn',
      fullAddress: 'Central Food Court Lawn, Student Amenities Complex',
      coordinates: { lat: 13.0830, lng: 80.2700 }
    },
    department: 'Sanitation, Waste & Hygiene Management',
    suggestedAction: 'Clear bins, sanitize floor area with bio-enzyme disinfectant, and deploy 2 high-capacity covered bins.',
    actionPlan: [
      { step: 1, title: 'Sanitation Audit', description: 'Inspect bin saturation level at Food Court lawn.', status: 'completed' },
      { step: 2, title: 'Waste Clearance Requisition', description: 'Schedule compactor pickup route.', status: 'in_progress' },
      { step: 3, title: 'Disinfection Protocol', description: 'Apply washdown and odor neutralizing spray.', status: 'pending' },
      { step: 4, title: 'Additional Bin Deployment', description: 'Install dual segregated 240L wheelie bins.', status: 'pending' },
      { step: 5, title: 'Inspection Sign-Off', description: 'Hygiene audit verification.', status: 'pending' }
    ],
    createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    timeline: [
      { id: '1', status: 'SUBMITTED', title: 'Grievance Registered', description: 'Grievance logged via student smartphone portal', timestamp: '5 hours ago, 11:45 AM', actor: 'FIXIT AI Portal' }
    ]
  }
];

export function getStoredComplaints(): Complaint[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_COMPLAINTS));
      return SEED_COMPLAINTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_COMPLAINTS;
  } catch (err) {
    console.error('Failed to read complaints from storage:', err);
    return SEED_COMPLAINTS;
  }
}

export function saveComplaint(complaint: Complaint): void {
  try {
    const current = getStoredComplaints();
    const existingIndex = current.findIndex(c => c.id === complaint.id);
    let updated: Complaint[];
    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = complaint;
    } else {
      updated = [complaint, ...current];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('fixit_complaints_updated'));
  } catch (err) {
    console.error('Failed to save complaint to storage:', err);
  }
}

export function getComplaintById(id: string): Complaint | undefined {
  const all = getStoredComplaints();
  return all.find(c => c.id.toLowerCase() === id.trim().toLowerCase());
}

const STATUS_ORDER: ComplaintStatus[] = [
  'SUBMITTED',
  'UNDER REVIEW',
  'ASSIGNED',
  'IN PROGRESS',
  'RESOLVED'
];

export function advanceComplaintStatus(id: string): Complaint | null {
  const current = getStoredComplaints();
  const index = current.findIndex(c => c.id.toLowerCase() === id.trim().toLowerCase());
  if (index === -1) return null;

  const complaint = { ...current[index] };
  const currentIdx = STATUS_ORDER.indexOf(complaint.status);
  
  if (currentIdx < STATUS_ORDER.length - 1) {
    const nextStatus = STATUS_ORDER[currentIdx + 1];
    complaint.status = nextStatus;
    complaint.updatedAt = new Date().toISOString();

    // Advance corresponding action plan steps
    complaint.actionPlan = complaint.actionPlan.map((step, idx) => {
      if (idx <= currentIdx + 1) {
        return { ...step, status: 'completed' as const };
      } else if (idx === currentIdx + 2) {
        return { ...step, status: 'in_progress' as const };
      }
      return step;
    });

    const actor =
      nextStatus === 'UNDER REVIEW' ? 'Central AI Triage Desk' :
      nextStatus === 'ASSIGNED' ? `${complaint.department} Dispatcher` :
      nextStatus === 'IN PROGRESS' ? 'Field Technician Unit' :
      'Chief Verification Officer';

    complaint.timeline.push({
      id: `tl-${Date.now()}`,
      status: nextStatus,
      title: `Status Updated to ${nextStatus}`,
      description: `Case progressed to ${nextStatus.toLowerCase()} stage during demonstration lifecycle.`,
      timestamp: 'Just now',
      actor
    });

    current[index] = complaint;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    window.dispatchEvent(new Event('fixit_complaints_updated'));
    return complaint;
  }

  return complaint;
}

export function calculateStats() {
  const complaints = getStoredComplaints();
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'SUBMITTED' || c.status === 'UNDER REVIEW').length;
  const inProgress = complaints.filter(c => c.status === 'ASSIGNED' || c.status === 'IN PROGRESS').length;
  const resolved = complaints.filter(c => c.status === 'RESOLVED').length;
  const critical = complaints.filter(c => c.priority === 'CRITICAL').length;

  const categoryCounts: Record<string, number> = {};
  const priorityCounts: Record<string, number> = {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
    CRITICAL: 0
  };

  complaints.forEach(c => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
    priorityCounts[c.priority] = (priorityCounts[c.priority] || 0) + 1;
  });

  return {
    total,
    pending,
    inProgress,
    resolved,
    critical,
    categoryCounts,
    priorityCounts,
    recent: complaints.slice(0, 6)
  };
}
