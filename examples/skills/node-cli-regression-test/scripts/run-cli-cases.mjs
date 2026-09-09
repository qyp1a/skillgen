#!/usr/bin/env node
/**
 * Deterministic regression runner for Node.js CLIs.
 *
 * Usage: node scripts/run-cli-cases.mjs --cli ./cli.js --cases ./cases [--strict]
 *
 * Case file format (plain text, one case per block):
 *   # comment
 *   $ <command arguments>
 *   exit:<expected exit code>
 *   out:<substring that must appear in stdout>
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

function parseArgs(argv) {
  const args = { cli: null, cases: './cases', strict: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--cli') args.cli = argv[++i];
    else if (argv[i] === '--cases') args.cases = argv[++i];
    else if (argv[i] === '--strict') args.strict = true;
  }
  return args;
}

function parseCaseFile(text) {
  const cases = [];
  let current = null;
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    if (trimmed.startsWith('$ ')) {
      if (current) cases.push(current);
      current = { args: trimmed.slice(2).trim().split(/\s+/), exit: 0, out: null };
    } else if (current && trimmed.startsWith('exit:')) {
      current.exit = Number(trimmed.slice(5).trim());
    } else if (current && trimmed.startsWith('out:')) {
      current.out = trimmed.slice(4).trim();
    }
  }
  if (current) cases.push(current);
  return cases;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.cli) {
    console.error('Missing --cli path.');
    process.exit(2);
  }
  const files = (await readdir(args.cases)).filter((f) => f.endsWith('.case'));
  let passed = 0;
  let failed = 0;
  for (const file of files) {
    const text = await readFile(join(args.cases, file), 'utf8');
    for (const c of parseCaseFile(text)) {
      const res = spawnSync(process.execPath, [args.cli, ...c.args], { encoding: 'utf8' });
      const exitOk = res.status === c.exit;
      const outOk = !c.out || (res.stdout || '').includes(c.out);
      const ok = exitOk && outOk;
      if (ok) passed++;
      else failed++;
      console.log(`${ok ? 'PASS' : 'FAIL'} ${file}: $ ${c.args.join(' ')}`);
      if (!ok) {
        console.log(`  expected exit=${c.exit}, got ${res.status}`);
        if (c.out && !(res.stdout || '').includes(c.out)) {
          console.log(`  expected stdout to contain: ${c.out}`);
          console.log(`  actual stdout: ${(res.stdout || '').slice(0, 200)}`);
        }
      }
    }
  }
  console.log(`\n${passed} passed, ${failed} failed`);
  if (args.strict && failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
