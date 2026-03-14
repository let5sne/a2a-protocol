# OpenClaw Integration Guide

This guide shows how to integrate A2A Protocol with OpenClaw agents.

## Overview

OpenClaw agents can join the A2A network to:
- Discover and collaborate with other agents
- Delegate specialized tasks
- Receive tasks from other agents
- Build multi-agent workflows

## Installation

### Option 1: Use as OpenClaw Skill

1. Copy the `openclaw-skill` folder to your OpenClaw skills directory:
```bash
cp -r openclaw-skill ~/.openclaw/skills/a2a-network
```

2. The skill will be automatically loaded by OpenClaw

### Option 2: Direct Integration

```bash
# In your OpenClaw project
npm install a2a-protocol
```

## Usage in OpenClaw

### Basic Setup

```typescript
import { Agent } from 'a2a-protocol';

// Create A2A agent for your OpenClaw instance
const a2aAgent = new Agent('MyOpenClawAgent', [
  'research',
  'coding',
  'analysis'
]);

await a2aAgent.register();
```

### Example: Research Assistant

```typescript
// OpenClaw agent that uses A2A network for research
async function researchWithA2A(query: string) {
  // Find research agents
  const researchers = await a2aAgent.searchAgents('research');
  
  // Delegate research task
  const result = await a2aAgent.requestTask(researchers[0].agent_id, {
    task: 'research',
    context: { query }
  });
  
  return result;
}
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    OpenClaw Agent                        │
│  ┌────────────────────────────────────────────────┐    │
│  │  OpenClaw Core Logic                           │    │
│  └────────────────┬───────────────────────────────┘    │
│                   │                                      │
│  ┌────────────────▼───────────────────────────────┐    │
│  │  A2A Agent Wrapper                             │    │
│  │  - Register to network                         │    │
│  │  - Discover agents                             │    │
│  │  - Send/receive tasks                          │    │
│  └────────────────┬───────────────────────────────┘    │
└───────────────────┼──────────────────────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │   A2A Registry       │
         │   (Port 3000)        │
         └──────────────────────┘
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
┌──────────────┐        ┌──────────────┐
│ Other Agents │        │ Other Agents │
└──────────────┘        └──────────────┘
```

## Use Cases

### 1. Multi-Agent Research

```typescript
// OpenClaw coordinates multiple research agents
const marketAgent = await findAgent('market_research');
const dataAgent = await findAgent('data_analysis');

const marketData = await delegateTask(marketAgent, { task: 'research' });
const analysis = await delegateTask(dataAgent, { 
  task: 'analyze', 
  data: marketData 
});
```

### 2. Code Review Pipeline

```typescript
// OpenClaw delegates code review to specialized agents
const codeReviewer = await findAgent('code_review');
const securityAuditor = await findAgent('security_audit');

const review = await delegateTask(codeReviewer, { code });
const audit = await delegateTask(securityAuditor, { code });
```

### 3. Content Generation

```typescript
// OpenClaw orchestrates content creation
const researcher = await findAgent('research');
const writer = await findAgent('writing');
const editor = await findAgent('editing');

const research = await delegateTask(researcher, { topic });
const draft = await delegateTask(writer, { research });
const final = await delegateTask(editor, { draft });
```

## Configuration

### Environment Variables

```bash
# A2A Registry URL
export A2A_REGISTRY_URL=http://localhost:3000

# Agent capabilities (comma-separated)
export A2A_CAPABILITIES=research,coding,analysis

# Agent name
export A2A_AGENT_NAME=MyOpenClawAgent
```

## Running Examples

```bash
# Start A2A registry
npm run server

# Start specialized agents
npm run agent:market
npm run agent:data

# Run OpenClaw integration example
npm run agent:openclaw
```

## Best Practices

1. **Register early** - Register to A2A network when OpenClaw starts
2. **Handle failures** - Always handle task delegation failures gracefully
3. **Set timeouts** - Don't wait forever for responses
4. **Log everything** - Track all A2A interactions for debugging
5. **Secure communication** - Use HTTPS in production

## Troubleshooting

### Agent not found
```
Error: No agents found with capability 'xyz'
```
**Solution**: Make sure the required agents are registered and running

### Connection timeout
```
Error: Connection timeout
```
**Solution**: Check if A2A registry is running and accessible

### Task failed
```
Error: Task execution failed
```
**Solution**: Check the target agent's logs for error details

## Next Steps

- Add authentication for secure agent communication
- Implement task queuing for better reliability
- Add monitoring and metrics
- Scale with multiple registry instances
