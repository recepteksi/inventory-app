import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { StoreProvider } from './presentation/store/store.tsx';

createRoot(document.getElementById('root')!).render(
  <StoreProvider>
    <App />
  </StoreProvider>
);
