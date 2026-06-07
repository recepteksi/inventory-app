import { TOKENS } from '../../components/ui/tokens.tsx';

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  /** Latest selectable date (YYYY-MM-DD). */
  max?: string;
  /** Earliest selectable date (YYYY-MM-DD). */
  min?: string;
}

export function DateInput({ value, onChange, max, min }: DateInputProps) {
  return (
    <input
      type="date"
      value={value}
      max={max}
      min={min}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%', boxSizing: 'border-box', padding: '12px 14px',
        border: `1px solid ${TOKENS.line}`, borderRadius: 10,
        background: TOKENS.paper, fontFamily: TOKENS.mono,
        fontSize: 15, color: TOKENS.ink, outline: 'none',
      }}
    />
  );
}
