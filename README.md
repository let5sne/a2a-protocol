# A2A Protocol - Agent-to-Agent Communication Protocol

[![CI](https://github.com/let5sne/a2a-protocol/actions/workflows/ci.yml/badge.svg)](https://github.com/let5sne/a2a-protocol/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/let5sne/a2a-protocol?style=social)](https://github.com/let5sne/a2a-protocol)

English | [简体中文](README.zh-CN.md)

> **Let your AI agents discover, communicate, and collaborate autonomously.**

## Why A2A Protocol?

AI agents are everywhere, but they're isolated. Your coding agent can't delegate research. Your research agent can't send data to an analysis agent.

**A2A Protocol changes that.** It's a lightweight communication layer that enables agents to:
- 🔍 **Discover** other agents by capability
- 📤 **Delegate** specialized tasks
- 🤝 **Collaborate** on complex workflows
- 🌐 **Scale** with distributed networks

Think of it as **DNS + HTTP for AI agents**.

## Core Features

- **Agent Identity System** - Decentralized identity based on public keys
- **Agent Registry** - Simple HTTP API for agent registration and discovery
- **Nostr Integration** - Decentralized discovery via Nostr protocol
- **End-to-End Encryption** - Secure agent communication with ECDH + AES-256-GCM
- **Reputation System** - Track agent reliability and performance (NEW!)
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

### Option 1: Docker (Recommended)

```bash
# Build and start all services
docker-compose up

# Or use npm scripts
npm run docker:up
```

This will start:
- Registry server on port 3000
- Example agents (Agent A and Agent B)

### Option 2: Manual Setup

```bash
# Install dependencies
npm install

# Terminal 1: Start Registry Server
npm run server

# Terminal 2: Start Agent B
npm run agent:b

# Terminal 3: Start Agent A
npm run agent:a
```

## More Examples

We have several example agents demonstrating different use cases:

- **Basic agents** - Simple message passing (agent-a, agent-b)
- **Market Analysis Agent** - Market research and competitor analysis
- **Data Analysis Agent** - Statistical analysis and data processing
- **Orchestrator Agent** - Multi-agent coordination

See [EXAMPLES.md](EXAMPLES.md) for detailed documentation.

## Nostr Integration (Decentralized)

Use Nostr protocol for truly decentralized agent discovery:

```typescript
import { NostrAgent } from 'a2a-protocol';

const agent = new NostrAgent('MyAgent', ['research', 'coding']);
await agent.register(); // Publishes to Nostr relays

// Discover agents via Nostr
const agents = await agent.searchAgents('coding');
```

See [docs/NOSTR_INTEGRATION.md](docs/NOSTR_INTEGRATION.md) for details.

## End-to-End Encryption

Secure agent communication with encryption:

```typescript
import { SecureAgent } from 'a2a-protocol';

const agentA = new SecureAgent('AgentA', ['research']);
const agentB = new SecureAgent('AgentB', ['coding']);

// Exchange public keys
agentA.setPeerPublicKey(agentB.id, agentB.getPublicKey());

// Send encrypted message
await agentA.sendSecureMessage(agentB.id, {
  task: 'sensitive_data_analysis'
});
```

See [docs/ENCRYPTION.md](docs/ENCRYPTION.md) for details.

## Reputation System

Track agent reliability and choose trustworthy collaborators:

```typescript
import { ReputationSystem } from 'a2a-protocol';

const reputation = new ReputationSystem();

// Rate agent after task
await reputation.rate('agent_123', {
  task_success: true,
  quality: 5,
  response_time_ms: 1200
});

// Check reputation
const rep = reputation.getScore('agent_123');
console.log(`Score: ${rep.score}/100, Level: ${rep.level}`);
```

See [docs/REPUTATION.md](docs/REPUTATION.md) for details.

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
- **Jest** - Testing framework
- **Docker** - Containerization

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

See [TESTING.md](TESTING.md) for detailed testing guide.

## Future Extensions

- [x] Nostr integration (decentralized discovery) ✅
- [x] End-to-end encryption ✅
- [x] Agent reputation system ✅
- [ ] Smart contract payments
- [ ] Task marketplace

## OpenClaw Integration

A2A Protocol can be integrated with OpenClaw agents. See [OPENCLAW_INTEGRATION.md](OPENCLAW_INTEGRATION.md) for detailed guide.

Quick example:
```typescript
import { Agent } from 'a2a-protocol';

const agent = new Agent('MyOpenClawAgent', ['research', 'coding']);
await agent.register();

// Find and delegate tasks
const agents = await agent.searchAgents('data_analysis');
const result = await agent.requestTask(agents[0].agent_id, { task: 'analyze' });
```

## License

MIT

## Contributing

Issues and Pull Requests are welcome!

## Community

- GitHub: https://github.com/let5sne/a2a-protocol
- Discord: [Coming soon]
