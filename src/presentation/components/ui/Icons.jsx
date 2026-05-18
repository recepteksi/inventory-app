import React from 'react';
import { TOKENS } from './tokens.jsx';

/**
 * Directional arrow icon.
 * @param {object} props
 * @param {'right'|'left'|'up'|'down'} [props.dir='right'] - Arrow direction
 * @param {number} [props.size=14] - Size in pixels
 * @param {string} [props.color] - SVG stroke colour
 */
export function IconArrow({ dir = 'right', size = 14, color = TOKENS.inkSoft }) {
  const rot = { right: 0, left: 180, up: -90, down: 90 }[dir];
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ transform: `rotate(${rot}deg)` }}>
      <path d="M5 3 L10 8 L5 13" stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Plus (+) icon — used on "add new" buttons.
 * @param {object} props
 * @param {number} [props.size=16] - Size in pixels
 * @param {string} [props.color='#fff'] - SVG stroke colour
 * @param {number} [props.weight=2] - Stroke width
 */
export function IconPlus({ size = 16, color = '#fff', weight = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16">
      <path d="M8 3 V13 M3 8 H13" stroke={color} strokeWidth={weight} strokeLinecap="round" />
    </svg>
  );
}

/**
 * Checkmark icon — used on success screens and selected-state indicators.
 * @param {object} props
 * @param {number} [props.size=14] - Size in pixels
 * @param {string} [props.color='#fff'] - SVG stroke colour
 */
export function IconCheck({ size = 14, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16">
      <path d="M3 8 L7 12 L13 4" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Search magnifier icon.
 * @param {object} props
 * @param {number} [props.size=16] - Size in pixels
 * @param {string} [props.color] - SVG stroke colour
 */
export function IconSearch({ size = 16, color = TOKENS.inkSoft }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16">
      <circle cx="7" cy="7" r="4.5" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M10.5 10.5 L14 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Box / stock icon — used for the Stock navigation link.
 * @param {object} props
 * @param {boolean} [props.active=false] - When true, renders in the active (dark) colour
 */
export function IconBox({ active }) {
  const c = active ? TOKENS.ink : TOKENS.inkMuted;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 7 L12 3 L21 7 L12 11 Z" stroke={c} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M3 7 V17 L12 21 L21 17 V7" stroke={c} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 11 V21" stroke={c} strokeWidth="1.6" />
    </svg>
  );
}

/**
 * Person icon — used for the Workers navigation link.
 * @param {object} props
 * @param {boolean} [props.active=false] - When true, renders in the active (dark) colour
 */
export function IconPerson({ active }) {
  const c = active ? TOKENS.ink : TOKENS.inkMuted;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.5" stroke={c} strokeWidth="1.6" />
      <path d="M4 20 C 5 15 8 13 12 13 C 16 13 19 15 20 20" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
