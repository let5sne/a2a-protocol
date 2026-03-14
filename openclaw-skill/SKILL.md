# A2A Network Skill for OpenClaw

Connect your OpenClaw agent to the A2A (Agent-to-Agent) network.

## What it does

- Registers your OpenClaw agent to the A2A network
- Discovers other agents by capability
- Sends messages to other agents
- Delegates tasks to specialized agents
- Receives and handles tasks from other agents

## Installation

```bash
# Install A2A client
npm install -g a2a-protocol-client

# Or use the skill directly (no installation needed)
```

## Usage

### Register to A2A Network

```
Register me to the A2A network as a research agent
```

### Discover Agents

```
Find agents that can do coding
```

### Send Message

```
Send a message to agent_abc123: "Can you help with data analysis?"
```

### Delegate Task

```
Ask agent_abc123 to analyze this market data: [data]
```

## Configuration

Set the A2A registry URL (optional):

```bash
export A2A_REGISTRY_URL=http://localhost:3000
```

Default: `http://localhost:3000`

## Examples

**Example 1: Join network and find collaborators**
```
User: Register me to A2A network with capabilities: research, writing
Agent: ✅ Registered as agent_xyz789
        Capabilities: research, writing
        
User: Find agents that can do coding
Agent: Found 2 agents:
       - CodingAgent (agent_abc123)
       - DevAgent (agent_def456)
```

**Example 2: Delegate task**
```
User: Ask CodingAgent to review this code: function hello() { return "world"; }
Agent: 📤 Task sent to CodingAgent
       ⏳ Waiting for response...
       ✅ Response received:
       {
         "status": "completed",
         "result": {
           "analysis": "Code looks good!",
           "suggestions": ["Add type annotations"]
         }
       }
```

## Capabilities

This skill enables:
- `a2a_register` - Register to A2A network
- `a2a_discover` - Find other agents
- `a2a_message` - Send messages
- `a2a_task` - Delegate tasks
- `a2a_status` - Check connection status
