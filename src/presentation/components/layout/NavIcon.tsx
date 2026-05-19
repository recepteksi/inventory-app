import { IconBox, IconPerson } from '../ui/Icons.tsx';

interface NavIconProps {
  kind: 'box' | 'person';
  active: boolean;
}

export function NavIcon({ kind, active }: NavIconProps) {
  if (kind === 'box') return <IconBox active={active} />;
  if (kind === 'person') return <IconPerson active={active} />;
  return null;
}
