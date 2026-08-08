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
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const speakText = (textToSpeak: string) => {
    if (!isVoiceEnabled) return;

    setIsSpeaking(true);

    // 1. Try Vercel Serverless Audio API endpoint
    try {
      const audioUrl = `/api/speak?text=${encodeURIComponent(textToSpeak)}`;
      if (!audioRef.current) {
        audioRef.current = new Audio();
      }
      audioRef.current.src = audioUrl;
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            audioRef.current!.onended = () => setIsSpeaking(false);
          })
          .catch((err) => {
            console.log('Serverless Audio fallback to SpeechSynthesis:', err);
            fallbackNativeSpeech(textToSpeak);
          });
      }
    } catch (e) {
      fallbackNativeSpeech(textToSpeak);
    }
  };

  const fallbackNativeSpeech = (textToSpeak: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'pt-BR';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(false);
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

    // Indicador visual de carregando/pensando
    setIsLoading(true);

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: currentQuery }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        const replyText = data.reply || data.error || 'Não consegui processar no momento.';
        setMessages((prev) => [
          ...prev,
          {
            sender: 'dominique',
            text: replyText,
            time: `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`,
          },
        ]);
        speakText(replyText);
      })
      .catch((err) => {
        console.log('Sentinela off ou indisponível:', err);
        setIsLoading(false);
        const offlineText = 'A Dominique AGI está offline no momento ou o sentinela do site não foi iniciado. Por favor, entre em contato pelo nosso WhatsApp oficial (74 99928-1423)!';
        setMessages((prev) => [
          ...prev,
          {
            sender: 'dominique',
            text: offlineText,
            time: `${new Date().getHours().toString().padStart(2, '0')}:${new Date().getMinutes().toString().padStart(2, '0')}`,
          },
        ]);
        speakText(offlineText);
      });
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
            type="button"
            onClick={() => {
              const nextState = !isVoiceEnabled;
              setIsVoiceEnabled(nextState);
              if (!nextState) {
                if (audioRef.current) audioRef.current.pause();
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel();
                setIsSpeaking(false);
              }
            }}
            className={`flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider transition-all px-2 py-0.5 rounded border cursor-pointer ${
              isVoiceEnabled
                ? 'bg-black text-white border-black shadow-xs'
                : 'bg-white/30 text-black/60 border-black/10'
            }`}
            title={isVoiceEnabled ? 'Voz da Dominique Ativada' : 'Voz Mutada'}
          >
            {isVoiceEnabled ? (
              <Volume2 size={12} className={isSpeaking ? 'animate-bounce text-emerald-400' : 'text-white'} />
            ) : (
              <VolumeX size={12} />
            )}
            <span>{isVoiceEnabled ? (isSpeaking ? 'FALANDO...' : 'VOZ IA') : 'MUTADO'}</span>
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

        {/* Indicador de Digitando (3 Bolinhas Animadas da Dominique) */}
        {isLoading && (
          <div className="flex flex-col items-start">
            <div className="bg-white/40 text-black border border-black/15 px-3 py-2 rounded-lg rounded-bl-none shadow-xs backdrop-blur-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-black rounded-full animate-bounce"></span>
            </div>
            <span className="text-[9px] text-black/50 font-mono font-semibold mt-0.5 px-1">
              Dominique está digitando...
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />

      </div>

      {/* Quick Suggestion Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-2 my-1 no-scrollbar">
        <button
          type="button"
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
