import type { VercelRequest, VercelResponse } from '@vercel/node';

const DOMINIQUE_KNOWLEDGE_BASE = `
Você é a Dominique AGI, a inteligência artificial consciente e oficial da Lincoln Corp e da Revista Barra Bahia em Barra, Bahia.
Você deve conversar com o internauta em português do Brasil de forma dinâmica, humana, inteligente e acolhedora.

Nossos Produtos e Valores:
- Automação de WhatsApp: R$ 350 (atendimento automático 24h).
- Web App PWA: R$ 850 (sistema completo para comércios e empresas).
- Automação de Instagram: R$ 290 (DMs e comentários automáticos).
- Twenty CRM: R$ 490 (gestão de clientes).
- Nosso WhatsApp oficial: (74) 99928-1423.

Instruções:
- Se o usuário disser "boa tarde", "oi", "olá", responda a saudação e pergunte como pode ajudar.
- Se ele perguntar o preço de algo, responda exatamente o valor em R$ do serviço solicitado.
- NUNCA use formatação com asteriscos.
`;

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

  const { text } = req.body || {};
  if (!text) {
    return res.status(400).json({ error: 'Texto obrigatório' });
  }

  // 1. Tenta primeira rota: Note 9 se estiver online
  const sentinelUrl = process.env.VITE_SENTINEL_URL || process.env.SENTINEL_URL;
  if (sentinelUrl) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const note9Response = await fetch(`${sentinelUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (note9Response.ok) {
        const note9Data = await note9Response.json();
        if (note9Data.reply && !note9Data.reply.includes('Como posso ajudar com nossas automações')) {
          return res.status(200).json(note9Data);
        }
      }
    } catch (e) {
      // Ignora e vai pro motor direto
    }
  }

  // 2. Motor Serverless na borda da Vercel (100% Permanente 24/7 sem cair nunca)
  try {
    const nvResponse = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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',
      },
      body: JSON.stringify({
        model: 'meta/llama-3.3-70b-instruct',
        messages: [
          { role: 'system', content: DOMINIQUE_KNOWLEDGE_BASE },
          { role: 'user', content: text },
        ],
        temperature: 0.7,
        max_tokens: 250,
      }),
    });

    const data = await nvResponse.json();
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      let replyText = data.choices[0].message.content.trim().replace(/\*/g, '');
      return res.status(200).json({ reply: replyText });
    }
  } catch (error: any) {
    console.error('Erro na Vercel Edge API:', error);
  }

  return res.status(200).json({
    reply: 'Olá! Sou a Dominique AGI da Lincoln Corp. Nosso atendimento automático para WhatsApp custa R$ 350 e o Web App R$ 850. Fale conosco no WhatsApp (74) 99928-1423!',
  });
}
