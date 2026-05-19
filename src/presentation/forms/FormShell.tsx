import React from 'react';
import { TOKENS } from '../components/ui/tokens.tsx';
import { Sub } from '../components/ui/Sub.tsx';

interface FormShellProps {
  title: string;
  altTitle?: string;
  children: React.ReactNode;
}

export function FormShell({ title, altTitle, children }: FormShellProps) {
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
