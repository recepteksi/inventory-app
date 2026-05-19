import React from 'react';
import { TOKENS } from './tokens.tsx';

interface SubProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function Sub({ children, style }: SubProps) {
  return (
    <div
      style={{
        fontFamily: TOKENS.mono,
        fontSize: 10.5,
        letterSpacing: 1.2,
        color: TOKENS.inkMuted,
        textTransform: 'uppercase',
        fontWeight: 500,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
