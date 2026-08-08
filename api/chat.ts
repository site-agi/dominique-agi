import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // A Vercel lê dinamicamente process.env.VITE_SENTINEL_URL a cada chamada
  const sentinelUrl = process.env.VITE_SENTINEL_URL || process.env.SENTINEL_URL;

  if (!sentinelUrl) {
    return res.status(503).json({ error: 'Sentinela URL não configurada na Vercel.' });
  }

  try {
    const { text } = req.body || {};
    
    // Roteador Serverless ultra-rápido apontando direto pro túnel Cloudflare
    const response = await fetch(`${sentinelUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Erro de Proxy no Sentinela da Vercel:', error);
    return res.status(502).json({ error: 'A Dominique AGI está offline ou a sentinela do site não foi iniciada.' });
  }
}
