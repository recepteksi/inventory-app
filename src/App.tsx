import React, { useState } from 'react';
import type { ModalState, RouteState } from './types/index.ts';
import { TOKENS } from './presentation/components/ui/tokens.tsx';
import { Sidebar } from './presentation/components/layout/Sidebar.tsx';
import { TopBar } from './presentation/components/layout/TopBar.tsx';
import { FormModal } from './presentation/components/layout/FormModal.tsx';
import { LoadingScreen } from './presentation/components/layout/LoadingScreen.tsx';
import { ErrorScreen } from './presentation/components/layout/ErrorScreen.tsx';
import { StockPage } from './presentation/pages/StockPage.tsx';
import { DetailPage } from './presentation/pages/DetailPage.tsx';
import { WorkersPage } from './presentation/pages/WorkersPage.tsx';
import { DeliveryForm } from './presentation/forms/DeliveryForm.tsx';
import { UsageForm } from './presentation/forms/UsageForm.tsx';
import { NewMaterialForm } from './presentation/forms/NewMaterialForm.tsx';
import { EditMaterialForm } from './presentation/forms/EditMaterialForm.tsx';
import { NewWorkerForm } from './presentation/forms/NewWorkerForm.tsx';
import { EditWorkerForm } from './presentation/forms/EditWorkerForm.tsx';
import { useStore } from './presentation/store/store.tsx';

/**
 * Application root component.
 * All navigation is driven by three state vars: `page`, `route`, and `modal`.
 *
 * - `page`: active top-level page ('stock' | 'workers')
 * - `route`: detail sub-page ({ kind:'detail', id }) or null
 * - `modal`: open form drawer ({ kind, id? }) or null
 *
 * Modal kinds: 'delivery' · 'usage' · 'new-material' · 'edit-material' · 'new-worker' · 'edit-worker'
 */
export default function App() {
  const { loading, error } = useStore();
  const [page, setPage] = useState<'stock' | 'workers'>('stock');
  const [route, setRoute] = useState<RouteState | null>(null);
  const [modal, setModal] = useState<ModalState | null>(null);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;

  /** Opens a modal form drawer or navigates to a detail sub-page. */
  const open = (kind: string, id?: string): void => {
    const modals = ['delivery', 'usage', 'new-material', 'edit-material', 'new-worker', 'edit-worker'];
    if (modals.includes(kind)) {
      setModal({ kind: kind as ModalState['kind'], id });
    } else if (kind === 'detail' && id) {
      setRoute({ kind: 'detail', id });
    }
  };

  const closeModal = () => setModal(null);
  const onNav = (id: string) => { setRoute(null); setPage(id as 'stock' | 'workers'); };

  let main: React.ReactNode;
  if (route?.kind === 'detail') {
    main = <DetailPage id={route.id} open={open} goBack={() => { setRoute(null); setPage('stock'); }} />;
  } else if (page === 'stock') {
    main = <StockPage open={open} />;
  } else if (page === 'workers') {
    main = <WorkersPage open={open} />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: TOKENS.bg, fontFamily: TOKENS.font, color: TOKENS.ink }}>
      <Sidebar active={page} onNav={onNav} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <TopBar />
        <main style={{ padding: '24px 32px 60px', maxWidth: 1400, width: '100%', boxSizing: 'border-box' }}>
          {main}
        </main>
      </div>

      {modal && (
        <FormModal onClose={closeModal}>
          {modal.kind === 'delivery'      && <DeliveryForm presetId={modal.id} goBack={closeModal} />}
          {modal.kind === 'usage'         && <UsageForm presetId={modal.id} goBack={closeModal} />}
          {modal.kind === 'new-material'  && <NewMaterialForm preset={modal.id} goBack={closeModal} />}
          {modal.kind === 'edit-material' && modal.id && <EditMaterialForm id={modal.id} goBack={closeModal} />}
          {modal.kind === 'new-worker'    && <NewWorkerForm goBack={closeModal} />}
          {modal.kind === 'edit-worker'   && modal.id && <EditWorkerForm id={modal.id} goBack={closeModal} />}
        </FormModal>
      )}
    </div>
  );
}
