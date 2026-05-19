import { TOKENS } from '../../components/ui/tokens.tsx';

interface ChipPickerProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

export function ChipPicker({ value, onChange, options }: ChipPickerProps) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          style={{
            appearance: 'none',
            border: `1px solid ${value === o ? TOKENS.ink : TOKENS.line}`,
            background: value === o ? TOKENS.ink : TOKENS.paper,
            color: value === o ? '#fff' : TOKENS.ink,
            padding: '7px 12px', borderRadius: 999,
            fontFamily: TOKENS.font, fontWeight: 500, fontSize: 13,
            cursor: 'pointer', whiteSpace: 'nowrap',
          }}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
