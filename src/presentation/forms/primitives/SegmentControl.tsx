import { TOKENS } from '../../components/ui/tokens.tsx';

interface SegmentOption {
  value: string;
  label: string;
}

interface SegmentControlProps {
  value: string;
  onChange: (value: string) => void;
  options: SegmentOption[];
}

export function SegmentControl({ value, onChange, options }: SegmentControlProps) {
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
