import { TOKENS } from '../ui/tokens.tsx';
import { tr } from '../../../i18n/tr.ts';

export function TopBar() {
  const today = new Date().toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 30, background: `${TOKENS.bg}f2`, backdropFilter: 'blur(8px)', borderBottom: `1px solid ${TOKENS.line}`, padding: '10px 32px' }}>
      <div style={{ fontFamily: TOKENS.mono, fontSize: 11, color: TOKENS.inkMuted, letterSpacing: 0.5 }}>
        {tr.nav.siteLabel}
        <span style={{ margin: '0 8px', color: TOKENS.line }}>|</span>
        {today}
      </div>
    </div>
  );
}
