import type { VercelRequest, VercelResponse } from '@vercel/node';
import { EdgeTTS } from 'node-edge-tts';
import { randomBytes } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readFileSync, unlinkSync, existsSync } from 'node:fs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const text = (req.query.text as string) || (req.body?.text as string) || 'Olá!';

  try {
    const tts = new EdgeTTS({
      voice: 'pt-BR-FranciscaNeural',
      lang: 'pt-BR',
      outputFormat: 'audio-24khz-48kbitrate-mono-mp3',
      rate: 'default',
      pitch: 'default',
      volume: 'default',
      timeout: 15000,
    });

    // Vercel /tmp is writable — use a random temp file
    const tmpFile = join(tmpdir(), `tts_${randomBytes(8).toString('hex')}.mp3`);

    await tts.ttsPromise(text, tmpFile);

    const audioBuffer = readFileSync(tmpFile);

    // Cleanup temp file
    try { unlinkSync(tmpFile); } catch {}

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.status(200).send(audioBuffer);
  } catch (err: any) {
    console.error('Edge TTS Serverless Error:', err);
    return res.status(500).json({ error: 'Failed to synthesize speech' });
  }
}
