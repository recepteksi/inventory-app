#!/usr/bin/env node
/**
 * PostToolUse hook — runs after every Edit or Write.
 * Syntax-checks any server/*.js file that was just modified.
 * Receives the hook event as JSON on stdin.
 */

import { execSync } from 'child_process';

const chunks = [];
process.stdin.on('data', d => chunks.push(d));
process.stdin.on('end', () => {
  let event;
  try {
    event = JSON.parse(Buffer.concat(chunks).toString());
  } catch {
    process.exit(0);
  }

  const file = event.tool_input?.file_path ?? '';

  // Only check server-side JS files
  if (!file.includes('/server/') || !file.endsWith('.js')) {
    process.exit(0);
  }

  try {
    execSync(`node --check "${file}"`, { stdio: 'pipe' });
    process.stdout.write(`✅ Sözdizimi geçerli: ${file.split('/server/')[1]}\n`);
  } catch (err) {
    process.stderr.write(`❌ Sözdizimi hatası: ${file.split('/server/')[1]}\n`);
    const msg = err.stderr?.toString() ?? err.message;
    process.stderr.write(msg + '\n');
  }
});
