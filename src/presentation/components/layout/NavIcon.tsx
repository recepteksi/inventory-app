import { IconBox, IconPerson, IconOrder, IconUsage, IconCatalog, IconUsers, IconSite } from '../ui/Icons.tsx';

export type NavIconKind = 'box' | 'person' | 'order' | 'usage' | 'catalog' | 'users' | 'site';

interface NavIconProps {
  kind: NavIconKind;
  active: boolean;
}

export function NavIcon({ kind, active }: NavIconProps) {
  switch (kind) {
    case 'box': return <IconBox active={active} />;
    case 'person': return <IconPerson active={active} />;
    case 'order': return <IconOrder active={active} />;
    case 'usage': return <IconUsage active={active} />;
    case 'catalog': return <IconCatalog active={active} />;
    case 'users': return <IconUsers active={active} />;
    case 'site': return <IconSite active={active} />;
    default: return null;
  }
}
