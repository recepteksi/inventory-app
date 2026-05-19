import { TOKENS } from './tokens.tsx';

interface ArrowProps {
  dir?: 'right' | 'left' | 'up' | 'down';
  size?: number;
  color?: string;
}

export function IconArrow({ dir = 'right', size = 14, color = TOKENS.inkSoft }: ArrowProps) {
  const rot = { right: 0, left: 180, up: -90, down: 90 }[dir];
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ transform: `rotate(${rot}deg)` }}>
      <path d="M5 3 L10 8 L5 13" stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface PlusProps {
  size?: number;
  color?: string;
  weight?: number;
}

export function IconPlus({ size = 16, color = '#fff', weight = 2 }: PlusProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16">
      <path d="M8 3 V13 M3 8 H13" stroke={color} strokeWidth={weight} strokeLinecap="round" />
    </svg>
  );
}

interface CheckProps {
  size?: number;
  color?: string;
}

export function IconCheck({ size = 14, color = '#fff' }: CheckProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16">
      <path d="M3 8 L7 12 L13 4" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface SearchProps {
  size?: number;
  color?: string;
}

export function IconSearch({ size = 16, color = TOKENS.inkSoft }: SearchProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16">
      <circle cx="7" cy="7" r="4.5" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M10.5 10.5 L14 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

interface ActiveProps {
  active?: boolean;
}

export function IconBox({ active }: ActiveProps) {
  const c = active ? TOKENS.ink : TOKENS.inkMuted;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 7 L12 3 L21 7 L12 11 Z" stroke={c} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M3 7 V17 L12 21 L21 17 V7" stroke={c} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 11 V21" stroke={c} strokeWidth="1.6" />
    </svg>
  );
}

export function IconPerson({ active }: ActiveProps) {
  const c = active ? TOKENS.ink : TOKENS.inkMuted;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.5" stroke={c} strokeWidth="1.6" />
      <path d="M4 20 C 5 15 8 13 12 13 C 16 13 19 15 20 20" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
