import React from 'react';
import { TOKENS } from '../../components/ui/tokens.jsx';

/**
 * Form error banner — renders nothing when message is empty.
 * @param {object} props
 * @param {string} [props.message] - Error text to display; banner is hidden when empty or undefined
 */
export function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div style={{ background: 'oklch(0.96 0.03 30)', border: '1px solid oklch(0.80 0.10 30)', borderRadius: 10, padding: '10px 14px', fontFamily: TOKENS.font, fontSize: 13, color: 'oklch(0.45 0.18 30)' }}>
      {message}
    </div>
  );
}
