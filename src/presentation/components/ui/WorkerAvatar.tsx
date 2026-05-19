import { TOKENS } from './tokens.tsx';
import { workerInitials, workerAvatarHue } from '../../../domain/entities/worker.ts';
import type { Worker } from '../../../types/index.ts';

interface WorkerAvatarProps {
  worker: Worker;
  size?: number;
}

export function WorkerAvatar({ worker, size = 42 }: WorkerAvatarProps) {
  const initials = workerInitials(worker.name);
  const h = workerAvatarHue(worker.id);
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
