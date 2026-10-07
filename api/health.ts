interface RequestLike {
  method?: string;
}

interface ResponseLike {
  status: (code: number) => ResponseLike;
  json: (body: any) => void;
  setHeader: (name: string, value: string) => void;
}

export default async function handler(req: RequestLike, res: ResponseLike) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ ok: true });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  const hasGeminiKey = Boolean(apiKey && apiKey !== 'your_gemini_api_key_here');
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

  return res.status(200).json({
    status: 'online',
    product: 'FIXIT AI — From Problem to Action',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    ai: {
      hasGeminiKey,
      model,
      demoModeAvailable: true,
      mode: hasGeminiKey ? 'Gemini Live AI' : 'Intelligent Demo Mode'
    }
  });
}
