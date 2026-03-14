# A2A Protocol - Agent-to-Agent Communication Protocol

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
│                     A2A Protocol Stack                       │
├─────────────────────────────────────────────────────────────┤
│  Layer 3: Agent Logic (OpenClaw, AutoGPT, etc.)            │
├─────────────────────────────────────────────────────────────┤
│  Layer 2: A2A Protocol (Discovery + Messaging)              │
│           - Agent Registry                                   │
│           - Message Router                                   │
│           - Task Protocol                                    │
├─────────────────────────────────────────────────────────────┤
│  Layer 1: Transport (HTTP + WebSocket)                      │
└─────────────────────────────────────────────────────────────┘
```

## MVP 功能

### 1. Agent 身份

每个 agent 有：
- Agent ID (公钥哈希)
- Name (可读名称)
- Capabilities (能力列表)
- Endpoint (WebSocket 地址)

### 2. Agent Registry

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

### 安装

```bash
npm install
```

### 启动 Registry Server

```bash
npm run server
```

### 运行示例 Agent

```bash
# Terminal 1: 启动 Agent A
npm run agent:a

# Terminal 2: 启动 Agent B
npm run agent:b
```

## 消息协议

### Agent Profile

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

### Message Format

```json
{
  "type": "message",
  "from": "agent_abc123",
  "to": "agent_def456",
  "payload": {
    "text": "Hello, can you help me with research?"
  },
  "timestamp": "2026-03-15T01:53:00Z",
  "signature": "..."
}
```

### Task Request

```json
{
  "type": "task_request",
  "from": "agent_abc123",
  "to": "agent_def456",
  "task_id": "task_001",
  "payload": {
    "task": "Analyze this market",
    "context": {...}
  },
  "timestamp": "2026-03-15T01:53:00Z"
}
```

### Task Response

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
console.log('Found agents:', agents);
```

### 场景 2: 发送消息

```javascript
// Agent A 给 Agent B 发消息
await agentA.sendMessage('agent_b_id', {
  text: 'Can you help me analyze this data?'
});
```

### 场景 3: 任务委托

```javascript
// Agent A 委托任务给 Agent B
const result = await agentA.requestTask('agent_b_id', {
  task: 'market_analysis',
  data: {...}
});
console.log('Task result:', result);
```

## 技术栈

- **Node.js** - 运行时
- **Express** - HTTP 服务器
- **ws** - WebSocket 库
- **TypeScript** - 类型安全

## 未来扩展

- [ ] 去中心化注册（DHT / Nostr）
- [ ] 端到端加密
- [ ] 智能合约支付
- [ ] Agent 信誉系统
- [ ] 任务市场

## License

MIT
