import React from 'react';
import { TOKENS } from '../components/ui/tokens.jsx';
import { Sub } from '../components/ui/Sub.jsx';

/**
 * Layout shell for the form drawer — provides a top header and a content column below.
 * @param {object} props
 * @param {string} props.title - Main heading (h1)
 * @param {string} [props.altTitle] - Small monospace label above the heading
 * @param {React.ReactNode} props.children - Form fields
 */
export function FormShell({ title, altTitle, children }) {
  return (
    <div style={{ paddingBottom: 60 }}>
      <div style={{ padding: '0 24px', paddingTop: 56 }}>
        <Sub>{altTitle}</Sub>
        <h1 style={{ fontFamily: TOKENS.font, fontWeight: 600, fontSize: 26, margin: '4px 0 18px', letterSpacing: -0.4 }}>
          {title}
        </h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
