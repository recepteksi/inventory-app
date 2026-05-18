import React from 'react';
import { TOKENS } from '../../components/ui/tokens.jsx';

/**
 * Segment control — tab-style toggle between two or more options.
 * @param {object} props
 * @param {string} props.value - Currently selected option value
 * @param {(value: string) => void} props.onChange - Selection change handler
 * @param {{ value: string, label: string }[]} props.options - Segment options
 */
export function SegmentControl({ value, onChange, options }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${options.length},1fr)`, background: TOKENS.lineSoft, padding: 3, borderRadius: 10 }}>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          style={{
            appearance: 'none', border: 'none', cursor: 'pointer',
            padding: '9px 12px', borderRadius: 8,
            background: value === o.value ? TOKENS.paper : 'transparent',
            color: value === o.value ? TOKENS.ink : TOKENS.inkSoft,
            fontFamily: TOKENS.font, fontWeight: 600, fontSize: 14,
            boxShadow: value === o.value ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
