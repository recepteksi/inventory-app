import { TOKENS } from '../ui/tokens.tsx';
import { NavIcon, type NavIconKind } from './NavIcon.tsx';
import { useAuth } from '../../auth/AuthProvider.tsx';
import { tr } from '../../../i18n/tr.ts';
import type { Page } from '../../../types/index.ts';

const NAV: { id: Page; label: string; icon: NavIconKind; adminOnly?: boolean }[] = [
  { id: 'stock',   label: tr.nav.stock,   icon: 'box'     },
  { id: 'usages',  label: tr.nav.usages,  icon: 'usage'   },
  { id: 'orders',  label: tr.nav.orders,  icon: 'order'   },
  { id: 'workers', label: tr.nav.workers, icon: 'person'  },
  { id: 'catalog', label: tr.nav.catalog, icon: 'catalog', adminOnly: true },
  { id: 'sites',   label: tr.nav.sites,   icon: 'site',    adminOnly: true },
  { id: 'users',   label: tr.nav.users,   icon: 'users',   adminOnly: true },
];

interface SidebarProps {
  active: Page;
  onNav: (id: Page) => void;
}

function initials(name: string): string {
  return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
}

export function Sidebar({ active, onNav }: SidebarProps) {
  const { user, isAdmin, logout } = useAuth();
  const items = NAV.filter((n) => !n.adminOnly || isAdmin);

  return (
    <aside style={{ width: 220, flexShrink: 0, background: TOKENS.paper, borderRight: `1px solid ${TOKENS.line}`, display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' }}>
      <div style={{ padding: '20px 20px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, background: TOKENS.ink, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M4 8 L12 4 L20 8 L12 12 Z" fill="#fff" />
            <path d="M4 8 V16 L12 20 L20 16 V8" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
            <path d="M12 12 V20" stroke="#fff" strokeWidth="1.5" />
          </svg>
        </div>
        <div>
          <div style={{ fontFamily: TOKENS.font, fontWeight: 700, fontSize: 14, color: TOKENS.ink, letterSpacing: -0.1 }}>{tr.nav.brand}</div>
          <div style={{ fontFamily: TOKENS.mono, fontSize: 9.5, color: TOKENS.inkMuted, letterSpacing: 1, textTransform: 'uppercase' }}>{tr.nav.brandSub}</div>
        </div>
      </div>

      <div style={{ padding: '4px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((n) => (
          <button
            key={n.id}
            onClick={() => onNav(n.id)}
            style={{
              appearance: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px',
              background: active === n.id ? TOKENS.bg : 'transparent',
              color: active === n.id ? TOKENS.ink : TOKENS.inkSoft,
              fontFamily: TOKENS.font, fontWeight: active === n.id ? 600 : 500,
              fontSize: 14, borderRadius: 8,
            }}
          >
            <NavIcon kind={n.icon} active={active === n.id} />
            {n.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1 }} />
      <div style={{ padding: '14px 16px', borderTop: `1px solid ${TOKENS.line}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 7, background: 'oklch(0.88 0.05 60)', color: 'oklch(0.32 0.08 60)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TOKENS.font, fontSize: 12, fontWeight: 700 }}>{initials(user?.name ?? '?')}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: TOKENS.font, fontSize: 13, fontWeight: 600, color: TOKENS.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
          <div style={{ fontFamily: TOKENS.mono, fontSize: 10, color: TOKENS.inkMuted, letterSpacing: 0.5 }}>{isAdmin ? tr.nav.roleAdmin : tr.nav.roleNormal}</div>
        </div>
        <button onClick={() => void logout()} title={tr.nav.logout} style={{ appearance: 'none', border: `1px solid ${TOKENS.line}`, background: TOKENS.bg, width: 30, height: 30, borderRadius: 7, cursor: 'pointer', color: TOKENS.inkSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 4 H6 a2 2 0 0 0-2 2 V18 a2 2 0 0 0 2 2 H9" stroke={TOKENS.inkSoft} strokeWidth="1.6" strokeLinecap="round" />
            <path d="M14 8 L18 12 L14 16 M18 12 H9" stroke={TOKENS.inkSoft} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
