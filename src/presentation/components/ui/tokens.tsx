import type { CSSProperties } from 'react';

export { stockStatus } from '../../../domain/entities/material.ts';

/**
 * Design-system token object — all shared colour, typography, and size constants.
 * Every component imports this to maintain a consistent visual language.
 */
export const TOKENS = {
  bg:         '#F4F0E8',
  paper:      '#FFFFFF',
  ink:        '#161412',
  inkSoft:    '#5C544A',
  inkMuted:   '#8C8378',
  line:       '#E5DFD2',
  lineSoft:   '#EFEAE0',
  accent:     'oklch(0.62 0.18 45)',
  accentSoft: 'oklch(0.95 0.04 60)',
  steel:      'oklch(0.42 0.05 240)',
  steelSoft:  'oklch(0.94 0.02 240)',
  ok:         'oklch(0.55 0.12 145)',
  okSoft:     'oklch(0.94 0.05 145)',
  low:        'oklch(0.60 0.18 30)',
  lowSoft:    'oklch(0.94 0.05 30)',
  font:       "'Space Grotesk', system-ui, sans-serif",
  mono:       "'JetBrains Mono', ui-monospace, monospace",
};

/** Dark background, white text — primary action button style. */
export const btnPrimaryStyle: CSSProperties = {
  appearance: 'none', border: 'none', background: TOKENS.ink, color: '#fff',
  padding: '10px 14px', borderRadius: 10, fontFamily: TOKENS.font, fontWeight: 600,
  fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4,
};

/** Outlined white background — secondary / neutral action button style. */
export const btnGhostStyle: CSSProperties = {
  appearance: 'none', border: `1px solid ${TOKENS.line}`, background: TOKENS.paper, color: TOKENS.ink,
  padding: '10px 14px', borderRadius: 10, fontFamily: TOKENS.font, fontWeight: 600,
  fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4,
};

/** Reddish border and background — delete / destructive action button style. */
export const btnDangerStyle: CSSProperties = {
  appearance: 'none', border: '1px solid oklch(0.80 0.10 30)', background: 'oklch(0.96 0.03 30)',
  color: 'oklch(0.45 0.18 30)', padding: '10px 14px', borderRadius: 10,
  fontFamily: TOKENS.font, fontWeight: 600, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 4,
};
