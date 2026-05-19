import React, { useEffect } from 'react';
import { TOKENS } from '../ui/tokens.tsx';

interface FormModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export function FormModal({ children, onClose }: FormModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(20,16,12,0.45)', zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: 460, maxWidth: '100%', height: '100%', background: TOKENS.bg, boxShadow: '-20px 0 40px rgba(0,0,0,0.1)', overflowY: 'auto', position: 'relative' }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, zIndex: 10, appearance: 'none', border: `1px solid ${TOKENS.line}`, background: TOKENS.paper, width: 32, height: 32, borderRadius: 8, cursor: 'pointer', fontFamily: TOKENS.font, fontSize: 18, color: TOKENS.inkSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
