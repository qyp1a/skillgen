# skillgen · Skill 模板生成器

一行命令生成符合 [Agent Skills 标准](https://agentskills.io) 的 `SKILL.md` 项目骨架，开箱支持 **Codex / Claude Code / Gemini CLI / Cursor**，**中英双语**，**零依赖**（只用 Node 内置模块）。

[English README](README.en.md) | [报告 Issue](https://github.com/qyp1a/skillgen/issues)

## 为什么用 skillgen

- **写一次，到处用**：生成的 SKILL.md 遵循 Agent Skills 标准，Codex、Claude Code、Gemini CLI、Cursor 都能直接识别。
- **中英双语**：CLI 界面和生成的模板都支持中文 / English / 中英双语三种模式。
- **4 种专业模板**：基础技能、CLI 工具封装、多步骤工作流、MCP 连接，每个模板带中文注释指导。
- **零依赖**：只用 Node 内置模块，`npx` 即用，无需安装任何包。
- **开箱即用**：自动生成 `SKILL.md` + `scripts/` + `assets/` + `README.md` + MIT `LICENSE`，克隆下来就是可发布的技能仓库。

## 快速开始

### 方式一：npx（无需安装）

```bash
npx skillgen
```

### 方式二：全局安装

```bash
npm i -g skillgen
skillgen
```

### 方式三：克隆本仓库直接运行

```bash
git clone https://github.com/qyp1a/skillgen.git
cd skillgen
node cli.js
```

## 交互式用法

```bash
$ npx skillgen
技能名称（小写字母/数字/连字符，如 my-skill）: my-skill
技能描述（一句话：做什么、何时用）: 自动化处理报表的技能

选择模板类型:
  1. 基础技能（通用知识/流程）
  2. CLI 工具封装
  3. 多步骤工作流
  4. MCP 连接
&gt; 3

生成模板的语言:
  1. 中文
  2. English
  3. 中英双语
&gt; 3

✓ 已生成 C:\...\my-skill\
```

## 非交互用法

```bash
npx skillgen --name my-skill --type workflow --lang both \
  --desc "自动处理报表" --desc-en "Automate report processing" --author you
```

| 参数 | 说明 |
| --- | --- |
| `--name` | 技能名称（小写字母/数字/连字符） |
| `--desc` / `--desc-en` | 描述（中 / 英，both 模式可同时提供） |
| `--type` | `basic` \| `cli` \| `workflow` \| `mcp` |
| `--lang` | `zh`（中文）\| `en`（English）\| `both`（中英双语） |
| `--ui` | CLI 界面语言 `zh` \| `en`（默认自动检测） |
| `--author` | 作者名（用于 LICENSE / README） |
| `--force` | 覆盖已存在的目录 |
| `--yes` | 跳过交互，使用默认值 |
| `--list-types` | 列出全部模板类型 |
| `--version` / `--help` | 版本 / 帮助 |

## 模板类型

| 类型 | 适用场景 | 模板重点 |
| --- | --- | --- |
| `basic` | 通用知识 / 流程技能 | 概述、触发条件、工作流、示例、最佳实践、故障排查 |
| `cli` | 封装命令行工具 | 前置检查、命令速查、标准工作流、输出解析、故障处理 |
| `workflow` | 多步骤流水线 | 阶段划分、输入输出表、质量门禁、失败恢复 |
| `mcp` | 连接 MCP 服务 | 服务配置、工具清单、使用模式、错误处理 |

## 生成的项目结构

```
my-skill/
├── SKILL.md          # 技能定义（主入口，Agent 首先读取）
├── scripts/          # 可执行脚本目录
│   └── example.js    # 示例脚本（占位，可替换）
├── assets/           # 参考资源目录
├── README.md         # 安装说明（双语）
└── LICENSE           # MIT 许可
```

## 如何安装生成的技能

**Codex：**

```bash
codex install ./my-skill
# 或复制到 ~/.codex/skills/
```

**Claude Code：**

```bash
cp -r my-skill ~/.claude/skills/
```

**通用：** 把目录放进 Agent 的 skills 路径即可，`SKILL.md` 中的 `name` / `description` 会被自动识别。

## 开发

```bash
npm test        # 运行自动化测试（4 类型 × 3 语言全矩阵）
node cli.js --list-types
```

## Roadmap

- [ ] 更多模板类型：数据技能、文档技能、浏览器自动化
- [ ] `skillgen check &lt;dir&gt;`：校验已有 SKILL.md 的格式与最佳实践
- [ ] `skillgen init`：从已有脚本自动推断生成 SKILL.md
- [ ] GitHub Action：自动校验 PR 中的 SKILL.md

## License

[MIT](LICENSE) © qyp1a
