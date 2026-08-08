import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Configura cabeçalhos de CORS
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

  // URL FIXA E PERMANENTE DO SENTINELA (ZERO TROCA DE LINK!)
  const FIXED_SENTINEL_URL = 'https://dominique-sentinel-lincoln-corp.loca.lt';

  try {
    const { text } = req.body || {};
    
    // Repassa a requisição do visitante com cabeçalho Bypass do Localtunnel
    const response = await fetch(`${FIXED_SENTINEL_URL}/api/chat`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Bypass-Tunnel-Remainder': 'true'
      },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error: any) {
    console.error('Erro no Sentinela Vercel Proxy:', error);
    return res.status(502).json({ error: 'A Dominique AGI está offline ou o sentinela do site não foi iniciado.' });
  }
}
