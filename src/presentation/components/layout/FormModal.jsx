import React, { useEffect } from 'react';
import { TOKENS } from '../ui/tokens.jsx';

/**
 * Full-height drawer that slides in from the right.
 * Clicking the backdrop or pressing Escape closes it.
 * @param {object} props
 * @param {React.ReactNode} props.children - Drawer content (typically a form)
 * @param {() => void} props.onClose - Close handler
 */
export function FormModal({ children, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
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
