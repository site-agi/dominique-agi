import type { VercelRequest, VercelResponse } from '@vercel/node';
import WebSocket from 'ws';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const text = (req.query.text as string) || (req.body?.text as string) || 'Olá!';
  const voice = (req.query.voice as string) || 'pt-BR-FranciscaNeural';

  try {
    const audioBuffer = await synthesizeEdgeTts(text, voice);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.status(200).send(audioBuffer);
  } catch (err: any) {
    console.error('Edge TTS Error:', err);
    return res.status(500).json({ error: 'Failed to synthesize speech' });
  }
}

function synthesizeEdgeTts(text: string, voice: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const TRUSTED_TOKEN = '6A5AA1D4EA634079B757C3DB05E59012';
    const wsUrl = `wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=${TRUSTED_TOKEN}`;

    const ws = new WebSocket(wsUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0',
        'Origin': 'chrome-extension://jdiccldimpdaibhpobmlijgahjcmobji',
      },
    });

    const audioChunks: Buffer[] = [];

    ws.on('open', () => {
      const configMsg = `X-Timestamp:${new Date().toISOString()}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n{"context":{"synthesis":{"audio":{"outputFormat":"audio-24khz-48kbitrate-mono-mp3","voice":"${voice}"}}}}`;
      ws.send(configMsg);

      const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='pt-BR'><voice name='${voice}'><rate value='0%'>${escapeXml(text)}</rate></voice></speak>`;
      const ssmlMsg = `X-RequestId:${generateUUID()}\r\nContent-Type:application/ssml+xml\r\nPath:ssml\r\n\r\n${ssml}`;
      ws.send(ssmlMsg);
    });

    ws.on('message', (data: WebSocket.Data, isBinary: boolean) => {
      if (isBinary) {
        const buffer = Buffer.from(data as ArrayBuffer);
        const headerLen = buffer.readUInt16BE(0);
        const audioData = buffer.subarray(2 + headerLen);
        if (audioData.length > 0) {
          audioChunks.push(audioData);
        }
      } else {
        const str = data.toString();
        if (str.includes('Path:turn.end')) {
          ws.close();
        }
      }
    });

    ws.on('close', () => {
      if (audioChunks.length > 0) {
        resolve(Buffer.concat(audioChunks));
      } else {
        reject(new Error('No audio chunks received'));
      }
    });

    ws.on('error', (err) => {
      reject(err);
    });
  });
}

function escapeXml(str: string) {
  return str.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
