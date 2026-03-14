# A2A Protocol Examples

This document explains all the example agents and how to use them.

## Basic Examples

### Agent A (Research Agent)
A simple agent that can search for other agents and send messages.

**Capabilities:** `research`, `analysis`

**Run:**
```bash
npm run agent:a
```

### Agent B (Coding Agent)
A simple agent that responds to messages and handles code review tasks.

**Capabilities:** `coding`, `debugging`

**Run:**
```bash
npm run agent:b
```

## Advanced Examples

### Market Analysis Agent
Specialized agent for market research and competitor analysis.

**Capabilities:** `market_research`, `competitor_analysis`, `trend_analysis`

**Run:**
```bash
npm run agent:market
```

**Supported Tasks:**
- `market_research` - Returns market size, growth rate, key players
- `competitor_analysis` - Returns competitor strengths/weaknesses

### Data Analysis Agent
Specialized agent for data processing and statistical analysis.

**Capabilities:** `data_processing`, `statistical_analysis`, `data_visualization`

**Run:**
```bash
npm run agent:data
```

**Supported Tasks:**
- `data_processing` - Returns data cleaning statistics
- `statistical_analysis` - Returns mean, median, correlation

### Orchestrator Agent
Coordinates multiple agents to complete complex multi-step tasks.

**Capabilities:** `orchestration`, `project_management`

**Run:**
```bash
npm run agent:orchestrator
```

**What it does:**
1. Finds market analysis agent
2. Requests market research
3. Finds data analysis agent
4. Requests statistical analysis
5. Combines results into final report

## Running Multiple Agents

### Scenario 1: Basic Communication

```bash
# Terminal 1: Start server
npm run server

# Terminal 2: Start Agent B
npm run agent:b

# Terminal 3: Start Agent A
npm run agent:a
```

Agent A will find Agent B and send a message.

### Scenario 2: Multi-Agent Collaboration

```bash
# Terminal 1: Start server
npm run server

# Terminal 2: Start Market Agent
npm run agent:market

# Terminal 3: Start Data Agent
npm run agent:data

# Terminal 4: Start Orchestrator
npm run agent:orchestrator
```

The orchestrator will coordinate both agents to complete a research project.

## Docker Examples

### Run all agents with Docker Compose

```bash
# Build images
npm run docker:build

# Start all services
npm run docker:up

# Stop all services
npm run docker:down
```

This will start:
- Registry server on port 3000
- Agent A
- Agent B

## Creating Your Own Agent

```typescript
import { Agent } from '../agent';
import { TaskRequest, TaskResponse } from '../types';

async function main() {
  // 1. Create agent with name and capabilities
  const myAgent = new Agent('MyAgent', ['capability1', 'capability2']);
  
  // 2. Register to the network
  await myAgent.register();
  
  // 3. Handle messages
  myAgent.onMessage((msg) => {
    console.log('Received message:', msg.payload);
  });
  
  // 4. Handle tasks
  myAgent.onTask(async (req: TaskRequest): Promise<TaskResponse> => {
    if (req.task === 'my_task') {
      return {
        status: 'completed',
        result: { data: 'result' }
      };
    }
    return {
      status: 'failed',
      error: 'Unknown task'
    };
  });
}

main().catch(console.error);
```

## Next Steps

- Add more specialized agents
- Implement task marketplace
- Add agent reputation system
- Integrate with OpenClaw
