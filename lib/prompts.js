// Interactive prompt session (zero-dependency)
//
// Uses a persistent line queue with raw 'line'/'close' events instead of
// rl.question(), because:
//   1. readline/promises' question() never settles when stdin hits EOF
//      (non-TTY / piped input), which would hang scripted usage.
//   2. 'line' events emitted while no listener is attached are dropped,
//      so listeners must be installed once and buffered forever.
// On EOF, pending and future questions resolve with null so callers can
// fall back to defaults.

import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

export class InputClosedError extends Error {
  constructor() {
    super('Input closed (EOF). Use flags for non-interactive usage.');
    this.code = 'INPUT_CLOSED';
  }
}

export function promptSession() {
  const rl = createInterface({ input: stdin, output: stdout });

  const queue = [];
  let waiter = null;

  rl.on('line', (line) => {
    if (waiter) {
      const w = waiter;
      waiter = null;
      w(line);
    } else {
      queue.push(line);
    }
  });
  rl.on('close', () => {
    if (waiter) {
      const w = waiter;
      waiter = null;
      w(null);
    } else {
      queue.push(null);
    }
  });

  const askRaw = (query) =>
    new Promise((resolve) => {
      if (queue.length > 0) {
        resolve(queue.shift());
        return;
      }
      waiter = resolve;
      stdout.write(query);
    });

  return {
    async ask(question, { validate, error, def, required = false } = {}) {
      for (;;) {
        const suffix = def ? ` [${def}]` : '';
        const raw = await askRaw(`${question}${suffix}: `);
        if (raw === null) {
          if (def !== undefined) return def;
          if (!required) return '';
          throw new InputClosedError();
        }
        const value = raw.trim();
        if (value === '' && def !== undefined) return def;
        if (value === '' && !required) return '';
        if (!validate || validate(value)) return value;
        console.log(error || '✗ Invalid input');
      }
    },

    async choose(question, choices, labels) {
      const labelOf = (c) =>
        typeof labels === 'function' ? labels(c) : labels?.[c] ?? c;
      console.log(`\n${question}:`);
      choices.forEach((c, i) => console.log(`  ${i + 1}. ${labelOf(c)}`));
      for (;;) {
        const raw = await askRaw('> ');
        if (raw === null) throw new InputClosedError();
        const value = raw.trim();
        if (value === '') continue;
        const idx = Number(value);
        if (Number.isInteger(idx) && choices[idx - 1]) return choices[idx - 1];
        if (choices.includes(value)) return value;
        console.log('✗ Invalid choice');
      }
    },

    async confirm(question) {
      for (;;) {
        const raw = await askRaw(`${question} (y/N): `);
        if (raw === null) return false;
        const value = raw.trim().toLowerCase();
        if (value === 'y' || value === 'yes') return true;
        if (value === '' || value === 'n' || value === 'no') return false;
        console.log('✗ Please answer y or n');
      }
    },

    close() {
      rl.close();
    }
  };
}
