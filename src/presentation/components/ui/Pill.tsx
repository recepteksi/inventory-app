import React from 'react';
import { TOKENS } from './tokens.tsx';

interface PillProps {
  children: React.ReactNode;
  color?: string;
  soft?: string;
  size?: 'sm' | 'md';
}

export function Pill({ children, color = TOKENS.steel, soft = TOKENS.steelSoft, size = 'sm' }: PillProps) {
  return (
    <span
      style={{
        background: soft,
        color,
        padding: size === 'sm' ? '3px 8px' : '5px 10px',
        borderRadius: 6,
        fontFamily: TOKENS.mono,
        fontSize: size === 'sm' ? 10.5 : 12,
        fontWeight: 600,
        letterSpacing: 0.6,
      }}
    >
      {children}
    </span>
  );
}
