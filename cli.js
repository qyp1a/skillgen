#!/usr/bin/env node
/**
 * skillgen — Generate standards-compliant Agent Skills (SKILL.md)
 * Interactive & zero-dependency. Bilingual: 中文 / English.
 */
import { parseArgs } from 'node:util';
import { readFileSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';
import { promptSession } from './lib/prompts.js';
import { scaffold } from './lib/scaffold.js';
import { validateName, TYPES, LANGS } from './lib/validate.js';
import { makeT } from './lib/i18n.js';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

function parseCliArgs() {
  try {
    return parseArgs({
      options: {
        name: { type: 'string' },
        desc: { type: 'string' },
        'desc-en': { type: 'string' },
        type: { type: 'string' },
        lang: { type: 'string' },
        ui: { type: 'string' },
        author: { type: 'string' },
        examples: { type: 'boolean', default: false },
        force: { type: 'boolean', default: false },
        yes: { type: 'boolean', default: false },
        'list-types': { type: 'boolean', default: false },
        version: { type: 'boolean', default: false },
        help: { type: 'boolean', default: false }
      }
    }).values;
  } catch (err) {
    console.error(`✗ ${err.message}`);
    console.error('Run skillgen --help for usage.');
    process.exitCode = 1;
    return null;
  }
}

const values = parseCliArgs();

function detectUiLang() {
  const env = (process.env.LANG || process.env.LC_ALL || '').toLowerCase();
  if (env.includes('zh')) return 'zh';
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    if (locale.toLowerCase().startsWith('zh')) return 'zh';
  } catch {
    /* ignore */
  }
  return 'en';
}

function resolveUiLang() {
  if (values.ui) return values.ui === 'zh' ? 'zh' : 'en';
  if (values.lang && values.lang !== 'both') return values.lang;
  return detectUiLang();
}

function gitUserName() {
  try {
    return execSync('git config --global user.name', { encoding: 'utf8' }).trim() || 'Your Name';
  } catch {
    return 'Your Name';
  }
}

function printHelp(t) {
  console.log(`
skillgen v${pkg.version} — Agent Skill 模板生成器 / Agent Skill template generator

${t('uiName')}
  npx skillgen

${t('listTypes')}
  npx skillgen --list-types

${t('version')} / ${t('help')}
  npx skillgen --version | --help

用法 / Usage:
  npx skillgen                                # 交互式 / interactive
  npx skillgen --name my-skill --type cli --lang en --desc "..." --author you

参数 / Options:
  --name <name>     ${t('uiName')}
  --desc <text>     ${t('uiDescZh')}
  --desc-en <text>  ${t('uiDescEn')}
  --type <type>     basic | cli | workflow | mcp
  --lang <lang>     zh | en | both
  --ui <lang>       CLI 界面语言 / UI language: zh | en (default: auto)
  --author <name>   ${t('uiAuthor')}
  --examples        生成示例脚本 / include an example script
  --force           覆盖同名生成文件 / overwrite generated files with the same names
  --yes             跳过交互，使用默认值 / skip prompts, use defaults
`);
}

function printListTypes(t) {
  console.log(`${t('listTypes')}`);
  for (const type of TYPES) console.log(`  - ${type.padEnd(10)} ${t(`types.${type}`)}`);
}

async function runInteractive(t) {
  const session = promptSession();
  try {
    const name = await session.ask(t('uiName'), {
      validate: validateName,
      error: t('nameInvalid')
    });

    const type = await session.choose(t('uiType'), TYPES, (k) => t(`types.${k}`));
    const lang = await session.choose(t('uiLang'), LANGS, (k) => t(`langs.${k}`));

    let desc;
    let descEn;
    if (lang === 'zh' || lang === 'both') {
      desc = await session.ask(t('uiDescZh'), {
        validate: () => true,
        def: t('defaultDescZh').replace('{{name}}', name)
      });
    }
    if (lang === 'en' || lang === 'both') {
      descEn = await session.ask(t('uiDescEn'), {
        validate: () => true,
        def: t('defaultDescEn').replace('{{name}}', name)
      });
    }
    const author = await session.ask(t('uiAuthor'), { validate: () => true, def: gitUserName() });

    let force = values.force;
    if (!force && existsSync(join(process.cwd(), name))) {
      force = await session.confirm(t('uiOverwrite'));
    }
    return { name, desc, descEn, type, lang, author, force, examples: values.examples };
  } finally {
    session.close();
  }
}

async function main() {
  if (!values) return;
  if (values.ui && !['zh', 'en'].includes(values.ui)) {
    console.error('✗ Invalid --ui value. Choose: zh, en');
    process.exitCode = 1;
    return;
  }

  const ui = resolveUiLang();
  const t = makeT(ui);

  if (values.help) {
    printHelp(t);
    return;
  }
  if (values.version) {
    console.log(pkg.version);
    return;
  }
  if (values['list-types']) {
    printListTypes(t);
    return;
  }

  let opts;
  const generationArgs = [
    values.name,
    values.desc,
    values['desc-en'],
    values.type,
    values.lang,
    values.author
  ];
  const nonInteractive = values.yes || generationArgs.some((value) => value !== undefined);
  if (nonInteractive) {
    if (!values.name) {
      console.error(t('missingName'));
      process.exitCode = 1;
      return;
    }
    if (!values.type) {
      console.error(t('missingType'));
      process.exitCode = 1;
      return;
    }
    if (!values.lang) {
      console.error(t('missingLang'));
      process.exitCode = 1;
      return;
    }
    if (!validateName(values.name)) {
      console.error(t('nameInvalid'));
      process.exitCode = 1;
      return;
    }
    if (!TYPES.includes(values.type)) {
      console.error(`${t('typeInvalid')}${TYPES.join(', ')}`);
      process.exitCode = 1;
      return;
    }
    if (!LANGS.includes(values.lang)) {
      console.error(`${t('langInvalid')}${LANGS.join(', ')}`);
      process.exitCode = 1;
      return;
    }
    opts = {
      name: values.name,
      desc: values.desc || (values['desc-en'] ? values['desc-en'] : undefined),
      descEn: values['desc-en'],
      type: values.type,
      lang: values.lang,
      author: values.author || (values.yes ? gitUserName() : undefined),
      force: values.force,
      examples: values.examples
    };
    if (!opts.author && !values.yes) {
      const session = promptSession();
      try {
        opts.author = await session.ask(t('uiAuthor'), { validate: () => true, def: gitUserName() });
      } finally {
        session.close();
      }
    }
    if (!opts.force && existsSync(join(process.cwd(), opts.name))) {
      console.error(t('dirExists'));
      process.exitCode = 1;
      return;
    }
  } else {
    opts = await runInteractive(t);
  }

  try {
    const { dir, files } = await scaffold(opts);
    console.log(`\n${t('generated')} ${dir}`);
    console.log(`${t('files')}`);
    for (const f of files) console.log(`  - ${f}`);
    console.log(`\n${t('nextSteps')} ${t('nextStepInstall').replaceAll('<name>', opts.name)}`);
  } catch (err) {
    console.error(`✗ ${err.message}`);
    process.exitCode = 1;
  }
}

if (values) {
  main().catch((err) => {
    console.error(`✗ ${err.message}`);
    process.exitCode = 1;
  });
}
