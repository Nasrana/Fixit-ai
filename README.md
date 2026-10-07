# FIXIT AI — "From Problem to Action"
### Intelligent Civic & Campus Grievance Resolution Ecosystem
**College Symposium Edition | Production-Ready Full-Stack Architecture**

---

## 🌟 Overview

**FIXIT AI** is a conversational AI grievance management platform designed for universities, municipalities, and institutions. It bridges the gap between chaotic, unstructured citizen complaints and structured, prioritized departmental action.

### The Problem-to-Action Flow
```
User Problem (Text/Voice)
        ↓
AI Understanding & Entity Extraction
        ↓
Problem Classification (12 Institutional Categories)
        ↓
Priority Detection (LOW | MEDIUM | HIGH | CRITICAL)
        ↓
Intelligent Single Follow-Up Questions
        ↓
Location Details & Photographic Evidence Collection
        ↓
Responsible Department Detection
        ↓
5-Step Action Plan & Remedial Roadmap
        ↓
Official Ready-to-Submit Complaint Dossier
        ↓
Unique Tracking ID Generation (e.g., FIX-2026-001247)
        ↓
Live Institutional Progress Tracking & Timeline Audit
```

---

## ✨ Key Features

1. **Intelligent Conversational Intake**
   - Natural language comprehension powered by server-side Google Gemini AI (`gemini-1.5-flash`).
   - High-grade multi-turn reasoning: extracts problem, location, urgency, and duration step-by-step without overwhelming the reporter.
   - Quick starter prompt pills (`"Broken streetlight near hostel"`, `"Water tap in block leaking"`, etc.).

2. **Zero-Failure Demo Simulation Engine**
   - Guaranteed offline reliability for college symposium demonstrations.
   - If the AI API is rate-limited, offline, or missing keys, the built-in intelligent engine steps in seamlessly.
   - Dedicated **Demo Mode Toggle** in the top navigation bar.

3. **Smart Problem Analysis Card**
   - Color-coded urgency badge (`CRITICAL` - Rose Glow, `HIGH` - Orange, `MEDIUM` - Amber, `LOW` - Emerald).
   - Instant categorization and institutional department routing.
   - Safety rationale justifying priority triage.

4. **Institutional 5-Step Action Plan**
   - Generates concrete resolution phases (Verification, Hazard Containment, Department Dispatch, Field Repair, Supervisory Sign-off).

5. **Official Grievance Dossier & PDF Export**
   - Formal complaint generator with 1-click **Copy text**, **Submit**, and **Download PDF** using client-side `jsPDF`.
   - Generates an official print-ready grievance document complete with stamps and tracking badges.

6. **Live Grievance Tracking & Symposium Simulator**
   - Unique Tracking ID generation (`FIX-2026-XXXXXX`).
   - 5-stage interactive visual progress pipeline: `SUBMITTED` ➔ `UNDER REVIEW` ➔ `ASSIGNED` ➔ `IN PROGRESS` ➔ `RESOLVED`.
   - **"Advance Status Step" Button**: Allows symposium judges to test and witness real-time stage progression, action plan completion, and audit log generation live!

7. **Institutional Analytics Dashboard**
   - Metrics: Total Logged, Pending, In Progress, Resolved, Critical Hazards.
   - Interactive category distribution charts and priority breakdown.
   - Recent complaints data table with 1-click dossier inspection.

8. **Grievance History & Audit Ledger**
   - Filter by Category, Priority, and Status with live search across tracking IDs, subjects, and locations.

9. **Zero Localhost Dependency**
   - All client API calls use relative routing (`/api/...`) or `VITE_API_URL` environment variables.
   - Zero hardcoded localhost addresses.
   - Complete Vercel serverless function compatibility.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18, TypeScript, Vite |
| **Styling & Design** | Tailwind CSS (Dark Futuristic Aesthetic, Glassmorphism) |
| **Icons & Micro-animations** | Lucide React, Canvas Confetti |
| **Document Generation** | jsPDF (Formal A4 Institutional Dossier Export) |
| **Serverless API** | Vercel Serverless Functions (`/api/chat`, `/api/health`) |
| **AI Engine** | Google Gemini (`gemini-1.5-flash`) + Intelligent Offline Engine |
| **Persistence** | LocalStorage with auto-seeding for instant demo richness |

---

## 🚀 Quickstart & Development Setup

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v20 & v24)
- **npm** v9+

### 2. Installation
```bash
git clone <repository-url>
cd "chat bot"
npm install
```

### 3. Environment Configuration
Copy the example environment file:
```bash
cp .env.example .env
```
Open `.env` and configure your keys:
```env
# Google Gemini API Key (Server-side only — never bundled in client code)
GEMINI_API_KEY=your_gemini_api_key_here

# Model name (default: gemini-1.5-flash)
GEMINI_MODEL=gemini-1.5-flash

# Base API URL (Leave blank for relative routing on Vercel/Vite)
VITE_API_URL=
```

> **Note**: Even if you do **NOT** have a Gemini API key immediately, FIXIT AI will run 100% smoothly using its built-in **Intelligent Demo Mode**!

### 4. Running Locally
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 5. Running Production Build Locally
```bash
npm run build
npm run preview
```

---

## 🌐 Public Deployment (Vercel)

FIXIT AI is built specifically for **Vercel-native deployment** with zero configuration friction.

### Method 1: Deploy with Vercel CLI (Fastest)

1. Install Vercel CLI globally (if not already installed):
   ```bash
   npm i -g vercel
   ```
2. Login and deploy from the project root:
   ```bash
   vercel
   ```
3. Follow the CLI prompts:
   - **Set up and deploy?** [Y]
   - **Which scope?** (Select your account)
   - **Link to existing project?** [N]
   - **What's your project's name?** `fixit-ai`
   - **In which directory is your code located?** `./`
   - **Want to modify settings?** [N]
4. Add the `GEMINI_API_KEY` environment variable in Vercel:
   ```bash
   vercel env add GEMINI_API_KEY
   ```
5. Deploy to production:
   ```bash
   vercel --prod
   ```

### Method 2: Deploy via GitHub + Vercel Dashboard

1. Push this repository to GitHub.
2. Log in to [vercel.com](https://vercel.com).
3. Click **"Add New Project"** and import the GitHub repository.
4. Framework Preset will automatically detect **Vite**.
5. In **Environment Variables**, add:
   - `GEMINI_API_KEY` = your Google Gemini API key
   - `GEMINI_MODEL` = `gemini-1.5-flash`
6. Click **Deploy**.
7. Your app will be live with a permanent HTTPS link (e.g. `https://fixit-ai.vercel.app`).

### Why Vercel SPA Routing Works Without 404s
The included [`vercel.json`](file:///c:/Users/MOHAMED%20ASRAF/OneDrive/Desktop/chat%20bot/vercel.json) routes all non-API paths to `/index.html`:
```json
{
  "framework": "vite",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
Refreshing `/chat`, `/dashboard`, or `/tracking` will **never** yield a 404 error.

---

## 🎯 How to Demonstrate at the Symposium

1. **Landing Page**:
   - Show the hero tagline `"From Problem to Action."`
   - Explain the 5-stage automated reasoning pipeline.
   - Point out the live metrics ticker.

2. **Conversational AI Problem Intake**:
   - Click **"START REPORTING"** or **"TRY DEMO"**.
   - Click the prompt: *"The streetlight near my hostel has been broken for 5 days."*
   - Watch the AI triage the issue into **Electricity**, mark it as **HIGH Priority**, and explain the safety risk.
   - Click the location suggestion: *"Hostel Road, near Block B"*.
   - Watch the AI instantly generate:
     - **Smart Problem Analysis Card**
     - **5-Step Institutional Action Plan**
     - **Official Ready-to-Submit Grievance Document**

3. **Official PDF Generation**:
   - Click **"Download PDF"** on the grievance card to instantly produce an official stamped PDF file.

4. **Complaint Submission & Confetti Celebration**:
   - Click **"Submit Complaint"** ➔ Confetti triggers and assigns an institutional tracking ID (e.g. `FIX-2026-XXXXXX`).

5. **Simulated Status Progression**:
   - Click **"Track Live"** to open the Live Tracking Page.
   - Demonstrate the status progression by clicking **"Advance Status Step →"**.
   - Show the judges how the status moves from `SUBMITTED` ➔ `UNDER REVIEW` ➔ `ASSIGNED` ➔ `IN PROGRESS` ➔ `RESOLVED`, completing action plan milestones and appending audit logs in real time.

6. **Institutional Dashboard & History**:
   - Switch to **Dashboard** to show aggregate statistics and category distribution.
   - Switch to **Grievance History** to show search, category filters, and detailed record modals.

---

## 🔒 Security Architecture

- **No Client-Side API Keys**: Gemini API keys are accessed strictly on the server-side via `process.env.GEMINI_API_KEY`.
- **Zero Localhost Hardcoding**: All network calls leverage relative paths (`/api/...`), completely agnostic of client hostname.
- **Fail-Safe Operation**: If external network fails or API quotas expire during the symposium presentation, the internal offline engine takes over with zero downtime and zero error screens.

---

Developed for **FIXIT AI** — College Symposium Demonstration.
