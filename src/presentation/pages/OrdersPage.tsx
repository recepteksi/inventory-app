import { useState } from 'react';
import { TOKENS, btnPrimaryStyle, btnGhostStyle, btnDangerStyle } from '../components/ui/tokens.tsx';
import { Pill } from '../components/ui/Pill.tsx';
import { useStore } from '../store/store.tsx';
import { useAuth } from '../auth/AuthProvider.tsx';
import { formatDate } from '../../utils/formatDate.ts';
import { t } from '../../i18n/tr.ts';

interface OrdersPageProps {
  open: (kind: string, id?: string) => void;
}

export function OrdersPage({ open }: OrdersPageProps) {
  const { orders, approveOrder, removeOrder } = useStore();
  const { user, isAdmin } = useAuth();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const approve = async (id: string) => {
    setBusyId(id); setError('');
    try {
      await approveOrder(id);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm(t('ordersPage.deleteConfirm'))) return;
    setBusyId(id); setError('');
    try {
      await removeOrder(id);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: 4 }}>
        <div>
          <h1 style={{ fontFamily: TOKENS.font, fontWeight: 600, fontSize: 30, margin: 0, letterSpacing: -0.6 }}>{t('ordersPage.title')}</h1>
          <div style={{ fontFamily: TOKENS.font, fontSize: 14, color: TOKENS.inkSoft, marginTop: 4 }}>{t('ordersPage.subtitle')}</div>
        </div>
        <button onClick={() => open('new-order')} style={btnPrimaryStyle}>{t('ordersPage.addOrder')}</button>
      </div>

      {error && <div style={{ marginTop: 10, padding: '10px 14px', background: 'oklch(0.96 0.03 30)', border: '1px solid oklch(0.80 0.10 30)', borderRadius: 10, fontFamily: TOKENS.font, fontSize: 13, color: 'oklch(0.45 0.18 30)' }}>{error}</div>}

      {orders.length === 0 ? (
        <div style={{ marginTop: 40, textAlign: 'center', color: TOKENS.inkMuted, fontFamily: TOKENS.font, fontSize: 14 }}>{t('ordersPage.empty')}</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
          {orders.map((o) => {
            const approved = o.status === 'approved';
            const isCreator = !!user && o.createdById === user.id;
            const canDelete = approved ? isAdmin : (isAdmin || isCreator);
            return (
              <div key={o.id} style={{ background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderBottom: `1px solid ${TOKENS.lineSoft}`, background: TOKENS.bg }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontFamily: TOKENS.mono, fontSize: 12, color: TOKENS.inkMuted }}>{o.id.toUpperCase()}</span>
                      <Pill color={approved ? TOKENS.ok : TOKENS.accent} soft={approved ? TOKENS.okSoft : TOKENS.accentSoft}>
                        {approved ? t('ordersPage.statusApproved') : t('ordersPage.statusPending')}
                      </Pill>
                    </div>
                    <div style={{ fontFamily: TOKENS.font, fontSize: 12.5, color: TOKENS.inkSoft, marginTop: 4 }}>
                      {t('ordersPage.orderDate').replace('{date}', formatDate(o.orderDate))} · {o.createdBy}
                      {o.supplier ? ` · ${o.supplier}` : ''}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {!approved && isAdmin && <button onClick={() => void approve(o.id)} disabled={busyId === o.id} style={{ ...btnPrimaryStyle, fontSize: 13, opacity: busyId === o.id ? 0.5 : 1 }}>{t('ordersPage.approve')}</button>}
                    {canDelete && <button onClick={() => void remove(o.id)} disabled={busyId === o.id} style={{ ...(approved ? btnGhostStyle : btnDangerStyle), fontSize: 13, opacity: busyId === o.id ? 0.5 : 1 }}>{t('common.delete')}</button>}
                  </div>
                </div>
                <div>
                  {o.items.map((it, i) => (
                    <div key={`${o.id}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', borderBottom: i === o.items.length - 1 ? 'none' : `1px solid ${TOKENS.lineSoft}` }}>
                      <div style={{ flex: 1, fontFamily: TOKENS.font, fontSize: 13.5, color: TOKENS.ink }}>{it.materialName}</div>
                      <div style={{ fontFamily: TOKENS.mono, fontSize: 13, fontWeight: 600, color: TOKENS.ink }}>{it.quantity} <span style={{ color: TOKENS.inkMuted, fontSize: 10.5 }}>{it.unit}</span></div>
                    </div>
                  ))}
                </div>
                {o.note && <div style={{ padding: '8px 14px', fontFamily: TOKENS.font, fontSize: 12.5, color: TOKENS.inkSoft, borderTop: `1px solid ${TOKENS.lineSoft}` }}>{o.note}</div>}
                {approved && o.approvedBy && <div style={{ padding: '6px 14px 10px', fontFamily: TOKENS.mono, fontSize: 11, color: TOKENS.inkMuted }}>{t('ordersPage.approvedBy').replace('{name}', o.approvedBy)}</div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
