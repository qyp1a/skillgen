# skillgen · Agent Skill 模板生成器

一个零依赖的 Node.js CLI，用来生成结构清晰、可继续编辑的 `SKILL.md` 项目。支持交互式与非交互式运行，并提供中文、英文和中英双语模板。

[English README](README.en.md) · [报告问题](https://github.com/qyp1a/skillgen/issues) · [贡献指南](CONTRIBUTING.md)

## 特性

- **零运行时依赖**：只使用 Node.js 内置模块。
- **4 类模板**：基础技能、CLI 工具、多步骤工作流、MCP 连接。
- **双语支持**：CLI 和模板支持 `zh`、`en`、`both`。
- **安全的 YAML frontmatter**：自动转义引号、反斜杠等内容。
- **精简默认输出**：默认只生成必要的技能与发布文件；示例脚本按需启用。
- **可自动化**：完整支持命令行参数，适合脚本和 CI。

## 快速开始

无需安装：

```bash
npx skillgen
```

全局安装：

```bash
npm install --global skillgen
skillgen
```

从源码运行：

```bash
git clone https://github.com/qyp1a/skillgen.git
cd skillgen
npm test
node cli.js
```

要求 Node.js 18 或更高版本。

## 非交互用法

```bash
npx skillgen \
  --name report-workflow \
  --type workflow \
  --lang both \
  --desc "当用户需要生成或校验报表时使用" \
  --desc-en "Use when the user needs to generate or validate reports" \
  --author "Your Name" \
  --yes
```

常用参数：

| 参数 | 说明 |
| --- | --- |
| `--name` | 技能名称，最多 64 个字符，只允许小写字母、数字和连字符 |
| `--type` | `basic`、`cli`、`workflow` 或 `mcp` |
| `--lang` | `zh`、`en` 或 `both` |
| `--desc` | 中文或主要描述 |
| `--desc-en` | 英文描述；`both` 模式下会与中文描述一起写入 frontmatter |
| `--author` | README 和 LICENSE 中使用的作者名 |
| `--examples` | 额外生成 `scripts/example.js` |
| `--force` | 允许写入已存在目录，仅覆盖本次生成的同名文件，不删除其他文件 |
| `--yes` | 跳过交互并使用默认值 |
| `--ui` | CLI 界面语言：`zh` 或 `en` |
| `--list-types` | 列出模板类型 |
| `--version` / `--help` | 显示版本或帮助 |

## 模板类型

| 类型 | 适用场景 | 内容重点 |
| --- | --- | --- |
| `basic` | 通用知识或流程 | 触发条件、步骤、示例、故障排查 |
| `cli` | 命令行工具封装 | 前置检查、命令速查、输出与失败处理 |
| `workflow` | 多阶段流水线 | 阶段输入输出、质量门禁、失败恢复 |
| `mcp` | MCP 服务使用指南 | 服务配置、工具清单、调用模式、错误处理 |

## 完整示例

[`examples/skills/`](examples/README.md) 提供 6 个已经写完整的 Skill，覆盖 GitHub 发布准备、双语 README 同步、Node CLI 回归测试、Skill 质量审查、Changelog 编写和 npm 发布检查。示例放在普通目录下，因此克隆仓库后不会被 Codex 自动激活。

## 生成结果

默认结构：

```text
report-workflow/
├── SKILL.md
├── README.md
└── LICENSE
```

添加 `--examples` 后会额外生成 `scripts/example.js`。`scripts/`、`references/`、`assets/` 和 `agents/openai.yaml` 都是可选资源，应在确实需要时添加，而不是作为空目录预生成。

## 在 Codex 中使用

- 项目级技能：放到仓库的 `.agents/skills/<skill-name>/`。
- 用户级技能：放到 `$HOME/.agents/skills/<skill-name>/`。
- 从 GitHub 安装个人使用的技能：在 Codex 中调用 `$skill-installer` 并提供仓库地址。
- 面向他人分发可安装内容时，OpenAI 当前建议将技能打包成 Plugin。

其他支持 Agent Skills 的工具可能使用不同的扫描目录，请以对应工具的文档为准。

参见 [OpenAI 官方 Build skills 文档](https://learn.chatgpt.com/docs/build-skills) 和 [Agent Skills 规范](https://agentskills.io/specification)。

## 开发与检查

```bash
npm test
npm run check
node cli.js --list-types
```

测试覆盖 4 种模板 × 3 种语言、YAML 转义、双语描述、可选示例脚本和常见 CLI 错误。

## Roadmap

- [ ] `skillgen check <dir>`：校验已有技能
- [ ] 可选生成 `agents/openai.yaml`
- [ ] Plugin 打包支持
- [ ] 更多面向真实任务的模板

## License

[MIT](LICENSE) © qyp1a
