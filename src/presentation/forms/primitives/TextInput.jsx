import React from 'react';
import { TOKENS } from '../../components/ui/tokens.jsx';

/**
 * Single-line text input.
 * @param {object} props
 * @param {string} props.value - Controlled value
 * @param {(value: string) => void} props.onChange - Change handler
 * @param {string} [props.placeholder] - Placeholder text
 * @param {boolean} [props.mono] - When true, uses the monospace font
 */
export function TextInput({ value, onChange, placeholder, mono }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', boxSizing: 'border-box', padding: '12px 14px',
        border: `1px solid ${TOKENS.line}`, borderRadius: 10,
        background: TOKENS.paper, fontFamily: mono ? TOKENS.mono : TOKENS.font,
        fontSize: 15, color: TOKENS.ink, outline: 'none',
      }}
    />
  );
}
