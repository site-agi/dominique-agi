import React from 'react';
import { X, ShoppingBag, ChevronRight, MessageCircle, Instagram } from 'lucide-react';

export type DrawerType = 'SHOP' | 'COLLECTIONS' | 'JOURNAL' | 'CART' | null;

export interface CartItem {
  id: string;
  title: string;
  price: number;
}

interface DrawersProps {
  activeDrawer: DrawerType;
  onClose: () => void;
  cart: CartItem[];
  onAddToCart: (item: { id: string; title: string; price: number }) => void;
  onRemoveFromCart: (index: number) => void;
  onCheckout: () => void;
}

export const Drawers: React.FC<DrawersProps> = ({
  activeDrawer,
  onClose,
  cart,
  onAddToCart,
  onRemoveFromCart,
  onCheckout,
}) => {
  if (!activeDrawer) return null;

  // Services offered in COMPRAR
  const servicosComprar = [
    { id: '1', title: 'AUTOMAÇÃO WHATSAPP IA 24H', price: 350, tag: 'POPULAR', desc: 'Atendimento automático inteligente 24 horas no WhatsApp.' },
    { id: '2', title: 'SITE / WEB APP PWA PROFISSIONAL', price: 850, tag: 'EXCLUSIVO', desc: 'Desenvolvimento web de alta performance, rápido e responsivo.' },
    { id: '3', title: 'AUTOMAÇÃO INSTAGRAM DIRETO (MANYCHAT OPEN)', price: 290, tag: 'CONVERSÃO', desc: 'Envio automático de DMs e respostas a comentários.' },
    { id: '4', title: 'CRM & BANCO DE DADOS DE CLIENTES', price: 490, tag: 'GESTÃO', desc: 'Organização de clientes, vendas e gestão comercial.' },
  ];

  // Solutions in SOLUÇÕES
  const solucoesItems = [
    {
      code: 'SOLUÇÃO 01',
      title: 'GUIA COMERCIAL & IMÓVEIS PWA',
      desc: 'Plataforma completa de negócios e imóveis com busca em tempo real e integração direta com WhatsApp.',
    },
    {
      code: 'SOLUÇÃO 02',
      title: 'SENTINELA IA DE ATENDIMENTO',
      desc: 'Agentes autônomos inteligentes capazes de tirar dúvidas e captar novos clientes em sites e mensageiros.',
    },
    {
      code: 'SOLUÇÃO 03',
      title: 'GERADOR DE VÍDEOS & MÍDIA IA',
      desc: 'Produção automatizada de vídeos em loop, artes 4K e carrosséis institucionais de alto engajamento.',
    },
  ];

  // Contact options in CONTATO
  const contatoItems = [
    {
      channel: 'WHATSAPP LINCOLN CORP',
      detail: 'Atendimento direto e orçamentos via WhatsApp',
      link: 'https://wa.me/5574999281423?text=Olá,%20gostaria%20de%20um%20orçamento%20de%20serviços!',
      icon: 'whatsapp',
      btnText: 'CHAMAR NO WHATSAPP'
    },
    {
      channel: 'INSTAGRAM DIRECT',
      detail: 'Revista Barra Bahia (@barra_bahia_revista)',
      link: 'https://instagram.com/barra_bahia_revista',
      icon: 'instagram',
      btnText: 'ABRIR DIRECT'
    }
  ];

  const totalCartPrice = cart.reduce((acc, item) => acc + item.price, 0);

  const renderTitle = () => {
    switch (activeDrawer) {
      case 'SHOP':
        return 'Comprar Serviços';
      case 'COLLECTIONS':
        return 'Nossas Soluções';
      case 'JOURNAL':
        return 'Contato Direto';
      case 'CART':
        return 'Sacola de Serviços';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="relative bg-white text-black h-full border-l border-gray-200 flex flex-col justify-between z-10 shadow-2xl transition-transform duration-300 w-full"
        style={{
          maxWidth: 'min(100vw, var(--drawer-max))',
          padding: 'var(--drawer-pad)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
          <h2 className="font-orbitron font-bold uppercase tracking-widest text-lg md:text-xl">
            {renderTitle()}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:opacity-50 transition-opacity cursor-pointer"
            aria-label="Close drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-6">
          {/* COMPRAR DRAWER */}
          {activeDrawer === 'SHOP' && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                Serviços & Soluções Comerciais
              </p>
              <div className="space-y-4">
                {servicosComprar.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 border border-gray-200 rounded-md hover:border-black transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-blue-600 font-bold block uppercase tracking-wider">
                        {item.tag}
                      </span>
                      <span className="text-xs font-bold text-black">
                        R$ {item.price}
                      </span>
                    </div>
                    <h4 className="font-semibold text-xs tracking-wider uppercase">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 leading-snug">
                      {item.desc}
                    </p>
                    <div className="pt-1 flex justify-end">
                      <button
                        onClick={() => onAddToCart(item)}
                        className="px-3.5 py-1.5 bg-black text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-gray-800 transition-all cursor-pointer"
                      >
                        + ADICIONAR À SACOLA
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SOLUÇÕES DRAWER */}
          {activeDrawer === 'COLLECTIONS' && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                Sistemas & Tecnologias em Produção
              </p>
              <div className="space-y-6">
                {solucoesItems.map((col, idx) => (
                  <div key={idx} className="border-b border-gray-100 pb-4 space-y-2">
                    <span className="text-[10px] font-orbitron font-bold tracking-widest text-gray-400 block">
                      {col.code}
                    </span>
                    <h4 className="font-orbitron font-bold text-sm tracking-wider uppercase">
                      {col.title}
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{col.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONTATO DRAWER */}
          {activeDrawer === 'JOURNAL' && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
                Canais de Atendimento Direto
              </p>
              <div className="space-y-4">
                {contatoItems.map((c, idx) => (
                  <div key={idx} className="p-4 border border-gray-200 rounded-md space-y-3">
                    <div className="flex items-center gap-2 text-black">
                      {c.icon === 'whatsapp' ? <MessageCircle size={18} /> : <Instagram size={18} />}
                      <h4 className="font-bold text-xs uppercase tracking-wider">
                        {c.channel}
                      </h4>
                    </div>
                    <p className="text-xs text-gray-600">{c.detail}</p>
                    <a
                      href={c.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-gray-800 transition-all text-decoration-none"
                    >
                      {c.btnText} <ChevronRight size={14} />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CART DRAWER */}
          {activeDrawer === 'CART' && (
            <div className="h-full flex flex-col justify-between">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-3 text-center text-gray-400">
                  <ShoppingBag size={40} strokeWidth={1.2} />
                  <p className="text-xs font-medium uppercase tracking-widest">
                    Sua sacola de serviços está vazia.
                  </p>
                  <p className="text-[11px] text-gray-400 max-w-xs">
                    Navegue pela opção COMPRAR no topo para adicionar os serviços que precisa!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <span className="text-xs font-semibold text-gray-400 uppercase">Serviço Escolhido</span>
                    <span className="text-xs font-semibold text-gray-400 uppercase">Valor</span>
                  </div>
                  <div className="space-y-3">
                    {cart.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-md"
                      >
                        <div className="space-y-0.5">
                          <h4 className="font-semibold text-xs uppercase tracking-wider">
                            {item.title}
                          </h4>
                          <p className="text-xs font-bold text-gray-800">R$ {item.price}</p>
                        </div>
                        <button
                          onClick={() => onRemoveFromCart(idx)}
                          className="text-xs text-red-500 hover:text-red-700 font-semibold uppercase tracking-wider cursor-pointer"
                        >
                          Remover
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                    <span className="font-bold text-sm uppercase tracking-wider">Total do Pedido:</span>
                    <span className="font-extrabold text-base text-black">R$ {totalCartPrice}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-4 mt-6">
          {activeDrawer === 'CART' && cart.length > 0 ? (
            <button
              onClick={onCheckout}
              className="w-full bg-black text-white py-3 px-4 rounded-md font-semibold text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors cursor-pointer"
            >
              CONTRATAR SERVIÇOS VIA WHATSAPP <ChevronRight size={16} />
            </button>
          ) : (
            <p className="text-[10px] text-center text-gray-400 font-mono tracking-widest uppercase">
              LINCOLN CORP © 2026 — Dominique AGI ASI CLI 2010/2026
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
