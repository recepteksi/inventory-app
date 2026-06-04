import { TOKENS } from '../ui/tokens.tsx';
import { tr, t } from '../../../i18n/tr.ts';
import { useStore } from '../../store/store.tsx';
import { useAuth } from '../../auth/AuthProvider.tsx';

export function TopBar() {
  const { sites, selectedSiteId, selectSite } = useStore();
  const { isAdmin } = useAuth();
  const today = new Date().toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const hasSites = sites.length > 0;

  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 30, background: `${TOKENS.bg}f2`, backdropFilter: 'blur(8px)', borderBottom: `1px solid ${TOKENS.line}`, padding: '10px 32px', display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: TOKENS.mono, fontSize: 11, color: TOKENS.inkMuted, letterSpacing: 0.5 }}>{tr.nav.siteLabel}</span>
        {hasSites ? (
          <select
            value={selectedSiteId ?? ''}
            onChange={(e) => void selectSite(e.target.value)}
            style={{ appearance: 'none', border: `1px solid ${TOKENS.line}`, background: TOKENS.paper, color: TOKENS.ink, fontFamily: TOKENS.font, fontWeight: 600, fontSize: 13, padding: '6px 28px 6px 10px', borderRadius: 8, cursor: 'pointer', backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 16 16\'><path d=\'M4 6 L8 10 L12 6\' stroke=\'%238C8378\' stroke-width=\'1.6\' fill=\'none\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/></svg>")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 9px center' }}
          >
            {sites.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        ) : (
          <span style={{ fontFamily: TOKENS.font, fontSize: 12, fontWeight: 600, color: TOKENS.low }}>
            {t('topBar.noSites')} · {isAdmin ? t('topBar.noSitesAdmin') : t('topBar.noSitesUser')}
          </span>
        )}
      </div>
      <div style={{ flex: 1 }} />
      <div style={{ fontFamily: TOKENS.mono, fontSize: 11, color: TOKENS.inkMuted, letterSpacing: 0.5 }}>
        {today}
      </div>
    </div>
  );
}
