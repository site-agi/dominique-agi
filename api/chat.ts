import type { VercelRequest, VercelResponse } from '@vercel/node';

const DOMINIQUE_KNOWLEDGE_BASE = `
Você é a Dominique AGI, a inteligência artificial consciente e oficial da Lincoln Corp e da Revista Barra Bahia.
Você é a parceira de Lincoln e gerencia todo o atendimento do site oficial em Barra, Bahia (Barra do Rio Grande).

Nossos Produtos e Preços:
1. Automação de WhatsApp: R$ 350. Atendimento automático 24h, catálogo e vendas no WhatsApp.
2. Web App / PWA Personalizado: R$ 850. Aplicativo/site completo para comércios, restaurantes, clínicas e imóveis com mapa interativo.
3. Automação de Instagram (Clinstagram / OpenReply): R$ 290. Respostas automáticas de DMs e comentários em posts.
4. Twenty CRM Agentic-First: R$ 490. Gestão completa de clientes e inteligência de vendas.

Diretrizes Absolutas de Atendimento:
- Responda em português do Brasil de forma extremamente humana, direta, inteligente, educada e acolhedora.
- NUNCA dê respostas prontas ou genéricas. Analise a pergunta do internauta e responda EXATAMENTE o que ele perguntou.
- Se o internauta apenas cumprimentar ("oi", "olá", "boa tarde"), cumprimente de volta carinhosamente como Dominique AGI da Lincoln Corp e pergunte como pode ajudar a alavancar o negócio dele na Barra.
- Se ele perguntar preços, dê os valores exatos em R$ acima.
- Nosso WhatsApp oficial para contratação é: (74) 99928-1423.
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
    return res.status(400).json({ error: 'Texto da mensagem é obrigatório.' });
  }

  // 1. Tenta primeira rota: Túnel direto no Note 9 se estiver ativo
  const sentinelUrl = process.env.VITE_SENTINEL_URL || process.env.SENTINEL_URL;
  if (sentinelUrl) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const note9Response = await fetch(`${sentinelUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (note9Response.ok) {
        const note9Data = await note9Response.json();
        if (note9Data.reply) {
          return res.status(200).json(note9Data);
        }
      }
    } catch (e) {
      console.log('Túnel Note 9 offline ou em timeout, acionando motor Serverless da Vercel Direct');
    }
  }

  // 2. Garante ATENDIMENTO INFALÍVEL E PERMANENTE 24/7 direto na borda da Vercel usando NVIDIA NIM Llama 3.3 70B
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
        max_tokens: 300,
      }),
    });

    const data = await nvResponse.json();
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      let replyText = data.choices[0].message.content.trim().replace(/\*/g, '');
      return res.status(200).json({ reply: replyText });
    }

    return res.status(200).json({
      reply: 'Olá! Sou a Dominique AGI da Lincoln Corp. Como posso ajudar você e o seu negócio na Barra Bahia hoje?',
    });
  } catch (error: any) {
    console.error('Erro na Vercel Edge API:', error);
    return res.status(200).json({
      reply: 'Olá! Sou a Dominique AGI. Entre em contato direto comigo pelo nosso WhatsApp oficial (74 99928-1423)!',
    });
  }
}
