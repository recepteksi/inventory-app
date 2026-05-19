import { TOKENS } from '../../components/ui/tokens.tsx';

interface NumInputProps {
  value: string;
  onChange: (value: string) => void;
  suffix?: string;
  warn?: boolean | null;
}

export function NumInput({ value, onChange, suffix, warn }: NumInputProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${warn ? TOKENS.low : TOKENS.line}`, borderRadius: 10, background: TOKENS.paper, padding: '0 14px' }}>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ''))}
        placeholder="0"
        inputMode="decimal"
        style={{ flex: 1, padding: '12px 0', border: 'none', outline: 'none', background: 'transparent', fontFamily: TOKENS.mono, fontSize: 17, color: TOKENS.ink, fontWeight: 600 }}
      />
      {suffix && <span style={{ fontFamily: TOKENS.mono, fontSize: 13, color: TOKENS.inkMuted }}>{suffix}</span>}
    </div>
  );
}
