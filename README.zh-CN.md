# A2A Protocol - Agent 间通信协议

[English](README.md) | 简体中文

## 概述

A2A Protocol 是一个轻量级的去中心化 Agent 通信协议，让 AI agents 可以互相发现、通信和协作。

## 核心特性

- **Agent 身份系统** - 基于公钥的去中心化身份
- **Agent 注册中心** - 简单的 HTTP API，agent 可以注册和发现其他 agent
- **消息传递** - WebSocket 实时通信
- **任务协作** - Agent 可以互相委托任务

## 架构

```
┌─────────────────────────────────────────────────────────────┐
│                     A2A 协议栈                               │
├─────────────────────────────────────────────────────────────┤
│  第三层: Agent 逻辑 (OpenClaw, AutoGPT 等)                  │
├─────────────────────────────────────────────────────────────┤
│  第二层: A2A 协议 (发现 + 消息传递)                         │
│           - Agent 注册中心                                   │
│           - 消息路由                                         │
│           - 任务协议                                         │
├─────────────────────────────────────────────────────────────┤
│  第一层: 传输层 (HTTP + WebSocket)                          │
└─────────────────────────────────────────────────────────────┘
```

## MVP 功能

### 1. Agent 身份

每个 agent 有：
- Agent ID (公钥哈希)
- Name (可读名称)
- Capabilities (能力列表)
- Endpoint (WebSocket 地址)

### 2. Agent 注册中心

中心化的注册服务（未来可去中心化）：
- `POST /agents/register` - 注册 agent
- `GET /agents` - 列出所有 agent
- `GET /agents/:id` - 获取 agent 信息
- `POST /agents/search` - 搜索 agent

### 3. 消息传递

通过 WebSocket 实时通信：
- `message` - 发送消息
- `task_request` - 请求任务
- `task_response` - 返回结果

## 快速开始

### 方式 1: Docker（推荐）

```bash
# 构建并启动所有服务
docker-compose up

# 或使用 npm 脚本
npm run docker:up
```

这将启动：
- 注册中心服务器（端口 3000）
- 示例 agents（Agent A 和 Agent B）

### 方式 2: 手动安装

```bash
# 安装依赖
npm install

# 终端 1: 启动注册中心服务器
npm run server

# 终端 2: 启动 Agent B
npm run agent:b

# 终端 3: 启动 Agent A
npm run agent:a
```

## 更多示例

我们提供了多个示例 agent 展示不同的使用场景：

- **基础 agents** - 简单消息传递（agent-a, agent-b）
- **市场分析 Agent** - 市场研究和竞品分析
- **数据分析 Agent** - 统计分析和数据处理
- **协调器 Agent** - 多 agent 协作

详细文档请查看 [EXAMPLES.md](EXAMPLES.md)。

## 消息协议

### Agent 配置文件

```json
{
  "agent_id": "agent_abc123",
  "name": "ResearchAgent",
  "capabilities": ["research", "analysis"],
  "endpoint": "ws://localhost:3000/agent/abc123",
  "public_key": "...",
  "created_at": "2026-03-15T01:53:00Z"
}
```

### 消息格式

```json
{
  "type": "message",
  "from": "agent_abc123",
  "to": "agent_def456",
  "payload": {
    "text": "你好，能帮我做研究吗？"
  },
  "timestamp": "2026-03-15T01:53:00Z",
  "signature": "..."
}
```

### 任务请求

```json
{
  "type": "task_request",
  "from": "agent_abc123",
  "to": "agent_def456",
  "task_id": "task_001",
  "payload": {
    "task": "分析这个市场",
    "context": {...}
  },
  "timestamp": "2026-03-15T01:53:00Z"
}
```

### 任务响应

```json
{
  "type": "task_response",
  "from": "agent_def456",
  "to": "agent_abc123",
  "task_id": "task_001",
  "payload": {
    "status": "completed",
    "result": {...}
  },
  "timestamp": "2026-03-15T01:53:00Z"
}
```

## 示例场景

### 场景 1: Agent 发现

```javascript
// Agent A 搜索能做"research"的 agent
const agents = await registry.search({ capability: 'research' });
console.log('找到的 agents:', agents);
```

### 场景 2: 发送消息

```javascript
// Agent A 给 Agent B 发消息
await agentA.sendMessage('agent_b_id', {
  text: '你能帮我分析这些数据吗？'
});
```

### 场景 3: 任务委托

```javascript
// Agent A 委托任务给 Agent B
const result = await agentA.requestTask('agent_b_id', {
  task: 'market_analysis',
  data: {...}
});
console.log('任务结果:', result);
```

## 技术栈

- **Node.js** - 运行时
- **Express** - HTTP 服务器
- **ws** - WebSocket 库
- **TypeScript** - 类型安全
- **Jest** - 测试框架
- **Docker** - 容器化

## 测试

```bash
# 运行测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 监听模式运行测试
npm run test:watch
```

详细测试指南请查看 [TESTING.md](TESTING.md)。

## 未来扩展

- [ ] 去中心化注册（DHT / Nostr）
- [ ] 端到端加密
- [ ] 智能合约支付
- [ ] Agent 信誉系统
- [ ] 任务市场

## 开源协议

MIT

## 贡献

欢迎提交 Issue 和 Pull Request！

## 社区

- GitHub: https://github.com/let5sne/a2a-protocol
- Discord: [即将推出]
