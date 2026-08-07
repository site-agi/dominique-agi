import type { VercelRequest, VercelResponse } from '@vercel/node';
import { tts } from 'edge-tts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const text = (req.query.text as string) || (req.body?.text as string) || 'Olá!';

  try {
    // Microsoft Edge Neural TTS - Francisca (pt-BR) - voz feminina natural e sofisticada
    const audioBuffer = await tts(text, {
      voice: 'pt-BR-FranciscaNeural',
      rate: '+0%',
      pitch: '+0Hz',
    });

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.status(200).send(Buffer.from(audioBuffer));
  } catch (err: any) {
    console.error('Edge TTS Serverless Error:', err);
    return res.status(500).json({ error: 'Failed to synthesize speech' });
  }
}
