import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
      <Toaster
        position="bottom-right"
        richColors
        closeButton
        duration={4000}
        toastOptions={{
          style: {
            fontFamily: "'DM Sans', sans-serif",
            borderRadius: '1rem',
          },
        }}
      />
    </HelmetProvider>
  </StrictMode>
);
