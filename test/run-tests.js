// skillgen automated tests — zero-dependency, runs with `npm test`
import { mkdtemp, readFile, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
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

async function main() {
  const work = await mkdtemp(join(tmpdir(), 'skillgen-test-'));
  process.chdir(work);
  console.log('== validation ==');
  assert(validateName('my-skill') === true, 'valid name: my-skill');
  assert(validateName('my_skill') === false, 'reject underscore');
  assert(validateName('-lead') === false, 'reject leading hyphen');
  assert(validateName('UPPER') === false, 'reject uppercase');
  assert(validateName('a1-b2') === true, 'valid name: a1-b2');

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
      assert(!skill.includes('"quoted"'), `${label}: quotes cleaned from description`);
      for (const f of ['scripts/example.js', 'README.md', 'LICENSE', 'assets/.gitkeep']) {
        const st = await stat(join(res.dir, f));
        assert(st.isFile(), `${label}: has ${f}`);
      }
    }
  }

  console.log('\n== both mode uses descEn when present ==');
  {
    const dir = join(work, 'both-desc');
    await scaffold({ name: 'both-desc', desc: '中文描述', type: 'basic', lang: 'both', author: 'T', force: true });
    const skill = await readFile(join(dir, 'SKILL.md'), 'utf8');
    assert(skill.includes('中文描述'), 'both: Chinese description preserved');
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

main().catch((e) =&gt; {
  console.error(e);
  process.exit(1);
});
