import React from 'react';
import { TOKENS } from './tokens.jsx';

/**
 * Status badge — a monospace pill with customisable colour props.
 * @param {object} props
 * @param {React.ReactNode} props.children - Badge text
 * @param {string} [props.color] - Text colour (CSS value)
 * @param {string} [props.soft] - Background colour (CSS value)
 * @param {'sm'|'md'} [props.size='sm'] - Size variant
 */
export function Pill({ children, color = TOKENS.steel, soft = TOKENS.steelSoft, size = 'sm' }) {
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
