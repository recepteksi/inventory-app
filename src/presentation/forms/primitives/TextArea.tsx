import { TOKENS } from '../../components/ui/tokens.tsx';

interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TextArea({ value, onChange, placeholder }: TextAreaProps) {
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
