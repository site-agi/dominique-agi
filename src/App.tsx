import React, { useState } from 'react';
import { ShoppingBag, ArrowUpRight, Check } from 'lucide-react';
import { ImageRevealBackground } from './components/ImageRevealBackground';
import {
  CheckerboardSVG,
  WireframeGlobeSVG,
  CornerBracketTL,
  CornerBracketTR,
  CornerBracketBL,
  CornerBracketBR,
} from './components/CustomIcons';
import { Drawers, DrawerType, CartItem } from './components/Drawers';
import { ChatWidget } from './components/ChatWidget';

const BG_IMAGE_1 = "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260802_074534_f0d9d476-3f86-4c67-9b12-dfc63d99da41.png&w=1920&q=85";

export const App: React.FC = () => {
  const [activeDrawer, setActiveDrawer] = useState<DrawerType>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleAddToCart = (item: { id: string; title: string; price: number }) => {
    setCart((prev) => [...prev, item]);
    showToast(`Adicionado "${item.title}" à sua sacola.`);
  };

  const handleRemoveFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCheckout = () => {
    const total = cart.reduce((acc, item) => acc + item.price, 0);
    const listStr = cart.map((item, i) => `${i + 1}. ${item.title} (R$ ${item.price})`).join('%0A');
    const waUrl = `https://wa.me/5574999281423?text=Olá%20Lincoln%20Corp!%20Gostaria%20de%20contratar%20os%20seguintes%20serviços:%0A%0A${listStr}%0A%0ATotal:%20R$%20${total}`;

    showToast('Abrindo WhatsApp para contratação dos serviços...');
    window.open(waUrl, '_blank');
    setCart([]);
    setActiveDrawer(null);
  };

  return (
    <div className="min-h-screen bg-white text-black font-jakarta flex flex-col justify-between relative overflow-hidden select-none">
      {/* 1. Dual-Image Reveal Interactive Background (Desktop LG+) */}
      <ImageRevealBackground />

      {/* Toast Notification Top-Right */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-black text-white px-4 py-3 rounded-md shadow-2xl flex items-center gap-3 text-xs font-semibold uppercase tracking-wider animate-bounce">
          <Check size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2. Header (z-20) */}
      <header
        className="relative z-20 flex items-center justify-between"
        style={{
          paddingInline: 'var(--pad-x)',
          paddingTop: 'var(--header-pt)',
          paddingBottom: 'var(--section-gap)',
        }}
      >
        {/* Logo */}
        <button
          onClick={() => setActiveDrawer(null)}
          className="font-orbitron font-black text-black tracking-[0.15em] hover:opacity-80 transition-opacity flex items-center"
          style={{ fontSize: 'var(--logo)' }}
        >
          <span>LINCOLN CORP</span>
          <span
            className="font-orbitron font-bold -mt-0.5 ml-0.5"
            style={{ fontSize: 'var(--logo-deg)' }}
          >
            ˚
          </span>
        </button>

        {/* Nav Links */}
        <nav
          className="flex items-center flex-wrap justify-end font-jakarta font-medium uppercase tracking-[0.12em] sm:tracking-[0.2em] max-w-full"
          style={{
            fontSize: 'var(--nav)',
            gap: 'clamp(0.5rem, 1.5vw, var(--gap-nav))',
          }}
        >
          <button
            onClick={() => setActiveDrawer('SHOP')}
            className="hover:opacity-50 transition-opacity cursor-pointer whitespace-nowrap"
          >
            COMPRAR
          </button>
          <button
            onClick={() => setActiveDrawer('COLLECTIONS')}
            className="hover:opacity-50 transition-opacity cursor-pointer whitespace-nowrap"
          >
            SOLUÇÕES
          </button>
          <button
            onClick={() => setActiveDrawer('JOURNAL')}
            className="hover:opacity-50 transition-opacity cursor-pointer whitespace-nowrap"
          >
            CONTATO
          </button>

          {/* Divider */}
          <span className="text-gray-300 font-normal hidden sm:inline">|</span>

          {/* Cart Icon Button - Prominent & Auto-Fit */}
          <button
            onClick={() => setActiveDrawer('CART')}
            className="relative bg-black text-white hover:bg-gray-800 transition-all flex items-center gap-1.5 px-2.5 py-1 rounded-full cursor-pointer shadow-sm shrink-0"
            aria-label="Shopping Bag"
          >
            <ShoppingBag
              strokeWidth={1.8}
              style={{ width: 'var(--icon)', height: 'var(--icon)' }}
            />
            <span className="text-[10px] font-bold tracking-wider">
              SACOLA ({cart.length})
            </span>
          </button>
        </nav>
      </header>

      {/* 3. Main Hero (flex-1 z-10) */}
      <main
        className="relative z-10 flex-1 flex flex-col justify-center lg:flex-row lg:items-center lg:justify-between"
        style={{
          paddingInline: 'var(--pad-x)',
          paddingBlock: 'var(--main-py)',
        }}
      >
        {/* Left Block */}
        <div className="flex flex-col items-start justify-center space-y-6 max-w-3xl">
          {/* Top-Left Corner Bracket */}
          <CornerBracketTL className="text-black mb-1" />

          {/* Main Headline */}
          <h1
            className="font-orbitron font-extrabold uppercase text-black tracking-[0.08em] leading-[1.05]"
            style={{ fontSize: 'var(--headline)' }}
          >
            <div>DOMINIQUE</div>
            <div className="flex items-center gap-3">
              <span>AGI</span>
              <CheckerboardSVG />
            </div>
          </h1>

          {/* Bottom-Left Corner Bracket */}
          <CornerBracketBL className="text-black mt-1" />

          {/* CTA Button */}
          <button
            onClick={() => setActiveDrawer('SHOP')}
            className="group inline-flex items-center border border-gray-400 rounded-md uppercase tracking-[0.18em] font-semibold text-black hover:bg-black hover:text-white hover:border-black transition-all cursor-pointer mt-4"
            style={{
              fontSize: 'var(--body)',
              paddingInline: 'var(--btn-px)',
              paddingBlock: 'var(--btn-py)',
              gap: 'var(--btn-gap)',
            }}
          >
            <span>COMPRAR</span>
            <ArrowUpRight
              size={18}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </button>
        </div>

        {/* Right Lower Feature Block (desktop bottom-aligned) */}
        <div className="mt-8 lg:mt-0 lg:self-end z-20">
          <ChatWidget onOpenShop={() => setActiveDrawer('SHOP')} />
        </div>
      </main>



      {/* 4. Side Drawers Component */}
      <Drawers
        activeDrawer={activeDrawer}
        onClose={() => setActiveDrawer(null)}
        cart={cart}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

export default App;
