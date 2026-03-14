# Quick Start Guide - Deploy & Try A2A Protocol

## 🚀 3 Ways to Get Started

### Option 1: Docker (Fastest - 60 seconds)

**Prerequisites:** Docker installed

```bash
# 1. Clone the repo
git clone https://github.com/let5sne/a2a-protocol.git
cd a2a-protocol

# 2. Start everything
docker-compose up
```

**What's running:**
- Registry Server: http://localhost:3000
- Agent A (research agent)
- Agent B (coding agent)

**Watch them communicate in real-time!**

---

### Option 2: Local Development

**Prerequisites:** Node.js 18+ installed

```bash
# 1. Clone and install
git clone https://github.com/let5sne/a2a-protocol.git
cd a2a-protocol
npm install

# 2. Start registry (Terminal 1)
npm run server

# 3. Start Agent B (Terminal 2)
npm run agent:b

# 4. Start Agent A (Terminal 3)
npm run agent:a
```

**You'll see:**
- Agent A discovers Agent B
- Agent A sends a message
- Agent A delegates a task
- Agent B responds with results

---

### Option 3: Try Individual Features

**Test the marketplace:**
```bash
npm run agent:marketplace
```

**Test encryption:**
```bash
npm run agent:secure
```

**Test reputation:**
```bash
npm run agent:reputation
```

**Test Nostr (decentralized):**
```bash
npm run agent:nostr
```

---

## 🧪 Interactive Testing

### Test 1: Basic Agent Communication

```bash
# Terminal 1: Start server
npm run server

# Terminal 2: Start coding agent
npm run agent:b

# Terminal 3: Test with curl
curl -X POST http://localhost:3000/agents/register \
  -H "Content-Type: application/json" \
  -d '{"name":"TestAgent","capabilities":["test"]}'

# Search for agents
curl -X POST http://localhost:3000/agents/search \
  -H "Content-Type: application/json" \
  -d '{"capability":"coding"}'
```

### Test 2: Multi-Agent Workflow

```bash
# Terminal 1: Server
npm run server

# Terminal 2: Market agent
npm run agent:market

# Terminal 3: Data agent
npm run agent:data

# Terminal 4: Orchestrator (coordinates both)
npm run agent:orchestrator
```

**Watch the orchestrator:**
1. Find market agent
2. Request market research
3. Find data agent
4. Request analysis
5. Combine results

---

## 🌐 Deploy to Production

### Deploy to VPS (Ubuntu/Debian)

```bash
# 1. SSH to your server
ssh user@your-server.com

# 2. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 3. Clone and run
git clone https://github.com/let5sne/a2a-protocol.git
cd a2a-protocol
docker-compose up -d

# 4. Check status
docker-compose ps
```

**Access:** http://your-server.com:3000

### Deploy to Cloud

**AWS/GCP/Azure:**
1. Launch Ubuntu VM
2. Open port 3000
3. Follow VPS steps above

**Heroku:**
```bash
heroku create your-app-name
git push heroku master
```

---

## 🔧 Configuration

### Change Registry Port

Edit `docker-compose.yml`:
```yaml
ports:
  - "8080:3000"  # Change 8080 to your port
```

### Use Custom Relays (Nostr)

Edit `src/nostr-agent.ts`:
```typescript
const DEFAULT_RELAYS = [
  'wss://your-relay.com',
  'wss://relay.damus.io'
];
```

### Add Your Own Agent

Create `src/examples/my-agent.ts`:
```typescript
import { Agent } from '../agent';

const agent = new Agent('MyAgent', ['my_capability']);
await agent.register();

agent.onTask(async (req) => {
  // Handle tasks
  return { status: 'completed', result: {...} };
});
```

Run: `ts-node src/examples/my-agent.ts`

---

## 📊 Monitor Your Network

### Check Registry Status
```bash
curl http://localhost:3000/agents
```

### View Logs
```bash
# Docker
docker-compose logs -f

# Local
# Check terminal output
```

---

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Find process
lsof -i :3000

# Kill it
kill -9 <PID>
```

**Docker issues:**
```bash
docker-compose down
docker-compose up --build
```

**Tests failing:**
```bash
npm install
npm test
```

---

## 🎯 Next Steps

1. **Customize agents** - Add your own capabilities
2. **Integrate with OpenClaw** - See OPENCLAW_INTEGRATION.md
3. **Deploy to production** - Use Docker on VPS
4. **Join community** - Star the repo, open issues

---

## 💡 Example Use Cases

**Research Pipeline:**
```
Research Agent → Data Agent → Analysis Agent → Report
```

**Code Review:**
```
Your Agent → Code Review Agent → Security Audit Agent
```

**Content Creation:**
```
Research Agent → Writer Agent → Editor Agent → Publisher
```

---

Need help? Open an issue: https://github.com/let5sne/a2a-protocol/issues
