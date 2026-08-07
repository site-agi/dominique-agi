import React, { useState, useRef, useEffect } from 'react';
import { Send, Volume2, VolumeX } from 'lucide-react';
import { CornerBracketTL, CornerBracketTR, CornerBracketBL, CornerBracketBR } from './CustomIcons';

interface Message {
  sender: 'dominique' | 'user';
  text: string;
  time: string;
}

interface ChatWidgetProps {
  onOpenShop: () => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ onOpenShop }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'dominique',
      text: 'Olá! Sou a Dominique AGI da Lincoln Corp. Como posso impulsionar seu negócio hoje?',
      time: '11:45',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const speakReply = (textToSpeak: string) => {
    if (!isVoiceEnabled) return;
    try {
      // Calls native Vercel serverless voice endpoint
      const audioUrl = `/api/speak?text=${encodeURIComponent(textToSpeak)}`;
      const audio = new Audio(audioUrl);
      audio.play().catch((err) => {
        console.log('Audio play interaction needed:', err);
      });
    } catch (e) {
      console.log('Voice playback error:', e);
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const userMsg: Message = {
      sender: 'user',
      text: inputText.trim(),
      time: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentQuery = inputText.trim();
    setInputText('');

    setTimeout(() => {
      let replyText = 'Entendido! Estou pronta para te ajudar. Se quiser ver nossos serviços ou orçamentos, clique no botão "COMPRAR" no topo ou fale no nosso WhatsApp (74 99928-1423)!';
      
      const lower = currentQuery.toLowerCase();
      if (lower.includes('comprar') || lower.includes('preço') || lower.includes('serviço') || lower.includes('quanto')) {
        replyText = 'Oferecemos Automação de WhatsApp 24h, Web Apps PWA, Automação de Instagram e CRM Comercial! Clique no botão COMPRAR no topo para ver os detalhes e adicionar à sacola.';
      } else if (lower.includes('whatsapp') || lower.includes('contato') || lower.includes('falar')) {
        replyText = 'Você pode nos chamar direto no WhatsApp pelo número 74 99928-1423 ou abrir a gaveta CONTATO no topo do site!';
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'dominique',
          text: replyText,
          time: `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`,
        },
      ]);

      // Trigger Voice Playback
      speakReply(replyText);
    }, 800);
  };

  return (
    <div
      className="relative border border-black/20 bg-white/10 backdrop-blur-xs rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-2xl transition-all duration-300 w-full max-w-sm lg:max-w-md"
      style={{
        minWidth: 'clamp(16rem, 24vw, 24rem)',
      }}
    >
      {/* Corner Brackets */}
      <div className="absolute top-0 left-0">
        <CornerBracketTL className="text-black" />
      </div>
      <div className="absolute top-0 right-0">
        <CornerBracketTR className="text-black" />
      </div>
      <div className="absolute bottom-0 left-0">
        <CornerBracketBL className="text-black" />
      </div>
      <div className="absolute bottom-0 right-0">
        <CornerBracketBR className="text-black" />
      </div>

      {/* Header Status & Voice Toggle */}
      <div className="flex items-center justify-between border-b border-black/15 pb-2.5 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-orbitron font-bold text-xs uppercase tracking-widest text-black">
            DOMINIQUE AGI
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
            className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider text-black/70 hover:text-black transition-colors px-1.5 py-0.5 rounded bg-white/30 border border-black/10 cursor-pointer"
            title={isVoiceEnabled ? 'Voz da Dominique Ativada' : 'Voz Mutada'}
          >
            {isVoiceEnabled ? <Volume2 size={12} className="text-emerald-600" /> : <VolumeX size={12} className="text-gray-400" />}
            <span>{isVoiceEnabled ? 'VOZ IA' : 'MUTADO'}</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Container */}
      <div className="flex-1 overflow-y-auto max-h-48 sm:max-h-56 pr-1 space-y-2.5 my-1 text-xs">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[85%] px-3 py-2 rounded-lg leading-relaxed shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-black text-white rounded-br-none font-medium'
                  : 'bg-white/40 text-black border border-black/15 rounded-bl-none font-medium backdrop-blur-xs'
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[9px] text-black/50 font-mono font-semibold mt-0.5 px-1">
              {msg.time}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-2 my-1 no-scrollbar">
        <button
          onClick={onOpenShop}
          className="px-2.5 py-1 bg-white/40 hover:bg-black hover:text-white transition-all text-[10px] font-bold uppercase tracking-wider rounded-full border border-black/15 text-black shrink-0 cursor-pointer backdrop-blur-xs"
        >
          💡 Ver Serviços
        </button>
        <a
          href="https://wa.me/557499281423"
          target="_blank"
          rel="noopener noreferrer"
          className="px-2.5 py-1 bg-white/40 hover:bg-black hover:text-white transition-all text-[10px] font-bold uppercase tracking-wider rounded-full border border-black/15 text-black shrink-0 cursor-pointer text-decoration-none backdrop-blur-xs"
        >
          📱 WhatsApp
        </a>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="pt-2 border-t border-black/15 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Conversar com Dominique..."
          className="flex-1 bg-transparent text-xs text-black font-medium placeholder-black/50 focus:outline-none border-b border-black/30 focus:border-black py-1 transition-colors"
        />
        <button
          type="submit"
          className="p-1.5 bg-black text-white rounded-md hover:bg-gray-800 transition-colors cursor-pointer shrink-0"
          aria-label="Enviar mensagem"
        >
          <Send size={13} />
        </button>
      </form>
    </div>
  );
};
