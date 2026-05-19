import React from 'react';
import { TOKENS } from './tokens.tsx';

interface ChipProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

export function Chip({ children, active, onClick }: ChipProps) {
  return (
    <button
      onClick={onClick}
      style={{
        appearance: 'none',
        border: `1px solid ${active ? TOKENS.ink : TOKENS.line}`,
        background: active ? TOKENS.ink : TOKENS.paper,
        color: active ? '#fff' : TOKENS.ink,
        padding: '7px 12px',
        borderRadius: 999,
        fontFamily: TOKENS.font,
        fontWeight: 500,
        fontSize: 13,
        letterSpacing: 0.1,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  );
}
