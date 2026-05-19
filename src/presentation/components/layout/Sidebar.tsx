import { TOKENS } from '../ui/tokens.tsx';
import { NavIcon } from './NavIcon.tsx';
import { tr } from '../../../i18n/tr.ts';

const NAV: { id: string; label: string; icon: 'box' | 'person' }[] = [
  { id: 'stock',   label: tr.nav.stock,   icon: 'box'    },
  { id: 'workers', label: tr.nav.workers, icon: 'person' },
];

interface SidebarProps {
  active: string;
  onNav: (id: string) => void;
}

export function Sidebar({ active, onNav }: SidebarProps) {
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
        {NAV.map((n) => (
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
        <div style={{ width: 32, height: 32, borderRadius: 7, background: 'oklch(0.88 0.05 60)', color: 'oklch(0.32 0.08 60)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: TOKENS.font, fontSize: 12, fontWeight: 700 }}>EK</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: TOKENS.font, fontSize: 13, fontWeight: 600, color: TOKENS.ink }}>{tr.nav.userName}</div>
          <div style={{ fontFamily: TOKENS.mono, fontSize: 10, color: TOKENS.inkMuted, letterSpacing: 0.5 }}>{tr.nav.userRole}</div>
        </div>
      </div>
    </aside>
  );
}
