import React, { useState } from 'react';
import type { ModalState, RouteState, Page } from './types/index.ts';
import { TOKENS } from './presentation/components/ui/tokens.tsx';
import { Sidebar } from './presentation/components/layout/Sidebar.tsx';
import { TopBar } from './presentation/components/layout/TopBar.tsx';
import { FormModal } from './presentation/components/layout/FormModal.tsx';
import { LoadingScreen } from './presentation/components/layout/LoadingScreen.tsx';
import { ErrorScreen } from './presentation/components/layout/ErrorScreen.tsx';
import { StockPage } from './presentation/pages/StockPage.tsx';
import { DetailPage } from './presentation/pages/DetailPage.tsx';
import { WorkersPage } from './presentation/pages/WorkersPage.tsx';
import { OrdersPage } from './presentation/pages/OrdersPage.tsx';
import { UsagesPage } from './presentation/pages/UsagesPage.tsx';
import { CatalogPage } from './presentation/pages/CatalogPage.tsx';
import { UsersPage } from './presentation/pages/UsersPage.tsx';
import { SitesPage } from './presentation/pages/SitesPage.tsx';
import { DeliveryForm } from './presentation/forms/DeliveryForm.tsx';
import { UsageForm } from './presentation/forms/UsageForm.tsx';
import { BatchUsageForm } from './presentation/forms/BatchUsageForm.tsx';
import { NewMaterialForm } from './presentation/forms/NewMaterialForm.tsx';
import { EditMaterialForm } from './presentation/forms/EditMaterialForm.tsx';
import { NewWorkerForm } from './presentation/forms/NewWorkerForm.tsx';
import { EditWorkerForm } from './presentation/forms/EditWorkerForm.tsx';
import { NewOrderForm } from './presentation/forms/NewOrderForm.tsx';
import { useStore } from './presentation/store/store.tsx';
import { useAuth } from './presentation/auth/AuthProvider.tsx';

const MODAL_KINDS = ['delivery', 'usage', 'batch-usage', 'new-material', 'edit-material', 'new-worker', 'edit-worker', 'new-order'];

/**
 * Application root. Navigation is driven by three state vars: `page`, `route`, `modal`.
 * Admin-only pages (catalog, users) fall back to the stock page for non-admins.
 */
export default function App() {
  const { loading, error } = useStore();
  const { isAdmin } = useAuth();
  const [page, setPage] = useState<Page>('stock');
  const [route, setRoute] = useState<RouteState | null>(null);
  const [modal, setModal] = useState<ModalState | null>(null);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;

  const open = (kind: string, id?: string): void => {
    if (MODAL_KINDS.includes(kind)) setModal({ kind: kind as ModalState['kind'], id });
    else if (kind === 'detail' && id) setRoute({ kind: 'detail', id });
  };

  const closeModal = () => setModal(null);
  const onNav = (id: Page) => { setRoute(null); setPage(id); };

  let main: React.ReactNode;
  if (route?.kind === 'detail') {
    main = <DetailPage id={route.id} open={open} goBack={() => { setRoute(null); setPage('stock'); }} />;
  } else if (page === 'orders') {
    main = <OrdersPage open={open} />;
  } else if (page === 'usages') {
    main = <UsagesPage open={open} />;
  } else if (page === 'workers') {
    main = <WorkersPage open={open} />;
  } else if (page === 'catalog' && isAdmin) {
    main = <CatalogPage />;
  } else if (page === 'users' && isAdmin) {
    main = <UsersPage />;
  } else if (page === 'sites' && isAdmin) {
    main = <SitesPage />;
  } else {
    main = <StockPage open={open} />;
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
          {modal.kind === 'batch-usage'   && <BatchUsageForm goBack={closeModal} />}
          {modal.kind === 'new-material'  && <NewMaterialForm preset={modal.id} goBack={closeModal} />}
          {modal.kind === 'edit-material' && modal.id && <EditMaterialForm id={modal.id} goBack={closeModal} />}
          {modal.kind === 'new-worker'    && <NewWorkerForm goBack={closeModal} />}
          {modal.kind === 'edit-worker'   && modal.id && <EditWorkerForm id={modal.id} goBack={closeModal} />}
          {modal.kind === 'new-order'     && <NewOrderForm goBack={closeModal} />}
        </FormModal>
      )}
    </div>
  );
}
