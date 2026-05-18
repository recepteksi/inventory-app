import React from 'react';
import { TOKENS } from './tokens.jsx';
import { ustaInitials, ustaAvatarHue } from '../../../domain/entities/worker.js';

/**
 * Coloured initials avatar derived from a worker's name.
 * The hue is computed deterministically from the worker's ID.
 * @param {object} props
 * @param {object} props.usta - Worker object from the store (requires ad and id fields)
 * @param {number} [props.size=42] - Circle diameter in pixels
 */
export function UstaAvatar({ usta, size = 42 }) {
  const initials = ustaInitials(usta.ad);
  const h = ustaAvatarHue(usta.id);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: `oklch(0.85 0.06 ${h})`,
        color: `oklch(0.32 0.08 ${h})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: TOKENS.font,
        fontWeight: 600,
        fontSize: size * 0.38,
        flexShrink: 0,
        border: `1px solid ${TOKENS.line}`,
      }}
    >
      {initials}
    </div>
  );
}
