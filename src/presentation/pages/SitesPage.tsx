import { useState } from 'react';
import { TOKENS, btnPrimaryStyle, btnGhostStyle, btnDangerStyle } from '../components/ui/tokens.tsx';
import { Pill } from '../components/ui/Pill.tsx';
import { FormModal } from '../components/layout/FormModal.tsx';
import { FormShell } from '../forms/FormShell.tsx';
import { Field } from '../forms/primitives/Field.tsx';
import { TextInput } from '../forms/primitives/TextInput.tsx';
import { ErrorBanner } from '../forms/primitives/ErrorBanner.tsx';
import { useStore } from '../store/store.tsx';
import { t } from '../../i18n/tr.ts';
import type { Site } from '../../types/index.ts';

function SiteForm({ editing, onDone }: { editing: Site | null; onDone: () => void }) {
  const { addSite, editSite } = useStore();
  const [name, setName] = useState(editing?.name ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!editing;
  const valid = name.trim().length > 1;

  const submit = async () => {
    if (!valid || loading) return;
    setLoading(true); setError('');
    try {
      if (isEdit) await editSite(editing.id, { name: name.trim() });
      else await addSite({ name: name.trim() });
      onDone();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormShell title={isEdit ? t('sitesPage.editTitle') : t('sitesPage.newTitle')} altTitle={t('sitesPage.formSubtitle')}>
      <Field label={t('sitesPage.fieldName')}>
        <TextInput value={name} onChange={setName} placeholder={t('sitesPage.namePlaceholder')} />
      </Field>
      <ErrorBanner message={error} />
      <div style={{ position: 'sticky', bottom: 0, padding: '12px 0 0', background: `linear-gradient(transparent, ${TOKENS.bg} 30%)` }}>
        <button onClick={() => void submit()} disabled={!valid || loading} style={{ ...btnPrimaryStyle, width: '100%', padding: '14px', opacity: valid && !loading ? 1 : 0.4 }}>
          {loading ? t('common.saving') : t('common.save')}
        </button>
      </div>
    </FormShell>
  );
}

export function SitesPage() {
  const { sites, selectedSiteId, removeSite } = useStore();
  const [error, setError] = useState('');
  const [modal, setModal] = useState<{ kind: 'new' | 'edit'; site: Site | null } | null>(null);

  const remove = async (s: Site) => {
    if (!window.confirm(t('sitesPage.deleteConfirm').replace('{name}', s.name))) return;
    setError('');
    try {
      await removeSite(s.id);
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: 4 }}>
        <div>
          <h1 style={{ fontFamily: TOKENS.font, fontWeight: 600, fontSize: 30, margin: 0, letterSpacing: -0.6 }}>{t('sitesPage.title')}</h1>
          <div style={{ fontFamily: TOKENS.font, fontSize: 14, color: TOKENS.inkSoft, marginTop: 4 }}>{t('sitesPage.subtitle')}</div>
        </div>
        <button onClick={() => setModal({ kind: 'new', site: null })} style={btnPrimaryStyle}>{t('sitesPage.addSite')}</button>
      </div>

      {error && <div style={{ marginTop: 10, padding: '10px 14px', background: 'oklch(0.96 0.03 30)', border: '1px solid oklch(0.80 0.10 30)', borderRadius: 10, fontFamily: TOKENS.font, fontSize: 13, color: 'oklch(0.45 0.18 30)' }}>{error}</div>}

      <div style={{ marginTop: 16, background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 12, overflow: 'hidden' }}>
        {sites.length === 0 ? (
          <div style={{ padding: 30, textAlign: 'center', color: TOKENS.inkMuted, fontFamily: TOKENS.font, fontSize: 14 }}>{t('sitesPage.empty')}</div>
        ) : sites.map((s, i) => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderBottom: i === sites.length - 1 ? 'none' : `1px solid ${TOKENS.lineSoft}` }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: TOKENS.font, fontWeight: 600, fontSize: 14, color: TOKENS.ink }}>{s.name}</div>
              <div style={{ fontFamily: TOKENS.mono, fontSize: 11.5, color: TOKENS.inkMuted }}>{new Date(s.createdAt).toLocaleDateString('tr-TR')}</div>
            </div>
            {s.id === selectedSiteId && <Pill color={TOKENS.ok} soft={TOKENS.okSoft}>{t('topBar.siteSelectLabel')}</Pill>}
            <button onClick={() => setModal({ kind: 'edit', site: s })} style={{ ...btnGhostStyle, fontSize: 13 }}>{t('common.edit')}</button>
            <button onClick={() => void remove(s)} style={{ ...btnDangerStyle, fontSize: 13 }}>{t('common.delete')}</button>
          </div>
        ))}
      </div>

      {modal && (
        <FormModal onClose={() => setModal(null)}>
          <SiteForm editing={modal.site} onDone={() => setModal(null)} />
        </FormModal>
      )}
    </div>
  );
}
