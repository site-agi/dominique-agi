import React from 'react';

// Checkerboard grid SVG: viewBox 0 0 36 18, 4 rows of 3.8x3.8 black squares; even rows shifted by 2.25
export const CheckerboardSVG: React.FC<{ className?: string }> = ({ className }) => {
  const rows = 4;
  const cols = 7;
  const squareSize = 3.8;
  const gapY = 0.7;
  const gapX = 1.2;

  const squares = [];
  for (let r = 0; r < rows; r++) {
    const shiftX = r % 2 === 1 ? 2.25 : 0;
    for (let c = 0; c < cols; c++) {
      const x = shiftX + c * (squareSize + gapX);
      const y = r * (squareSize + gapY);
      if (x + squareSize <= 36) {
        squares.push(
          <rect
            key={`${r}-${c}`}
            x={x}
            y={y}
            width={squareSize}
            height={squareSize}
            fill="black"
          />
        );
      }
    }
  }

  return (
    <svg
      viewBox="0 0 36 18"
      className={className}
      style={{
        width: 'var(--checker-w)',
        height: 'var(--checker-h)',
        transform: 'translateY(2px)',
        display: 'inline-block',
      }}
    >
      {squares}
    </svg>
  );
};

// Wireframe globe SVG (viewBox 0 0 64 64, stroke 1.2: outer circle r=28, equator line, 2 horizontal ellipses, meridian line, 2 vertical ellipses)
export const WireframeGlobeSVG: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    className={`${className || ''} animate-globe`}
    style={{ width: 'var(--globe)', height: 'var(--globe)' }}
  >
    {/* Outer circle */}
    <circle cx="32" cy="32" r="28" />
    {/* Equator line */}
    <line x1="4" y1="32" x2="60" y2="32" />
    {/* Meridian line */}
    <line x1="32" y1="4" x2="32" y2="60" />
    {/* Horizontal ellipses */}
    <ellipse cx="32" cy="32" rx="28" ry="14" />
    <ellipse cx="32" cy="32" rx="28" ry="22" />
    {/* Vertical ellipses */}
    <ellipse cx="32" cy="32" rx="14" ry="28" />
    <ellipse cx="32" cy="32" rx="22" ry="28" />
  </svg>
);

// L-corner brackets
export const CornerBracketTL: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
    style={{ width: 'var(--corner)', height: 'var(--corner)' }}
  >
    <path d="M0 11.5V0.5H11.5" />
  </svg>
);

export const CornerBracketTR: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
    style={{ width: 'var(--corner)', height: 'var(--corner)' }}
  >
    <path d="M0.5 0.5H11.5V11.5" />
  </svg>
);

export const CornerBracketBL: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
    style={{ width: 'var(--corner)', height: 'var(--corner)' }}
  >
    <path d="M0 0.5V11.5H11.5" />
  </svg>
);

export const CornerBracketBR: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    className={className}
    style={{ width: 'var(--corner)', height: 'var(--corner)' }}
  >
    <path d="M0.5 11.5H11.5V0.5" />
  </svg>
);
