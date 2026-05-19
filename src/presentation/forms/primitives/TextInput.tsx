import { TOKENS } from '../../components/ui/tokens.tsx';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  mono?: boolean;
}

export function TextInput({ value, onChange, placeholder, mono }: TextInputProps) {
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
