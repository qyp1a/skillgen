// skillgen automated tests — zero-dependency, runs with `npm test`
import { mkdtemp, readFile, readdir, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { scaffold } from '../lib/scaffold.js';
import { validateName, TYPES, LANGS } from '../lib/validate.js';

let passed = 0;
let failed = 0;

function assert(cond, label) {
  if (cond) {
    passed++;
    console.log(`  ✓ ${label}`);
  } else {
    failed++;
    console.error(`  ✗ ${label}`);
  }
}

async function listFiles(root, dir = root) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(root, full)));
    if (entry.isFile()) files.push(relative(root, full).replaceAll('\\', '/'));
  }
  return files;
}

async function main() {
  const work = await mkdtemp(join(tmpdir(), 'skillgen-test-'));
  const cli = fileURLToPath(new URL('../cli.js', import.meta.url));
  process.chdir(work);
  console.log('== validation ==');
  assert(validateName('my-skill') === true, 'valid name: my-skill');
  assert(validateName('my_skill') === false, 'reject underscore');
  assert(validateName('-lead') === false, 'reject leading hyphen');
  assert(validateName('UPPER') === false, 'reject uppercase');
  assert(validateName('a1-b2') === true, 'valid name: a1-b2');
  assert(validateName('a'.repeat(64)) === true, 'accept 64-character name');
  assert(validateName('a'.repeat(65)) === false, 'reject name longer than 64 characters');

  console.log('\n== scaffold: 4 types × 3 languages ==');
  for (const type of TYPES) {
    for (const lang of LANGS) {
      const label = `${type}/${lang}`;
      const res = await scaffold({
        name: `${type}-${lang}`,
        desc: '测试描述 "quoted"',
        descEn: 'Test description "quoted"',
        type,
        lang,
        author: 'Tester',
        force: true
      });
      const skill = await readFile(join(res.dir, 'SKILL.md'), 'utf8');
      assert(skill.includes(`name: ${type}-${lang}`), `${label}: frontmatter name`);
      assert(!/{{[a-z_]+}}/i.test(skill), `${label}: no leftover placeholders`);
      assert(skill.includes('\\"quoted\\"'), `${label}: YAML quotes escaped`);
      for (const f of ['README.md', 'LICENSE']) {
        const st = await stat(join(res.dir, f));
        assert(st.isFile(), `${label}: has ${f}`);
      }
    }
  }

  console.log('\n== both mode uses descEn when present ==');
  {
    const dir = join(work, 'both-desc');
    await scaffold({ name: 'both-desc', desc: '中文描述', descEn: 'English description', type: 'basic', lang: 'both', author: 'T', force: true });
    const skill = await readFile(join(dir, 'SKILL.md'), 'utf8');
    assert(skill.includes('中文描述'), 'both: Chinese description preserved');
    assert(skill.includes('English description'), 'both: English description preserved');
  }

  console.log('\n== optional example script ==');
  {
    const res = await scaffold({ name: 'with-examples', type: 'cli', lang: 'en', examples: true, force: true });
    const st = await stat(join(res.dir, 'scripts/example.js'));
    assert(st.isFile(), 'examples: creates scripts/example.js');
  }

  console.log('\n== CLI errors are actionable ==');
  {
    const partial = spawnSync(process.execPath, [cli, '--ui', 'en', '--name', 'partial', '--yes'], {
      cwd: work,
      encoding: 'utf8'
    });
    assert(partial.status === 1, 'partial non-interactive arguments fail');
    assert(partial.stderr.includes('Missing --type'), 'partial arguments name the missing flag');

    const unknown = spawnSync(process.execPath, [cli, '--unknown'], { cwd: work, encoding: 'utf8' });
    assert(unknown.status === 1, 'unknown flag fails');
    assert(unknown.stderr.includes('--help'), 'unknown flag points to help');
  }

  console.log('\n== interactive CLI ==');
  {
    const interactive = spawnSync(process.execPath, [cli, '--ui', 'en'], {
      cwd: work,
      encoding: 'utf8',
      input: ['interactive-skill', '1', '2', 'Use when testing interactive input.', 'Tester'].join('\n')
    });
    assert(interactive.status === 0, 'interactive input completes');
    const skill = await readFile(join(work, 'interactive-skill', 'SKILL.md'), 'utf8');
    assert(skill.includes('Use when testing interactive input.'), 'interactive description is rendered');
  }

  console.log('\n== complete skill examples ==');
  {
    const examplesRoot = fileURLToPath(new URL('../examples/skills/', import.meta.url));
    const entries = (await readdir(examplesRoot, { withFileTypes: true })).filter((entry) => entry.isDirectory());
    assert(entries.length === 6, 'six complete examples are present');

    for (const entry of entries) {
      const dir = join(examplesRoot, entry.name);
      const skill = await readFile(join(dir, 'SKILL.md'), 'utf8');
      const name = skill.match(/^name:\s*(.+)$/m)?.[1]?.trim();
      const description = skill.match(/^description:\s*(.+)$/m)?.[1]?.trim();
      assert(name === entry.name, `${entry.name}: folder matches frontmatter name`);
      assert(Boolean(description && description.length <= 1024), `${entry.name}: description is present and concise`);
      assert(!/\{\{|\bTODO\b|\bTBD\b/.test(skill), `${entry.name}: no unfinished placeholders`);

      for (const file of await listFiles(dir)) {
        if (file === 'SKILL.md') continue;
        assert(skill.includes(file), `${entry.name}: routes to ${file}`);
      }
    }
  }

  console.log('\n== invalid inputs throw ==');
  let threw = false;
  try {
    await scaffold({ name: 'Bad_Name', type: 'basic', lang: 'en' });
  } catch {
    threw = true;
  }
  assert(threw, 'invalid name throws');

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
