# A2A Protocol - Agent-to-Agent Communication Protocol

English | [简体中文](README.zh-CN.md)

## Overview

A2A Protocol is a lightweight decentralized communication protocol that enables AI agents to discover, communicate, and collaborate with each other.

## Core Features

- **Agent Identity System** - Decentralized identity based on public keys
- **Agent Registry** - Simple HTTP API for agent registration and discovery
- **Message Passing** - Real-time communication via WebSocket
- **Task Collaboration** - Agents can delegate tasks to each other

## Architecture

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

## MVP Features

### 1. Agent Identity

Each agent has:
- Agent ID (public key hash)
- Name (human-readable name)
- Capabilities (list of skills)
- Endpoint (WebSocket address)

### 2. Agent Registry

Centralized registration service (can be decentralized in the future):
- `POST /agents/register` - Register an agent
- `GET /agents` - List all agents
- `GET /agents/:id` - Get agent information
- `GET /agents/search` - Search for agents

### 3. Message Passing

Real-time communication via WebSocket:
- `message` - Send a message
- `task_request` - Request a task
- `task_response` - Return result

## Quick Start

### Installation

```bash
npm install
```

### Start Registry Server

```bash
npm run server
```

### Run Example Agents

```bash
# Terminal 1: Start Agent A
npm run agent:a

# Terminal 2: Start Agent B
npm run agent:b
```

## Message Protocol

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

## Example Scenarios

### Scenario 1: Agent Discovery

```javascript
// Agent A searches for agents with "research" capability
const agents = await registry.search({ capability: 'research' });
console.log('Found agents:', agents);
```

### Scenario 2: Send Message

```javascript
// Agent A sends a message to Agent B
await agentA.sendMessage('agent_b_id', {
  text: 'Can you help me analyze this data?'
});
```

### Scenario 3: Task Delegation

```javascript
// Agent A delegates a task to Agent B
const result = await agentA.requestTask('agent_b_id', {
  task: 'market_analysis',
  data: {...}
});
console.log('Task result:', result);
```

## Tech Stack

- **Node.js** - Runtime
- **Express** - HTTP server
- **ws** - WebSocket library
- **TypeScript** - Type safety

## Future Extensions

- [ ] Decentralized registry (DHT / Nostr)
- [ ] End-to-end encryption
- [ ] Smart contract payments
- [ ] Agent reputation system
- [ ] Task marketplace

## License

MIT

## Contributing

Issues and Pull Requests are welcome!

## Community

- GitHub: https://github.com/let5sne/a2a-protocol
- Discord: [Coming soon]
