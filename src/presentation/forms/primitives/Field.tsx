import React from 'react';
import { TOKENS } from '../../components/ui/tokens.tsx';

interface FieldProps {
  label: string;
  optional?: boolean;
  hint?: string | null;
  children: React.ReactNode;
}

export function Field({ label, optional, hint, children }: FieldProps) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6, gap: 8 }}>
        <label style={{ fontFamily: TOKENS.font, fontSize: 13, fontWeight: 600, color: TOKENS.ink, whiteSpace: 'nowrap' }}>
          {label}{' '}
          {optional && <span style={{ color: TOKENS.inkMuted, fontWeight: 400 }}>(opsiyonel)</span>}
        </label>
        {hint && <span style={{ fontFamily: TOKENS.mono, fontSize: 11, color: TOKENS.low, fontWeight: 600 }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}
