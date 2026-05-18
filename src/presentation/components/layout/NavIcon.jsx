import React from 'react';
import { IconBox, IconPerson } from '../ui/Icons.jsx';

/**
 * Icon slot for a navigation item — returns the correct SVG based on `kind`.
 * @param {object} props
 * @param {'box'|'person'} props.kind - Which icon to render
 * @param {boolean} props.active - When true, renders the icon in the active (dark) colour
 */
export function NavIcon({ kind, active }) {
  if (kind === 'box') return <IconBox active={active} />;
  if (kind === 'person') return <IconPerson active={active} />;
  return null;
}
