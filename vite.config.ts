import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      {
        name: 'fixit-api-dev-server',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.url?.startsWith('/api/health')) {
              res.setHeader('Content-Type', 'application/json');
              res.setHeader('Access-Control-Allow-Origin', '*');
              const hasKey = Boolean(env.GEMINI_API_KEY && env.GEMINI_API_KEY !== 'your_gemini_api_key_here');
              res.end(
                JSON.stringify({
                  status: 'online',
                  product: 'FIXIT AI — From Problem to Action',
                  version: '1.0.0',
                  ai: {
                    hasGeminiKey: hasKey,
                    model: env.GEMINI_MODEL || 'gemini-1.5-flash',
                    mode: hasKey ? 'Gemini Live AI' : 'Intelligent Demo Mode'
                  }
                })
              );
              return;
            }

            if (req.url?.startsWith('/api/chat') && req.method === 'POST') {
              let bodyStr = '';
              req.on('data', chunk => {
                bodyStr += chunk;
              });
              req.on('end', async () => {
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Access-Control-Allow-Origin', '*');

                try {
                  const body = JSON.parse(bodyStr || '{}');
                  const { message, isDemo } = body;
                  const apiKey = env.GEMINI_API_KEY;

                  if (isDemo || !apiKey || apiKey === 'your_gemini_api_key_here') {
                    // Signal client to use the high-fidelity demo engine with full UI state
                    res.end(
                      JSON.stringify({
                        isDemo: true,
                        aiEngine: 'FIXIT Intelligent Offline Engine'
                      })
                    );
                    return;
                  }

                  // Live Gemini call
                  const systemPrompt = `You are FIXIT AI, an expert civic and campus grievance intelligence officer.
Return STRICT JSON ONLY in this format:
{
  "reply": "Conversational markdown string explaining the analysis or asking for the missing detail (one at a time)",
  "analysis": {
    "problem": "Clear problem statement",
    "category": "Infrastructure|Water|Electricity|Road|Transport|Healthcare|Education|Sanitation|Safety|Environment|Public Services|Other",
    "priority": "LOW|MEDIUM|HIGH|CRITICAL",
    "location": "Location or Awaiting location",
    "department": "Department Name",
    "reason": "Clear justification of priority"
  },
  "suggestedNextStep": "ask_location" | "ready_to_generate",
  "quickReplies": ["Quick suggestion 1", "Quick suggestion 2"]
}`;

                  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${env.GEMINI_MODEL || 'gemini-1.5-flash'}:generateContent?key=${apiKey}`;
                  const gRes = await fetch(geminiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Issue: ${message}` }] }],
                      generationConfig: { temperature: 0.2, responseMimeType: 'application/json' }
                    })
                  });

                  if (!gRes.ok) {
                    throw new Error(`Gemini HTTP error ${gRes.status}`);
                  }

                  const gData = await gRes.json();
                  const replyText = gData?.candidates?.[0]?.content?.parts?.[0]?.text;
                  const parsed = JSON.parse(replyText);
                  res.end(JSON.stringify({ ...parsed, isDemo: false, aiEngine: 'Google Gemini' }));
                } catch (err: any) {
                  // Fallback signal
                  res.end(
                    JSON.stringify({
                      isDemo: true,
                      fallbackTriggered: true,
                      aiEngine: 'FIXIT Intelligent Fallback Engine'
                    })
                  );
                }
              });
              return;
            }

            next();
          });
        }
      }
    ]
  };
});
