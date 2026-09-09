// skillgen template loader — reads SKILL.md templates from ./templates/<type>/SKILL.<lang>.md

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const templateRoot = join(here, '..', 'templates');

export function loadTemplate(type, lang) {
  const file = join(templateRoot, type, `SKILL.${lang}.md`);
  return readFileSync(file, 'utf8');
}
