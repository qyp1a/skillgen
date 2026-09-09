---
name: {{name}}
description: {{description_yaml}}
---

# {{name_title}}

> MCP 连接型技能 · 由 skillgen 生成

## 概述
<!-- 这个技能连接哪个 MCP 服务、解锁了什么能力。 -->

## MCP 服务配置
<!-- 常见客户端（Claude Desktop、Cursor、Codex 等）的参考配置。 -->
```json
{
  "mcpServers": {
    "{{name}}": {
      "command": "npx",
      "args": ["-y", "your-mcp-server"],
      "env": {}
    }
  }
}
```

## 可用工具
<!-- 记录该服务暴露的工具：用途和关键参数。 -->

| 工具 | 用途 | 关键参数 |
| --- | --- | --- |
| `tool_name` | ... | `param1`, `param2` |

## 使用模式
<!-- 组合多个工具完成任务的典型调用序列。 -->

### 模式 1：...
1. 调用 `tool_name`，参数为 ...
2. ...

## 错误处理

| 错误 | 原因 | 修复 |
| --- | --- | --- |
| ... | ... | ... |
