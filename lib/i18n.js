// skillgen i18n — Chinese / English messages

export const messages = {
  zh: {
    uiName: '技能名称（小写字母/数字/连字符，如 my-skill）',
    uiDescZh: '中文技能描述（一句话：做什么、何时使用）',
    uiDescEn: 'English skill description (what it does and when to use it)',
    defaultDescZh: '一个用于 {{name}} 的技能。',
    defaultDescEn: 'A skill for {{name}}.',
    uiType: '选择模板类型',
    uiLang: '生成模板的语言',
    uiAuthor: '作者名（用于 LICENSE / README）',
    uiOverwrite: '目标目录已存在，是否覆盖？',
    invalid: '✗ 无效输入',
    nameInvalid: '✗ 名称不合法：最多 64 个字符，仅允许小写字母(a-z)、数字(0-9)和连字符(-)，不能以 - 开头或结尾',
    typeInvalid: '✗ 无效类型，可选：',
    langInvalid: '✗ 无效语言，可选：',
    dirExists: '✗ 目标目录已存在，使用 --force 覆盖将生成的同名文件',
    generated: '✓ 已生成',
    createdDir: '已创建目录：',
    files: '生成文件：',
    nextSteps: '下一步：',
    nextStepInstall: 'Codex 项目内使用：移动到 .agents/skills/<name>；个人使用：移动到 $HOME/.agents/skills/<name>。',
    listTypes: '可用模板类型：',
    version: '版本',
    help: '帮助',
    types: {
      basic: '基础技能（通用知识/流程）',
      cli: 'CLI 工具封装',
      workflow: '多步骤工作流',
      mcp: 'MCP 连接'
    },
    langs: {
      zh: '中文',
      en: 'English',
      both: '中英双语'
    },
    missingName: '✗ 缺少 --name 参数（非交互模式必须提供）',
    missingType: '✗ 缺少 --type 参数（可用 --list-types 查看）',
    missingLang: '✗ 缺少 --lang 参数（zh / en / both）'
  },
  en: {
    uiName: 'Skill name (lowercase letters/digits/hyphens, e.g. my-skill)',
    uiDescZh: 'Chinese skill description (what it does and when to use it)',
    uiDescEn: 'English skill description (what it does and when to use it)',
    defaultDescZh: '一个用于 {{name}} 的技能。',
    defaultDescEn: 'A skill for {{name}}.',
    uiType: 'Choose a template type',
    uiLang: 'Template language',
    uiAuthor: 'Author name (used in LICENSE / README)',
    uiOverwrite: 'Target directory already exists. Overwrite?',
    invalid: '✗ Invalid input',
    nameInvalid: '✗ Invalid name: use at most 64 lowercase letters, digits, and hyphens; do not start/end with "-"',
    typeInvalid: '✗ Invalid type, choose from: ',
    langInvalid: '✗ Invalid language, choose from: ',
    dirExists: '✗ Target directory already exists; use --force to overwrite generated files with the same names',
    generated: '✓ Generated',
    createdDir: 'Created directory: ',
    files: 'Files:',
    nextSteps: 'Next steps: ',
    nextStepInstall: 'For a Codex project, move it to .agents/skills/<name>; for personal use, move it to $HOME/.agents/skills/<name>.',
    listTypes: 'Available template types:',
    version: 'version',
    help: 'help',
    types: {
      basic: 'Basic skill (general knowledge / workflow)',
      cli: 'CLI tool wrapper',
      workflow: 'Multi-step workflow',
      mcp: 'MCP connection'
    },
    langs: {
      zh: '中文',
      en: 'English',
      both: 'Bilingual (中英双语)'
    },
    missingName: '✗ Missing --name (required in non-interactive mode)',
    missingType: '✗ Missing --type (see --list-types)',
    missingLang: '✗ Missing --lang (zh / en / both)'
  }
};

export function makeT(lang) {
  const m = messages[lang] || messages.en;
  return (key) =>
    key.split('.').reduce((acc, part) => (acc == null ? undefined : acc[part]), m) ?? key;
}
