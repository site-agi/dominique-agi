import React, { useEffect, useRef, useState } from 'react';

const BG_IMAGE_1 = "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260802_074534_f0d9d476-3f86-4c67-9b12-dfc63d99da41.png&w=1920&q=85";
const BG_IMAGE_2 = "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260802_075145_1b557479-775b-43af-8270-f45d79d97d5a.png&w=1920&q=85";

export const ImageRevealBackground: React.FC = () => {
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const smoothRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const gridOffsetRef = useRef({ x: 0, y: 0 });
  const revealLayerRef = useRef<HTMLDivElement>(null);
  const userInteractedRef = useRef<boolean>(false);
  const autoTimeRef = useRef<number>(0);

  const [gridCellSize, setGridCellSize] = useState(48);
  const [gridOffset, setGridOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      userInteractedRef.current = true;
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }
      mouseRef.current = { x: clientX, y: clientY };
    };

    const updateCellSize = () => {
      const cell = Math.round(Math.min(64, Math.max(36, window.innerWidth * 0.028)));
      setGridCellSize(cell);
    };

    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove);
    window.addEventListener('touchstart', handlePointerMove);
    window.addEventListener('resize', updateCellSize);
    updateCellSize();

    // Offscreen canvas setup
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    const handleCanvasResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleCanvasResize);

    let animationFrameId: number;

    const render = () => {
      // Auto animation loop if no user interaction yet (ambient floating spotlight)
      if (!userInteractedRef.current) {
        autoTimeRef.current += 0.015;
        const cx = window.innerWidth / 2 + Math.sin(autoTimeRef.current) * (window.innerWidth * 0.25);
        const cy = window.innerHeight / 2 + Math.cos(autoTimeRef.current * 0.8) * (window.innerHeight * 0.2);
        mouseRef.current = { x: cx, y: cy };
      }

      const mouse = mouseRef.current;
      const smooth = smoothRef.current;

      // Ease spotlight (smoothing factor 0.1)
      smooth.x += (mouse.x - smooth.x) * 0.1;
      smooth.y += (mouse.y - smooth.y) * 0.1;

      // Ease grid parallax
      const normX = (smooth.x / window.innerWidth) - 0.5;
      const normY = (smooth.y / window.innerHeight) - 0.5;
      const targetGridX = normX * 16;
      const targetGridY = normY * 16;

      gridOffsetRef.current.x += (targetGridX - gridOffsetRef.current.x) * 0.06;
      gridOffsetRef.current.y += (targetGridY - gridOffsetRef.current.y) * 0.06;

      setGridOffset({ x: gridOffsetRef.current.x, y: gridOffsetRef.current.y });

      // Draw spotlight mask on canvas
      if (ctx && revealLayerRef.current) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const radius = Math.round(Math.min(420, Math.max(160, window.innerWidth * 0.2)));

        const gradient = ctx.createRadialGradient(smooth.x, smooth.y, 0, smooth.x, smooth.y, radius);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.4, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.6, 'rgba(255,255,255,0.75)');
        gradient.addColorStop(0.75, 'rgba(255,255,255,0.4)');
        gradient.addColorStop(0.88, 'rgba(255,255,255,0.12)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(smooth.x, smooth.y, radius, 0, Math.PI * 2);
        ctx.fill();

        const dataUrl = canvas.toDataURL();
        revealLayerRef.current.style.maskImage = `url(${dataUrl})`;
        revealLayerRef.current.style.webkitMaskImage = `url(${dataUrl})`;
        revealLayerRef.current.style.maskSize = '100% 100%';
        revealLayerRef.current.style.webkitMaskSize = '100% 100%';
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchstart', handlePointerMove);
      window.removeEventListener('resize', updateCellSize);
      window.removeEventListener('resize', handleCanvasResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 1. Base Layer */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-300"
        style={{ backgroundImage: `url("${BG_IMAGE_1}")` }}
      />

      {/* 2. Reveal Layer with Canvas Mask */}
      <div 
        ref={revealLayerRef}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url("${BG_IMAGE_2}")` }}
      />

      {/* 3. Subtle SVG Grid Overlay */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none">
        <defs>
          <pattern
            id="bg-grid-pattern"
            width={gridCellSize}
            height={gridCellSize}
            patternUnits="userSpaceOnUse"
            x={gridOffset.x}
            y={gridOffset.y}
          >
            <path
              d={`M ${gridCellSize} 0 L 0 0 0 ${gridCellSize}`}
              fill="none"
              stroke="#64748b"
              strokeWidth="0.6"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bg-grid-pattern)" />
      </svg>
    </div>
  );
};
