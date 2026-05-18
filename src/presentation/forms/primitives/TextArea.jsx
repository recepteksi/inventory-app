import React from 'react';
import { TOKENS } from '../../components/ui/tokens.jsx';

/**
 * Multi-line text area — for longer text such as job descriptions.
 * @param {object} props
 * @param {string} props.value - Controlled value
 * @param {(value: string) => void} props.onChange - Change handler
 * @param {string} [props.placeholder] - Placeholder text
 */
export function TextArea({ value, onChange, placeholder }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      style={{
        width: '100%', boxSizing: 'border-box', padding: '12px 14px',
        border: `1px solid ${TOKENS.line}`, borderRadius: 10,
        background: TOKENS.paper, fontFamily: TOKENS.font,
        fontSize: 15, color: TOKENS.ink, outline: 'none', resize: 'none',
      }}
    />
  );
}
